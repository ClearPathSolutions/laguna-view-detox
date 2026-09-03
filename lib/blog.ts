import blogData from "@/content/blog.json";
import { site } from "@/lib/site";
import { displayAuthor } from "@/lib/authors";
import { isAllowedImageHost } from "@/lib/image-hosts.mjs";

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string; // display label, e.g. "June 17, 2026"
  ts: number; // sortable timestamp (0 when unknown)
  excerpt: string;
  category: string;
  image: string; // local path under /images, or an absolute URL for Clarion posts
  sections?: { heading: string; body: string }[];
  external?: boolean; // true for posts sourced from Clarion (not local markdown)
  bodyHtml?: string; // rendered post HTML (Clarion posts only, on the detail page)
};

type RawPost = {
  slug: string;
  title: string;
  author?: string;
  date?: string;
  excerpt?: string;
  category?: string;
  image?: string;
  sections?: { heading: string; body: string }[];
};

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function toTs(label?: string): number {
  if (!label) return 0;
  const m = label.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (!m) return 0;
  const mo = MONTHS[m[1].toLowerCase()];
  if (mo === undefined) return 0;
  return Date.UTC(Number(m[3]), mo, Number(m[2]));
}

const DEFAULT_IMAGE = "/images/shutterstock_1122712238.jpg";

const raw = blogData as unknown as RawPost[];

export const allPosts: BlogPost[] = raw
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    // Vetted at the data layer so an unconfirmed name never reaches a page,
    // a schema block, or the serialized RSC payload. See lib/authors.ts.
    author: displayAuthor(p.author || site.name),
    date: p.date || "",
    ts: toTs(p.date),
    excerpt: p.excerpt || "",
    category: p.category || "Recovery",
    image: p.image || DEFAULT_IMAGE,
    sections: p.sections,
  }))
  .sort((a, b) => b.ts - a.ts);

export const categories: string[] = Array.from(
  new Set(allPosts.map((p) => p.category).filter(Boolean))
).sort();

export const featured: BlogPost[] = allPosts.slice(0, 3);

const bySlug: Record<string, BlogPost> = Object.fromEntries(
  allPosts.map((p) => [p.slug, p])
);

export function getPost(slug: string): BlogPost | undefined {
  return bySlug[slug];
}

/* ------------------------------------------------------------------ *
 * Clarion posts
 *
 * Clarion is the source of truth for incoming posts. We fetch them on the
 * SERVER (no Origin header → the feed's origin-pinning lets us through, and
 * the posts land in the static HTML so they're crawlable — unlike the old
 * client embed). Results are cached and revalidated hourly (see the fetch
 * `revalidate` option + the pages' `export const revalidate`).
 *
 * Every network path fails soft: if Clarion is unreachable, the blog simply
 * falls back to the local posts and never errors.
 * ------------------------------------------------------------------ */

const clarion = site.widgets.clarion;
const CLARION_CATEGORY = "Recovery"; // Clarion posts carry no category; blend them in.
const REVALIDATE = 3600; // seconds

type ClarionPost = {
  slug: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  author_name?: string;
  published_at?: string;
  body_html?: string;
};

