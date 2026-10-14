import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import type { Locale } from "./routing";
import { localeHref } from "./routing";

const textProps = new Set(["title", "subtitle", "eyebrow", "intro", "label", "placeholder", "aria-label", "aria-roledescription", "alt", "text"]);

/** Translate React elements before rendering; never mutate browser DOM or user-entered values. */
export function localizeTree(node: ReactNode, locale: Locale, translate: (text: string) => string): ReactNode {
  if (typeof node === "string") return translate(node);
  if (Array.isArray(node)) return Children.map(node, child => localizeTree(child, locale, translate));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(element.props)) {
    if (textProps.has(key) && typeof value === "string") props[key] = translate(value);
    if (key === "href" && typeof value === "string") props[key] = localeHref(locale, value);
  }
  if ("children" in element.props) props.children = localizeTree(element.props.children as ReactNode, locale, translate);
  return cloneElement(element, props);
}
