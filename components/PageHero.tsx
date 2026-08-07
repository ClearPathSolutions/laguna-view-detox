import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { PhoneIcon, ChevronRightIcon } from "./icons";

export type Crumb = { label: string; href?: string };

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image = "/images/NIK_5883-hero.jpg",
  crumbs = [],
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: Crumb[];
  align?: "center" | "left";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/60 to-navy-950/90" />
      <div className="absolute inset-0 bg-grid-navy opacity-40 mix-blend-overlay" />

      <div className="container-x relative pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className={`flex flex-wrap items-center gap-1.5 text-xs text-white/60 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRightIcon className="h-3 w-3 text-white/30" />
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-gold-300">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white/80">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && (
            <p className={`eyebrow mt-6 text-gold-300 ${align === "center" ? "justify-center" : ""}`}>
              <span className="h-px w-6 bg-gold-400" />
              {eyebrow}
            </p>
          )}
          <h1 className="h-display mt-4 !text-white text-shadow-hero">{title}</h1>
          {subtitle && (
            <p className="lead mt-5 !text-white/80">{subtitle}</p>
          )}
          <div
            className={`mt-8 flex flex-col gap-3 sm:flex-row ${
              align === "center" ? "sm:justify-center" : ""
            }`}
          >
            <a href={site.phoneHref} className="btn-gold">
              <PhoneIcon className="h-4 w-4" />
              Call {site.phone}
            </a>
            <Link href="/insurance" className="btn-outline">
              Verify Your Insurance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
