import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import {
  listPosts,
  POST_CATEGORY_LABELS,
  type PostCategory,
} from "@/lib/blog";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SITE } from "@/lib/site";

type SearchParams = { cat?: string; page?: string; tag?: string };

export const metadata: Metadata = {
  title: "Blog",
  description: `Análises, mercado e atualizações das frentes da ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/blog` },
};

const isCategory = (v?: string): v is PostCategory =>
  !!v && v in POST_CATEGORY_LABELS;

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const category = isCategory(sp.cat) ? sp.cat : undefined;
  const tag = sp.tag;

  const { posts, totalPages } = await listPosts({ page, category, tag });

  const buildHref = (next: { cat?: PostCategory | null; page?: number }) => {
    const params = new URLSearchParams();
    if (next.cat) params.set("cat", next.cat);
    else if (category && next.cat === undefined) params.set("cat", category);
    if (tag) params.set("tag", tag);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="gradient-mesh absolute inset-0 -z-10 opacity-40 dark:opacity-25"
        />
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-36 lg:px-8 lg:pb-16 lg:pt-44">
          <Reveal>
            <SectionHeading
              eyebrow="Blog"
              title="Análises, mercado e bastidores das nossas frentes."
              subtitle={
                tag
                  ? `Matérias com a tag #${tag}.`
                  : category
                    ? `Categoria: ${POST_CATEGORY_LABELS[category]}.`
                    : "Conteúdo direto de quem está construindo as próximas frentes do agronegócio, energia e meio ambiente brasileiros."
              }
            />
          </Reveal>

          {/* Filtros por categoria */}
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-2">
              <Link
                href={buildHref({ cat: null })}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  !category
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-[var(--border)] text-[var(--content-soft)] hover:border-brand-500/40 hover:text-[var(--content)]"
                }`}
              >
                Todas
              </Link>
              {(Object.keys(POST_CATEGORY_LABELS) as PostCategory[]).map((c) => (
                <Link
                  key={c}
                  href={buildHref({ cat: c, page: 1 })}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    category === c
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-[var(--border)] text-[var(--content-soft)] hover:border-brand-500/40 hover:text-[var(--content)]"
                  }`}
                >
                  {POST_CATEGORY_LABELS[c]}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        {posts.length === 0 ? (
          <Reveal>
            <div className="mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-10 text-center">
              <p className="font-display text-lg font-bold">
                Em breve, nossas primeiras matérias.
              </p>
              <p className="mt-2 text-sm text-[var(--content-soft)]">
                A equipe está finalizando o conteúdo inicial. Volte em breve.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id as string} delay={(i % 3) * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {post.cover ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={post.cover.url}
                        alt={post.cover.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-brand-500/20 to-brand-700/20" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.categories?.length ? (
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                        {POST_CATEGORY_LABELS[post.categories[0]]}
                      </p>
                    ) : null}
                    <h3 className="text-balance mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300">
                      {post.title}
                    </h3>
                    <p className="text-pretty mt-3 line-clamp-3 text-sm text-[var(--content-soft)]">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-5 flex items-center justify-between text-xs text-[var(--content-soft)]">
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.readingTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime} min
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3 text-sm">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="rounded-full border border-[var(--border)] px-4 py-1.5 transition hover:border-brand-500/40"
              >
                ← Anterior
              </Link>
            )}
            <span className="text-[var(--content-soft)]">
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildHref({ page: page + 1 })}
                className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1.5 text-white transition hover:bg-brand-700"
              >
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
