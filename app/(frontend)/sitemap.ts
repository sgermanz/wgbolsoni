import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";
import { getAllAreas } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticUrls = ["", "/conceito", "/politicas", "/conversor", "/contato", "/blog"];
  const areas = await getAllAreas();

  return [
    ...staticUrls.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...areas.map((a) => ({
      url: `${base}/areas/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
