"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

import { NAV_TOP } from "@/lib/site";
import { AREAS } from "@/lib/areas";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/brand";

export function Navbar({ brandName }: { brandName: string }) {
  const [open, setOpen] = useState(false);              // mobile menu
  const [areasOpen, setAreasOpen] = useState(false);    // desktop dropdown
  const [dark, setDark] = useState(false);

  // Lê o tema atual aplicado pelo bootstrap inline.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("wgb-theme", next ? "dark" : "light");
    setDark(next);
  };

  const navLink =
    "rounded-lg px-3 py-2 text-sm font-medium text-[var(--content-soft)] transition hover:text-[var(--content)]";

  const iconBtn =
    "grid h-10 w-10 place-items-center rounded-lg text-[var(--content-soft)] transition hover:bg-[var(--surface-2)] hover:text-[var(--content)]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 lg:h-20 lg:px-8" aria-label="Principal">
        {/* No mobile o logo fica centralizado (posição absoluta, ignora o
            espaço assimétrico dos ícones à direita); no desktop volta ao
            fluxo normal, primeiro item à esquerda. */}
        <Link
          href="/"
          aria-label={brandName}
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0"
        >
          <Brand name={brandName} />
        </Link>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_TOP.filter(n => n.href !== "/contato").map((item) => (
            <Link key={item.href} href={item.href} className={navLink}>
              {item.label}
            </Link>
          ))}

          {/* Dropdown Conheça Mais (áreas de atuação) */}
          <div
            className="relative"
            onMouseEnter={() => setAreasOpen(true)}
            onMouseLeave={() => setAreasOpen(false)}
          >
            <button
              className={cn(navLink, "flex items-center gap-1")}
              aria-expanded={areasOpen}
              onClick={() => setAreasOpen(v => !v)}
            >
              Conheça Mais
              <ChevronDown className={cn("h-4 w-4 transition-transform", areasOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {areasOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full w-[420px] rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {AREAS.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/areas/${a.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--surface)]"
                      >
                        <span className="font-medium">{a.title}</span>
                        {a.tag && (
                          <span className="ml-2 rounded-full bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                            {a.tag}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={iconBtn}
            aria-label="Alternar tema"
          >
            {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <Link
            href="/contato"
            className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 lg:inline-block"
          >
            Fale conosco
          </Link>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className={cn(iconBtn, "lg:hidden")}
            aria-expanded={open}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] lg:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {NAV_TOP.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium transition hover:bg-[var(--surface-2)]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-[var(--border)]" />
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--content-soft)]">
                Áreas de atuação
              </p>
              {AREAS.map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[var(--surface-2)]"
                >
                  {a.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
