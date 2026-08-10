import type { Metadata } from "next";
import { site } from "./site";

/** Strip a trailing "| Laguna View Detox" / "- Laguna View Detox" brand suffix
 *  so the root layout's title template can append the brand exactly once
 *  (prevents double-branded titles like "About - LVD | LVD"). */
export function stripBrand(title: string): string {
  return title
    .replace(/\s*[|\-–—:]\s*Laguna View Detox\s*$/i, "")
    .replace(/\s*[|\-–—]\s*LVD\s*$/i, "")
    .trim();
}

const DEFAULT_OG_IMAGE = "/images/NIK_5883-hero.jpg";

/* ------------------------------------------------------------------ */
/* Length limits (T-08)                                                */
/*                                                                     */
/* Titles over ~62 chars and descriptions over ~165 truncate in SERPs.  */
/* Rather than hand-editing 158 blog excerpts, the meta values are      */
/* clamped here at a sentence or word boundary. The on-page <h1> and    */
/* the visible excerpt are untouched — only the meta tags are trimmed.  */
/* ------------------------------------------------------------------ */
const MAX_TITLE = 62;
const MAX_DESC = 160;
const BRAND_SUFFIX = ` | ${site.name}`;

/** Trim to `max` at a word boundary, without leaving dangling punctuation. */
function clampWords(text: string, max: number): string {
  const s = text.trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/[\s,;:—–-]+$/, "");
}

/**
 * Prefer ending on a complete sentence. Falls back to a word-boundary trim
 * with an ellipsis so the snippet never reads as though it was chopped.
 */
export function clampDescription(text: string, max = MAX_DESC): string {
  const s = text.trim().replace(/\s+/g, " ");
  if (s.length <= max) return s;

  // Longest run of whole sentences that fits.
  const sentences = s.match(/[^.!?]+[.!?]+/g);
  if (sentences) {
    let out = "";
    for (const sentence of sentences) {
      if ((out + sentence).trim().length > max) break;
      out += sentence;
    }
    out = out.trim();
    if (out.length >= max * 0.55) return out;
  }
  return clampWords(s, max - 1) + "…";
}

export function clampTitle(text: string, max = MAX_TITLE): string {
  return clampWords(text, max);
}

/**
 * Reports source copy that only fits because it was clamped.
 *
 * This deliberately checks the ORIGINAL title and description, not the clamped
 * output — the output is within budget by construction, so checking it would
 * make the guard vacuous. Clamping keeps what ships correct; this says which
 * pages still need an editor.
 *
 * Warns by default so the backlog does not brick the pipeline on day one. Set
 * SEO_STRICT=1 in CI to turn it into a hard failure once the copy is rewritten.
 */
function checkSourceLengths(path: string, rawTitle: string, rawDescription: string) {
  const problems: string[] = [];
  const branded = stripBrand(rawTitle).length + BRAND_SUFFIX.length;
  if (branded > MAX_TITLE) {
    problems.push(`title would render ${branded} chars (limit ${MAX_TITLE}) — clamped`);
  }
  if (rawDescription.trim().length > MAX_DESC) {
    problems.push(
      `description is ${rawDescription.trim().length} chars (limit ${MAX_DESC}) — clamped`
    );
  }
  if (!problems.length) return;

  const msg = `[seo] ${path}: ${problems.join("; ")}`;
  if (process.env.SEO_STRICT) throw new Error(msg);
  if (process.env.SEO_VERBOSE) console.warn(msg);
}

/**
 * Build page metadata with a self-referential canonical plus per-page
 * OpenGraph/Twitter. `path` is the route path beginning with "/" (use "/" for
 * the homepage). Relative URLs resolve against `metadataBase` (set in the root
 * layout), so pass plain paths.
 */
export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  /**
   * Emit the brand-suffixed title directly instead of relying on the root
   * layout's `title.template`. Next does not apply that template to the
   * segment that defines it, so `app/page.tsx` — which shares a segment with
   * `app/layout.tsx` — would otherwise render an unbranded `<title>`.
   */
  absoluteTitle?: boolean;
}): Metadata {
  const clean = stripBrand(title);
  const canonical = path === "" ? "/" : path;
  const desc = clampDescription(description);

  // Keep the brand suffix when it fits inside the 62-char budget; otherwise
  // spend the budget on the descriptive part. The root layout appends the
  // suffix via title.template, so anything that must not receive it has to be
  // emitted as `absolute`.
  const withBrand = clean + BRAND_SUFFIX;
  const brandFits = withBrand.length <= MAX_TITLE;
  const renderedTitle = brandFits ? withBrand : clampTitle(clean);
  const ogTitle = renderedTitle;

  checkSourceLengths(canonical, title, description);

  return {
    // `absolute` bypasses the layout template and matches `ogTitle` exactly,
    // so the <title> and og:title can never drift apart.
    title: absoluteTitle || !brandFits ? { absolute: renderedTitle } : clean,
    description: desc,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      title: ogTitle,
      description: desc,
      url: canonical,
      siteName: site.name,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: [image],
    },
  };
}
