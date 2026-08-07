import type { Section } from "@/lib/content";

/** Stable anchor id for a section heading. */
export function headingId(heading: string, index: number): string {
  const slug = heading
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `s-${slug}` : `s-${index}`;
}

/**
 * On-page table of contents, derived from the section headings the page already
 * renders (30 sheet rows asked for this). Server-rendered anchors, so it works
 * without JS and gives crawlers an outline of the page.
 */
export default function TableOfContents({ sections }: { sections: Section[] }) {
  const items = sections
    .map((s, i) => ({ heading: s.heading?.trim(), id: headingId(s.heading || "", i) }))
    .filter((s): s is { heading: string; id: string } => Boolean(s.heading));

  if (items.length < 4) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="mb-12 rounded-2xl border border-navy-900/10 bg-sand-50 p-6 sm:p-7"
    >
      <h2
        id="toc-heading"
        className="text-sm font-semibold uppercase tracking-eyebrow text-gold-700"
      >
        On this page
      </h2>
      <ol className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
        {items.map((s, i) => (
          <li key={s.id} className="flex gap-2.5 text-[15px] leading-snug">
            <span aria-hidden="true" className="shrink-0 font-medium text-navy-900/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${s.id}`}
              className="text-navy-900/80 underline-offset-2 transition-colors hover:text-gold-700 hover:underline"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
