// Run: npm test   (node --test tests/redirects.test.mjs)
// Pure-function tests of the redirect resolver against the full CSV. The HTTP
// audit (scripts/redirects/audit.mjs) checks the same rules on a running server.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildRedirectTable, runtimeTable, readCsvRows, normalizePath } from "../lib/redirects.mjs";
import { resolveRedirect, CANONICAL_ORIGIN } from "../lib/redirect-resolver.mjs";

const built = buildRedirectTable();
const table = runtimeTable(built);
const rows = readCsvRows();
const APEX = "lagunaviewdetox.com";
const WWW = "www.lagunaviewdetox.com";
const go = (host, pathname, search = "", method = "GET") => resolveRedirect(table, { host, pathname, search, method });
const slashVariants = (p) => (p === "/" ? ["/"] : [normalizePath(p), `${normalizePath(p)}/`]);

test("CSV parses completely and the table validates", () => {
  assert.equal(rows.length, 323);
  const by = (a) => rows.filter((r) => r.action.startsWith(a)).length;
  assert.equal(by("Fix chain"), 241);
  assert.equal(by("Add 301"), 71);
  assert.equal(by("Leave 404"), 11);
  assert.equal(built.counts.uniqueKeys, 311);
  assert.deepEqual(built.errors, []);
});

test("generated map is up to date with lib/redirects.mjs + CSV", () => {
  const onDisk = JSON.parse(readFileSync(new URL("../lib/redirect-map.generated.json", import.meta.url), "utf8"));
  assert.deepEqual(onDisk, JSON.parse(JSON.stringify(table)), "run: npm run redirects:generate");
});

test("every CSV redirect row: each host x slash variant is one 301 to redirect_to, or 200 if already canonical", () => {
  for (const r of rows.filter((r) => r.redirectTo)) {
    const dest = new URL(r.redirectTo);
    for (const host of [APEX, WWW]) {
      for (const p of slashVariants(r.oldPath)) {
        const res = go(host, p);
        const canonical = host === WWW && p === dest.pathname && !dest.hash && !dest.search;
        if (canonical) assert.deepEqual(res, { action: "next" }, `${host}${p} should serve, not redirect`);
        else {
          assert.equal(res.action, "redirect", `${host}${p}`);
          assert.equal(res.status, 301, `${host}${p}`);
          assert.equal(res.location, r.redirectTo, `${host}${p}`);
        }
      }
    }
  }
});

test("leave-404 rows are never mapped: only host/slash normalisation, to the same path", () => {
  for (const r of rows.filter((r) => r.action.startsWith("Leave 404"))) {
    const key = normalizePath(r.oldPath);
    assert.deepEqual(go(WWW, key), { action: "next" }, key);
    for (const host of [APEX, WWW])
      for (const p of slashVariants(r.oldPath)) {
        if (host === WWW && p === key) continue;
        const res = go(host, p);
        assert.equal(res.status, 301);
        assert.equal(res.location, `${CANONICAL_ORIGIN}${key}`, `${host}${p} must not go to a fallback page`);
      }
  }
});

test("no destination redirects again (no chains, loops or self-redirects)", () => {
  for (const [key, to] of Object.entries(table.exact)) {
    const d = new URL(to, CANONICAL_ORIGIN);
    assert.deepEqual(go(WWW, d.pathname, d.search), { action: "next" }, `${key} -> ${to}`);
  }
});

test("root", () => {
  assert.deepEqual(go(WWW, "/"), { action: "next" });
  assert.deepEqual(go(APEX, "/"), { action: "redirect", status: 301, location: `${CANONICAL_ORIGIN}/`, reason: "host" });
  assert.equal(go(APEX, "/", "?gclid=1").location, `${CANONICAL_ORIGIN}/?gclid=1`);
});

