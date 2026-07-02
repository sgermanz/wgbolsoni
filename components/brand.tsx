import { cn } from "@/lib/utils";

type Props = {
  /** Brand name — used as the logo's alt text (still editable via Site Settings). */
  name: string;
  /** "md" for the navbar, "lg" (~30% larger) for the footer. */
  size?: "md" | "lg";
  className?: string;
};

/**
 * The client's official logo (fixed colors — green wordmark, red arrow) is
 * never recolored or swapped for a theme variant, by explicit request. It
 * assumes a white backdrop; the surrounding chrome (navbar/footer) is what
 * provides that backdrop, not the logo itself — no card, no wrapper here.
 */
export function Brand({ name, size = "md", className }: Props) {
  const heightClass = size === "lg" ? "h-10 lg:h-12" : "h-9 lg:h-10";

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt={name}
        className={cn("w-auto shrink-0", heightClass)}
      />
    </span>
  );
}
