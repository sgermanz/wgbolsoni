import "server-only";

import { cache } from "react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { AREAS, type Area as LegacyArea } from "@/lib/areas";
import { SITE, NAV_TOP } from "@/lib/site";
import { withFallback } from "@/lib/cms";

/* ----------------------- Unified shapes for frontend ---------------------- */

export type AreaLink = { label: string; href: string; external?: boolean };
export type AreaSubitem = { title: string; body: string };
export type AreaCover = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type AreaRecord = {
  id?: string | number;
  slug: string;
  title: string;
  tag?: string;
  short: string;
  /** Either lexical (from Payload) or paragraphs (from fallback) is set. */
  bodyLexical?: SerializedEditorState;
  bodyParagraphs?: string[];
  links?: AreaLink[];
  subitems?: AreaSubitem[];
  cover?: AreaCover;
};

export type PageRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  bodyLexical?: SerializedEditorState;
  bodyParagraphs?: string[];
  cover?: AreaCover;
};

export type SiteSettingsRecord = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  copyrightStart: number;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
    latitude?: number;
    longitude?: number;
  };
  social?: { platform: string; url: string }[];
  navTop: { label: string; href: string }[];
};

/* ----------------------------- Adapters ----------------------------------- */

const fromLegacyArea = (a: LegacyArea): AreaRecord => ({
  slug: a.slug,
  title: a.title,
  tag: a.tag,
  short: a.short,
  bodyParagraphs: a.body,
  links: a.links,
  subitems: a.subitems,
});

type PayloadArea = {
  id: string | number;
  slug: string;
  title: string;
  tag?: string | null;
  short: string;
  body?: SerializedEditorState | null;
  links?: AreaLink[] | null;
  subitems?: AreaSubitem[] | null;
  coverImage?:
    | {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | string
    | number
    | null;
};

const fromPayloadArea = (a: PayloadArea): AreaRecord => {
  const cover =
    typeof a.coverImage === "object" && a.coverImage?.url
      ? {
          url: a.coverImage.url,
          alt: a.coverImage.alt || a.title,
          width: a.coverImage.width ?? undefined,
          height: a.coverImage.height ?? undefined,
        }
      : undefined;

  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    tag: a.tag ?? undefined,
    short: a.short,
    bodyLexical: a.body ?? undefined,
    links: a.links ?? undefined,
    subitems: a.subitems ?? undefined,
    cover,
  };
};

/* ----------------------------- Public API --------------------------------- */

export async function getAllAreas(): Promise<AreaRecord[]> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "areas",
        limit: 100,
        sort: "order",
        depth: 1,
      });
      if (result.docs.length === 0) throw new Error("areas empty");
      return result.docs.map((doc) => fromPayloadArea(doc as PayloadArea));
    },
    AREAS.map(fromLegacyArea),
    "getAllAreas",
  );
}

export async function getAreaBySlug(
  slug: string,
): Promise<AreaRecord | undefined> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "areas",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      });
      const doc = result.docs[0];
      if (!doc) throw new Error("not found");
      return fromPayloadArea(doc as PayloadArea);
    },
    AREAS.map(fromLegacyArea).find((a) => a.slug === slug),
    `getAreaBySlug(${slug})`,
  );
}

export async function getPageBySlug(
  slug: string,
): Promise<PageRecord | undefined> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "pages",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      });
      const doc = result.docs[0] as unknown as
        | {
            slug: string;
            title: string;
            subtitle?: string | null;
            body?: SerializedEditorState | null;
            coverImage?:
              | {
                  url?: string | null;
                  alt?: string | null;
                  width?: number | null;
                  height?: number | null;
                }
              | string
              | number
              | null;
          }
        | undefined;
      if (!doc) throw new Error("page not found");
      const cover =
        typeof doc.coverImage === "object" && doc.coverImage?.url
          ? {
              url: doc.coverImage.url,
              alt: doc.coverImage.alt || doc.title,
              width: doc.coverImage.width ?? undefined,
              height: doc.coverImage.height ?? undefined,
            }
          : undefined;
      return {
        slug: doc.slug,
        title: doc.title,
        subtitle: doc.subtitle ?? undefined,
        bodyLexical: doc.body ?? undefined,
        cover,
      };
    },
    undefined,
    `getPageBySlug(${slug})`,
  );
}

// Memoized per-request: layout.tsx (metadata + JSON-LD) and Navbar/Footer
// each need this, and without cache() we'd hit Payload twice per request.
export const getSiteSettings = cache(async (): Promise<SiteSettingsRecord> => {
  const legacy: SiteSettingsRecord = {
    name: SITE.name,
    legalName: SITE.legalName,
    tagline: SITE.tagline,
    description: SITE.description,
    email: SITE.email,
    copyrightStart: SITE.copyrightStart,
    navTop: NAV_TOP.map((n) => ({ label: n.label, href: n.href })),
  };
  return withFallback(
    async (payload) => {
      const doc = (await payload.findGlobal({
        slug: "siteSettings",
        depth: 0,
      })) as Partial<SiteSettingsRecord> | null;
      if (!doc) throw new Error("settings empty");
      return {
        name: doc.name || legacy.name,
        legalName: doc.legalName || legacy.legalName,
        tagline: doc.tagline || legacy.tagline,
        description: doc.description || legacy.description,
        email: doc.email || legacy.email,
        phone: doc.phone,
        whatsapp: doc.whatsapp,
        copyrightStart: doc.copyrightStart || legacy.copyrightStart,
        address: doc.address,
        social: doc.social,
        navTop:
          doc.navTop && doc.navTop.length > 0 ? doc.navTop : legacy.navTop,
      };
    },
    legacy,
    "getSiteSettings",
  );
});
