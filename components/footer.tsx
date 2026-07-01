import Link from "next/link";
import { SITE, NAV_TOP } from "@/lib/site";
import { AREAS } from "@/lib/areas";
import { Brand } from "@/components/brand";

type Props = {
  brandName: string;
  tagline: string;
  email: string;
  copyrightStart: number;
};

export function Footer({ brandName, tagline, email, copyrightStart }: Props) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <Link href="/" aria-label={brandName} className="inline-flex items-center">
              <Brand name={brandName} size="lg" />
            </Link>
            <p className="text-pretty mt-4 max-w-xs text-sm text-[var(--content-soft)]">
              {tagline}
            </p>
          </div>

          {/* Navegação */}
          <nav aria-label="Rodapé — navegação" className="text-sm">
            <h3 className="font-display font-semibold">Navegação</h3>
            <ul className="mt-4 space-y-2.5 text-[var(--content-soft)]">
              {NAV_TOP.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition hover:text-[var(--content)]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Áreas de atuação (1ª metade) */}
          <nav aria-label="Áreas de atuação" className="text-sm">
            <h3 className="font-display font-semibold">Áreas de atuação</h3>
            <ul className="mt-4 space-y-2.5 text-[var(--content-soft)]">
              {AREAS.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="transition hover:text-[var(--content)]">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Áreas de atuação (2ª metade) + Contato */}
          <div className="text-sm">
            <h3 className="font-display font-semibold">&nbsp;</h3>
            <ul className="mt-4 space-y-2.5 text-[var(--content-soft)]">
              {AREAS.slice(6).map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="transition hover:text-[var(--content)]">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-display font-semibold">Contato</h3>
            <a
              href={`mailto:${email}`}
              className="mt-3 inline-block text-[var(--content-soft)] transition hover:text-[var(--content)]"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-7 text-sm text-[var(--content-soft)] sm:flex-row sm:items-center">
          <p>
            &copy; {copyrightStart} &ndash; {SITE.copyrightEnd} {brandName}.
            Todos os direitos reservados.
          </p>
          <Link href="/politicas" className="transition hover:text-[var(--content)]">
            Políticas &amp; Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
