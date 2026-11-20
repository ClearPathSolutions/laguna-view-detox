/**
 * One redirect decision per request.
 *
 * Host, trailing slash and legacy path are resolved together and answered with
 * ONE 301 to the final URL — never a 301 to a URL that redirects again. Used by
 * middleware.ts at the edge and directly by tests/redirects.test.mjs.
 *
 * Protocol: Vercel upgrades http -> https with its own 308 before any project
 * code runs, and that cannot be disabled (vercel.com/docs/cdn-security/encryption).
 * So this code never sees production http traffic, never issues a protocol-only
 * redirect (that is how proxies cause https loops), and always emits https.
 *
 * Host: destinations are built from the fixed CANONICAL_ORIGIN, never from the
 * request's Host / X-Forwarded-* headers. The Host only selects from an
 * allowlist: the two production hostnames get host normalisation to
 * CANONICAL_ORIGIN; localhost and this project's *.vercel.app deployments get
 * path-only redirects within themselves (so previews stay usable); any other
 * Host gets no redirect at all. Location is always absolute — Next 14's
 * middleware adapter cannot parse a relative one.
 */

export const CANONICAL_HOST = "www.lagunaviewdetox.com";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
export const PRODUCTION_HOSTS = new Set([CANONICAL_HOST, "lagunaviewdetox.com"]);

/** Origin to redirect within for a non-production host, or null if untrusted. */
export function previewOrigin(host) {
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return `http://${host}`;
  if (/^laguna-view-detox(-[a-z0-9-]+)?\.vercel\.app$/.test(host)) return `https://${host}`;
  return null;
}

const SAFE_METHODS = new Set(["GET", "HEAD"]);

export const normalizePath = (p) => (p === "/" ? "/" : p.replace(/\/+$/, "") || "/");

/** Framework internals and the API are never redirected. */
const isFrameworkPath = (p) => p.startsWith("/_next/") || p === "/_next" || p.startsWith("/api/") || p === "/api";

/** /robots.txt, /sitemap.xml, /images/x.jpg … — files, not pages. */
const isFilePath = (p) => /\/[^/]*\.[^/]+$/.test(p);

/**
 * Destination query wins on a key clash; every other incoming param (utm_*,
 * gclid …) is carried over in its original order.
 */
export function mergeQuery(destSearch, incomingSearch) {
  const out = new URLSearchParams(destSearch);
  const destKeys = new Set(out.keys());
  for (const [k, v] of new URLSearchParams(incomingSearch)) if (!destKeys.has(k)) out.append(k, v);
  const s = out.toString();
  return s ? `?${s}` : "";
}

function lookup(table, key) {
  if (Object.prototype.hasOwnProperty.call(table.exact, key)) return { kind: "internal", to: table.exact[key] };
  if (Object.prototype.hasOwnProperty.call(table.external, key)) return { kind: "external", to: table.external[key] };
  for (const p of table.patterns) {
    const m = key.match(new RegExp(p.re));
    if (m) return { kind: "internal", to: p.to.replace(/\$(\d)/g, (_, i) => m[Number(i)] ?? "") };
  }
  return null;
}

/**
 * @param {{exact: Record<string,string>, patterns: {re:string,to:string}[], external: Record<string,string>}} table
 * @param {{method?: string, host?: string|null, pathname: string, search?: string}} req
 * @returns {{action: "next"} | {action: "redirect", status: number, location: string, reason: string}}
 */
export function resolveRedirect(table, { method = "GET", host, pathname, search = "" }) {
  const rawHost = (host || "").toLowerCase();
  const h = rawHost.replace(/:\d+$/, "");
  const onProduction = PRODUCTION_HOSTS.has(h);
  const wrongHost = onProduction && h !== CANONICAL_HOST;
  const origin = onProduction ? CANONICAL_ORIGIN : previewOrigin(rawHost);
  const q = search && search !== "?" ? search : "";

  if (isFrameworkPath(pathname) || origin === null) return { action: "next" };

  // A 301 turns POST into GET. Non-idempotent requests are only moved off the
  // apex, with a method-preserving 308, exactly as the old domain redirect did.
  if (!SAFE_METHODS.has(method.toUpperCase())) {
    return wrongHost
      ? { action: "redirect", status: 308, location: `${origin}${pathname}${q}`, reason: "host (non-GET)" }
      : { action: "next" };
  }

  if (isFilePath(pathname)) {
    return wrongHost
      ? { action: "redirect", status: 301, location: `${origin}${pathname}${q}`, reason: "host" }
      : { action: "next" };
  }

  const key = normalizePath(pathname);
  const hit = lookup(table, key);

  if (hit?.kind === "external") {
    // Third-party hand-off stays temporary on purpose (see EXTERNAL_MAP).
    const u = new URL(hit.to);
    return { action: "redirect", status: 302, location: `${u.origin}${u.pathname}${mergeQuery(u.search, q)}${u.hash}`, reason: "external" };
  }

  if (hit) {
    const d = new URL(hit.to, CANONICAL_ORIGIN);
    return {
      action: "redirect",
      status: 301,
      location: `${origin}${d.pathname}${mergeQuery(d.search, q)}${d.hash}`,
      reason: "legacy",
    };
  }

  if (key !== pathname || wrongHost) {
    return {
      action: "redirect",
      status: 301,
      location: `${origin}${key}${q}`,
      reason: wrongHost && key !== pathname ? "host+slash" : wrongHost ? "host" : "slash",
    };
  }

  return { action: "next" };
}
