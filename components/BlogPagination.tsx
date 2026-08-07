import Link from "next/link";
import { ChevronRightIcon } from "./icons";

/** Page 1 lives at /blog; pages 2+ at /blog/page/N. */
export function pageHref(n: number): string {
  return n <= 1 ? "/blog" : `/blog/page/${n}`;
}

/**
 * Numbered pagination. Every page is a real link so a crawler can walk the
 * whole archive from /blog; `rel="prev"/"next"` marks the sequence.
 */
export default function BlogPagination({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  // Window of page numbers around the current page, always including 1 and N.
  const window = new Set<number>([1, total, current]);
  for (const n of [current - 2, current - 1, current + 1, current + 2]) {
    if (n > 1 && n < total) window.add(n);
  }
  const pages = [...window].sort((a, b) => a - b);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pages">
      {current > 1 && (
        <Link
          href={pageHref(current - 1)}
          rel="prev"
          className="inline-flex items-center gap-1.5 rounded-full border border-navy/25 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <ChevronRightIcon className="h-4 w-4 rotate-180" />
          Previous
        </Link>
      )}

      {pages.map((n, i) => {
        const gap = i > 0 && n - pages[i - 1] > 1;
        return (
          <span key={n} className="flex items-center gap-2">
            {gap && <span className="px-1 text-navy-900/40">…</span>}
            {n === current ? (
              <span
                aria-current="page"
                className="flex h-10 min-w-10 items-center justify-center rounded-full bg-navy px-3 text-sm font-semibold text-white"
              >
                {n}
              </span>
            ) : (
              <Link
                href={pageHref(n)}
                className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-navy-900/75 transition-colors hover:bg-sand-100 hover:text-navy-900"
                aria-label={`Page ${n}`}
              >
                {n}
              </Link>
            )}
          </span>
        );
      })}

      {current < total && (
        <Link
          href={pageHref(current + 1)}
          rel="next"
          className="inline-flex items-center gap-1.5 rounded-full border border-navy/25 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}

/** Category chips — links, not client-side filter state. */
export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: { label: string; slug: string; count: number }[];
  activeSlug?: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2.5" aria-label="Blog categories">
      <Link
        href="/blog"
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeSlug
            ? "bg-sand-100 text-navy-900/75 hover:bg-sand-200 hover:text-navy-900"
            : "bg-navy text-white"
        }`}
      >
        All articles
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          aria-current={activeSlug === c.slug ? "page" : undefined}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSlug === c.slug
              ? "bg-navy text-white"
              : "bg-sand-100 text-navy-900/75 hover:bg-sand-200 hover:text-navy-900"
          }`}
        >
          {c.label}
          <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
        </Link>
      ))}
    </nav>
  );
}
