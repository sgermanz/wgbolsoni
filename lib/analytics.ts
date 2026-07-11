import "server-only";

import { GoogleAuth, type JWTInput } from "google-auth-library";

/**
 * GA4 Data API + Google Search Console API client.
 *
 * Service Account JSON is supplied via env (`GOOGLE_SERVICE_ACCOUNT_JSON`).
 * Each fetcher returns `null` when credentials/IDs are missing — the admin
 * view uses that to render an explicit "configure to enable" empty state
 * instead of failing.
 *
 * Cached for 15 min in-memory to avoid burning GA4/SC quota on every admin
 * page hit.
 */

const CACHE_TTL_MS = 15 * 60 * 1000;
const memo = new Map<string, { at: number; value: unknown }>();

function cached<T>(key: string, ttl = CACHE_TTL_MS) {
  const e = memo.get(key);
  if (e && Date.now() - e.at < ttl) return e.value as T;
  return undefined;
}
function setCached<T>(key: string, value: T) {
  memo.set(key, { at: Date.now(), value });
  return value;
}

function getServiceAccountCreds(): JWTInput | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JWTInput;
  } catch {
    return null;
  }
}

export type AnalyticsIntegrationStatus = {
  ga4PropertyId: boolean;
  searchConsoleSiteUrl: boolean;
  serviceAccount: "missing" | "invalid" | "ready";
};

/**
 * Configuration state intended for the admin UI. This deliberately exposes
 * no secret values, only whether each integration has enough configuration to
 * make a request.
 */
export function getAnalyticsIntegrationStatus(): AnalyticsIntegrationStatus {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  let serviceAccount: AnalyticsIntegrationStatus["serviceAccount"] = "missing";

  if (raw) {
    try {
      JSON.parse(raw);
      serviceAccount = "ready";
    } catch {
      serviceAccount = "invalid";
    }
  }

  return {
    ga4PropertyId: Boolean(process.env.GA4_PROPERTY_ID),
    searchConsoleSiteUrl: Boolean(process.env.SEARCH_CONSOLE_SITE_URL),
    serviceAccount,
  };
}

async function getAuthClient(scopes: string[]) {
  const credentials = getServiceAccountCreds();
  if (!credentials) return null;
  const auth = new GoogleAuth({ credentials, scopes });
  return auth.getAccessToken();
}

/* ----------------------------- GA4 Data API -------------------------------- */

export type GA4Range = "7d" | "28d" | "90d";

export type GA4Summary = {
  range: GA4Range;
  totals: { activeUsers: number; sessions: number; pageviews: number };
  series: { date: string; users: number }[];
  topPages: { path: string; pageviews: number }[];
  sources: { source: string; sessions: number }[];
  devices: { device: string; sessions: number }[];
};

const GA4_RANGE_DAYS: Record<GA4Range, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
};

export async function fetchGA4Summary(
  range: GA4Range = "28d",
): Promise<GA4Summary | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) return null;

  const key = `ga4:${propertyId}:${range}`;
  const hit = cached<GA4Summary>(key);
  if (hit) return hit;

  const token = await getAuthClient([
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);
  if (!token) return null;

  const days = GA4_RANGE_DAYS[range];
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const run = (body: object) =>
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));

  try {
    const [totals, series, topPages, sources, devices] = await Promise.all([
      run({
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
        ],
      }),
      run({
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      run({
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      run({
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
      run({
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
      }),
    ]);

    const summary: GA4Summary = {
      range,
      totals: {
        activeUsers: Number(totals.rows?.[0]?.metricValues?.[0]?.value ?? 0),
        sessions: Number(totals.rows?.[0]?.metricValues?.[1]?.value ?? 0),
        pageviews: Number(totals.rows?.[0]?.metricValues?.[2]?.value ?? 0),
      },
      series: (series.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        date: r.dimensionValues[0].value,
        users: Number(r.metricValues[0].value),
      })),
      topPages: (topPages.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        path: r.dimensionValues[0].value,
        pageviews: Number(r.metricValues[0].value),
      })),
      sources: (sources.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        source: r.dimensionValues[0].value,
        sessions: Number(r.metricValues[0].value),
      })),
      devices: (devices.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        device: r.dimensionValues[0].value,
        sessions: Number(r.metricValues[0].value),
      })),
    };
    return setCached(key, summary);
  } catch {
    return null;
  }
}

/* ------------------------- Google Search Console --------------------------- */

export type SCRange = "7d" | "28d" | "90d";

export type SCSummary = {
  range: SCRange;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
};

const SC_RANGE_DAYS: Record<SCRange, number> = { "7d": 7, "28d": 28, "90d": 90 };

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function fetchSearchConsoleSummary(
  range: SCRange = "28d",
): Promise<SCSummary | null> {
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) return null;

  const key = `sc:${siteUrl}:${range}`;
  const hit = cached<SCSummary>(key);
  if (hit) return hit;

  const token = await getAuthClient([
    "https://www.googleapis.com/auth/webmasters.readonly",
  ]);
  if (!token) return null;

  const days = SC_RANGE_DAYS[range];
  const body = {
    startDate: isoDaysAgo(days),
    endDate: isoDaysAgo(0),
    dimensions: ["query"] as string[],
    rowLimit: 25,
  };

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      rows?: {
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }[];
    };
    const rows = data.rows ?? [];

    const totals = rows.reduce(
      (acc, r) => {
        acc.clicks += r.clicks;
        acc.impressions += r.impressions;
        return acc;
      },
      { clicks: 0, impressions: 0 },
    );
    const ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
    const avgPos = rows.length
      ? rows.reduce((s, r) => s + r.position, 0) / rows.length
      : 0;

    const summary: SCSummary = {
      range,
      totals: { ...totals, ctr, position: avgPos },
      queries: rows.map((r) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
    };
    return setCached(key, summary);
  } catch {
    return null;
  }
}
