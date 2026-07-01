"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Payload's default admin Nav renders no active/current-page indicator at
 * all — no class, no aria-current — so editors have no visual cue for
 * "where am I" in the sidebar. Injected via admin.components.afterNavLinks
 * (a no-op render slot), this mounts once and keeps a `data-active`
 * attribute on the right .nav__link, re-running on every route change.
 * custom.scss styles that attribute.
 *
 * Two signals, combined:
 *  1. On the exact list/global view, Payload itself strips the link's
 *     `href` (it becomes a dead link, presumably to avoid a pointless
 *     self-navigation) — that's a reliable "you are here" marker we can
 *     detect, but it does NOT apply on a document's edit view.
 *  2. On a document edit view (e.g. /admin/collections/areas/11), the
 *     href stays intact ("/admin/collections/areas"), so we fall back to
 *     longest-prefix matching against the current pathname.
 */
export default function NavActiveHighlight() {
  const pathname = usePathname();

  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(".nav__link"),
    ];
    links.forEach((link) => link.removeAttribute("data-active"));

    const hrefless = links.find((link) => !link.getAttribute("href"));
    if (hrefless) {
      hrefless.setAttribute("data-active", "true");
      return;
    }

    let bestMatch: HTMLAnchorElement | null = null;
    let bestLength = 0;
    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href) continue;
      if (pathname === href || pathname?.startsWith(href + "/")) {
        if (href.length > bestLength) {
          bestMatch = link;
          bestLength = href.length;
        }
      }
    }
    bestMatch?.setAttribute("data-active", "true");
  }, [pathname]);

  return null;
}
