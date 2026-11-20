#!/usr/bin/env node
/**
 * Redirect audit: every mapped URL, every variant, hop by hop.
 *
 *   node scripts/redirects/audit.mjs                       # production
 *   node scripts/redirects/audit.mjs --local http://localhost:3000
 *       # a `next start` build; requests carry Host: www./apex so the
 *       # production host logic runs. http:// variants are skipped there:
 *       # the http->https upgrade is Vercel's, not the app's.
 *   options: --out <dir> (default ./redirect-audit)  --concurrency 6
 *            --timeout 20000  --max-hops 5  --no-sitemap
 *
 * Redirects are never auto-followed: each hop's status and Location are
 * recorded. Pass = exactly one 301 to the expected URL and then a 200 (or the
 * request is already canonical and answers 200 directly). Leave-404 rows pass
 * when the final status is 404/410 after at most one normalising 301.
 * Exits 1 on any failure.
 */
import http from "node:http";
import https from "node:https";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildRedirectTable, readCsvRows, normalizePath } from "../../lib/redirects.mjs";
import { CANONICAL_ORIGIN, CANONICAL_HOST } from "../../lib/redirect-resolver.mjs";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? def : process.argv[i + 1];
};
const LOCAL = arg("local", null);
const OUT = arg("out", "redirect-audit");
const CONCURRENCY = Number(arg("concurrency", 6));
const TIMEOUT = Number(arg("timeout", 20000));
const MAX_HOPS = Number(arg("max-hops", 5));
const SITEMAP = !process.argv.includes("--no-sitemap");
const APEX = CANONICAL_HOST.replace(/^www\./, "");
const PROD_HOSTS = new Set([CANONICAL_HOST, APEX]);
const UA = "lvd-redirect-audit/1.0";

/** One GET, no redirect following. Local mode re-targets production hosts. */
function get(url, { body = false } = {}) {
  const u = new URL(url);
  let lib = u.protocol === "http:" ? http : https;
  let opts = { method: "GET", hostname: u.hostname, port: u.port || undefined, path: u.pathname + u.search, headers: { "user-agent": UA } };
  if (LOCAL && PROD_HOSTS.has(u.hostname)) {
    const l = new URL(LOCAL);
    lib = l.protocol === "https:" ? https : http;
    opts = { ...opts, hostname: l.hostname, port: l.port, headers: { ...opts.headers, host: u.host } };
  }
  return new Promise((resolve) => {
    const req = lib.request(opts, (res) => {
      if (!body) {
        res.destroy();
        return resolve({ status: res.statusCode, location: res.headers.location ?? null });
      }
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location ?? null, body: data }));
    });
    req.setTimeout(TIMEOUT, () => req.destroy(new Error(`timeout after ${TIMEOUT}ms`)));
    req.on("error", (e) => resolve({ status: 0, location: null, error: e.message }));
    req.end();
  });
}

/** Follow manually, recording every hop. */
async function trace(url) {
  const hops = [];
  let current = url;
  for (let i = 0; i <= MAX_HOPS; i++) {
    const r = await get(current);
    hops.push({ url: current, status: r.status, location: r.location, error: r.error });
    if (r.status < 300 || r.status >= 400 || !r.location) break;
    const next = new URL(r.location, current);
    next.hash = ""; // fragments are never sent to the server
    current = next.toString();
  }
  return hops;
}

const variantsOf = (path, { protocols, hosts = [APEX, CANONICAL_HOST] }) => {
  const paths = path === "/" ? ["/"] : [normalizePath(path), `${normalizePath(path)}/`];
  const out = new Set();
  for (const p of protocols) for (const h of hosts) for (const s of paths) out.add(`${p}://${h}${s}`);
  return [...out];
};
const PROTOCOLS = LOCAL ? ["https"] : ["http", "https"];

