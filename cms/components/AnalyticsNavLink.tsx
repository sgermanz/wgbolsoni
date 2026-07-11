"use client";

import { BarChart3 } from "lucide-react";

/** Places the custom Analytics view alongside Payload's native navigation. */
export default function AnalyticsNavLink() {
  return (
    <a className="nav__link" href="/admin/analytics">
      <BarChart3 aria-hidden size={17} strokeWidth={1.8} />
      <span className="nav__link-label">Analytics</span>
    </a>
  );
}
