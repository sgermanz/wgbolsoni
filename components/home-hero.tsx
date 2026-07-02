"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import type { HeroSlide, HomeHeroData } from "@/lib/home";
import { toBackgroundEmbedUrl } from "@/lib/embed";
import { cn } from "@/lib/utils";
import {
  HeroOverlayEffect,
  heroMediaFilterClass,
} from "@/components/hero-overlay-effect";
import { useReportHeroOnDark } from "@/components/hero-theme";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function CtaButton({
  cta,
  variant,
  onDark,
}: {
  cta: { label: string; href: string };
  variant: "primary" | "ghost";
  onDark: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300";
  const styles =
    variant === "primary"
      ? "bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:-translate-y-0.5"
      : onDark
        ? "border border-white/30 text-white hover:bg-white/10"
        : "border border-[var(--border)] text-[var(--content)] hover:bg-[var(--surface-2)]";
  const external = isExternal(cta.href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {cta.label}
      <Icon className="h-4 w-4" />
    </>
  );
  return external ? (
    <a className={cn(base, styles)} href={cta.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className={cn(base, styles)} href={cta.href}>
      {inner}
    </Link>
  );
}

function SlideBackground({ slide }: { slide: HeroSlide }) {
  const bg = slide.background;

  if (bg.type === "image") {
    return (
      <>
        <Image
          src={bg.url}
          alt={bg.alt}
          fill
          priority
          sizes="100vw"
          className={cn(
            "absolute inset-0 -z-20 object-cover",
            heroMediaFilterClass(bg.effect),
          )}
        />
        <HeroOverlayEffect effect={bg.effect} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/35"
        />
      </>
    );
  }

  if (bg.type === "video") {
    return (
      <>
        <video
          className={cn(
            "absolute inset-0 -z-20 h-full w-full object-cover",
            heroMediaFilterClass(bg.effect),
          )}
          autoPlay
          muted
          loop
          playsInline
          poster={bg.poster}
        >
          <source src={bg.url} />
        </video>
        <HeroOverlayEffect effect={bg.effect} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/35"
        />
      </>
    );
  }

  if (bg.type === "youtube") {
    const embed = toBackgroundEmbedUrl(bg.url);
    return (
      <>
        {bg.poster && (
          <Image
            src={bg.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className={cn(
              "absolute inset-0 -z-30 object-cover",
              heroMediaFilterClass(bg.effect),
            )}
          />
        )}
        {embed && (
          // 16:9 video scaled to cover the hero, centered, pointer-events off.
          <div
            className={cn(
              "pointer-events-none absolute inset-0 -z-20 overflow-hidden",
              heroMediaFilterClass(bg.effect),
            )}
          >
            <iframe
              src={embed}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
              title=""
              tabIndex={-1}
            />
          </div>
        )}
        <HeroOverlayEffect effect={bg.effect} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/35"
        />
      </>
    );
  }

  // none → keep the original light gradient-mesh look
  return (
    <>
      <div
        aria-hidden
        className="gradient-mesh absolute inset-0 -z-20 opacity-60 dark:opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_40%,var(--surface)_100%)]"
      />
    </>
  );
}

function SlideContent({ slide, onDark }: { slide: HeroSlide; onDark: boolean }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-36 lg:px-8 lg:pb-32 lg:pt-48">
      {slide.eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur",
            onDark
              ? "border-white/25 bg-white/10 text-white"
              : "border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--content-soft)]",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          {slide.eyebrow}
        </motion.p>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={cn(
          "text-balance max-w-4xl text-[length:var(--text-fluid-hero)] font-extrabold tracking-tight",
          onDark && "text-white drop-shadow-sm",
        )}
      >
        {slide.title}
      </motion.h1>

      {slide.subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className={cn(
            "text-pretty mt-7 max-w-2xl text-[length:var(--text-fluid-lg)]",
            onDark ? "text-white/85" : "text-[var(--content-soft)]",
          )}
        >
          {slide.subtitle}
        </motion.p>
      )}

      {(slide.primaryCta || slide.secondaryCta) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          {slide.primaryCta && (
            <CtaButton cta={slide.primaryCta} variant="primary" onDark={onDark} />
          )}
          {slide.secondaryCta && (
            <CtaButton cta={slide.secondaryCta} variant="ghost" onDark={onDark} />
          )}
        </motion.div>
      )}
    </div>
  );
}

export function HomeHero({ data }: { data: HomeHeroData }) {
  const { slides, autoplaySeconds } = data;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  );

  // Autoplay (skipped for a single slide or reduced-motion users).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return;
    timer.current = setTimeout(
      () => setIndex((i) => (i + 1) % count),
      Math.max(2, autoplaySeconds) * 1000,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, count, paused, reduceMotion, autoplaySeconds]);

  const slide = slides[index];
  const onDark = slide.background.type !== "none";
  useReportHeroOnDark(onDark);

  return (
    <section
      className="relative isolate flex min-h-[88vh] flex-col justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription={count > 1 ? "carrossel" : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="absolute inset-0 -z-10"
        >
          <SlideBackground slide={slide} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <div key={`content-${index}`} className="w-full">
          <SlideContent slide={slide} onDark={onDark} />
        </div>
      </AnimatePresence>

      {count > 1 && (
        <>
          {/* Setas */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Slide anterior"
            className={cn(
              "absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 backdrop-blur transition lg:block",
              onDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-[var(--surface-2)]/70 text-[var(--content)] hover:bg-[var(--surface-2)]",
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Próximo slide"
            className={cn(
              "absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 backdrop-blur transition lg:block",
              onDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-[var(--surface-2)]/70 text-[var(--content)] hover:bg-[var(--surface-2)]",
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Bolinhas */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir para o slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-brand-500"
                    : onDark
                      ? "w-2 bg-white/50 hover:bg-white/80"
                      : "w-2 bg-[var(--content-soft)]/40 hover:bg-[var(--content-soft)]/70",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
