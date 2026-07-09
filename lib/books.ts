import "server-only";

import { withFallback } from "@/lib/cms";

export type BookRecord = {
  id: string | number;
  title: string;
  synopsis: string;
  year?: number;
  purchaseUrl?: string;
  cover?: { url: string; alt: string; width?: number; height?: number };
};

type PayloadBookDoc = {
  id: string | number;
  title: string;
  synopsis: string;
  year?: number | null;
  purchaseUrl?: string | null;
  cover?:
    | {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | string
    | number
    | null;
};

const toBook = (doc: PayloadBookDoc): BookRecord => {
  const cover =
    typeof doc.cover === "object" && doc.cover?.url
      ? {
          url: doc.cover.url as string,
          alt: doc.cover.alt || doc.title,
          width: doc.cover.width ?? undefined,
          height: doc.cover.height ?? undefined,
        }
      : undefined;

  return {
    id: doc.id,
    title: doc.title,
    synopsis: doc.synopsis,
    year: doc.year ?? undefined,
    purchaseUrl: doc.purchaseUrl ?? undefined,
    cover,
  };
};

export async function listBooks(): Promise<BookRecord[]> {
  return withFallback(
    async (payload) => {
      const result = await payload.find({
        collection: "books",
        limit: 24,
        sort: "-year",
        depth: 1,
      });
      return (result.docs as unknown as PayloadBookDoc[]).map(toBook);
    },
    [],
    "listBooks",
  );
}
