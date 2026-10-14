"use client";

import NextLink from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { translateUI } from "@/lib/i18n/shared";

const LocaleContext = createContext<Locale>("pt");
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export function useLocale() { return useContext(LocaleContext); }
export function useTranslate() { const locale = useLocale(); return (source: string, values?: Record<string, string | number>) => translateUI(locale, source, values); }

export function LocaleLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const localized = typeof href === "string" ? localeHref(locale, href) : { ...href, pathname: href.pathname ? localeHref(locale, href.pathname) : href.pathname };
  return <NextLink {...props} href={localized} />;
}
