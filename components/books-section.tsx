import Image from "next/image";

import type { BookRecord } from "@/lib/books";
import { Reveal } from "@/components/reveal";

type Props = {
  books: BookRecord[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

/**
 * Bibliography grid used at the bottom of /conceito. Book covers are 2:3
 * portrait (standard book proportion). Purchase link, when present, sits at
 * the bottom of each card as a soft CTA.
 */
export function BooksSection({
  books,
  eyebrow = "Bibliografia",
  title = "Livros do autor",
  subtitle,
}: Props) {
  if (books.length === 0) return null;

  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <span className="h-px w-6 bg-brand-500" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-balance max-w-3xl font-display text-[length:var(--text-fluid-2xl)] font-extrabold leading-[1.05]">
            {title}
          </h2>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="text-pretty mt-4 max-w-2xl text-[var(--content-soft)]">
              {subtitle}
            </p>
          </Reveal>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, i) => (
            <Reveal key={book.id} delay={0.05 * i}>
              <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg">
                {book.cover && (
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-900/5">
                    <Image
                      src={book.cover.url}
                      alt={book.cover.alt}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {book.title}
                  </h3>
                  {book.year && (
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--content-soft)]">
                      {book.year}
                    </p>
                  )}
                  <p className="text-pretty text-sm leading-relaxed text-[var(--content-soft)]">
                    {book.synopsis}
                  </p>
                  {book.purchaseUrl && (
                    <a
                      href={book.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-100"
                    >
                      Onde comprar
                      <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
