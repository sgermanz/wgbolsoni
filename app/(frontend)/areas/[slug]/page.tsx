import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

import { getAllAreas, getAreaBySlug } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { CTA } from "@/components/cta";
import { RichBody } from "@/components/rich-body";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = true;

// Same rationale as the home page: avoid freezing on build-time fallback
// data (no DB access during Railway's build step). ISR refreshes content
// and cover images from the CMS without requiring a redeploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const areas = await getAllAreas();
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) return {};

  return {
    title: area.title,
    description: area.short,
    alternates: { canonical: `${SITE.url}/areas/${area.slug}` },
    openGraph: {
      title: `${area.title} — ${SITE.name}`,
      description: area.short,
      url: `${SITE.url}/areas/${area.slug}`,
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) notFound();

  const areas = await getAllAreas();
  const idx = areas.findIndex((a) => a.slug === area.slug);
  const prev = areas[(idx - 1 + areas.length) % areas.length];
  const next = areas[(idx + 1) % areas.length];

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Início", href: "/" },
    { name: "Áreas de atuação", href: "/#areas" },
    { name: area.title, href: `/areas/${area.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {/* HERO da área */}
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="gradient-mesh absolute inset-0 -z-10 opacity-40 dark:opacity-25"
        />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pb-20 lg:pt-44">
          <Reveal>
            <Link
              href="/#areas"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--content-soft)] transition hover:text-[var(--content)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas as áreas
            </Link>
          </Reveal>

          <Reveal>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
              <span className="h-px w-6 bg-brand-500" />
              Áreas de atuação
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-4xl font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.02]">
              {area.title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-pretty mt-6 max-w-2xl text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
              {area.short}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CAPA */}
      {area.cover && (
        <div className="mx-auto -mt-2 max-w-5xl px-5 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={area.cover.url}
              alt={area.cover.alt}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* CORPO */}
      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <RichBody
            lexical={area.bodyLexical}
            paragraphs={area.bodyParagraphs}
          />
        </Reveal>

        {/* SUBITENS (caso Florestamentos → Biomassa) */}
        {area.subitems && area.subitems.length > 0 && (
          <div className="mt-12 space-y-4">
            {area.subitems.map((sub, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 lg:p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    Subproduto
                  </span>
                  <h2 className="mt-4 font-display text-[length:var(--text-fluid-xl)] font-bold">
                    {sub.title}
                  </h2>
                  <p className="text-pretty mt-3 text-[var(--content-soft)]">
                    {sub.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* LINKS PARCEIROS (caso Proteína) */}
        {area.links && area.links.length > 0 && (
          <div className="mt-12">
            <Reveal>
              <h2 className="font-display text-[length:var(--text-fluid-xl)] font-bold">
                Parceiros nesta frente
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {area.links.map((link, i) => (
                <Reveal key={link.href} delay={0.05 * i}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg"
                  >
                    <div>
                      <p className="font-display text-lg font-bold">{link.label}</p>
                      <p className="mt-0.5 truncate text-xs text-[var(--content-soft)]">
                        {link.href.replace(/^https?:\/\//, "")}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-brand-300" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* NAV entre áreas + CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link
              href={`/areas/${prev.slug}`}
              className="group flex items-center gap-3 text-sm"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>
                <span className="block text-xs text-[var(--content-soft)]">
                  Anterior
                </span>
                <span className="font-display font-semibold">{prev.title}</span>
              </span>
            </Link>
            <Link
              href={`/areas/${next.slug}`}
              className="group flex items-center gap-3 text-right text-sm"
            >
              <span>
                <span className="block text-xs text-[var(--content-soft)]">
                  Próxima
                </span>
                <span className="font-display font-semibold">{next.title}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-700 px-6 py-8 text-white lg:px-10">
          <div>
            <p className="font-display text-lg font-bold">
              Quer saber mais sobre {area.title.toLowerCase()}?
            </p>
            <p className="text-sm text-white/80">Conte com o time da WG Bolsoni.</p>
          </div>
          <CTA href="/contato">Fale conosco</CTA>
        </div>
      </section>
    </>
  );
}
