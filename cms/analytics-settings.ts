import config from "@/payload.config";
import { getPayload } from "payload";

export type StoredAnalyticsSettings = {
  ga4PropertyId?: string;
  searchConsoleSiteUrl?: string;
};

export async function getStoredAnalyticsSettings(): Promise<StoredAnalyticsSettings> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "analyticsSettings" });
    return {
      ga4PropertyId: settings.ga4PropertyId ?? undefined,
      searchConsoleSiteUrl: settings.searchConsoleSiteUrl ?? undefined,
    };
  } catch {
    return {};
  }
}
