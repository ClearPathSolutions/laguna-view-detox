import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPage } from "@/lib/content";
import SectionBody from "@/components/SectionBody";
import { team } from "@/lib/data";
import { CtaBand } from "@/components/sections";
import { PhoneIcon, ChevronRightIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const CANONICAL_AT_PARENT: Record<string, string> = {
  "pamela-tambini": "https://www.quadranthealthgroup.com/team/pamela-tambini/",
};

export function generateStaticParams() {
  return team.map((m) => ({ member: m.slug }));
}

export function generateMetadata({ params }: { params: { member: string } }): Metadata {
  const m = team.find((x) => x.slug === params.member);
  const page = m && getPage(m.contentSlug);
  if (!m) return {};
  const meta = pageMeta({
    title: `${m.name} — ${m.role}`,
    description: page?.metaDescription || `Meet ${m.name}, ${m.role} at Laguna View Detox.`,
    path: `/about/${m.slug}`,
    image: m.image,
  });
  // Network-wide staff: this exact bio is published on quadranthealthgroup.com
  // and on every other Quadrant facility site, so the page points at the parent
  // rather than competing with it as a near-duplicate.
  const parent = CANONICAL_AT_PARENT[m.slug];
  return parent ? { ...meta, alternates: { canonical: parent } } : meta;
}

export default function TeamMemberPage({ params }: { params: { member: string } }) {
  const m = team.find((x) => x.slug === params.member);
  const page = m && getPage(m.contentSlug);
  if (!m || !page) notFound();

  return (
    <>
      <section className="bg-navy-950 text-white">
        <div className="container-x py-14 lg:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-300">Home</Link>
            <ChevronRightIcon className="h-3 w-3 text-white/30" />
            <Link href="/about" className="hover:text-gold-300">About</Link>
            <ChevronRightIcon className="h-3 w-3 text-white/30" />
            <span className="text-white/80">{m.name}</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[300px_1fr]">
            <div className="relative mx-auto aspect-[3/4] w-56 overflow-hidden rounded-2xl shadow-lift lg:mx-0 lg:w-full">
              {m.image ? (
                <Image src={m.image} alt={m.name} fill sizes="300px" className="object-cover" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-navy-800 font-serif text-6xl font-semibold text-gold-300">
                  {m.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="eyebrow text-gold-300">
                <span className="h-px w-6 bg-gold-400" />
                {page.teamRole || m.role}
              </p>
              <h1 className="h-display mt-3 !text-white">{m.name}</h1>
              <p className="lead mt-4 !text-white/80 max-w-xl">{page.heroSubtitle}</p>
              <a href={site.phoneHref} className="btn-gold mt-7">
                <PhoneIcon className="h-4 w-4" />
                Speak With Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          {page.sections.map((s, i) => (
            <div key={i} className={i === 0 ? "" : "mt-10"}>
              {s.heading?.trim() && <h2 className="h-card !text-2xl">{s.heading}</h2>}
              <SectionBody body={s.body} className="mt-4" />
            </div>
          ))}

          <div className="mt-12 border-t border-navy-900/10 pt-8">
            <Link href="/about#team" className="link-underline group">
              <ChevronRightIcon className="h-4 w-4 rotate-180" />
              Back to the team
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
