"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/**
 * Clarion blog embed. Renders into an isolated <div data-clarion-blog> that the
 * embed script hydrates client-side with Clarion's incoming posts. It only ever
 * fills its own container, so the site's hand-authored posts (rendered above
 * this section) stay untouched and fully crawlable.
 *
 * Caveat: these posts render after page load, so they are NOT in the static
 * HTML and are not SEO-crawled the way pre-rendered posts are.
 */
export default function ClarionBlog() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || document.querySelector("script[data-clarion-blog-embed]")) {
      return;
    }
    loaded.current = true;

    const { clarion } = site.widgets;
    const s = document.createElement("script");
    s.src = clarion.blogEmbed;
    s.dataset.clarionBlogEmbed = "true";
    s.setAttribute("data-site-key", clarion.siteKey);
    s.setAttribute("data-api", clarion.api);
    document.body.appendChild(s);
  }, []);

  return <div data-clarion-blog />;
}
