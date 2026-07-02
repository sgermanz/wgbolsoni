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
 * assumes a white backdrop, so it always sits inside a small white card —
 * fixed regardless of light/dark theme or whatever's behind the navbar
 * (photo hero, video, dark mode). Same treatment in the footer.
 */
export function Brand({ name, size = "md", className }: Props) {
  const heightClass = size === "lg" ? "h-9 lg:h-10" : "h-7 lg:h-8";
  const paddingClass = size === "lg" ? "px-3.5 py-2" : "px-3 py-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5",
        paddingClass,
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt={name}
        className={cn("w-auto shrink-0", heightClass)}
      />
    </span>
  );
}
