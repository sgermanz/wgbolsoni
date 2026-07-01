import { cn } from "@/lib/utils";

type Props = {
  /** Brand name, editable via the Site Settings global — falls back to lib/site.ts. */
  name: string;
  /** "md" for the navbar, "lg" (~30% larger) for the footer. */
  size?: "md" | "lg";
  /** When over a dark hero, render the wordmark in white. */
  onDark?: boolean;
  className?: string;
};

/**
 * Brand lockup: the WG Bolsoni emblem (icon.svg) + a live-text wordmark.
 * We render the name as real text instead of using the fully-vectorized
 * logo so the wordmark adapts to light/dark backgrounds (the exported logo
 * baked in fixed colors that vanished on dark or light surfaces).
 */
export function Brand({ name, size = "md", onDark = false, className }: Props) {
  const isLg = size === "lg";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        className={cn("w-auto shrink-0", isLg ? "h-14" : "h-10 lg:h-11")}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            isLg ? "text-2xl" : "text-lg",
            onDark ? "text-white" : "text-[var(--content)]",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-1 font-semibold uppercase tracking-[0.22em]",
            isLg ? "text-[11px]" : "text-[9px]",
            onDark ? "text-white/70" : "text-brand-600 dark:text-brand-300",
          )}
        >
          Participações
        </span>
      </span>
    </span>
  );
}
