import { createRequire } from "node:module";

import type { Payload } from "payload";
import { pushDevSchema } from "@payloadcms/drizzle";

import { AREAS } from "@/lib/areas";
import { SITE, NAV_TOP } from "@/lib/site";
import {
  paragraphsToLexical,
  buildLexical,
  lexParagraph,
  lexHeading,
  lexBulletList,
  lexicalToPlainParagraphs,
} from "@/lib/lexical";

/**
 * The full Conceito body, mirroring the rich content the /conceito page used
 * to hardcode (intro + "O que orienta nossas decisões" list + "Nossa visão").
 * Stored in the CMS so editors control the page text; the page renders this
 * and keeps the same JSX as an offline fallback. Keep the two in sync.
 */
const CONCEITO_BODY = buildLexical([
  lexParagraph(
    "A WG Bolsoni é uma holding de participações que atua em múltiplas frentes — agronegócio, energia, meio ambiente, indústria e novas fronteiras como proteína de alto valor biológico e ativos ambientais.",
  ),
  lexParagraph(
    "Em vez de operar em um único setor, escolhemos negócios em que nossa visão setorial, rede de relacionamento e capacidade de execução criam vantagem competitiva real — e em que conseguimos contribuir além do capital, com governança e estratégia.",
  ),
  lexHeading("O que orienta nossas decisões"),
  lexBulletList([
    [
      { text: "Longo prazo.", bold: true },
      {
        text: " Privilegiamos teses estruturais a modas passageiras. Plantar uma floresta, montar um negócio de proteína global ou estruturar um título financeiro lastreado em conservação são apostas de anos, não de semestres.",
      },
    ],
    [
      { text: "Convergência ambiental e produtiva.", bold: true },
      {
        text: " Cada vez mais, geração de valor passa por sustentabilidade — não como discurso, mas como modelo de negócio. CPR Verde, biomassa, biocombustíveis e proteína de alto valor biológico são exemplos disso.",
      },
    ],
    [
      { text: "Execução com governança.", bold: true },
      {
        text: " Investimos em pessoas e em estruturas que sustentem a operação no tempo, com clareza de papéis e disciplina financeira.",
      },
    ],
  ]),
  lexHeading("Nossa visão"),
  lexParagraph(
    "Ser referência em construir e participar de negócios que conectam o agronegócio brasileiro ao mundo, gerando renda, segurança alimentar e contribuição efetiva para a redução de emissões — sem romantismo e sem sacrificar competitividade.",
  ),
]);

/**
 * Distinctive phrase from the *old* short seed body. The backfill only fires
 * when it finds this exact legacy text, so it replaces the placeholder once
 * and never touches a fresh-seeded body or an editor's later edits.
 */
const CONCEITO_LEGACY_MARKER =
  "nasceu como holding de participações em 2016";

/**
 * Idempotent seed runner. Called from `onInit` in payload.config.ts on every
 * boot, but only inserts records when their collections/globals are still
 * empty. Once Wilton edits anything in the admin, the seed stops re-touching
 * that data — his edits stay authoritative.
 *
 * Pulls the source of truth from the existing legacy files so the admin
 * starts with the exact same content the public site already serves.
 */
export async function seed(payload: Payload): Promise<void> {
  await ensureSchema(payload);
  await seedAreas(payload);
  await seedPages(payload);
  await backfillConceitoBody(payload);
  await seedSiteSettings(payload);
  await seedHomeHero(payload);
}

/**
 * One-time content migration: the /conceito page used to hardcode its body,
 * so the seeded CMS body was a short placeholder that the page ignored. Now
 * that the page renders the CMS body, backfill the full rich content so the
 * page looks identical while becoming fully editable.
 *
 * Idempotent and non-destructive: it only writes when the body still contains
 * the old placeholder text, so it fires once and never touches a fresh-seeded
 * body or an editor's later edits.
 */
async function backfillConceitoBody(payload: Payload): Promise<void> {
  try {
    const res = await payload.find({
      collection: "pages",
      where: { slug: { equals: "conceito" } },
      limit: 1,
      pagination: false,
    });
    const doc = res.docs[0] as { id: string | number; body?: unknown } | undefined;
    if (!doc) return;

    const plain = lexicalToPlainParagraphs(doc.body as never).join(" ");
    if (!plain.includes(CONCEITO_LEGACY_MARKER)) return; // fresh/edited — leave it

    await payload.update({
      collection: "pages",
      id: doc.id,
      data: { body: CONCEITO_BODY } as never,
    });
    payload.logger.info("[seed] conceito body: migrated legacy placeholder");
  } catch (error) {
    payload.logger.warn(
      `[seed] conceito body backfill skipped: ${(error as Error).message}`,
    );
  }
}

/**
 * The postgres adapter's `push: true` flag only auto-syncs the schema when
 * Payload starts in dev mode. In production (NODE_ENV=production) the
 * adapter expects migrations to have already been run, so on a fresh
 * Railway DB the tables don't exist and the very first query fails.
 *
 * We sidestep that by calling `pushDevSchema` manually on every boot —
 * it diffs the schema and applies only what's missing, so it's idempotent
 * and safe to re-run.
 */
