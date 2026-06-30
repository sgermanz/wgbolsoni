type Props = { data: unknown };

/**
 * Renders a single JSON-LD script tag. Server-rendered so search engines and
 * AI crawlers see it on first byte. The `key` discrimination lets Next dedupe
 * when multiple of these end up in the same head.
 */
export function JsonLd({ data }: Props) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
