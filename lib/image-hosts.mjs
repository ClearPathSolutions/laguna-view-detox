/**
 * Remote hosts next/image is allowed to fetch and optimize.
 *
 * This replaced `remotePatterns: [{ protocol: "https", hostname: "**" }]`, which
 * turned the site's own /_next/image endpoint into an open image proxy: anyone
 * could pass an arbitrary URL and have it fetched, resized and served from this
 * domain, on this account's bandwidth. It is also the exact shape called out by
 * the advisory "Next.js self-hosted applications vulnerable to DoS via Image
 * Optimizer remotePatterns configuration".
 *
 * Adding a host is a one-line change here. Nothing breaks if a host is missing:
 * `isAllowedImageHost` below lets lib/blog.ts swap an un-allowlisted cover image
 * for the local fallback, rather than letting next/image throw and take the page
 * down with it.
 */
export const REMOTE_IMAGE_HOSTS = [
  // Clarion post covers currently resolve to Unsplash.
  "images.unsplash.com",
  // Clarion's own asset hosts, in case covers move in-house.
  "api.clarionlabs.ai",
  "www.clarionlabs.ai",
];

export function isAllowedImageHost(url) {
  if (typeof url !== "string" || !url.startsWith("http")) return false;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && REMOTE_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export const remoteImagePatterns = REMOTE_IMAGE_HOSTS.map((hostname) => ({
  protocol: "https",
  hostname,
}));
