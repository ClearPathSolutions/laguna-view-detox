import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const blog = JSON.parse(readFileSync(join(here, "..", "content", "blog.json"), "utf8"));

/**
 * Cutover redirect map: every URL live on production today -> its address on
 * this build. Enumerated from production's Yoast sitemaps (post-sitemap.xml =
 * 158 posts, page-sitemap.xml = 44 pages), verified 2026-08-07.
 *
 * Production is WordPress at root level and slash-canonical:
 *   /why-is-crystal-meth-addictive/   ->  /blog/why-is-crystal-meth-addictive
 *   /anthem/                          ->  /insurance/anthem
 * This build nests those paths. Ship this together with the trailingSlash
 * decision below — doing them as two passes produces redirect chains.
 *
 * ⚠️ BLOCKED ON QHG: whether production's root-level slugs or this build's
 * nested ones survive cutover (T-36), and the portfolio trailing-slash
 * convention (V0102). If QHG keeps root-level slugs instead, this map inverts;
 * the pairs stay the same, only the direction changes.
 */

/** Production page slug -> this build's path. 24 non-blog pairs. */
const PAGE_MAP = {
  // Insurance carriers live at root on production. Note there is no /aetna/ or
  // /bcbs/ page on production, so those two carrier pages are new here and
  // need no redirect — hence 7 pairs, not 9.
  "/anthem": "/insurance/anthem",
  "/cigna": "/insurance/cigna",
  "/connecticare": "/insurance/connecticare",
  "/multiplan": "/insurance/multiplan",
  "/nyship": "/insurance/nyship",
  "/oxford-pilgrim": "/insurance/oxford-pilgrim",
  "/tufts": "/insurance/tufts",

  // Cities
  "/orange-county-drug-rehab": "/locations/orange-county",
  "/newport-beach": "/locations/newport-beach",
  "/los-angeles": "/locations/los-angeles",
  "/san-diego": "/locations/san-diego",
  "/ventura": "/locations/ventura",
  "/california": "/locations/california",

  // Populations
  "/women": "/who-we-treat/women",
  "/men": "/who-we-treat/men",
  "/professionals": "/who-we-treat/professionals",
  "/young-adults": "/who-we-treat/young-adults",
  "/college-students": "/who-we-treat/college-students",
  "/veterans": "/who-we-treat/veterans",
  "/first-responders": "/who-we-treat/first-responders",

  // About + bios. /nicole-burson sits at root on production, not under
  // /about-us, so a bulk prefix rule would miss it.
  "/about-us": "/about",

  // Departed staff, confirmed off the roster by the facility 2026-08-10.
  // Their bio pages are indexed on production AND were live on this build's
  // earlier deploys, so both address forms are retired to the team hub rather
  // than 404'd. Do not point these at a successor's bio — a redirect from a
  // named person to a different named person reads as impersonation.
  "/about-us/karen-pettit": "/about#team",
  "/about-us/david-goodgame": "/about#team",
  "/nicole-burson": "/about#team",
  "/about/karen-pettit": "/about#team",
  "/about/david-goodgame": "/about#team",
  "/about/nicole-burson": "/about#team",

  // Departed 2026-09-01 (ticket #36). Her bio shipped in an earlier deploy, so
  // both address forms are retired rather than 404'd.
  "/about-us/elizabeth-wald": "/about#team",
  "/about/elizabeth-wald": "/about#team",
};

/**
 * Slugs production renamed on 2026-07-16 and now 301s itself. Mapping the OLD
 * spelling straight to its final destination keeps cutover to a single hop
 * instead of chaining through production's own redirect.
 */
const LEGACY_BLOG_SLUGS = {
  "why-is-crystal-math-addictive": "why-is-crystal-meth-addictive",
  "use-your-gilsbar-health-insurance-to-treat-your-addicition":
    "use-your-gilsbar-health-insurance-to-treat-your-addiction",
  "addiction-in-the-families-and-love-ones": "addiction-in-families-and-loved-ones",
};

export function buildRedirects() {
  const out = [];
  const seen = new Set();

  const add = (source, destination) => {
    if (seen.has(source)) return; // never emit two rules for one source
    seen.add(source);
    // `statusCode: 301` rather than `permanent: true`, which emits 308.
    // Google treats them the same, but 301 is what the migration plan
    // specifies and what older crawlers and proxies handle predictably.
    out.push({ source, destination, statusCode: 301 });
  };

  // Blog posts: root -> /blog/<slug>
  for (const post of blog) add(`/${post.slug}`, `/blog/${post.slug}`);
  // Legacy misspellings -> corrected /blog path, one hop
  for (const [oldSlug, newSlug] of Object.entries(LEGACY_BLOG_SLUGS)) {
    add(`/${oldSlug}`, `/blog/${newSlug}`);
  }
  // Non-blog pages
  for (const [from, to] of Object.entries(PAGE_MAP)) add(from, to);

  return out;
}

export const redirectStats = () => {
  const r = buildRedirects();
  return {
    total: r.length,
    blog: blog.length,
    legacyBlog: Object.keys(LEGACY_BLOG_SLUGS).length,
    pages: Object.keys(PAGE_MAP).length,
  };
};
