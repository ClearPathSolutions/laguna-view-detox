/**
 * Emits a JSON-LD block. `undefined` values are dropped by JSON.stringify, so
 * builders can omit optional fields (dates, images) rather than emitting nulls
 * that structured-data validators flag.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
