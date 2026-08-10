"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { PhoneIcon, ShieldIcon } from "./icons";

/**
 * Mobile-only sticky admissions bar.
 *
 * The phone is the primary conversion on this site and, below `lg`, the only
 * persistent CTA was a small "Call" button in the header that scrolls away.
 * This keeps calling and insurance verification one tap away on every page.
 *
 * Hidden until the hero is out of the way so it never competes with the
 * hero's own CTAs, and suppressed on the two pages that already lead with a
 * form.
 */
const SUPPRESS_ON = ["/contact", "/insurance"];

export default function StickyCallBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suppressed = SUPPRESS_ON.includes(pathname);

  /**
   * Tell the page when this bar is occupying the bottom edge.
   *
   * The Clarion chat bubble is fixed bottom-right at z-index 2147483000, so it
   * sat directly on top of the "Verify" button and swallowed most of its tap
   * target. globals.css uses this class to lift the bubble above the bar, which
   * keeps both CTAs at full width instead of shrinking them to dodge it.
   */
  useEffect(() => {
    const active = show && !suppressed;
    document.body.classList.toggle("has-sticky-bar", active);
    return () => document.body.classList.remove("has-sticky-bar");
  }, [show, suppressed]);

  if (suppressed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      // Keep it out of the tab order while it is off-screen.
      {...(show ? {} : { inert: "" as unknown as boolean, "aria-hidden": true })}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={site.phoneHref}
          onClick={() => track("phone_click", { location: "sticky_bar" })}
          className="btn-gold flex-1 py-3 text-sm"
        >
          <PhoneIcon className="h-4 w-4" />
          Call {site.phone}
        </a>
        <Link
          href="/insurance"
          onClick={() => track("insurance_start", { location: "sticky_bar" })}
          className="btn-outline-navy shrink-0 px-4 py-3 text-sm"
          aria-label="Verify your insurance"
        >
          <ShieldIcon className="h-4 w-4" />
          Verify
        </Link>
      </div>
    </div>
  );
}
