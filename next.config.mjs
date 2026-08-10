/** @type {import('next').NextConfig} */
import { buildRedirects } from "./lib/redirects.mjs";

/**
 * ⚠️ CUTOVER DECISION — BLOCKED ON QHG (sheet V0102, portfolio-wide).
 *
 * Production (`lagunaviewdetox.com`) is slash-canonical: it 301s the slashless
 * form of every URL. This build serves slashless. Until this matches
 * production, every canonical this site emits points at a URL that redirects,
 * which discounts it — measured live 2026-08-07: of 9 sampled routes, 8 either
 * 301 or 404 and only `/` resolves cleanly.
 *
 * Set this to `true` the moment QHG confirms the convention, and ship it in the
 * SAME deploy as the redirect map below. Two passes produce chains.
 */
const TRAILING_SLASH = false;

// Content-Security-Policy: locks the site to its own origin, allows the
// Google Maps embed (contact page) and next/image's data: URIs. Inline
// scripts (the framework runtime + JSON-LD) require 'unsafe-inline'; the
// site is statically generated, so per-request nonces aren't available.
// Third-party hosts that must be allowlisted. Enumerated explicitly rather
// than wildcarded wherever possible — a broad `*.google.com` style allowance
// would re-open most of what this policy closes.
//
//   • Clarion chat + form-capture — scripts from www.clarionlabs.ai, both
//     calling api.clarionlabs.ai via fetch from the browser.
//   • Call tracking — script + beacons from *.tctm.co.
//   • GA4 — inert unless NEXT_PUBLIC_GA_ID is set (see components/Analytics).
//
// img-src keeps `https:` because Clarion blog covers come from arbitrary CMS
// hosts. `remotePatterns` below lets next/image proxy them same-origin, so
// this can be tightened to 'self' once every remote image renders through
// next/image rather than a raw <img>.
const CLARION_SCRIPT = "https://www.clarionlabs.ai";
const CLARION_API = "https://api.clarionlabs.ai";
const CALL_TRACKING = "https://*.tctm.co";
const GA_SCRIPT = "https://www.googletagmanager.com";
const GA_CONNECT =
  "https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${CLARION_SCRIPT} ${CALL_TRACKING} ${GA_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src https://www.google.com https://maps.google.com",
  `connect-src 'self' ${CLARION_API} ${CALL_TRACKING} ${GA_CONNECT} ${GA_SCRIPT}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: TRAILING_SLASH,
  // 185 pairs: every URL live on production today -> its address here.
  // Enumerated from production's sitemaps; see lib/redirects.mjs.
  async redirects() {
    return buildRedirects();
  },
  images: {
    // AVIF/WebP + responsive srcset. This was previously `unoptimized: true`,
    // which made every `sizes` prop in the codebase inert and shipped the same
    // full-resolution JPEG to a 390px phone as to a 1440px desktop — the
    // homepage alone carried ~5.5 MB of images and /blog ~7.2 MB.
    formats: ["image/avif", "image/webp"],
    // Widths the optimizer will generate. Trimmed to the breakpoints this
    // design actually uses so we don't build derivatives nobody requests.
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
    // Clarion post covers are absolute URLs on arbitrary CMS hosts. Without
    // this, next/image throws on them now that optimization is enabled.
    // Routing them through /_next/image also means they are served
    // same-origin, optimized and cached like everything else.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    // Static assets under /public are content-addressed by filename here, so
    // they can be cached hard. This applies in dev too — it is not a security
    // header and dev reloads bust it via the query string Next adds.
    const assetCache = [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/logos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];

    // Apply the strict security headers only to production builds. Next.js dev
    // mode relies on eval + a websocket for hot reload, which this CSP would
    // block (leaving client JS — and the scroll-reveal — dead). The headers are
    // what matters for the deployed site, which is what Vercel serves.
    if (process.env.NODE_ENV !== "production") return assetCache;
    return [...assetCache, { source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
