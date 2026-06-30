import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import {
  ImageBlockRenderer,
  VideoBlockRenderer,
  GalleryBlockRenderer,
} from "@/components/lexical-blocks";

type Props = {
  lexical?: SerializedEditorState;
  paragraphs?: string[];
  className?: string;
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    image: ({ node }: { node: { fields: unknown } }) => (
      <ImageBlockRenderer block={node.fields as never} />
    ),
    video: ({ node }: { node: { fields: unknown } }) => (
      <VideoBlockRenderer block={node.fields as never} />
    ),
    gallery: ({ node }: { node: { fields: unknown } }) => (
      <GalleryBlockRenderer block={node.fields as never} />
    ),
  },
});

/**
 * Renders article-style body content. Prefers Lexical state (from Payload)
 * with custom block converters for image/video/gallery; falls back to a
 * list of <p> tags from the legacy `string[]` shape used in lib/areas.ts.
 */
export function RichBody({ lexical, paragraphs, className }: Props) {
  if (lexical?.root) {
    return (
      <div className={className ?? "prose"}>
        <RichText data={lexical} converters={converters} />
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
