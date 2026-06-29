"use client";

// Bloco animado: aparece quando entra no viewport.
// Use no lugar de uma <div> quando quiser reveal on scroll com stagger.
// Respeita `prefers-reduced-motion` (framer-motion já faz isso por padrão).

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof motion;
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (motion as any)[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}

// Aplica stagger automático para a sequência de filhos.
export function RevealStagger({
  children,
  step = 0.08,
  className,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
