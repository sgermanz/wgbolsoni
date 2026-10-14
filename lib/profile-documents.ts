import { LOCALES, type Locale } from "@/lib/i18n/routing";

/** Public documentary files, deliberately absent from the site's visual menu. */
export const PROFILE_DOCUMENTS = LOCALES.map(locale => ({
  locale,
  path: `/perfil-wilton-gerson-bolsoni${locale === "pt" ? "" : `.${locale}`}.txt`,
  label: ({
    pt: "Português — memorial original",
    en: "English — institutional profile and corporate career",
    es: "Español — perfil institucional y trayectoria corporativa",
    fr: "Français — profil institutionnel et parcours corporatif",
    zh: "简体中文 — 机构背景与企业发展历程",
  } satisfies Record<Locale, string>)[locale],
}));
