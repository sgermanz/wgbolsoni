import type { Payload } from "payload";
import sharp from "sharp";

/**
 * One-time example book, seeded on the first boot after this file lands.
 * Idempotent guard is on the exact title — the editor can rename, edit,
 * or delete it and this seed won't recreate. Purely there to make the
 * bibliography section on /conceito visible without waiting for the
 * client to upload a real cover.
 */

const EXAMPLE_TITLE = "Longo prazo — capital, governança e território";
const EXAMPLE = {
  title: EXAMPLE_TITLE,
  year: 2024,
  synopsis:
    "Um mapa das teses de longo prazo que orientam o grupo — do capital que constrói ao território que sustenta —, com casos práticos das frentes agro, energia e ativos ambientais.",
  purchaseUrl: "https://exemplo.com/onde-comprar",
  /** Cover gradient (top → bottom) in brand tones. */
  gradient: ["#143620", "#2f8049"] as [string, string],
};

async function makeBookCover(
  payload: Payload,
  alt: string,
): Promise<string | number> {
  const [from, to] = EXAMPLE.gradient;
  // Portrait book cover (2:3), branded gradient + a subtle wordmark stripe.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.12">
    <circle cx="640" cy="220" r="120" stroke-width="30"/>
    <circle cx="640" cy="220" r="200" stroke-width="16"/>
    <circle cx="640" cy="220" r="280" stroke-width="8"/>
  </g>
  <rect x="90" y="1040" width="180" height="8" rx="4" fill="#ffffff" fill-opacity="0.5"/>
  <rect x="90" y="1080" width="360" height="4" rx="2" fill="#ffffff" fill-opacity="0.25"/>
</svg>`;
  const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();
  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: "image/jpeg",
      name: "book-example-cover.jpg",
      size: buffer.length,
    },
  });
  return media.id as string | number;
}

export async function seedExampleBook(payload: Payload): Promise<void> {
  try {
    const existing = await payload.find({
      collection: "books",
      where: { title: { equals: EXAMPLE_TITLE } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs.length > 0) {
      payload.logger.info("[seed] books: example already present — skipping");
      return;
    }

    const coverId = await makeBookCover(
      payload,
      `Capa do livro — ${EXAMPLE.title}`,
    );
    await payload.create({
      collection: "books",
      data: {
        title: EXAMPLE.title,
        cover: coverId,
        synopsis: EXAMPLE.synopsis,
        year: EXAMPLE.year,
        purchaseUrl: EXAMPLE.purchaseUrl,
      } as never,
    });
    payload.logger.info("[seed] books: example book inserted");
  } catch (error) {
    payload.logger.warn(
      `[seed] books skipped: ${(error as Error).message}`,
    );
  }
}
