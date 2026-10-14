"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslate } from "./locale-provider";
import { LANGUAGE_COOKIE, LOCALES, LOCALE_INFO, localeHref, type Locale } from "@/lib/i18n/routing";

export function LanguageSelector() {
  const locale = useLocale();
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function choose(code: Locale) {
    document.cookie = `${LANGUAGE_COOKIE}=${code}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    // Reload deliberately: a language change must also update server content and the root layout.
    const query = new URLSearchParams(location.search);
    query.delete("lang");
    const suffix = query.size ? `?${query}` : "";
    location.assign(localeHref(code, `${location.pathname}${suffix}${location.hash}`));
  }

  return (
    <div ref={root} className="relative shrink-0">
      <button ref={button} type="button" aria-label={t("Selecionar idioma")}
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-brand-700/15 bg-white/70 px-3 text-xs font-semibold tracking-wide text-brand-800 shadow-sm transition hover:border-brand-700/35 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
        <Globe2 className="h-4 w-4" aria-hidden />
        <span>{LOCALE_INFO[locale].code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div id={id} aria-label={t("Idiomas disponíveis")} className="absolute left-0 top-full z-[80] mt-3 w-52 overflow-hidden rounded-2xl border border-brand-700/15 bg-ink-50 p-2 text-ink-800 shadow-xl lg:left-auto lg:right-0">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-500">{t("Idioma do site")}</p>
          {LOCALES.map(code => (
            <button key={code} type="button" lang={LOCALE_INFO[code].html} aria-pressed={code === locale}
              onClick={() => choose(code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-brand-600 ${code === locale ? "bg-brand-700 text-white" : "hover:bg-white"}`}>
              <span>{LOCALE_INFO[code].name}</span>
              {code === locale ? <Check className="h-4 w-4" aria-hidden /> : <span className="text-[10px] opacity-50">{LOCALE_INFO[code].code}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