function clarionApi(): string | null {
  if (!clarion?.siteKey || !clarion?.api) return null;
  return clarion.api.replace(/\/$/, "");
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Inline <img> tags in Clarion body_html carry only a src — no loading or
 * decoding hints — and each one is a full-resolution original. Without this
 * every in-body image blocks alongside the cover. Width is constrained in CSS
 * (.blog-html img); this only adds the hints, and skips any tag that already
 * sets `loading` so a future CMS change wins over us.
 */
function tuneInlineImages(html: string): string {
  return html.replace(/<img\b(?![^>]*\bloading=)([^>]*?)\s*\/?>/gi, (_m, attrs) => {
    const decoding = /\bdecoding=/i.test(attrs) ? "" : ' decoding="async"';
    return `<img${attrs} loading="lazy"${decoding}>`;
  });
}

/**
 * Clarion body_html ships a "Table of Contents" whose links point at
 * `#slug` anchors, but none of the headings carry an `id` — so every entry is
 * a dead link and clicking one does nothing at all. Same for the `[1]`/`[2]`
 * citations, which target `#ref1`/`#ref2` that likewise do not exist.
 *
 * This gives every heading an id derived from its own text, then repairs any
 * in-body anchor that still points nowhere.
 *
 * The repair matches on the link's TEXT rather than its href, because the
 * hrefs cannot be trusted: these posts are templated across the fleet, and a
 * rebrand updates the visible text but not the slug baked into the href. A
 * real example from this site — the link reads "How Laguna View Detox can
 * support your recovery" while its href is still
 * `#how-dallas-detox-center-can-support-your-recovery`. Slugifying the
 * heading alone would leave that entry broken; matching the text fixes it.
 */
function anchorizeHeadings(html: string): string {
  const slugify = (text: string): string =>
    text
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // 1. Give each heading an id from its text, keeping any id already present
  //    and de-duplicating so two identically-worded headings stay distinct.
  const used = new Set<string>();
  let out = html.replace(
    /<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (whole, tag: string, attrs: string, inner: string) => {
      const existing = attrs.match(/\bid="([^"]*)"/i)?.[1];
      if (existing) {
        used.add(existing);
        return whole;
      }
      const base = slugify(inner);
      if (!base) return whole; // an empty heading has nothing to anchor to
      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

  // 2. Number the References list items so `#ref1`-style citations resolve.
  //    Only touches the <ol> that directly follows the References heading.
  if (/href="#ref\d+"/i.test(out)) {
    out = out.replace(
      /(<h[23][^>]*>\s*References\s*<\/h[23]>\s*<ol[^>]*>)([\s\S]*?)<\/ol>/i,
      (_whole, head: string, body: string) => {
        let n = 0;
        const numbered = body.replace(/<li\b([^>]*)>/gi, (li, liAttrs: string) => {
          n += 1;
          return /\bid=/i.test(liAttrs) ? li : `<li${liAttrs} id="ref${n}">`;
        });
        return `${head}${numbered}</ol>`;
      },
    );
  }

  // 3. Repoint any anchor that still leads nowhere, using its own link text.
  const ids = new Set<string>();
  for (const m of out.matchAll(/\bid="([^"]+)"/gi)) ids.add(m[1]);

  return out.replace(
    /<a\b([^>]*?)href="#([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (whole, pre: string, target: string, post: string, text: string) => {
      if (!target || ids.has(target)) return whole;
      const fromText = slugify(text);
      if (!fromText || !ids.has(fromText)) return whole;
      return `<a${pre}href="#${fromText}"${post}>${text}</a>`;
    },
  );
}

function normalizeClarion(p: ClarionPost): BlogPost {
  const t = p.published_at ? Date.parse(p.published_at) : NaN;
  return {
    slug: p.slug,
    title: p.title || "Untitled",
    author: displayAuthor(p.author_name || site.name),
    date: fmtDate(p.published_at),
    ts: Number.isNaN(t) ? 0 : t,
    excerpt: p.excerpt || "",
    category: CLARION_CATEGORY,
    // Only proxy covers from allowlisted hosts. An un-allowlisted URL would
    // make next/image throw and take the whole page down, so it degrades to
    // the local fallback instead. See lib/image-hosts.mjs.
    image: isAllowedImageHost(p.cover_image_url) ? p.cover_image_url! : DEFAULT_IMAGE,
    external: true,
    bodyHtml:
      typeof p.body_html === "string"
        ? anchorizeHeadings(tuneInlineImages(p.body_html))
        : undefined,
  };
}

async function fetchClarionFeed(): Promise<ClarionPost[]> {
  const api = clarionApi();
  if (!api) return [];
  const url = `${api}/blog/public/feed?site_key=${encodeURIComponent(clarion.siteKey)}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: ClarionPost[] };
    return Array.isArray(data?.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

/** Local + Clarion posts, newest first. The first entry is the site-wide
 *  featured post — it may be a Clarion post if that's the most recent. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const feed = await fetchClarionFeed();
  const localSlugs = new Set(allPosts.map((p) => p.slug));
  const clarionPosts = feed
    .filter((p) => p?.slug && !localSlugs.has(p.slug)) // local wins on slug collision
    .map(normalizeClarion);
  return [...allPosts, ...clarionPosts].sort((a, b) => b.ts - a.ts);
}

/** A single post by slug — local first, else fetched from Clarion (which
 *  includes body_html for rendering the article). */
export async function getMergedPost(slug: string): Promise<BlogPost | undefined> {
  const local = getPost(slug);
  if (local) return local;

  const api = clarionApi();
  if (!api) return undefined;
  const url = `${api}/blog/public/post?site_key=${encodeURIComponent(
    clarion.siteKey
  )}&slug=${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return undefined;
    const p = (await res.json()) as ClarionPost;
    if (!p || !p.title) return undefined;
    return normalizeClarion({ ...p, slug });
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ *
 * Pagination + category archives
 *
 * These take an explicit `posts` array rather than closing over the static
 * `allPosts`, because the crawlable list is the MERGED one (local + Clarion)
 * and that is only available asynchronously via getAllPosts(). Building the
 * archives off the static list would leave every Clarion post out of
 * pagination and category pages — reintroducing exactly the crawlability gap
 * these routes exist to close.
 * ------------------------------------------------------------------ */

export const PAGE_SIZE = 12;

export function totalPagesFor(posts: BlogPost[]): number {
  return Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
}

/** 1-indexed. Page 1 is served by /blog itself. */
export function postsForPage(posts: BlogPost[], page: number): BlogPost[] {
  const start = (page - 1) * PAGE_SIZE;
  return posts.slice(start, start + PAGE_SIZE);
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CategoryInfo = { label: string; slug: string; count: number };

export function categoryListFor(posts: BlogPost[]): CategoryInfo[] {
  const labels = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  return labels
    .map((label) => ({
      label,
      slug: categorySlug(label),
      count: posts.filter((p) => p.category === label).length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getCategoryFrom(posts: BlogPost[], slug: string): CategoryInfo | undefined {
  return categoryListFor(posts).find((c) => c.slug === slug);
}

export function postsInCategoryFrom(posts: BlogPost[], label: string): BlogPost[] {
  return posts.filter((p) => p.category === label);
}
