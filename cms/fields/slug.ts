import type { Field, FieldHook } from "payload";

/** Turn any string into a clean kebab-case slug (accents stripped). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Field hook: if the editor left the slug blank, derive it from another
 * field (default: title). If they typed one, normalize it. Runs before
 * validation so a blank slug still satisfies `required`.
 */
export const formatSlugHook =
  (fallbackField = "title"): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return slugify(value);
    }
    const source =
      (data?.[fallbackField] as string | undefined) ??
      (originalDoc?.[fallbackField] as string | undefined);
    if (typeof source === "string" && source.length > 0) {
      return slugify(source);
    }
    return value;
  };

/**
 * Reusable slug field that auto-generates from `fallbackField` (title) when
 * left empty. The editor can still type a custom slug; it gets normalized.
 */
export function slugField(options?: {
  fallbackField?: string;
  description?: string;
}): Field {
  return {
    name: "slug",
    type: "text",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        options?.description ??
        "Gerado automaticamente a partir do título ao salvar. Edite se quiser um endereço específico.",
    },
    hooks: {
      beforeValidate: [formatSlugHook(options?.fallbackField ?? "title")],
    },
  };
}