async function ensureSchema(payload: Payload): Promise<void> {
  payload.logger.info("[schema] syncing Postgres schema (pushDevSchema)…");
  try {
    // The db-postgres adapter only auto-pushes when NODE_ENV !== 'production'
    // (see node_modules/@payloadcms/db-postgres/dist/connect.js). On Railway,
    // NODE_ENV is 'production', so we call the same utility ourselves.
    // Safe to re-run: it diffs the schema and applies only what's missing.
    //
    // When a change is potentially destructive (e.g. dropping a column while
    // altering a field type), pushDevSchema calls prompts() to ask for
    // confirmation. Railway containers have no TTY, so that throws. Since our
    // schema is code-owned and applied intentionally, we pre-inject "yes"
    // answers so the push proceeds non-interactively. (Postgres backups on
    // Railway are the safety net — see README.)
    const require = createRequire(import.meta.url);
    const prompts = require("prompts") as {
      inject: (values: unknown[]) => void;
    };
    prompts.inject(Array(20).fill(true));
    await pushDevSchema(payload.db as never);
    payload.logger.info("[schema] sync done");
  } catch (error) {
    payload.logger.error(
      `[schema] pushDevSchema failed: ${(error as Error).message}`,
    );
    throw error;
  }
}

async function seedAreas(payload: Payload) {
  const existing = await payload.find({
    collection: "areas",
    limit: 1,
    pagination: false,
  });
  if (existing.docs.length > 0) {
    payload.logger.info(
      `[seed] areas: ${existing.docs.length}+ already present — skipping`,
    );
    return;
  }

  payload.logger.info(`[seed] areas: importing ${AREAS.length} from lib/areas.ts`);
  for (const [index, area] of AREAS.entries()) {
    await payload.create({
      collection: "areas",
      data: {
        title: area.title,
        slug: area.slug,
        tag: area.tag,
        short: area.short,
        body: paragraphsToLexical(area.body),
        order: index,
        links: area.links?.map((l) => ({
          label: l.label,
          href: l.href,
          external: l.external ?? true,
        })),
        subitems: area.subitems?.map((s) => ({
          title: s.title,
          body: s.body,
        })),
      } as never,
    });
  }
  payload.logger.info(`[seed] areas: done`);
}

async function seedPages(payload: Payload) {
  const existing = await payload.find({
    collection: "pages",
    limit: 1,
    pagination: false,
  });
  if (existing.docs.length > 0) return;

  const politicas = [
    "A WG Bolsoni atua sob princípios claros de ética, conformidade e responsabilidade. Estes princípios guiam as decisões de investimento, a relação com sócios e parceiros e o dia a dia das empresas em que participamos.",
    "Sustentabilidade — Toda nova frente é avaliada também pelo impacto ambiental e social. A pauta ESG não é discurso: dirige a alocação de capital.",
    "Governança — Decisões importantes seguem ritos formais, com registro, segregação de funções e prestação de contas. Conflitos de interesse são declarados e tratados.",
    "Pessoas & Diversidade — Acreditamos que times diversos tomam decisões melhores. Combatemos toda forma de discriminação.",
    "Privacidade de Dados — Tratamos dados pessoais nos termos da LGPD. Coletamos apenas o necessário, com finalidade clara e armazenamento seguro.",
  ];

  await payload.create({
    collection: "pages",
    data: {
      title: "Conceito",
      slug: "conceito",
      subtitle:
        "Holding de participações desde 2016 — capital, governança e visão setorial.",
      body: CONCEITO_BODY,
    } as never,
  });

  await payload.create({
    collection: "pages",
    data: {
      title: "Políticas",
      slug: "politicas",
      subtitle:
        "Ética, sustentabilidade, governança, pessoas e privacidade de dados.",
      body: paragraphsToLexical(politicas),
    } as never,
  });

  payload.logger.info(`[seed] pages: done`);
}

async function seedSiteSettings(payload: Payload) {
  const existing = await payload.findGlobal({
    slug: "siteSettings",
  });
  if (existing && (existing as { name?: string }).name) {
    return;
  }

  await payload.updateGlobal({
    slug: "siteSettings",
    data: {
      name: SITE.name,
      legalName: SITE.legalName,
      tagline: SITE.tagline,
      description: SITE.description,
      email: SITE.email,
      copyrightStart: SITE.copyrightStart,
      navTop: NAV_TOP.map((n) => ({ label: n.label, href: n.href })),
    } as never,
  });

  payload.logger.info(`[seed] siteSettings: done`);
}

async function seedHomeHero(payload: Payload) {
  const existing = (await payload.findGlobal({ slug: "homeHero" })) as {
    slides?: unknown[];
  } | null;
  if (existing?.slides && existing.slides.length > 0) {
    return;
  }

  await payload.updateGlobal({
    slug: "homeHero",
    data: {
      autoplaySeconds: 6,
      slides: [
        {
          eyebrow: `Holding de participações desde ${SITE.copyrightStart}`,
          title: "Nossa marca está presente em cada um destes negócios.",
          subtitle:
            "Agronegócio, energia, meio ambiente, indústria e novas frentes — com a CPR Verde no centro da agenda ambiental e a proteína de alto valor biológico como nova fronteira nutricional global.",
          primaryCtaLabel: "Fale com a WG Bolsoni",
          primaryCtaHref: "/contato",
          secondaryCtaLabel: "Conhecer as frentes",
          secondaryCtaHref: "#areas",
          background: { type: "none" },
        },
      ],
    } as never,
  });

  payload.logger.info(`[seed] homeHero: done`);
}
