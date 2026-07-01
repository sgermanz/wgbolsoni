import { cn } from "@/lib/utils";

export type HeroOverlayEffectType = "none" | "grain" | "duotone" | "vignette";

/**
 * The "effect" is a layer that sits on top of whatever media is underneath
 * (image / video / YouTube) — it never touches the source file, so editors
 * can swap the photo/video later and the chosen effect carries over
 * unchanged. Pure CSS + one inline SVG noise filter — no WebGL/three.js,
 * which would add a few hundred KB and real performance risk for a
 * marginal visual gain on an institutional site's homepage hero.
 */

/** Applied directly to the media element (Image/video) — only duotone needs this. */
export function heroMediaFilterClass(effect: HeroOverlayEffectType): string {
  return effect === "duotone" ? "grayscale contrast-[1.05]" : "";
}

const GRAIN_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

export function HeroOverlayEffect({
  effect,
}: {
  effect: HeroOverlayEffectType;
}) {
  if (effect === "duotone") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-[11] bg-gradient-to-br from-brand-800 via-brand-600 to-accent-500 mix-blend-color"
      />
    );
  }

  if (effect === "vignette") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-[11]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    );
  }

  if (effect === "grain") {
    return (
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-[9] opacity-[0.18] mix-blend-overlay",
          "motion-safe:animate-[hero-grain_1s_steps(6)_infinite]",
        )}
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundSize: "220px 220px",
        }}
      />
    );
  }

  return null;
}
