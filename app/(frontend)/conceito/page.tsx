import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Conceito",
  description:
    "O conceito da WG Bolsoni: holding de participações que combina visão setorial, governança e capacidade de execução.",
};

export default function ConceitoPage() {
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
              Conceito
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-3xl font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.02]">
              Uma holding pensada para o longo prazo.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <div className="prose">
            <p>
              A WG Bolsoni é uma holding de participações que atua em múltiplas
              frentes — agronegócio, energia, meio ambiente, indústria e novas
              fronteiras como proteína de alto valor biológico e ativos
              ambientais.
            </p>
            <p>
              Em vez de operar em um único setor, escolhemos negócios em que
              nossa visão setorial, rede de relacionamento e capacidade de
              execução criam vantagem competitiva real — e em que conseguimos
              contribuir além do capital, com governança e estratégia.
            </p>

            <h2>O que orienta nossas decisões</h2>
            <ul>
              <li>
                <strong>Longo prazo.</strong> Privilegiamos teses estruturais a
                modas passageiras. Plantar uma floresta, montar um negócio de
                proteína global ou estruturar um título financeiro lastreado em
                conservação são apostas de anos, não de semestres.
              </li>
              <li>
                <strong>Convergência ambiental e produtiva.</strong> Cada vez
                mais, geração de valor passa por sustentabilidade — não como
                discurso, mas como modelo de negócio. CPR Verde, biomassa,
                biocombustíveis e proteína de alto valor biológico são exemplos
                disso.
              </li>
              <li>
                <strong>Execução com governança.</strong> Investimos em pessoas
                e em estruturas que sustentem a operação no tempo, com clareza
                de papéis e disciplina financeira.
              </li>
            </ul>

            <h2>Nossa visão</h2>
            <p>
              Ser referência em construir e participar de negócios que conectam
              o agronegócio brasileiro ao mundo, gerando renda, segurança
              alimentar e contribuição efetiva para a redução de emissões — sem
              romantismo e sem sacrificar competitividade.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
