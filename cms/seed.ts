import type { Payload } from "payload";

import { AREAS } from "@/lib/areas";
import { SITE, NAV_TOP } from "@/lib/site";
import { paragraphsToLexical } from "@/lib/lexical";

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
  await seedSiteSettings(payload);
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
  const db = payload.db as unknown as {
    pushDevSchema?: () => Promise<void>;
  };
  if (typeof db.pushDevSchema !== "function") {
    payload.logger.warn(
      "[schema] adapter has no pushDevSchema — skipping (run migrations manually)",
    );
    return;
  }
  payload.logger.info("[schema] syncing Postgres schema (pushDevSchema)…");
  try {
    await db.pushDevSchema();
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

  const conceito = [
    "A WG Bolsoni nasceu como holding de participações em 2016, com a missão de conectar capital, governança e visão setorial a empresas em cadeias produtivas que combinam relevância econômica, agenda ambiental e potencial de expansão.",
    "O grupo opera em frentes que vão do agronegócio à indústria de base — proteína, florestamento, biomassa, alcoolquímica, biocombustíveis, energia, gaseificação de resíduos, fibras celulósicas, meio ambiente e novas frentes digitais — sempre com o mesmo princípio: investir onde conseguimos ajudar a construir e onde a sustentabilidade é parte do plano, não um anexo.",
    "Cada participação carrega o nome WG Bolsoni junto: não somos apenas capital, somos sócios de jornada.",
  ];

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
      body: paragraphsToLexical(conceito),
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
