"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Brand } from "@/components/brand";

type NavChild = { label: string; href: string; tag?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

export function Navbar({
  brandName,
  navItems,
}: {
  brandName: string;
  navItems: NavItem[];
}) {
  const [open, setOpen] = useState(false);              // mobile menu
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  // Lê o tema atual aplicado pelo bootstrap inline.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("wgb-theme", next ? "dark" : "light");
    setDark(next);
  };

  // A barra superior é FIXA no bege-claro da marca, mesmo quando o site
  // inteiro entra em modo escuro — decisão explícita do cliente. Por isso
  // as cores da navbar não usam as variáveis de tema (--surface, --content
  // etc.), que trocariam com .dark; ficam com valores literais.
  const navLink =
    "rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition hover:text-ink-800";

  const iconBtn =
    "grid h-10 w-10 place-items-center rounded-lg text-ink-500 transition hover:bg-white hover:text-ink-800";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-200 bg-ink-50">
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
          {navItems.map((item) => {
            const children = item.children ?? [];
            if (children.length === 0) {
              return (
                <Link key={item.href} href={item.href} className={navLink}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(navLink, "flex items-center gap-1")}
                  aria-expanded={openDropdown === item.href}
                  onClick={() => setOpenDropdown((value) => value === item.href ? null : item.href)}
                >
                  {item.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === item.href && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openDropdown === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full w-[420px] rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2 shadow-2xl"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {children.map((child) => (
                          <Link
                            key={`${child.label}-${child.href}`}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--surface)]"
                          >
                            <span className="font-medium">{child.label}</span>
                            {child.tag && (
                              <span className="ml-2 rounded-full bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                                {child.tag}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
            className="overflow-hidden border-t border-ink-200 bg-ink-50 lg:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink-800 transition hover:bg-white"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={`${child.label}-${child.href}`}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="ml-4 block rounded-lg px-3 py-2.5 text-sm text-ink-800 transition hover:bg-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