/** Judge a trace. expected = absolute URL (redirect) or {gone:true, path}. */
function judge(source, expected, hops) {
  const first = hops[0];
  const last = hops[hops.length - 1];
  const fail = (reason) => ({ pass: false, reason });
  if (first.error) return fail(`request error: ${first.error}`);
  if (last.error) return fail(`request error at ${last.url}: ${last.error}`);
  const redirects = hops.filter((h) => h.status >= 300 && h.status < 400);

  if (expected.gone) {
    const target = `${CANONICAL_ORIGIN}${expected.path}`;
    if (![404, 410].includes(last.status)) return fail(`final ${last.status}, expected 404/410`);
    if (source === target) return redirects.length ? fail(`canonical 404 URL redirected (${first.status})`) : { pass: true, reason: "404 direct" };
    if (redirects.length !== 1) return fail(`${redirects.length} redirects before 404 (expected 1 normalising 301)`);
    if (first.status !== 301) return fail(`first hop ${first.status}, expected 301`);
    if (new URL(first.location, source).toString() !== target) return fail(`normalised to ${first.location}, expected ${target}`);
    return { pass: true, reason: "1x301 then 404" };
  }

  const exp = expected.url;
  const expNoHash = exp.replace(/#.*$/, "");
  if (source === exp) {
    if (redirects.length) return fail(`canonical URL redirected: ${first.status} -> ${first.location}`);
    return last.status === 200 ? { pass: true, reason: "canonical 200" } : fail(`canonical URL returned ${last.status}`);
  }
  if (first.status !== (expected.status ?? 301)) {
    const why = first.status === 308 && source.startsWith("http://") ? " (Vercel platform http->https upgrade)" : "";
    return fail(`first hop ${first.status}${why}, expected ${expected.status ?? 301}`);
  }
  const loc = first.location && new URL(first.location, source).toString();
  if (loc !== exp) return fail(`Location ${first.location}, expected ${exp}`);
  if (expected.status === 302) return { pass: true, reason: "external 302" }; // third-party final not checked
  if (redirects.length !== 1) return fail(`${redirects.length} redirects: ${hops.map((h) => h.status).join(">")}`);
  if (last.status !== 200) return fail(`destination ${expNoHash} returned ${last.status}`);
  return { pass: true, reason: "1x301 then 200" };
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
        if (++done % 200 === 0) process.stderr.write(`  ${done}/${items.length}\n`);
      }
    }),
  );
  return out;
}

const cases = [];
const add = (group, source, expected) => cases.push({ group, source, expected });
const seen = new Set();
const addOnce = (group, source, expected) => {
  if (seen.has(source)) return;
  seen.add(source);
  add(group, source, expected);
};

// 1. Every CSV row, every variant.
const rows = readCsvRows();
for (const r of rows) {
  const group = r.action.startsWith("Leave") ? "csv:leave-404" : r.action.startsWith("Add") ? "csv:add-301" : "csv:fix-chain";
  const expected = r.redirectTo ? { url: r.redirectTo } : { gone: true, path: normalizePath(r.oldPath) };
  for (const v of variantsOf(r.oldPath, { protocols: PROTOCOLS })) addOnce(group, v, expected);
}

// 2. Rules outside the CSV (older maps, patterns, external).
const table = buildRedirectTable();
const csvKeys = new Set(rows.map((r) => normalizePath(r.oldPath)));
for (const [key, to] of Object.entries(table.exact)) {
  if (csvKeys.has(key)) continue;
  for (const v of variantsOf(key, { protocols: PROTOCOLS })) addOnce("existing", v, { url: `${CANONICAL_ORIGIN}${to}` });
}
for (const [p, to] of [["/tag/audit-sample", "/blog"], ["/category/audit-sample", "/blog"], ["/blog/2", "/blog/page/2"], ["/blog/1", "/blog"]])
  for (const v of variantsOf(p, { protocols: PROTOCOLS })) addOnce("existing:pattern", v, { url: `${CANONICAL_ORIGIN}${to}` });
for (const [key, to] of Object.entries(table.external)) addOnce("existing:external", `${CANONICAL_ORIGIN}${key}`, { url: to, status: 302 });

// 3. Query strings, incl. fragment destinations.
const Q = "utm_source=audit&utm_medium=redirect-test&gclid=TEST123";
const withQuery = (dest) => {
  const u = new URL(dest);
  return `${u.origin}${u.pathname}${u.search ? `${u.search}&` : "?"}${Q}${u.hash}`;
};
const qRows = rows.filter((r) => r.redirectTo && r.redirectTo.includes("#"));
qRows.push(...rows.filter((r) => r.redirectTo).slice(0, 15));
for (const r of qRows) addOnce("query", `https://${APEX}${r.oldPath}?${Q}`, { url: withQuery(r.redirectTo) });
addOnce("query", `https://${APEX}/about-us/karen-pettit/?${Q}`, { url: withQuery(`${CANONICAL_ORIGIN}/about#team`) });

// 4. Explicit ticket checks.
const explicit = [
  [`http://${APEX}/`, `${CANONICAL_ORIGIN}/`],
  [`http://${APEX}/orange-county/`, `${CANONICAL_ORIGIN}/locations/orange-county`],
  [`https://${APEX}/what-are-xanax-bars/`, `${CANONICAL_ORIGIN}/blog/what-are-xanax-bars`],
  [`https://${CANONICAL_HOST}/lean-drink-purple-drank`, `${CANONICAL_ORIGIN}/blog/lean-drink-purple-drank`],
  [`https://${CANONICAL_HOST}/lean-drink-purple-drank/`, `${CANONICAL_ORIGIN}/blog/lean-drink-purple-drank`],
  [`https://${APEX}/lean-drink-purple-drank`, `${CANONICAL_ORIGIN}/blog/lean-drink-purple-drank`],
  [`https://${APEX}/lean-drink-purple-drank/`, `${CANONICAL_ORIGIN}/blog/lean-drink-purple-drank`],
];
for (const [s, d] of explicit) if (!(LOCAL && s.startsWith("http:"))) add("explicit", s, { url: d });

