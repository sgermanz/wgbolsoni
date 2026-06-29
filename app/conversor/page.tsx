import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Converter } from "./converter";

export const metadata: Metadata = {
  title: "Conversor de Medidas",
  description:
    "Ferramenta interativa de conversão de unidades para agronegócio, floresta e energia: hectares, alqueires, m³, toneladas, MWh, GJ, sacas.",
};

export default function ConversorPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="gradient-mesh absolute inset-0 -z-10 opacity-40 dark:opacity-25"
        />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pb-20 lg:pt-44">
          <Reveal>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
              <span className="h-px w-6 bg-brand-500" />
              Ferramentas
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-3xl font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.02]">
              Conversor de Medidas
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-pretty mt-5 max-w-2xl text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
              Conversões frequentes em agro, floresta e energia — área, massa,
              volume e energia. Tudo no navegador, sem servidor.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
        <Converter />
      </section>
    </>
  );
}
