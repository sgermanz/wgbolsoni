import { cn } from "@/lib/utils";

type Props = {
  /** Brand name — used as the logo's alt text (still editable via Site Settings). */
  name: string;
  /** "md" for the navbar, "lg" (~30% larger) for the footer. */
  size?: "md" | "lg";
  /** When over a dark hero, force the white-text logo regardless of theme. */
  onDark?: boolean;
  className?: string;
};

/**
 * Brand logo (emblem + "WGBolsoni" wordmark + "Participações"), shipped as two
 * vector variants that bake in fixed text colors:
 *   /logo-on-light.svg → dark text, for LIGHT backgrounds
 *   /logo-on-dark.svg  → white text, for DARK backgrounds
 *
 * Over a dark hero (`onDark`) we always use the white-text logo. Otherwise the
 * background follows the theme, so we render both and let CSS swap them on the
 * `.dark` class — this keeps working when the user toggles the theme client-side.
 */
export function Brand({ name, size = "md", onDark = false, className }: Props) {
  const heightClass = size === "lg" ? "h-11 lg:h-12" : "h-8 lg:h-9";

  if (onDark) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-on-dark.svg"
          alt={name}
          className={cn("w-auto shrink-0", heightClass)}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-on-light.svg"
        alt={name}
        className={cn("w-auto shrink-0 dark:hidden", heightClass)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-on-dark.svg"
        alt=""
        aria-hidden="true"
        className={cn("hidden w-auto shrink-0 dark:block", heightClass)}
      />
    </span>
  );
}
