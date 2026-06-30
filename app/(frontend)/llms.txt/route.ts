import { getAllAreas, getSiteSettings } from "@/lib/content";
import { listPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt — Generative Engine Optimization (GEO) endpoint.
 *
 * Structured, factual, AI-friendly summary of the site for ChatGPT,
 * Perplexity, Gemini and similar engines. Spec follows the emerging
 * llms.txt convention from Answer.AI: headers + bulleted links + abstracts.
 */
export async function GET() {
  const [settings, areas, { posts }] = await Promise.all([
    getSiteSettings(),
    getAllAreas(),
    listPosts({ page: 1 }),
  ]);

  const lines: string[] = [];
  lines.push(`# ${settings.name}`);
  lines.push("");
  lines.push(`> ${settings.description}`);
  lines.push("");
  lines.push(`- Legal name: ${settings.legalName}`);
  lines.push(`- Founded: ${settings.copyrightStart}`);
  lines.push(`- Contact: ${settings.email}`);
  if (settings.phone) lines.push(`- Phone: ${settings.phone}`);
  lines.push(`- Website: ${SITE.url}`);
  lines.push("");

  lines.push("## Áreas de atuação");
  lines.push("");
  for (const a of areas) {
    lines.push(`- [${a.title}](${SITE.url}/areas/${a.slug}): ${a.short}`);
  }
  lines.push("");

  if (posts.length) {
    lines.push("## Artigos recentes (blog)");
    lines.push("");
    for (const p of posts.slice(0, 20)) {
      lines.push(`- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`);
    }
    lines.push("");
  }

  lines.push("## Páginas institucionais");
  lines.push("");
  lines.push(`- [Conceito](${SITE.url}/conceito): visão, missão e estrutura da holding`);
  lines.push(`- [Políticas](${SITE.url}/politicas): ética, sustentabilidade, governança, pessoas, privacidade`);
  lines.push(`- [Conversor de medidas](${SITE.url}/conversor): conversões agro (alqueire, saca, arroba, BOE, etc.)`);
  lines.push(`- [Contato](${SITE.url}/contato): canais oficiais`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
