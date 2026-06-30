import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

import { getPostBySlug, getRelated, POST_CATEGORY_LABELS } from "@/lib/blog";
import { getSiteSettings } from "@/lib/content";
import { lexicalToPlainParagraphs } from "@/lib/lexical";
import { Reveal } from "@/components/reveal";
import { RichBody } from "@/components/rich-body";
import { TTSButton } from "@/components/tts-button";
import { JsonLd } from "@/components/json-ld";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/schema";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.seo?.ogImage?.url
        ? [post.seo.ogImage.url]
        : post.cover?.url
          ? [post.cover.url]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([
    getRelated(post.id, post.categories?.[0], 3),
    getSiteSettings(),
  ]);
  const plain = lexicalToPlainParagraphs(post.body).join(" ");

  const articleLd = buildArticleSchema(post, settings);
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Início", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ]);
  const faqLd = post.geo?.faq ? buildFaqSchema(post.geo.faq) : null;

  return (
    <article>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="gradient-mesh absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        />
        <div className="mx-auto max-w-3xl px-5 pb-12 pt-36 lg:px-8 lg:pb-16 lg:pt-40">
          <Reveal>
            <Link
              href="/blog"
              className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--content-soft)] transition hover:text-[var(--content)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas as matérias
            </Link>
          </Reveal>

          {post.categories?.length ? (
            <Reveal>
              <Link
                href={`/blog?cat=${post.categories[0]}`}
                className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-600 transition hover:underline dark:text-brand-300"
              >
                {POST_CATEGORY_LABELS[post.categories[0]]}
              </Link>
            </Reveal>
          ) : null}

          <Reveal delay={0.05}>
            <h1 className="text-balance mt-3 font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.05]">
              {post.title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-pretty mt-5 text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
              {post.excerpt}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--content-soft)]">
              {post.author && (
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              {post.readingTime && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min de leitura
                </span>
              )}
              <TTSButton
                audioUrl={post.audioUrl}
                text={plain}
                className="ml-auto"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* COVER */}
      {post.cover?.url && (
        <div className="mx-auto -mt-2 max-w-5xl px-5 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* BODY */}
      <section className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <Reveal>
          <RichBody lexical={post.body} />
        </Reveal>

        {post.tags?.length ? (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--content-soft)] transition hover:border-brand-500/40 hover:text-[var(--content)]"
              >
                #{t}
              </Link>
            ))}
          </div>
        ) : null}

        {/* AUTHOR */}
        {post.author?.bio && (
          <div className="mt-12 flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
            {post.author.avatarUrl && (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-display font-bold">{post.author.name}</p>
              <p className="mt-1 text-sm text-[var(--content-soft)]">
                {post.author.bio}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="font-display text-2xl font-bold">Leia também</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id as string}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {r.cover ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={r.cover.url}
                        alt={r.cover.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-brand-500/15 to-brand-700/15" />
                  )}
                  <div className="p-5">
                    <p className="text-balance font-display font-bold leading-snug">
                      {r.title}
                    </p>
                    <p className="text-pretty mt-2 line-clamp-2 text-sm text-[var(--content-soft)]">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
