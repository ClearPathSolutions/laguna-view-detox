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
 * This build nests those paths.
 *
 * Nothing here is a Next.js config redirect any more. buildRedirectTable()
 * merges these maps with redirects/laguna-view-redirect-map.csv, validates the
 * result, and scripts/redirects/generate.mjs serialises it for middleware.ts,
 * which answers every variant with ONE 301 to the final URL.
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

  // Found 2026-11-11 from the Wayback Machine: indexed WordPress URLs that
  // were not in the Yoast sitemaps this map was built from, and 404'd after
  // cutover. The carrier landers are /aetna-rehab/ and /bcbs-drug-rehab/,
  // not /aetna/ and /bcbs/, which is why the note above missed them.
  "/aetna-rehab": "/insurance/aetna",
  "/bcbs-drug-rehab": "/insurance/bcbs",
  "/orange-county": "/locations/orange-county",
  // Current staff whose WordPress slugs carried a credential suffix.
  "/about-us/michael-mcarthur": "/about/michael-mcarthur",
  "/about-us/riky-hanaumi-lcsw": "/about/riky-hanaumi",
  "/about-us/shawn-young-cadc": "/about/shawn-young",
  // Staff no longer on the roster: team hub, never another person's bio.
  "/about-us/ashlea-ryder": "/about#team",
  "/about-us/eric-norton": "/about#team",
  "/about-us/matthew-lawler": "/about#team",
  "/about-us/melanie-duenez": "/about#team",
  "/about-us/melany-iglesias": "/about#team",
  "/about-us/robert-walton": "/about#team",
  "/about-us/sara-letchworth": "/about#team",
  "/about-us/shannon-farmer-cadc": "/about#team",
  "/about-us/tracy-chamberlain": "/about#team",
};

/**
 * WordPress archive URLs (tags, categories, numbered blog pages) with no route
 * in this build. About 40 /tag/ URLs were indexed and 404'd after cutover.
 * Wildcards, so archive URLs not seen in the Wayback sample land too.
 */
// [regex over the slashless path, destination with $1 substitution]. Exact
// entries always win over these. /blog/1 goes to /blog: page 1 IS /blog and
// /blog/page/1 is a 404 (app/blog/page/[n] only builds pages 2..N).
const PATTERN_MAP = [
  ["^/blog/1$", "/blog"],
  ["^/blog/(\\d+)$", "/blog/page/$1"],
  ["^/category(?:/.*)?$", "/blog"],
  ["^/tag(?:/.*)?$", "/blog"],
];

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

/**
 * Paths that hand off to a third-party site. Kept apart from PAGE_MAP because
 * these are 302s: the destination is owned by someone else and can change
 * (ADP regenerates job-board links), and a cached 301 would strand visitors
 * on a dead URL long after the rule here is updated.
 */
const EXTERNAL_MAP = {
  // ADP Workforce Now job board.
  "/careers":
    "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=e1094ba9-8b93-4f55-9dab-3102a4eaaa49&ccId=9200865816229_2&lang=en_US",
};

/**
 * The Nov 19 audit (ClickUp 1dfjb8tm472): 323 legacy URLs traced hop by hop,
 * each with the single-301 destination it must reach. Authoritative — rows
 * here override nothing silently: a CSV row that disagrees with the maps above
 * fails the build (see buildRedirectTable).
 */
export const CSV_PATH = join(here, "..", "redirects", "laguna-view-redirect-map.csv");

export const CANONICAL_ORIGIN = "https://www.lagunaviewdetox.com";

const CSV_COLUMNS = [
  "old_path",
  "referring_domains",
  "current_hops",
  "current_chain",
  "current_final_status",
  "redirect_to (single 301)",
  "action",
];
const ACTION_FIX = "Fix chain: single 301";
const ACTION_ADD = "Add 301: currently 404";
const ACTION_LEAVE = "Leave 404 (or 410): no equivalent page";

/** Lookup key: the path without trailing slashes ("/" stays "/"). */
export const normalizePath = (p) => (p === "/" ? "/" : p.replace(/\/+$/, "") || "/");

/** RFC 4180 parser: quoted fields, doubled quotes, CRLF. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += c;
  }
  if (field !== "" || row.length) row.push(field), rows.push(row);
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

/** Every CSV row as an object; throws on a header or shape mismatch. */
export function readCsvRows(path = CSV_PATH) {
  const [header, ...body] = parseCsv(readFileSync(path, "utf8").replace(/^﻿/, ""));
  if (header.join(",") !== CSV_COLUMNS.join(","))
    throw new Error(`Unexpected CSV header: ${header.join(",")}`);
  return body.map((cells, i) => {
    if (cells.length !== CSV_COLUMNS.length)
      throw new Error(`CSV line ${i + 2}: ${cells.length} fields, expected ${CSV_COLUMNS.length}`);
    const r = Object.fromEntries(CSV_COLUMNS.map((k, j) => [k, cells[j].trim()]));
    return { line: i + 2, oldPath: r.old_path, redirectTo: r["redirect_to (single 301)"], action: r.action, raw: r };
  });
}

/** "/about#team?x" style destinations -> { path, query, hash }. */
export function splitDestination(dest) {
  const u = new URL(dest, CANONICAL_ORIGIN);
  return { origin: u.origin, path: u.pathname, query: u.search, hash: u.hash };
}

/**
 * The single redirect table the middleware resolves against. Pure data, so it
 * can be serialised into the edge bundle (lib/redirect-map.generated.json).
 *
 * Validation — each is a hard error, never a silent pick:
 *   - two sources that normalise to one key with different destinations
 *   - a destination that is itself a redirect source (a chain)
 *   - a source equal to its own destination with a fragment/query (a loop)
 *   - a CSV "leave 404" path that some rule would redirect
 *   - CSV destination off the canonical origin or with a trailing slash
 * A CSV row whose destination equals its own normalised path (e.g. /contact/ ->
 * /contact) is slash/host normalisation only: no table entry, the canonical
 * page serves 200 and the variant is fixed by normalisation in one 301.
 */
