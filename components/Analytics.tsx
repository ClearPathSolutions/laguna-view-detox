"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ID, analyticsEnabled, pageview, track } from "@/lib/analytics";

/**
 * GA4 loader + global conversion listeners.
 *
 * Renders nothing at all when NEXT_PUBLIC_GA_ID is unset, so no third-party
 * request is made and the CSP allowance below stays unused.
 */
export default function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  // App Router does a client-side transition between pages, which GA4's
  // automatic pageview does not see after the first load.
  useEffect(() => {
    if (!analyticsEnabled) return;
    const qs = search?.toString();
    pageview(pathname + (qs ? `?${qs}` : ""));
  }, [pathname, search]);

  // Phone taps are the primary conversion on mobile and are ordinary <a>
  // elements scattered across every template. One delegated listener catches
  // all of them without touching a dozen components.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href^='tel:']");
      if (!el) return;
      track("phone_click", {
        number: el.getAttribute("href")?.replace("tel:", ""),
        location: pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  if (!analyticsEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