test("query strings survive, before any fragment", () => {
  const q = "?utm_source=news&utm_medium=email&gclid=abc";
  assert.equal(go(APEX, "/what-are-xanax-bars/", q).location, `${CANONICAL_ORIGIN}/blog/what-are-xanax-bars${q}`);
  assert.equal(go(WWW, "/contact/", q).location, `${CANONICAL_ORIGIN}/contact${q}`);
  assert.equal(go(APEX, "/about-us/karen-pettit/", "?ref=x").location, `${CANONICAL_ORIGIN}/about?ref=x#team`);
  // External: destination-defined params kept, incoming appended, no clash override.
  const ext = go(WWW, "/careers", "?utm_source=x&cid=evil");
  assert.equal(ext.status, 302);
  const u = new URL(ext.location);
  assert.equal(u.searchParams.get("cid"), "e1094ba9-8b93-4f55-9dab-3102a4eaaa49");
  assert.equal(u.searchParams.get("utm_source"), "x");
});

test("ticket examples", () => {
  assert.equal(go(APEX, "/what-are-xanax-bars/").location, `${CANONICAL_ORIGIN}/blog/what-are-xanax-bars`);
  assert.equal(go(APEX, "/orange-county/").location, `${CANONICAL_ORIGIN}/locations/orange-county`);
  for (const p of ["/lean-drink-purple-drank", "/lean-drink-purple-drank/"])
    for (const h of [APEX, WWW]) assert.equal(go(h, p).location, `${CANONICAL_ORIGIN}/blog/lean-drink-purple-drank`);
});

test("existing rules outside the CSV still work", () => {
  assert.equal(go(WWW, "/about/karen-pettit").location, `${CANONICAL_ORIGIN}/about#team`);
  assert.equal(go(WWW, "/about-us/elizabeth-wald/").location, `${CANONICAL_ORIGIN}/about#team`);
  assert.equal(go(APEX, "/tag/anything/").location, `${CANONICAL_ORIGIN}/blog`);
  assert.equal(go(WWW, "/category").location, `${CANONICAL_ORIGIN}/blog`);
  assert.equal(go(WWW, "/blog/3").location, `${CANONICAL_ORIGIN}/blog/page/3`);
  assert.equal(go(WWW, "/blog/1").location, `${CANONICAL_ORIGIN}/blog`);
  assert.equal(go(WWW, "/careers/").status, 302);
});

test("framework, API, files and methods", () => {
  for (const h of [APEX, WWW]) {
    assert.deepEqual(go(h, "/_next/static/chunks/x.js"), { action: "next" });
    assert.deepEqual(go(h, "/api/lead", "", "POST"), { action: "next" });
  }
  assert.deepEqual(go(WWW, "/robots.txt"), { action: "next" });
  assert.deepEqual(go(WWW, "/sitemap.xml"), { action: "next" });
  assert.equal(go(APEX, "/sitemap.xml").location, `${CANONICAL_ORIGIN}/sitemap.xml`);
  // POST on the apex keeps its method (308) and is never legacy-mapped.
  assert.deepEqual(go(APEX, "/contact/", "", "POST"), { action: "redirect", status: 308, location: `${CANONICAL_ORIGIN}/contact/`, reason: "host (non-GET)" });
  assert.deepEqual(go(WWW, "/what-are-xanax-bars", "", "POST"), { action: "next" });
  assert.equal(go(WWW, "/what-are-xanax-bars", "", "HEAD").status, 301);
});

test("hosts: canonical origin is fixed; previews redirect within themselves; unknown hosts untouched", () => {
  assert.equal(go("LagunaViewDetox.com:443", "/contact").location, `${CANONICAL_ORIGIN}/contact`);
  assert.equal(go("laguna-view-detox-abc123-quadrant-health-group.vercel.app", "/contact/").location, "https://laguna-view-detox-abc123-quadrant-health-group.vercel.app/contact");
  assert.equal(go("localhost:3000", "/what-are-xanax-bars/").location, "http://localhost:3000/blog/what-are-xanax-bars");
  assert.deepEqual(go("evil.example", "/what-are-xanax-bars/"), { action: "next" });
  assert.deepEqual(go(null, "/contact/"), { action: "next" });
});
