"use client";

import type { ReactNode } from "react";
import { useLocale } from "./locale-provider";
import { translateUI } from "@/lib/i18n/shared";
import { localizeTree } from "@/lib/i18n/react-tree";

export function Localized({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return localizeTree(children, locale, (text) => translateUI(locale, text));
}
