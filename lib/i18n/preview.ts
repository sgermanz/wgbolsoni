import "server-only";
import { readFile } from "node:fs/promises";
import type { Payload } from "payload";

/** Read-only local QA data. Never enabled in production, never used for writes. */
export async function getPreviewPayload(): Promise<Payload | undefined> {
  if (process.env.NODE_ENV !== "development" || !process.env.WGB_CONTENT_PREVIEW_PATH) return undefined;
  const snapshot = JSON.parse(await readFile(process.env.WGB_CONTENT_PREVIEW_PATH, "utf8")) as Record<string, unknown>;
  function matches(doc: Record<string, unknown>, where?: Record<string, unknown>): boolean {
    if (!where) return true;
    return Object.entries(where).every(([field, condition]) => {
      if (field === "and") return (condition as Record<string, unknown>[]).every(part => matches(doc, part));
      if (field === "or") return (condition as Record<string, unknown>[]).some(part => matches(doc, part));
      const operators = condition as Record<string, unknown>;
      const value = field.split(".").reduce<unknown>((item, key) => item && typeof item === "object" ? (item as Record<string, unknown>)[key] : undefined, doc);
      return Object.entries(operators).every(([operator, target]) => {
        if (operator === "equals") return String(value) === String(target);
        if (operator === "not_equals") return String(value) !== String(target);
        if (operator === "contains") return Array.isArray(value) ? value.some(item => String(typeof item === "object" ? item.value : item) === String(target)) : String(value).includes(String(target));
        return false;
      });
    });
  }
  return {
    async find({ collection, where, sort, limit = 10, page = 1 }: { collection: string; where?: Record<string, unknown>; sort?: string; limit?: number; page?: number }) {
      const stored = snapshot[collection] as { docs?: Record<string, unknown>[] } | Record<string, unknown>[];
      const all = Array.isArray(stored) ? stored : stored?.docs ?? [];
      const docs = all.filter(doc => matches(doc, where));
      if (sort) {
        const key = sort.replace(/^-/, "");
        docs.sort((a, b) => String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "en", { numeric: true }) * (sort.startsWith("-") ? -1 : 1));
      }
      return { docs: docs.slice((page - 1) * limit, page * limit), totalDocs: docs.length, totalPages: Math.max(1, Math.ceil(docs.length / limit)), page };
    },
    async findGlobal({ slug }: { slug: string }) { return snapshot[slug]; },
  } as unknown as Payload;
}
