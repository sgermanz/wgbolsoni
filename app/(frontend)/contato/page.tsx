import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a WGBolsoni sobre proteína, florestamentos, biomassa, CPR Verde e demais frentes de atuação.",
};

export default function ContatoPage() {
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
              eyebrow="Contato"
              title="Vamos conversar."
              subtitle="Proteína, florestamentos, biomassa, CPR Verde, biocombustíveis ou qualquer das frentes do grupo — conte sua demanda e retornamos pelo canal de sua preferência."
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold">
                Envie sua mensagem
              </h2>
              <p className="mt-1 text-sm text-[var(--content-soft)]">
                Resposta em até 2 dias úteis.
              </p>

              <div className="mt-6">
                <ContactForm
                  turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                />
              </div>
            </div>
          </Reveal>
      </section>
    </>
  );
}
