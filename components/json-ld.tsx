type Props = { data: unknown };
import { localizeSchema } from "@/lib/i18n/server";

/**
 * Renders a single JSON-LD script tag. Server-rendered so search engines and
 * AI crawlers see it on first byte. The `key` discrimination lets Next dedupe
 * when multiple of these end up in the same head.
 */
export async function JsonLd({ data }: Props) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(await localizeSchema(data)).replace(/</g, "\\u003c") }}
    />
  );
}
