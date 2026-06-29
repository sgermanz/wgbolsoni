import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * Convert plain text paragraphs into a Lexical editor state.
 * Used by the seed script to migrate legacy `string[]` content from
 * `lib/areas.ts` into Payload's rich-text format.
 */
export function paragraphsToLexical(
  paragraphs: string[],
): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: [
          {
            type: "text",
            text,
            format: 0,
            mode: "normal",
            style: "",
            detail: 0,
            version: 1,
          },
        ],
      })),
    },
  } as unknown as SerializedEditorState;
}

/**
 * Pull plain-text paragraphs out of a Lexical state — used for excerpts and
 * the FAQ schema where we need flat text, not JSX.
 */
export function lexicalToPlainParagraphs(
  state: SerializedEditorState | null | undefined,
): string[] {
  if (!state?.root) return [];
  const out: string[] = [];
  for (const node of state.root.children ?? []) {
    if (
      (node as { type?: string }).type === "paragraph" &&
      Array.isArray((node as { children?: unknown[] }).children)
    ) {
      const text = ((node as unknown as { children: { text?: string }[] })
        .children ?? [])
        .map((c) => c?.text ?? "")
        .join("");
      if (text.trim()) out.push(text);
    }
  }
  return out;
}
