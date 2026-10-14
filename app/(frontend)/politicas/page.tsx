import { localizePage, localizeMetadata, getLocale, localizeRecord } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { RichBody } from "@/components/rich-body";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { withFallback } from "@/lib/cms";

// Read the published document on every request, never an autosaved draft.
export const dynamic = "force-dynamic";

const baseMetadata: Metadata = {
  title: "Políticas",
  description:
    "Princípios de conduta, governança, sustentabilidade e privacidade da WG Bolsoni.",
};

export default async function PoliticasPage() {
  const sourcePage = await withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "pages",
        where: {
          and: [
            { slug: { equals: "politicas" } },
            { _status: { equals: "published" } },
          ],
        },
        draft: false,
        limit: 1,
        depth: 1,
      });
      return result.docs[0] as unknown as
        | { subtitle?: string | null; body?: SerializedEditorState | null }
        | undefined;
    },
    undefined,
    "PoliticasPage",
  );

  const page = localizeRecord(sourcePage, await getLocale());
  return localizePage((
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
              Políticas
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-3xl font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.02]">
              {page?.subtitle || "Princípios que guiam nossa atuação."}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          {page?.body?.root ? (
            <RichBody lexical={page.body} />
          ) : (
          <div className="prose">
            <h2>Conduta e ética</h2>
            <p>
              Atuamos com integridade, transparência e respeito a todas as
              partes interessadas — clientes, parceiros, colaboradores,
              comunidades e poder público. Não toleramos práticas que
              comprometam a confiança ou violem a legislação aplicável.
            </p>

            <h2>Sustentabilidade</h2>
            <p>
              Nossa agenda ambiental é estrutural, não decorativa: integramos
              conservação, recuperação e uso sustentável de recursos às nossas
              decisões de investimento. A CPR Verde é uma das expressões
              concretas desse compromisso — remunerar o produtor que preserva.
            </p>

            <h2>Governança</h2>
            <p>
              Negócios duradouros exigem governança clara — papéis bem
              definidos, decisões registradas, indicadores acompanhados e
              auditoria periódica. Aplicamos esses princípios tanto no nível da
              holding quanto nas companhias em que participamos.
            </p>

            <h2>Pessoas e diversidade</h2>
            <p>
              Valorizamos times diversos e meritocráticos, com igualdade de
              oportunidades. A capacidade de aprender e contribuir não tem cor,
              gênero, origem ou crença.
            </p>

            <h2>Privacidade de dados</h2>
            <p>
              Tratamos dados pessoais com responsabilidade, em conformidade com
              a LGPD. Coletamos apenas o necessário, com finalidade legítima
              clara, e mantemos as informações com medidas razoáveis de
              segurança.
            </p>

            <h2>Canal de comunicação</h2>
            <p>
              Dúvidas, sugestões ou denúncias relacionadas a esta política
              podem ser enviadas pelo nosso canal de contato.
            </p>
          </div>
          )}
        </Reveal>
      </section>
    </>
  ));
}

export async function generateMetadata(): Promise<Metadata> { return localizeMetadata(baseMetadata); }
