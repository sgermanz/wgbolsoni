import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { AREAS } from "@/lib/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticUrls = ["", "/conceito", "/politicas", "/conversor", "/contato"];

  return [
    ...staticUrls.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...AREAS.map((a) => ({
      url: `${base}/areas/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
