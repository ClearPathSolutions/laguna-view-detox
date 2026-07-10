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

const DEFAULT_OG_IMAGE = "/images/lvd-hp-bk-.jpg";

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
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const clean = stripBrand(title);
  const canonical = path === "" ? "/" : path;
  const ogTitle = `${clean} | ${site.name}`;

  return {
    title: clean,
    description,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      title: ogTitle,
      description,
      url: canonical,
      siteName: site.name,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}
