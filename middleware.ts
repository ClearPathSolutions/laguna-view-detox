import { NextResponse, type NextRequest } from "next/server";
import { resolveRedirect } from "@/lib/redirect-resolver.mjs";
import table from "@/lib/redirect-map.generated.json";

/**
 * The only redirect layer for this site's pages. Every legacy URL, host
 * variant and trailing-slash variant reaches its final URL in ONE 301:
 *
 *   - next.config.mjs has no redirects() and sets skipTrailingSlashRedirect,
 *     so Next.js adds no hop of its own before this runs;
 *   - the apex domain must be attached to the Vercel project WITHOUT a
 *     domain-level redirect, so apex requests reach this code instead of
 *     getting a platform 308 first.
 *
 * The map is lib/redirect-map.generated.json (built from lib/redirects.mjs and
 * redirects/laguna-view-redirect-map.csv by scripts/redirects/generate.mjs).
 */
export function middleware(request: NextRequest) {
  // request.url keeps the raw pathname, trailing slash included.
  const url = new URL(request.url);
  const result = resolveRedirect(table, {
    method: request.method,
    host: request.headers.get("host"),
    pathname: url.pathname,
    search: url.search,
  });
  if (result.action === "next") return NextResponse.next();

  // Explicit status: NextResponse.redirect() would default to 307.
  return new NextResponse(null, { status: result.status, headers: { Location: result.location } });
}

export const config = {
  // Everything except Next.js build output and the API. Files (robots.txt,
  // sitemap.xml, /images/…) still pass through for apex -> www.
  matcher: ["/((?!_next/static|_next/image|api/).*)"],
};
