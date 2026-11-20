#!/usr/bin/env node
/**
 * Builds lib/redirect-map.generated.json — the table middleware.ts resolves
 * against — from lib/redirects.mjs + redirects/laguna-view-redirect-map.csv.
 * Runs as `prebuild`, so a conflicting, chained or looping rule fails the
 * deploy instead of shipping.
 *
 *   node scripts/redirects/generate.mjs           write the file
 *   node scripts/redirects/generate.mjs --check   fail if the file is stale
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildRedirectTable, runtimeTable } from "../../lib/redirects.mjs";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "lib", "redirect-map.generated.json");
const table = buildRedirectTable();

if (table.errors.length) {
  console.error(`Redirect table invalid (${table.errors.length}):`);
  for (const e of table.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const json = JSON.stringify(runtimeTable(table), null, 1) + "\n";
const c = table.counts;
const summary =
  `CSV: ${c.rows} rows, ${c.uniqueKeys} unique paths (fix ${c.fix}, add ${c.add}, leave-404 ${c.leave}; ` +
  `${c.normalizationOnly} normalisation-only). Table: ${Object.keys(table.exact).length} exact, ` +
  `${table.patterns.length} patterns, ${Object.keys(table.external).length} external.`;

if (process.argv.includes("--check")) {
  if (!existsSync(out) || readFileSync(out, "utf8") !== json) {
    console.error("lib/redirect-map.generated.json is stale — run: npm run redirects:generate");
    process.exit(1);
  }
  console.log(`OK. ${summary}`);
} else {
  writeFileSync(out, json);
  console.log(`Wrote lib/redirect-map.generated.json. ${summary}`);
}
