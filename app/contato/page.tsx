import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import { CTA } from "@/components/cta";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a WG Bolsoni sobre proteína, florestamentos, biomassa, CPR Verde e demais frentes de atuação.",
};

export default function ContatoPage() {
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
              Contato
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance max-w-3xl font-display text-[length:var(--text-fluid-3xl)] font-extrabold leading-[1.02]">
              Vamos conversar.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-pretty mt-5 max-w-2xl text-[length:var(--text-fluid-lg)] text-[var(--content-soft)]">
              Proteína, florestamentos, biomassa, CPR Verde, biocombustíveis ou
              qualquer das frentes do grupo — conte sua demanda.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-[var(--content-soft)]">E-mail</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-display text-xl font-bold transition hover:text-brand-600 dark:hover:text-brand-300"
                >
                  {SITE.email}
                </a>
              </div>
            </div>

            <p className="text-pretty mt-6 text-[var(--content-soft)]">
              Envie sua mensagem para o nosso e-mail institucional. Respondemos
              com prioridade temas relacionados às frentes em que atuamos.
            </p>

            <div className="mt-6">
              <CTA
                href={`mailto:${SITE.email}?subject=Contato%20pelo%20site`}
              >
                Abrir cliente de e-mail
              </CTA>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
