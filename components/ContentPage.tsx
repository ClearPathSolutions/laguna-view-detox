import Link from "next/link";
import { site } from "@/lib/site";
import { type PageContent } from "@/lib/content";
import SectionBody from "./SectionBody";
import PageHero from "./PageHero";
import FaqSection from "./Faq";
import { CtaBand } from "./sections";
import { Bullet } from "./ui";
import TableOfContents, { headingId } from "./TableOfContents";
import ProgramCards from "./ProgramCards";
import LeadForm from "./LeadForm";
import Reviews from "./Reviews";
import {
  PhoneIcon,
  ShieldIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "./icons";

export type RelatedLink = { label: string; href: string };

function Prose({ page }: { page: PageContent }) {
  return (
    <div className="max-w-none">
      {page.sections.map((section, si) => {
        return (
          <section
            key={si}
            id={section.heading?.trim() ? headingId(section.heading, si) : undefined}
            className={si === 0 ? "scroll-mt-28" : "mt-12 scroll-mt-28"}
          >
            {section.heading?.trim() && (
              <h2 className="h-card !text-2xl sm:!text-[1.75rem]">{section.heading}</h2>
            )}
            <SectionBody body={section.body} className="mt-5" />
          </section>
        );
      })}
    </div>
  );
}

function Sidebar({
  related,
  relatedTitle = "Explore More",
}: {
  related?: RelatedLink[];
  relatedTitle?: string;
}) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {/* Admissions CTA */}
      <div className="overflow-hidden rounded-2xl bg-navy-900 p-7 text-white shadow-card">
        <p className="eyebrow text-gold-300">
          <span className="h-px w-6 bg-gold-400" />
          24/7 Confidential
        </p>
        <h3 className="mt-3 font-serif text-2xl font-medium text-white">
          Speak with our admissions team
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          We&apos;ve been in your shoes. Call now for a free, confidential conversation — no cost,
          no obligation.
        </p>
        <a href={site.phoneHref} className="btn-gold mt-5 w-full">
          <PhoneIcon className="h-4 w-4" />
          {site.phone}
        </a>
        <Link href="/insurance" className="btn-outline mt-2.5 w-full">
          <ShieldIcon className="h-4 w-4" />
          Verify Insurance
        </Link>
      </div>

      {/* Inline capture. Previously the only forms on the site were on
          /contact and /insurance, so every programme, detox, location and
          population page asked the reader to navigate away to convert. */}
      <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-navy-900/5">
        <h3 className="font-serif text-lg font-medium text-navy-900">
          Prefer we call you?
        </h3>
        <p className="mt-1.5 text-sm text-navy-900/70">
          Leave your name and number — we&apos;ll reach out discreetly.
        </p>
        <div className="mt-4">
          <LeadForm variant="callback" />
        </div>
      </div>

      {/* Related links */}
      {related && related.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
          <p className="text-sm font-semibold uppercase tracking-eyebrow text-gold-600">
            {relatedTitle}
          </p>
          <ul className="mt-4 space-y-1">
            {related.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium text-navy-900 transition-colors hover:bg-sand-100"
                >
                  {l.label}
                  <ChevronRightIcon className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust */}
      <div className="rounded-2xl border border-navy-900/10 bg-sand-50 p-6">
        <p className="text-sm font-semibold text-navy-900">Licensed &amp; Accredited</p>
        <ul className="mt-3 space-y-2 text-sm text-navy-900/70">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-gold-600" /> Joint Commission Accredited
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-gold-600" /> California DHCS Licensed
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-gold-600" /> Most PPO Insurance Accepted
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default function ContentPage({
  page,
  eyebrow,
  crumbs,
  heroImage,
  related,
  relatedTitle,
  intro,
  path,
  showPrograms = true,
}: {
  page: PageContent;
  eyebrow?: string;
  crumbs?: { label: string; href?: string }[];
  heroImage?: string;
  related?: RelatedLink[];
  relatedTitle?: string;
  intro?: React.ReactNode;
  /** Current route — feeds the BreadcrumbList's final item. */
  path?: string;
  /** Show the program-link widget (T-20). Defaults on for programme pages. */
  showPrograms?: boolean;
}) {
  // T-17: "At a Glance" used to be inferred — any page whose `bullets` had 3+
  // entries under 95 chars and free of colons got the block, which is why the
  // sheet described it as "randomly populated". It is now opt-in per page via
  // an explicit `atAGlance` array in pages.raw.json, so it appears only where
  // someone curated it.
  const atAGlance = page.atAGlance ?? [];
  const showBullets = atAGlance.length >= 3;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={page.h1}
        subtitle={page.heroSubtitle}
        image={heroImage}
        crumbs={crumbs}
        path={path}
      />

      <section className="section bg-white">
        <div className="container-x">
          {intro}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <div className="reveal">
              <TableOfContents sections={page.sections} />

              <Prose page={page} />

              {showBullets && (
                <div className="mt-12 rounded-2xl bg-sand-50 p-7 ring-1 ring-navy-900/5">
                  <h3 className="h-card !text-xl">At a Glance</h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {atAGlance.slice(0, 10).map((b, i) => (
                      <Bullet key={i}>{b}</Bullet>
                    ))}
                  </ul>
                </div>
              )}

              {showPrograms && <ProgramCards exclude={path} />}
            </div>

            <Sidebar related={related} relatedTitle={relatedTitle} />
          </div>
        </div>
      </section>

      {page.faqs && page.faqs.length > 0 && <FaqSection faqs={page.faqs} />}

      {/* Social proof above the closing CTA — QA rows 1097, 1103, 1244, 1277,
          1286 asked for this on detox, dual diagnosis, Orange County and the
          carrier pages, all of which render through here. */}
      <Reviews bg="bg-sand-50" />

      <CtaBand />
    </>
  );
}
