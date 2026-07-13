"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

/**
 * Clarion client widgets, mounted once at the bottom of <body> in the root
 * layout. Two independent scripts load here:
 *
 *   1. widget.v1.js       — the floating chat bubble (branded below).
 *   2. forms-capture.v1.js — exposes window.ClarionForms.submit(...), which
 *                            LeadForm calls best-effort on every submission.
 *
 * Keep BRAND.color in sync with the site's primary brand token (navy
 * --navy DEFAULT #0e3e5a in tailwind.config.ts) so the bubble never drifts
 * from the rest of the site.
 */
const BRAND = {
  color: "#0e3e5a", // navy DEFAULT — primary brand color
  headerText: "#ffffff", // readable contrast on navy
  title: "Chat with us",
  position: "right" as const, // left | right
  font: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
};

export default function Clarion() {
  useEffect(() => {
    const { clarion } = site.widgets;

    // Chat widget — load once.
    if (!document.querySelector("script[data-clarion-widget]")) {
      const s = document.createElement("script");
      s.src = clarion.widget;
      s.async = true;
      s.dataset.clarionWidget = "true";
      s.setAttribute("data-site-key", clarion.siteKey);
      s.setAttribute("data-api", clarion.api);
      s.setAttribute("data-color", BRAND.color);
      s.setAttribute("data-header-text", BRAND.headerText);
      s.setAttribute("data-title", BRAND.title);
      s.setAttribute("data-position", BRAND.position);
      s.setAttribute("data-font", BRAND.font);
      document.body.appendChild(s);
    }

    // Form-capture script — load once. Exposes window.ClarionForms.
    if (!document.querySelector("script[data-clarion-forms]")) {
      const f = document.createElement("script");
      f.src = clarion.formsCapture;
      f.async = true;
      f.dataset.clarionForms = "true";
      f.setAttribute("data-site-key", clarion.siteKey);
      f.setAttribute("data-api", clarion.api);
      document.body.appendChild(f);
    }
  }, []);

  // CSS custom properties the widget reads for theming.
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{--clarion-chat-color:${BRAND.color};--clarion-chat-header-text:${BRAND.headerText};--clarion-chat-position:${BRAND.position};}`,
      }}
    />
  );
}
