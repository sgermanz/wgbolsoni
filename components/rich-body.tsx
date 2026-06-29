import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";

type Props = {
  lexical?: SerializedEditorState;
  paragraphs?: string[];
  className?: string;
};

/**
 * Renders article-style body content. Prefers Lexical state (from Payload)
 * when present; falls back to a list of `<p>` tags from the legacy
 * `string[]` shape. The wrapper carries the `.prose` typography styles
 * defined in globals.css.
 */
export function RichBody({ lexical, paragraphs, className }: Props) {
  if (lexical?.root) {
    return (
      <div className={className ?? "prose"}>
        <RichText data={lexical} />
      </div>
    );
  }
  if (paragraphs && paragraphs.length > 0) {
    return (
      <div className={className ?? "prose"}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  }
  return null;
}
