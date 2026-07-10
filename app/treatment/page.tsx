import Link from "next/link";
import Image from "next/image";
import { getPage, paragraphs } from "@/lib/content";
import { programs, detoxTypes } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { CtaBand, AdmissionsSteps } from "@/components/sections";
import { SectionHeading } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";

const page = getPage("treatment");
export const metadata = pageMeta({
  title: page?.title ?? "Addiction Treatment Programs",
  description: page?.metaDescription ?? "",
  path: "/treatment",
});

export default function TreatmentHub() {
  const intro = page?.heroSubtitle;
  const overview = page?.sections?.[0];

  return (
    <>
      <PageHero
        eyebrow="Comprehensive Care"
        title={page?.h1 || "Our Treatment Programs"}
        subtitle={intro}
        image="/images/NIK_5789-scaled.jpg"
        crumbs={[{ label: "Treatment" }]}
      />

      {/* Programs */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="A Full Continuum of Care"
            title="Every level of care, under one roof."
            lead="From your first day in medical detox to lifelong alumni support, our programs are built to work together — so nothing about your recovery ever feels fragmented."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p, i) => (
              <Link
                key={p.slug}
                href={p.href}
                className="card group reveal flex flex-col hover:-translate-y-1.5 hover:shadow-card"
                data-delay={i * 80}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="h-card !text-xl">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70">{p.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Addiction Therapies callout */}
          <div className="mt-6 grid items-center gap-8 rounded-3xl bg-navy-950 p-8 text-white lg:grid-cols-[1.4fr_1fr] lg:p-12 reveal">
            <div>
              <p className="eyebrow text-gold-300">
                <span className="h-px w-6 bg-gold-400" />
                Evidence-Based &amp; Holistic
              </p>
              <h3 className="mt-3 font-serif text-3xl font-medium text-white">Addiction Therapies</h3>
              <p className="mt-4 max-w-xl text-white/75">
                Individual and group therapy, CBT, DBT, motivational interviewing, and holistic
                modalities work together to treat the whole person — not just the symptoms.
              </p>
              <Link href="/treatment/addiction-therapies" className="btn-gold mt-6">
                Explore Our Therapies
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["CBT", "DBT", "Group", "1-on-1", "Holistic", "Family"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-4 text-sm font-medium text-white/80"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we detox */}
      <section className="section-sm bg-sand-50">
        <div className="container-x">
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-navy-900/5 lg:p-12">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow">
                  <span className="h-px w-6 bg-gold-400" />
                  Substances We Treat
                </p>
                <h2 className="h-card mt-3 !text-2xl">Safe, medically supervised detox</h2>
              </div>
              <Link href="/treatment/detoxification" className="btn-outline-navy shrink-0">
                Detox Overview
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {detoxTypes.map((d) => (
                <Link
                  key={d.slug}
                  href={d.href}
                  className="group flex items-center justify-between rounded-xl border border-navy-900/10 px-5 py-4 transition-colors hover:border-gold hover:bg-gold/5"
                >
                  <span className="font-medium text-navy-900">{d.label}</span>
                  <ArrowRightIcon className="h-4 w-4 text-gold-600 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {overview && (
        <section className="section bg-white">
          <div className="container-x max-w-3xl">
            <h2 className="h-section">{overview.heading}</h2>
            <div className="prose-body mt-6">
              {paragraphs(overview.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <AdmissionsSteps withBg={false} />
      <CtaBand />
    </>
  );
}
