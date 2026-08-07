import blogData from "@/content/blog.json";

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string; // display label, e.g. "June 17, 2026"
  ts: number; // sortable timestamp (0 when unknown)
  excerpt: string;
  category: string;
  image: string; // local path under /images
  sections?: { heading: string; body: string }[];
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
    author: p.author || "Laguna View Detox",
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

/* ------------------------------------------------------------------ */
/* Crawlable archives                                                  */
/*                                                                     */
/* The client-side "Load More" and category filter render only the      */
/* first 12 posts into the HTML, so 144 of 157 posts had no internal    */
/* link pointing at them. Sitemap inclusion is discovery, not link      */
/* equity. These helpers back real server-rendered routes:              */
/*   /blog            page 1                                           */
/*   /blog/page/2..N  the rest, 12 per page                            */
/*   /blog/category/<slug>  one archive per category                    */
/* ------------------------------------------------------------------ */

export const PAGE_SIZE = 12;

export const totalPages: number = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));

/** 1-indexed. Page 1 is served by /blog itself. */
export function postsForPage(page: number): BlogPost[] {
  const start = (page - 1) * PAGE_SIZE;
  return allPosts.slice(start, start + PAGE_SIZE);
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CategoryInfo = { label: string; slug: string; count: number };

export const categoryList: CategoryInfo[] = categories
  .map((label) => ({
    label,
    slug: categorySlug(label),
    count: allPosts.filter((p) => p.category === label).length,
  }))
  .sort((a, b) => b.count - a.count);

const categoryBySlug: Record<string, CategoryInfo> = Object.fromEntries(
  categoryList.map((c) => [c.slug, c])
);

export function getCategory(slug: string): CategoryInfo | undefined {
  return categoryBySlug[slug];
}

export function postsInCategory(label: string): BlogPost[] {
  return allPosts.filter((p) => p.category === label);
}
