/**
 * Post-processing for Clarion `body_html`, applied before the HTML is injected
 * into a blog post page. Clarion templates every post across the fleet, so its
 * links arrive in whatever shape the CMS emits, which has caused site-audit
 * failures:
 *
 *  - every link (including links to this site's own service pages and to
 *    `#ref` anchors) carries `rel="nofollow"`, so crawlers see internal links
 *    marked as untrusted and authoritative citations as unendorsed;
 *  - internal links are absolute and use whichever host/trailing-slash form the
 *    CMS has on file, so they reach the page through a redirect;
 *  - some internal links point at posts that only exist on sister sites in the
 *    fleet (e.g. /blog/what-to-expect-first-30-days-of-treatment), i.e. a 404;
 *  - inline <img> tags carry no alt attribute.
 *
 * Everything here is string-level and conservative: a tag the patterns don't
 * recognise passes through untouched.
 */

export type ClarionHtmlOptions = {
  /** Canonical origin, e.g. "https://www.example.com" (no trailing slash). */
  origin: string;
  /** Whether the site's canonical URLs end in "/". */
  trailingSlash: boolean;
  /** Paths (without trailing slash) of blog posts that exist on this site. */
  knownBlogPaths?: Set<string>;
  /** Where to send links to /blog/* posts that don't exist here. */
  missingPostFallback?: string;
  /** Alt text for inline images that have none (usually the post title). */
  fallbackAlt: string;
  /** Optional exact-URL remap for known-dead external links. */
  externalRemap?: Record<string, string>;
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

function normalisePath(pathname: string, trailingSlash: boolean): string {
  if (pathname === "" || pathname === "/") return "/";
  const last = pathname.split("/").pop() ?? "";
  if (last.includes(".")) return pathname; // a file, e.g. /llms.txt
  const stripped = pathname.replace(/\/+$/, "");
  return trailingSlash ? `${stripped}/` : stripped;
}

function setAttr(attrs: string, name: string, value: string | null): string {
  const re = new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i");
  if (value === null) return attrs.replace(re, "");
  if (re.test(attrs)) return attrs.replace(re, ` ${name}="${escapeAttr(value)}"`);
  return `${attrs} ${name}="${escapeAttr(value)}"`;
}

function getAttr(attrs: string, name: string): string | null {
  const m = attrs.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? "";
}

function withoutNofollow(rel: string | null): string | null {
  if (rel === null) return null;
  const tokens = rel.split(/\s+/).filter((t) => t && t.toLowerCase() !== "nofollow");
  return tokens.length ? tokens.join(" ") : null;
}

export function cleanClarionHtml(html: string, opts: ClarionHtmlOptions): string {
  const siteHost = bareHost(new URL(opts.origin).host);
  const fallback = opts.missingPostFallback ?? normalisePath("/blog", opts.trailingSlash);

  let out = html.replace(/<a\b([^>]*)>/gi, (_whole, rawAttrs: string) => {
    let attrs = rawAttrs;
    const href = getAttr(attrs, "href");
    const rel = getAttr(attrs, "rel");

    if (href === null) return `<a${attrs}>`;

    // In-page anchors (#ref1, table of contents): internal, never nofollow.
    if (href.startsWith("#")) {
      attrs = setAttr(attrs, "rel", null);
      return `<a${attrs}>`;
    }

    let url: URL | null = null;
    try {
      url = new URL(href, opts.origin);
    } catch {
      url = null;
    }
    if (!url || !/^https?:$/.test(url.protocol)) {
      return `<a${attrs}>`; // mailto:, tel:, malformed — leave alone
    }

    if (bareHost(url.host) === siteHost) {
      // Internal: root-relative, canonical slash form, followed.
      let path = normalisePath(url.pathname, opts.trailingSlash);
      const key = path.replace(/\/+$/, "");
      if (
        opts.knownBlogPaths &&
        /^\/blog\/[^/]+$/.test(key) &&
        !opts.knownBlogPaths.has(key)
      ) {
        path = fallback;
      }
      const target = `${path}${path === fallback ? "" : url.search + url.hash}`;
      attrs = setAttr(attrs, "href", target);
      attrs = setAttr(attrs, "rel", null);
      attrs = setAttr(attrs, "target", null);
      return `<a${attrs}>`;
    }

    // External: keep noopener/noreferrer, drop nofollow on editorial citations.
    const remapped = opts.externalRemap?.[href];
    if (remapped) attrs = setAttr(attrs, "href", remapped);
    attrs = setAttr(attrs, "rel", withoutNofollow(rel));
    return `<a${attrs}>`;
  });

  out = out.replace(/<img\b([^>]*?)(\s*\/?)>/gi, (whole, attrs: string, close: string) => {
    if (/\salt\s*=/i.test(attrs)) return whole;
    return `<img${attrs} alt="${escapeAttr(opts.fallbackAlt)}"${close}>`;
  });

  return out;
}