// 5. Sitemap: canonical URLs serve 200 directly; every variant is one 301.
let sitemapCount = 0;
if (SITEMAP) {
  const sm = await get(`${CANONICAL_ORIGIN}/sitemap.xml`, { body: true });
  if (sm.status !== 200) add("sitemap", `${CANONICAL_ORIGIN}/sitemap.xml`, { url: `${CANONICAL_ORIGIN}/sitemap.xml` });
  const locs = [...(sm.body ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  sitemapCount = locs.length;
  for (const loc of locs) {
    const u = new URL(loc);
    if (u.origin !== CANONICAL_ORIGIN) {
      add("sitemap", loc, { url: `${CANONICAL_ORIGIN}${u.pathname}` }); // will fail: off-origin sitemap entry
      continue;
    }
    for (const v of variantsOf(u.pathname, { protocols: PROTOCOLS })) {
      // sitemap canonical itself must be 200 with no redirect
      add("sitemap", v, { url: u.toString() }); // "https://host" == "https://host/"
    }
  }
}

// 6. Non-page requests.
const home = await get(`${CANONICAL_ORIGIN}/`, { body: true });
const asset = (home.body ?? "").match(/\/_next\/static\/[^"'\s)]+\.js/)?.[0];
const image = (home.body ?? "").match(/\/(?:images|logos)\/[^"'\s)?]+\.(?:png|jpe?g|webp|svg)/)?.[0];
const nonPage = [
  ["/robots.txt", 200], ["/sitemap.xml", 200], asset && [asset, 200], image && [image, 200],
].filter(Boolean);

const results = await pool(cases, async (c) => {
  const hops = await trace(c.source);
  const verdict = judge(c.source, c.expected, hops);
  return { ...c, hops, ...verdict };
});

for (const [path, want] of nonPage) {
  const hops = await trace(`${CANONICAL_ORIGIN}${path}`);
  const ok = hops.length === 1 && hops[0].status === want;
  results.push({ group: "non-page", source: `${CANONICAL_ORIGIN}${path}`, expected: { url: `${CANONICAL_ORIGIN}${path}` }, hops, pass: ok, reason: ok ? `${want} direct` : `got ${hops.map((h) => h.status).join(">")}` });
}
{
  // API must never be redirected on the canonical host (any non-3xx is fine).
  const hops = await trace(`${CANONICAL_ORIGIN}/api/lead`);
  const ok = hops.length === 1 && !(hops[0].status >= 300 && hops[0].status < 400) && hops[0].status !== 0;
  results.push({ group: "non-page", source: `${CANONICAL_ORIGIN}/api/lead`, expected: { url: "(not redirected)" }, hops, pass: ok, reason: ok ? `${hops[0].status} direct` : `got ${hops.map((h) => h.status).join(">")}` });
}

// Report.
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const label = LOCAL ? "local" : "production";
mkdirSync(OUT, { recursive: true });
const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
const csv = [
  "group,source_url,expected_destination,first_status,first_location,hop_chain,final_status,pass,reason",
  ...results.map((r) =>
    [
      r.group, r.source, r.expected.gone ? `404/410 at ${r.expected.path}` : r.expected.url,
      r.hops[0]?.status, r.hops[0]?.location,
      r.hops.map((h) => `${h.status} ${h.url}`).join(" > "),
      r.hops[r.hops.length - 1]?.status, r.pass ? "PASS" : "FAIL", r.reason,
    ].map(esc).join(","),
  ),
].join("\n");
const base = join(OUT, `redirect-audit-${label}-${stamp}`);
writeFileSync(`${base}.csv`, csv + "\n");
writeFileSync(`${base}.json`, JSON.stringify({ target: LOCAL ?? "production", sitemapUrls: sitemapCount, results }, null, 1));

const groups = {};
for (const r of results) {
  const g = (groups[r.group] ??= { pass: 0, fail: 0 });
  r.pass ? g.pass++ : g.fail++;
}
const failed = results.filter((r) => !r.pass);
console.log(`Target: ${LOCAL ?? "production"}${LOCAL ? " (http:// variants skipped: platform layer)" : ""}`);
console.log(`CSV rows: ${rows.length}, sitemap URLs: ${sitemapCount}, checks: ${results.length}`);
console.table(groups);
const reasons = {};
for (const f of failed) reasons[f.reason.replace(/https?:\/\/\S+/g, "<url>")] = (reasons[f.reason.replace(/https?:\/\/\S+/g, "<url>")] ?? 0) + 1;
if (failed.length) {
  console.log("Failure reasons:");
  for (const [k, v] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log(`  ${v}  ${k}`);
  console.log("First failures:");
  for (const f of failed.slice(0, 15)) console.log(`  ${f.source}  ->  ${f.reason}`);
}
console.log(`Report: ${base}.csv / .json`);
process.exit(failed.length ? 1 : 0);
