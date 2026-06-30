import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAllAreas } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CTA } from "@/components/cta";
import { SITE } from "@/lib/site";

// Without this the page is fully static-generated at build time. Railway's
// build container can't reach the internal Postgres network, so the page
// would freeze on the lib/areas.ts fallback (no cover images, stale text)
// until the next code deploy. ISR lets it pick up CMS edits on its own.
export const revalidate = 60;

export default async function HomePage() {
  const areas = await getAllAreas();

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="gradient-mesh absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_40%,var(--surface)_100%)]"
        />

        <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-8 lg:pb-32 lg:pt-48">
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)]/60 px-4 py-1.5 text-sm font-medium text-[var(--content-soft)] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Holding de participações desde {SITE.copyrightStart}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-4xl text-[length:var(--text-fluid-hero)] font-extrabold tracking-tight">
              Nossa marca está presente em cada um destes negócios.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-pretty mt-7 max-w-2xl text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
              Agronegócio, energia, meio ambiente, indústria e novas frentes —
              com a <strong className="text-[var(--content)]">CPR Verde</strong>{" "}
              no centro da agenda ambiental e a{" "}
              <strong className="text-[var(--content)]">proteína de alto valor biológico</strong>{" "}
              como nova fronteira nutricional global.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CTA href="/contato">Fale com a WG Bolsoni</CTA>
              <CTA href="#areas" variant="ghost">
                Conhecer as frentes
              </CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== ÁREAS DE ATUAÇÃO ===================== */}
      <section
        id="areas"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28 scroll-mt-24"
      >
        <SectionHeading
          eyebrow="Áreas de atuação"
          title={`${areas.length} frentes que se conectam`}
          subtitle="Cada uma delas com história, parceiros e estratégia próprios — e todas alinhadas à agenda ambiental e produtiva do grupo."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.slug} delay={(i % 3) * 0.06}>
              <Link
                href={`/areas/${area.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                {area.cover ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={area.cover.url}
                      alt={area.cover.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-brand-500/20"
                  />
                )}
                <div className="relative flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-500">
                      0{i + 1 < 10 ? i + 1 : i + 1}
                    </span>
                    {area.tag && (
                      <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                        {area.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold">
                    {area.title}
                  </h3>
                  <p className="text-pretty mt-3 line-clamp-3 text-sm text-[var(--content-soft)]">
                    {area.short}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2.5 dark:text-brand-300">
                    Conhecer
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-700 px-8 py-16 text-center text-white lg:px-16 lg:py-24">
          <div aria-hidden className="gradient-mesh absolute inset-0 opacity-30" />
          <div className="relative">
            <Reveal>
              <h2 className="text-balance mx-auto max-w-2xl font-display text-[length:var(--text-fluid-2xl)] font-bold">
                Vamos conversar sobre as frentes do grupo?
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-pretty mx-auto mt-4 max-w-xl text-white/80">
                Conte sua demanda — retornamos pelo canal de sua preferência.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex justify-center">
                <CTA href="/contato">Falar com a WG Bolsoni</CTA>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
