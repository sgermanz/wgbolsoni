import entries from "./ui.json";
import type { Locale } from "./routing";

export type TranslationEntry = { pt: string; en: string; es: string; fr: string; zh: string };
export const normalizeText = (value: string) => value.replace(/\s+/gu, " ").trim();
const dictionary = new Map((entries as TranslationEntry[]).map((entry) => [normalizeText(entry.pt), entry]));

export function translateUI(locale: Locale, source: string, values?: Record<string, string | number>): string {
  const key = normalizeText(source);
  const entry = dictionary.get(key);
  let result = locale === "pt" ? source : entry?.[locale] ?? source;
  if (locale !== "pt" && entry) result = (/^\s/u.test(source) ? " " : "") + result + (/\s$/u.test(source) ? " " : "");
  if (values) for (const [key, value] of Object.entries(values)) result = result.replaceAll(`{${key}}`, String(value));
  return result;
}
