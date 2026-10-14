export const LOCALES = ["pt", "en", "es", "fr", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";
export const LANGUAGE_COOKIE = "wgb-language";
export const LOCALE_INFO: Record<Locale, { name: string; code: string; html: string; intl: string; og: string }> = {
  pt: { name: "Português", code: "PT", html: "pt-BR", intl: "pt-BR", og: "pt_BR" },
  en: { name: "English", code: "EN", html: "en", intl: "en-US", og: "en_US" },
  es: { name: "Español", code: "ES", html: "es", intl: "es-ES", og: "es_ES" },
  fr: { name: "Français", code: "FR", html: "fr", intl: "fr-FR", og: "fr_FR" },
  zh: { name: "简体中文", code: "ZH", html: "zh-Hans", intl: "zh-CN", og: "zh_CN" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.includes(value as Locale);
}

export function splitLocalePath(pathname: string): { locale?: Locale; pathname: string } {
  const match = pathname.match(/^\/(pt|en|es|fr|zh)(?=\/|$)/);
  return match ? { locale: match[1] as Locale, pathname: pathname.slice(match[0].length) || "/" } : { pathname };
}

export function isPublicPage(pathname: string): boolean {
  return !/^\/(api|admin|_next|media)(\/|$)/.test(pathname) && !/\.[^/]+$/.test(pathname);
}

export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = href.match(/^([^?#]*)(.*)$/)!;
  const base = splitLocalePath(match[1] || "/").pathname;
  if (!isPublicPage(base)) return href;
  return (locale === "pt" ? base : `/${locale}${base === "/" ? "" : base}`) + match[2];
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const candidates = acceptLanguage.split(",").map((entry, index) => {
    const [tag, ...parameters] = entry.trim().split(";");
    const parameter = parameters.find((item) => item.trim().startsWith("q="));
    const quality = parameter ? Number(parameter.trim().slice(2)) : 1;
    return { locale: tag.toLowerCase().split(/[-_]/)[0], quality: Number.isFinite(quality) ? quality : 0, index };
  }).filter((entry) => entry.quality > 0 && entry.quality <= 1).sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const candidate of candidates) if (isLocale(candidate.locale)) return candidate.locale;
  return "en";
}
