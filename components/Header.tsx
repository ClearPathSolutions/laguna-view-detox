"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { PhoneIcon, ChevronDownIcon, MenuIcon, CloseIcon, ShieldIcon } from "./icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouch = useRef(false);
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
  }, [pathname]);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Hover intent for pointer devices. Suppressed on touch, where the synthetic
  // mouseenter would fight the tap-to-toggle below.
  const handleEnter = (label: string) => {
    if (isTouch.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const handleLeave = () => {
    if (isTouch.current) return;
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  // Close the open desktop menu on Escape or a click/tap outside the nav.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onOutside = (e: Event) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-white/80 lg:block">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <p className="tracking-wide">
            Confidential 24/7 Admissions · Licensed by the State of California DHCS
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/60">{site.address.full}</span>
            <a
              href={site.phoneHref}
              className="flex items-center gap-1.5 font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-navy-900/10 bg-white/95 shadow-soft backdrop-blur"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4 lg:h-[84px]">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Laguna View Detox home">
            <Image
              src="/logos/logo-color.png"
              alt="Laguna View Detox"
              width={130}
              height={124}
              priority
              className="h-11 w-auto lg:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
            {nav.map((item) => {
              const active =
                item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
              if (!item.columns) {
                return (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors ${
                      active ? "text-gold-700" : "text-navy-900/80 hover:text-navy-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleEnter(item.label)}
                  onMouseLeave={handleLeave}
                >
                  <button
                    type="button"
                    onTouchStart={() => {
                      isTouch.current = true;
                    }}
                    onClick={() =>
                      setOpen((cur) => (cur === item.label ? null : item.label))
                    }
                    className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors ${
                      open === item.label || active
                        ? "text-gold-700"
                        : "text-navy-900/80 hover:text-navy-900"
                    }`}
                    aria-expanded={open === item.label}
                    aria-haspopup="true"
                    aria-controls={`nav-menu-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        open === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Mega menu */}
                  <div
                    id={`nav-menu-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ${
                      open === item.label
                        ? "visible pointer-events-auto translate-y-0 opacity-100"
                        : "invisible pointer-events-none translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="w-max overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-lift">
                      <div className="flex">
                        <div className="flex gap-2 p-4">
                          {item.columns.map((col, ci) => (
                            <div key={ci} className="w-52 shrink-0">
                              {col.title.trim() && (
                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-eyebrow text-gold-600">
                                  {col.title}
                                </p>
                              )}
                              <ul className={col.title.trim() ? "" : "mt-[26px]"}>
                                {col.links.map((l) => (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href}
                                      className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-sand-100"
                                    >
                                      <span className="whitespace-nowrap text-[15px] font-medium text-navy-900 group-hover:text-gold-700">
                                        {l.label}
                                      </span>
                                      {l.note && (
                                        <span className="text-xs text-navy-900/50">{l.note}</span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {item.feature && (
                          <Link
                            href={item.feature.href}
                            className="group relative hidden w-56 shrink-0 overflow-hidden xl:block"
                          >
                            <Image
                              src={item.feature.image}
                              alt={item.feature.label}
                              fill
                              sizes="224px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-900/25 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                              <p className="font-serif text-lg font-semibold">{item.feature.label}</p>
                              <p className="mt-1 text-xs text-white/80">{item.feature.blurb}</p>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <Link href="/insurance" className="btn-outline-navy px-5 py-2.5 text-[13px]">
              <ShieldIcon className="h-4 w-4" />
              Verify Insurance
            </Link>
            <a href={site.phoneHref} className="btn-gold px-5 py-2.5 text-[13px]">
              <PhoneIcon className="h-4 w-4" />
              Call Now
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={site.phoneHref}
              className="flex h-11 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-semibold text-navy-900"
              aria-label={`Call ${site.phone}`}
            >
              <PhoneIcon className="h-4 w-4" />
              Call
            </a>
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        returnFocusRef={hamburgerRef}
      />
    </header>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function MobileDrawer({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Whether the drawer occupies the tab order at all. Driven by state rather
  // than a CSS `transition-[visibility]` because a transitioned visibility
  // flips asynchronously, which races focus management. On close we hold it
  // visible for the slide-out duration, then remove it.
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    const t = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  // `inert` is the load-bearing fix: it removes the drawer's 48 links and
  // buttons from the tab order and the accessibility tree in one step, with no
  // transition semantics to race against. Toggling it imperatively lets us
  // order it against focus movement — clearing it *before* focusing in, and
  // moving focus out *before* setting it.
  // Depends on `rendered` as well as `open`: focus cannot land on an element
  // inside a visibility:hidden subtree, so we wait for the drawer to actually
  // be visible before moving focus into it.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (open && rendered) {
      wrap.removeAttribute("inert");
      closeBtnRef.current?.focus();
    } else if (!open) {
      // Only reclaim focus if it is still inside the drawer, so a route change
      // or an outside click does not yank focus unexpectedly.
      if (wrap.contains(document.activeElement)) {
        returnFocusRef.current?.focus();
      }
      wrap.setAttribute("inert", "");
    }
  }, [open, rendered, returnFocusRef]);

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    // Rendered inert so that even before hydration a keyboard user cannot tab
    // into the closed drawer. `pointer-events-none` alone left all 48 controls
    // focusable inside an aria-hidden subtree — a WCAG 2.1 SC 4.1.2 violation.
    // The effect above takes over the attribute once React is running.
    <div
      ref={wrapRef}
      className={`fixed inset-0 z-[60] lg:hidden ${
        open ? "" : "pointer-events-none"
      } ${rendered ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute right-0 top-0 flex h-full w-[min(90vw,400px)] flex-col bg-white shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-navy-900/10 px-5 py-4">
          <Image src="/logos/logo-color.png" alt="Laguna View Detox" width={44} height={42} className="h-10 w-auto" />
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-900"
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3" aria-label="Mobile">
          {nav.map((item) => {
            if (!item.columns) {
              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className="block rounded-xl px-4 py-3.5 text-[17px] font-medium text-navy-900 hover:bg-sand-100"
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = expanded === item.label;
            return (
              <div key={item.label} className="border-b border-navy-900/5 last:border-0">
                <button
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium text-navy-900 hover:bg-sand-100"
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gold-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-2 pl-3">
                      {item.columns.map((col, ci) => (
                        <div key={ci} className="mb-1">
                          {col.title.trim() && (
                            <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-eyebrow text-gold-600">
                              {col.title}
                            </p>
                          )}
                          {col.links.map((l) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              className="block rounded-lg px-4 py-2.5 text-[15px] text-navy-900/75 hover:bg-sand-100 hover:text-navy-900"
                            >
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="space-y-2.5 border-t border-navy-900/10 bg-sand-50 px-5 py-4">
          <a href={site.phoneHref} className="btn-gold w-full">
            <PhoneIcon className="h-4 w-4" />
            Call {site.phone}
          </a>
          <Link href="/insurance" className="btn-outline-navy w-full">
            <ShieldIcon className="h-4 w-4" />
            Verify Your Insurance
          </Link>
        </div>
      </div>
    </div>
  );
}