export function buildRedirectTable({ csvPath = CSV_PATH } = {}) {
  const errors = [];
  /** key -> { to, origin } */
  const exact = new Map();
  const put = (source, to, origin) => {
    const key = normalizePath(source);
    const prev = exact.get(key);
    if (prev && prev.to !== to) {
      errors.push(`Conflict on ${key}: "${prev.to}" (${prev.origin}) vs "${to}" (${origin})`);
      return;
    }
    if (!prev) exact.set(key, { to, origin });
  };

  for (const post of blog) put(`/${post.slug}`, `/blog/${post.slug}`, "blog.json root slug");
  for (const [o, n] of Object.entries(LEGACY_BLOG_SLUGS)) put(`/${o}`, `/blog/${n}`, "LEGACY_BLOG_SLUGS");
  for (const [from, to] of Object.entries(PAGE_MAP)) put(from, to, "PAGE_MAP");

  // CSV
  const rows = readCsvRows(csvPath);
  const counts = { rows: rows.length, fix: 0, add: 0, leave: 0, normalizationOnly: 0 };
  const gone = new Set();
  const csvKeys = new Map();
  for (const r of rows) {
    if (!r.oldPath.startsWith("/")) errors.push(`CSV line ${r.line}: old_path must start with "/": ${r.oldPath}`);
    const key = normalizePath(r.oldPath);
    if (csvKeys.has(key)) {
      const other = csvKeys.get(key);
      if (other.redirectTo !== r.redirectTo || other.action !== r.action)
        errors.push(`CSV lines ${other.line} and ${r.line} normalise to ${key} with different outcomes`);
      continue;
    }
    csvKeys.set(key, r);
    if (r.action === ACTION_LEAVE) {
      counts.leave++;
      if (r.redirectTo) errors.push(`CSV line ${r.line}: "leave 404" row has a destination`);
      gone.add(key);
      continue;
    }
    if (r.action === ACTION_FIX) counts.fix++;
    else if (r.action === ACTION_ADD) counts.add++;
    else {
      errors.push(`CSV line ${r.line}: unknown action "${r.action}"`);
      continue;
    }
    if (!r.redirectTo) {
      errors.push(`CSV line ${r.line}: no destination`);
      continue;
    }
    const d = splitDestination(r.redirectTo);
    if (d.origin !== CANONICAL_ORIGIN) errors.push(`CSV line ${r.line}: destination off canonical origin: ${r.redirectTo}`);
    if (d.path !== "/" && d.path.endsWith("/")) errors.push(`CSV line ${r.line}: destination has a trailing slash: ${r.redirectTo}`);
    const to = d.path + d.query + d.hash;
    if (d.path === key) {
      if (d.query || d.hash) errors.push(`CSV line ${r.line}: ${key} redirects to itself with ${d.query}${d.hash}`);
      else counts.normalizationOnly++;
      // Must not be shadowed by an older rule sending the canonical page elsewhere.
      if (exact.has(key)) errors.push(`CSV line ${r.line}: ${key} is canonical per CSV but PAGE_MAP redirects it to ${exact.get(key).to}`);
      continue;
    }
    put(r.oldPath, to, `CSV line ${r.line}`);
  }
  counts.uniqueKeys = csvKeys.size;

  const patterns = PATTERN_MAP.map(([re, to]) => ({ re, to }));
  const matchPattern = (path) => {
    for (const p of patterns) {
      const m = path.match(new RegExp(p.re));
      if (m) return p.to.replace(/\$(\d)/g, (_, i) => m[Number(i)] ?? "");
    }
    return null;
  };

  // Chains / loops: a destination must not itself redirect.
  for (const [key, { to, origin }] of exact) {
    const d = splitDestination(to);
    const dk = normalizePath(d.path);
    if (dk === key) errors.push(`Loop: ${key} -> ${to} (${origin})`);
    else if (d.path !== dk) errors.push(`Destination with trailing slash: ${key} -> ${to} (${origin})`);
    else if (exact.has(dk)) errors.push(`Chain: ${key} -> ${to} -> ${exact.get(dk).to} (${origin})`);
    else if (matchPattern(dk) && matchPattern(dk) !== dk) errors.push(`Chain via pattern: ${key} -> ${to} -> ${matchPattern(dk)}`);
  }
  for (const key of gone) {
    if (exact.has(key)) errors.push(`CSV says leave ${key} as 404, but it redirects to ${exact.get(key).to} (${exact.get(key).origin})`);
    else if (matchPattern(key)) errors.push(`CSV says leave ${key} as 404, but a pattern redirects it to ${matchPattern(key)}`);
  }
  for (const [from] of Object.entries(EXTERNAL_MAP)) {
    if (exact.has(normalizePath(from))) errors.push(`External ${from} also has an internal rule`);
  }

  const sorted = [...exact.entries()].sort(([a], [b]) => a.localeCompare(b));
  return {
    exact: Object.fromEntries(sorted.map(([k, v]) => [k, v.to])),
    origins: Object.fromEntries(sorted.map(([k, v]) => [k, v.origin])),
    patterns,
    external: Object.fromEntries(Object.entries(EXTERNAL_MAP).map(([k, v]) => [normalizePath(k), v])),
    gone: [...gone].sort(),
    counts,
    errors,
  };
}

/** The serialisable part the middleware imports. */
export const runtimeTable = (t) => ({ exact: t.exact, patterns: t.patterns, external: t.external });
