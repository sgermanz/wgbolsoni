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

/* -------------------------------------------------------------------------
 * Rich builders — for content that needs headings, bullet lists and bold,
 * beyond the plain-paragraph `paragraphsToLexical` above. Produces the same
 * node shapes Payload's Lexical editor writes, so the admin can edit the
 * result normally afterwards.
 * ----------------------------------------------------------------------- */

/** A run of inline text; `bold` maps to Lexical's format bit 1. */
export type TextRun = { text: string; bold?: boolean };

function textNode(run: TextRun) {
  return {
    type: "text",
    text: run.text,
    format: run.bold ? 1 : 0,
    mode: "normal",
    style: "",
    detail: 0,
    version: 1,
  };
}

export function lexParagraph(runs: string | TextRun[]) {
  const children = (typeof runs === "string" ? [{ text: runs }] : runs).map(
    textNode,
  );
  return {
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    textFormat: 0,
    textStyle: "",
    children,
  };
}

export function lexHeading(text: string, tag: "h2" | "h3" = "h2") {
  return {
    type: "heading",
    tag,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: [textNode({ text })],
  };
}

export function lexBulletList(items: TextRun[][]) {
  return {
    type: "list",
    listType: "bullet",
    tag: "ul",
    start: 1,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: items.map((runs, i) => ({
      type: "listitem",
      value: i + 1,
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: runs.map(textNode),
    })),
  };
}

/** Wrap a list of block nodes (from the lex* helpers) into an editor state. */
export function buildLexical(children: unknown[]): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children,
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
