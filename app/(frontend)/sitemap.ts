import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";
import { getAllAreasForSitemap } from "@/lib/content";
import { withFallback } from "@/lib/cms";
import { LOCALES, LOCALE_INFO, localeHref } from "@/lib/i18n/routing";

// Read the live catalog at runtime, not the database-offline build fallback.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticUrls = ["/", "/conceito", "/politicas", "/conversor", "/contato", "/blog"];
  const areas = await getAllAreasForSitemap();
  const posts = await withFallback(async payload => {
    const result = await payload.find({ collection: "posts", where: { _status: { equals: "published" } }, limit: 1000, depth: 0 });
    return result.docs.map(doc => ({ slug: String(doc.slug), updatedAt: String(doc.updatedAt) }));
  }, [], "sitemapPosts");
  const paths = [...staticUrls.map(path => ({ path, priority: path === "/" ? 1 : 0.7 })), ...areas.map(area => ({ path: `/areas/${area.slug}`, priority: 0.8 })), ...posts.map(post => ({ path: `/blog/${post.slug}`, priority: 0.7 }))];
  return [
    ...paths.flatMap(({ path, priority }) => LOCALES.map(locale => ({
      url: `${base}${localeHref(locale, path)}`,
      changeFrequency: "monthly" as const, priority,
      alternates: { languages: Object.fromEntries(LOCALES.map(code => [LOCALE_INFO[code].html, `${base}${localeHref(code, path)}`])) },
    }))),
    { url: `${base}/perfil-wilton-gerson-bolsoni.txt`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];
}
