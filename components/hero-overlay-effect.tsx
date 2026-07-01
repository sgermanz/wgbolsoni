"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type HeroOverlayEffectType =
  | "none"
  | "grain"
  | "duotone"
  | "vignette"
  | "particles";

/**
 * The "effect" is a layer that sits on top of whatever media is underneath
 * (image / video / YouTube) — it never touches the source file, so editors
 * can swap the photo/video later and the chosen effect carries over
 * unchanged. Pure CSS + Canvas 2D — no WebGL/three.js, which would add a
 * few hundred KB and real performance risk for a marginal visual gain on
 * an institutional site's homepage hero.
 */

/** Applied directly to the media element (Image/video) — only duotone needs this. */
export function heroMediaFilterClass(effect: HeroOverlayEffectType): string {
  return effect === "duotone" ? "grayscale contrast-[1.05]" : "";
}

const GRAIN_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

// Brand palette for the particle glow — matches app/(frontend)/globals.css
// tokens. Canvas fillStyle can't read CSS custom properties, so these are
// pinned copies; keep in sync if the palette changes.
const PARTICLE_COLORS = [
  "111, 217, 149", // brand-400-ish, lightened for glow on dark backgrounds
  "70, 156, 93", // --color-brand-400
  "244, 162, 89", // --color-accent-400
];

function ParticlesLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    type Particle = {
      x: number;
      y: number;
      r: number;
      baseOpacity: number;
      speed: number;
      swayAmp: number;
      swaySpeed: number;
      swayPhase: number;
      color: string;
    };

    let particles: Particle[] = [];

    const spawn = (p: Partial<Particle> = {}): Particle => ({
      x: p.x ?? Math.random() * width,
      y: p.y ?? height + Math.random() * height * 0.3,
      r: 1.2 + Math.random() * 2.6,
      baseOpacity: 0.15 + Math.random() * 0.45,
      speed: 0.12 + Math.random() * 0.3,
      swayAmp: 8 + Math.random() * 18,
      swaySpeed: 0.2 + Math.random() * 0.4,
      swayPhase: Math.random() * Math.PI * 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area, capped for performance.
      const target = Math.min(70, Math.round((width * height) / 18000));
      if (particles.length === 0) {
        particles = Array.from({ length: target }, () =>
          spawn({ y: Math.random() * height }),
        );
      } else if (particles.length < target) {
        particles.push(
          ...Array.from({ length: target - particles.length }, () => spawn()),
        );
      } else {
        particles.length = target;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let t = 0;
    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        const sway = Math.sin(t * 0.016 * p.swaySpeed + p.swayPhase) * p.swayAmp;
        const drawX = p.x + sway;

        // Fade in near the bottom, fade out near the top.
        const edgeFade = Math.min(1, (height - p.y) / (height * 0.25));
        const topFade = Math.min(1, p.y / (height * 0.2));
        const opacity = p.baseOpacity * Math.min(edgeFade, topFade);

        if (opacity > 0.01) {
          ctx.beginPath();
          ctx.arc(drawX, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
          ctx.shadowColor = `rgba(${p.color}, ${opacity * 0.8})`;
          ctx.shadowBlur = p.r * 4;
          ctx.fill();
        }

        if (p.y < -10) {
          Object.assign(p, spawn({ y: height + Math.random() * 40 }));
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-[9] h-full w-full motion-reduce:hidden"
    />
  );
}

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

  if (effect === "particles") {
    return <ParticlesLayer />;
  }

  return null;
}
