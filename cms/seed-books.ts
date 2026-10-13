import type { Payload } from "payload";

/**
 * Legacy entry point retained for cms/seed.ts compatibility.
 * Demo creation is permanently disabled. Retire only the exact, approved
 * legacy example record; never delete its media or modify genuine books.
 * A repeated initialization is safe: the same query then matches no rows.
 */
export async function seedExampleBook(payload: Payload): Promise<void> {
  const removed = await payload.delete({
    collection: "books",
    where: {
      and: [
        { id: { equals: 14 } },
        { title: { equals: "Longo prazo — capital, governança e território" } },
        { purchaseUrl: { equals: "https://exemplo.com/onde-comprar" } },
        { cover: { equals: 66 } },
        { year: { equals: 2024 } },
      ],
    },
    depth: 0,
  });

  if (removed.docs.length > 0) {
    payload.logger.info("[seed] books: approved legacy demo removed; demo creation disabled");
  }
}
