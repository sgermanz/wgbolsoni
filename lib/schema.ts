import type { SiteSettingsRecord } from "@/lib/content";
import type { PostRecord } from "@/lib/blog";
import { POST_CATEGORY_LABELS } from "@/lib/blog";
import { SITE } from "@/lib/site";

/**
 * JSON-LD builders. All return plain objects; consumers stringify and drop
 * them into `<script type="application/ld+json">`.
 *
 * Mixed SEO + GEO strategy:
 *  • Organization + WebSite (with SearchAction) — every page via layout
 *  • LocalBusiness — emitted only when `siteSettings.address` is populated
 *  • Article + BreadcrumbList — per-post
 *  • FAQPage — when a post has geo.faq entries
 *  • BreadcrumbList — per-area page
 */

const url = (path = "") => `${SITE.url}${path}`;

export function buildOrganizationSchema(settings: SiteSettingsRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    legalName: settings.legalName,
    url: SITE.url,
    description: settings.description,
    email: settings.email,
    telephone: settings.phone,
    foundingDate: String(settings.copyrightStart),
    sameAs: settings.social?.map((s) => s.url),
  };
}

export function buildLocalBusinessSchema(settings: SiteSettingsRecord) {
  const a = settings.address;
  if (!a?.streetAddress || !a?.addressLocality) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.name,
    image: url("/og.jpg"),
    "@id": SITE.url,
    url: SITE.url,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.streetAddress,
      addressLocality: a.addressLocality,
      addressRegion: a.addressRegion,
      postalCode: a.postalCode,
      addressCountry: a.addressCountry ?? "BR",
    },
    geo:
      a.latitude && a.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: a.latitude,
            longitude: a.longitude,
          }
        : undefined,
  };
}

export function buildWebsiteSchema(settings: SiteSettingsRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: SITE.url,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/blog?tag={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildArticleSchema(post: PostRecord, settings: SiteSettingsRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url(`/blog/${post.slug}`),
    },
    headline: post.title,
    description: post.excerpt,
    image: post.cover?.url ?? post.seo?.ogImage?.url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: settings.name },
    publisher: {
      "@type": "Organization",
      name: settings.name,
      logo: { "@type": "ImageObject", url: url("/logo.png") },
    },
    articleSection: post.categories?.[0]
      ? POST_CATEGORY_LABELS[post.categories[0]]
      : undefined,
    keywords: post.tags?.join(", "),
  };
}

export function buildBreadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: url(it.href),
    })),
  };
}

export function buildFaqSchema(faq: { question: string; answer: string }[]) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
