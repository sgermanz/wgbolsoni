import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import entries from "./content.json";
import { isLocale, LOCALES, LOCALE_INFO, localeHref, type Locale } from "./routing";
import { normalizeText, translateUI, type TranslationEntry } from "./shared";
import { localizeTree } from "./react-tree";
import { SITE } from "@/lib/site";

export const getLocale = cache(async (): Promise<Locale> => {
  const locale = (await headers()).get("x-wgb-locale");
  return isLocale(locale) ? locale : "pt";
});

const catalog = new Map((entries as TranslationEntry[]).map(entry => [normalizeText(entry.pt), entry]));
export function translateContent(locale: Locale, text: string, values?: Record<string, string | number>): string {
  const translated = locale === "pt" ? undefined : catalog.get(normalizeText(text))?.[locale];
  const result = translated !== undefined ? `${/^\s/.test(text) ? " " : ""}${translated}${/\s$/.test(text) ? " " : ""}` : translateUI(locale, text);
  return values ? result.replace(/\{(\w+)\}/g, (match, key: string) => key in values ? String(values[key]) : match) : result;
}

const textFields = new Set([
  "title", "subtitle", "tag", "short", "text", "body", "bodyParagraphs", "synopsis",
  "excerpt", "label", "alt", "caption", "eyebrow", "heading", "intro", "bio", "tagline",
  "description", "metaTitle", "metaDescription", "question", "answer", "primaryCtaLabel", "secondaryCtaLabel",
]);

/** Translate text only. IDs, slugs, enum filters, names, media and contact addresses remain untouched. */
export function localizeRecord<T>(value: T, locale: Locale, preserveTitle = false): T {
  if (locale === "pt" || value == null) return value;
  function visit(item: unknown, field = "", root = false): unknown {
    if (typeof item === "string") {
      if ((field === "href" || field === "url") && item.startsWith("/")) return localeHref(locale, item);
      return textFields.has(field) && !(preserveTitle && root && field === "title") ? translateContent(locale, item) : item;
    }
    if (Array.isArray(item)) return item.map(child => visit(child, field));
    if (!item || typeof item !== "object") return item;
    return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, visit(child, key, root)]));
  }
  // A book's official title is not a translated edition title.
  const translated = visit(value) as T;
  if (preserveTitle && typeof value === "object" && value && "title" in value) {
    (translated as Record<string, unknown>).title = (value as Record<string, unknown>).title;
  }
  return translated;
}

export async function localizePage(tree: ReactNode): Promise<ReactNode> {
  const locale = await getLocale();
  return localizeTree(tree, locale, text => translateContent(locale, text));
}

export async function localizeMetadata(metadata: Metadata): Promise<Metadata> {
  const locale = await getLocale();
  const pathname = (await headers()).get("x-wgb-pathname") || "/";
  const languages = Object.fromEntries(LOCALES.map(code => [LOCALE_INFO[code].html, `${SITE.url}${localeHref(code, pathname)}`]));
  const title = typeof metadata.title === "string" ? translateContent(locale, metadata.title) : metadata.title;
  return {
    ...metadata, title,
    description: metadata.description ? translateContent(locale, metadata.description) : metadata.description,
    alternates: { ...metadata.alternates, canonical: `${SITE.url}${localeHref(locale, pathname)}`, languages: { ...languages, "x-default": `${SITE.url}${pathname}` } },
    openGraph: {
      ...metadata.openGraph,
      locale: LOCALE_INFO[locale].og,
      alternateLocale: LOCALES.filter(code => code !== locale).map(code => LOCALE_INFO[code].og),
      url: `${SITE.url}${localeHref(locale, pathname)}`,
      ...(metadata.openGraph && "title" in metadata.openGraph && typeof metadata.openGraph.title === "string" ? { title: translateContent(locale, metadata.openGraph.title) } : {}),
      ...(metadata.openGraph?.description ? { description: translateContent(locale, metadata.openGraph.description) } : {}),
    },
  };
}

export async function localizeSchema(data: unknown): Promise<unknown> {
  const locale = await getLocale();
  const fields = new Set(["name", "text", "headline", "description", "articleSection"]);
  function visit(value: unknown, field = ""): unknown {
    if (typeof value === "string") {
      if (value.startsWith(SITE.url)) return `${SITE.url}${localeHref(locale, value.slice(SITE.url.length) || "/")}`;
      if (field === "inLanguage") return LOCALE_INFO[locale].html;
      if (field === "keywords") return value.split(", ").map(keyword => translateContent(locale, keyword)).join(", ");
      return fields.has(field) ? translateContent(locale, value) : value;
    }
    if (Array.isArray(value)) return value.map(item => visit(item));
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item, key)]));
  }
  return visit(data);
}
