/** @type {import('next').NextConfig} */

// Content-Security-Policy: locks the site to its own origin, allows the
// Google Maps embed (contact page) and next/image's data: URIs. Inline
// scripts (the framework runtime + JSON-LD) require 'unsafe-inline'; the
// site is statically generated, so per-request nonces aren't available.
//
// Third-party widgets that must be allowlisted (see lib/site.ts widgets):
//   • Clarion chat + form-capture — scripts served from www.clarionlabs.ai,
//     both call api.clarionlabs.ai via fetch from the browser.
//   • Call tracking — script + beacons from *.tctm.co.
//   • Clarion blog posts are fetched server-side (no browser origin needed),
//     but their cover/body images come from arbitrary CMS hosts (e.g.
//     images.unsplash.com), so img-src must permit any https image.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.clarionlabs.ai https://*.tctm.co",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src https://www.google.com https://maps.google.com",
  "connect-src 'self' https://api.clarionlabs.ai https://*.tctm.co",
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
  images: {
    formats: ['image/avif', 'image/webp'],
    // Source images are already downscaled to web-appropriate sizes (<=2000px),
    // so we serve them directly for instant loads. Flip to `false` to re-enable
    // Next's on-demand optimization (responsive srcset + AVIF/WebP) if desired.
    unoptimized: true,
  },
  async headers() {
    // Apply the strict security headers only to production builds. Next.js dev
    // mode relies on eval + a websocket for hot reload, which this CSP would
    // block (leaving client JS — and the scroll-reveal — dead). The headers are
    // what matters for the deployed site, which is what Vercel serves.
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
