import "server-only";

import { SITE } from "@/lib/site";
import { withFallback } from "@/lib/cms";

export type HeroBackground =
  | { type: "none" }
  | { type: "image"; url: string; alt: string }
  | {
      type: "video";
      url: string;
      poster?: string;
    }
  | {
      type: "youtube";
      url: string;
      poster?: string;
    };

export type HeroSlide = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  background: HeroBackground;
};

export type HomeHeroData = {
  autoplaySeconds: number;
  slides: HeroSlide[];
};

/** The hardcoded hero, used as fallback when the CMS has no slides. */
const FALLBACK: HomeHeroData = {
  autoplaySeconds: 6,
  slides: [
    {
      eyebrow: `Holding de participações desde ${SITE.copyrightStart}`,
      title: "Nossa marca está presente em cada um destes negócios.",
      subtitle:
        "Agronegócio, energia, meio ambiente, indústria e novas frentes — com a CPR Verde no centro da agenda ambiental e a proteína de alto valor biológico como nova fronteira nutricional global.",
      primaryCta: { label: "Fale com a WG Bolsoni", href: "/contato" },
      secondaryCta: { label: "Conhecer as frentes", href: "#areas" },
      background: { type: "none" },
    },
  ],
};

type MediaRef =
  | { url?: string | null; alt?: string | null }
  | string
  | number
  | null
  | undefined;

const mediaUrl = (m: MediaRef): string | undefined =>
  typeof m === "object" && m?.url ? m.url : undefined;
const mediaAlt = (m: MediaRef): string | undefined =>
  typeof m === "object" && m?.alt ? m.alt : undefined;

type PayloadSlide = {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  background?: {
    type?: "none" | "image" | "video" | "youtube";
    image?: MediaRef;
    videoFile?: MediaRef;
    videoUrl?: string | null;
    posterImage?: MediaRef;
  } | null;
};

function toBackground(bg: PayloadSlide["background"]): HeroBackground {
  const type = bg?.type ?? "none";
  const poster = mediaUrl(bg?.posterImage);
  if (type === "image") {
    const url = mediaUrl(bg?.image);
    if (url) return { type: "image", url, alt: mediaAlt(bg?.image) ?? "" };
  }
  if (type === "video") {
    const url = mediaUrl(bg?.videoFile);
    if (url) return { type: "video", url, poster };
  }
  if (type === "youtube") {
    if (bg?.videoUrl) return { type: "youtube", url: bg.videoUrl, poster };
  }
  return { type: "none" };
}

function toSlide(s: PayloadSlide): HeroSlide {
  const primaryCta =
    s.primaryCtaLabel && s.primaryCtaHref
      ? { label: s.primaryCtaLabel, href: s.primaryCtaHref }
      : undefined;
  const secondaryCta =
    s.secondaryCtaLabel && s.secondaryCtaHref
      ? { label: s.secondaryCtaLabel, href: s.secondaryCtaHref }
      : undefined;
  return {
    eyebrow: s.eyebrow ?? undefined,
    title: s.title,
    subtitle: s.subtitle ?? undefined,
    primaryCta,
    secondaryCta,
    background: toBackground(s.background),
  };
}

export async function getHomeHero(): Promise<HomeHeroData> {
  return withFallback(
    async (payload) => {
      const doc = (await payload.findGlobal({
        slug: "homeHero",
        depth: 1,
      })) as {
        autoplaySeconds?: number | null;
        slides?: PayloadSlide[] | null;
      } | null;

      const slides = (doc?.slides ?? []).map(toSlide).filter((s) => s.title);
      if (slides.length === 0) throw new Error("no slides");

      return {
        autoplaySeconds: doc?.autoplaySeconds || 6,
        slides,
      };
    },
    FALLBACK,
    "getHomeHero",
  );
}
