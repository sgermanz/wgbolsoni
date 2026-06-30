import type { AdminViewServerProps } from "payload";

import {
  fetchGA4Summary,
  fetchSearchConsoleSummary,
  type GA4Range,
  type SCRange,
} from "@/lib/analytics";

type SearchParams = { range?: string };

const RANGES = ["7d", "28d", "90d"] as const;
const RANGE_LABEL: Record<(typeof RANGES)[number], string> = {
  "7d": "Últimos 7 dias",
  "28d": "Últimos 28 dias",
  "90d": "Últimos 90 dias",
};

const pickRange = (raw?: string): (typeof RANGES)[number] =>
  (RANGES as readonly string[]).includes(raw ?? "")
    ? (raw as (typeof RANGES)[number])
    : "28d";

const nf = new Intl.NumberFormat("pt-BR");
const pf = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export default async function AnalyticsView({
  searchParams,
}: AdminViewServerProps & { searchParams?: SearchParams }) {
  const range = pickRange(searchParams?.range);
  const [ga4, sc] = await Promise.all([
    fetchGA4Summary(range as GA4Range),
    fetchSearchConsoleSummary(range as SCRange),
  ]);

  return (
    <div
      style={{
        padding: "32px 40px",
        maxWidth: 1200,
        margin: "0 auto",
        fontFamily:
          'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Analytics</h1>
        <p style={{ margin: "6px 0 0", color: "#52606d", fontSize: 14 }}>
          Visitas e termos buscados — atualizados a cada 15 min.
        </p>
        <nav style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {RANGES.map((r) => {
            const active = r === range;
            return (
              <a
                key={r}
                href={`?range=${r}`}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: active ? "#2f8049" : "#e4e7eb",
                  background: active ? "#2f8049" : "#fff",
                  color: active ? "#fff" : "#52606d",
                }}
              >
                {RANGE_LABEL[r]}
              </a>
            );
          })}
        </nav>
      </header>

      {/* GA4 SECTION */}
      <Section
        title="Visitas (GA4)"
        empty={
          !ga4
            ? "Configure GA4_PROPERTY_ID + GOOGLE_SERVICE_ACCOUNT_JSON nas variáveis de ambiente do Railway. A Service Account precisa ter acesso de leitura à propriedade GA4."
            : null
        }
      >
        {ga4 && (
          <>
            <KPIRow>
              <KPI label="Usuários ativos" value={nf.format(ga4.totals.activeUsers)} />
              <KPI label="Sessões" value={nf.format(ga4.totals.sessions)} />
              <KPI label="Páginas vistas" value={nf.format(ga4.totals.pageviews)} />
            </KPIRow>

            <Sparkline data={ga4.series} />

            <DualGrid>
              <Table
                title="Páginas mais vistas"
                head={["Caminho", "Pageviews"]}
                rows={ga4.topPages.map((p) => [p.path, nf.format(p.pageviews)])}
              />
              <Table
                title="Origens"
                head={["Canal", "Sessões"]}
                rows={ga4.sources.map((s) => [s.source, nf.format(s.sessions)])}
              />
            </DualGrid>

            <Table
              title="Dispositivos"
              head={["Tipo", "Sessões"]}
              rows={ga4.devices.map((d) => [d.device, nf.format(d.sessions)])}
            />
          </>
        )}
      </Section>

      {/* Search Console */}
      <Section
        title="Termos buscados (Google Search Console)"
        empty={
          !sc
            ? "Configure SEARCH_CONSOLE_SITE_URL + a mesma Service Account com acesso à propriedade no Search Console. Para domínios verificados como prefixo de URL, use a URL completa com / no fim (ex: https://wgbolsoni.net/)."
            : null
        }
      >
        {sc && (
          <>
            <KPIRow>
              <KPI label="Cliques" value={nf.format(sc.totals.clicks)} />
              <KPI label="Impressões" value={nf.format(sc.totals.impressions)} />
              <KPI label="CTR" value={pf.format(sc.totals.ctr)} />
              <KPI
                label="Posição média"
                value={sc.totals.position ? sc.totals.position.toFixed(1) : "—"}
              />
            </KPIRow>
            <Table
              title="Top 25 buscas"
              head={["Query", "Cliques", "Impressões", "CTR", "Posição"]}
              rows={sc.queries.map((q) => [
                q.query,
                nf.format(q.clicks),
                nf.format(q.impressions),
                pf.format(q.ctr),
                q.position.toFixed(1),
              ])}
            />
          </>
        )}
      </Section>
    </div>
  );
}

/* ---------------------------- Inline components --------------------------- */

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string | null;
  children?: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: 32,
        padding: 20,
        background: "#fff",
        border: "1px solid #e4e7eb",
        borderRadius: 16,
      }}
    >
      <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>
        {title}
      </h2>
      {empty ? (
        <p
          style={{
            margin: 0,
            padding: 16,
            background: "#f9fafb",
            border: "1px dashed #cbd2d9",
            borderRadius: 10,
            color: "#52606d",
            fontSize: 14,
          }}
        >
          {empty}
        </p>
      ) : (
        children
      )}
    </section>
  );
}

function KPIRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "#f9fafb",
        borderRadius: 12,
        border: "1px solid #e4e7eb",
      }}
    >
      <div style={{ fontSize: 12, color: "#7b8794", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 24, fontWeight: 800, color: "#1f2933" }}>
        {value}
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: { date: string; users: number }[] }) {
  if (!data.length) return null;
  const W = 800, H = 80, P = 4;
  const max = Math.max(...data.map((d) => d.users), 1);
  const step = (W - P * 2) / Math.max(data.length - 1, 1);
  const pts = data
    .map((d, i) => `${P + i * step},${H - P - (d.users / max) * (H - P * 2)}`)
    .join(" ");
  return (
    <div style={{ marginBottom: 16 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: 80, background: "#f9fafb", borderRadius: 10 }}
      >
        <polyline fill="none" stroke="#2f8049" strokeWidth="2" points={pts} />
      </svg>
    </div>
  );
}

function DualGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function Table({
  title,
  head,
  rows,
}: {
  title: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <div
      style={{
        padding: 14,
        background: "#f9fafb",
        border: "1px solid #e4e7eb",
        borderRadius: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#52606d" }}>
        {title}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "8px 6px",
                  borderBottom: "1px solid #e4e7eb",
                  color: "#7b8794",
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={head.length}
                style={{ padding: 12, color: "#7b8794", textAlign: "center" }}
              >
                Sem dados nesse período.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    textAlign: j === 0 ? "left" : "right",
                    padding: "8px 6px",
                    borderBottom: "1px solid #eef2f6",
                    color: "#1f2933",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
