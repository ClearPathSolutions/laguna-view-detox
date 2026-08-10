import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reviews from "@/components/Reviews";
import { AdmissionsSteps, CtaBand } from "@/components/sections";
import { SectionHeading } from "@/components/ui";
import { getPage } from "@/lib/content";
import { team } from "@/lib/data";
import { HeartIcon, SparkleIcon, UsersIcon, LeafIcon, ArrowRightIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";
import { extraStaff } from "@/lib/staff-feed";

const page = getPage("about-us");
export const metadata = pageMeta({
  title: page?.title ?? "About Us",
  description: page?.metaDescription ?? "",
  path: "/about",
});

const pillars = [
  {
    Icon: UsersIcon,
    title: "Dedicated Staff",
    text: "You'll be welcomed by a comprehensive team of expert professionals who gently guide you through the detox process.",
  },
  {
    Icon: SparkleIcon,
    title: "Luxurious Setting",
    text: "A comfortable, beautiful environment eases early recovery. Our 180° ocean view provides an unmatched experience.",
  },
  {
    Icon: HeartIcon,
    title: "Personalized Care",
    text: "Through a full spectrum of care with experienced medical and clinical professionals, we design a plan just for you.",
  },
  {
    Icon: LeafIcon,
    title: "Continuum of Care",
    text: "Aftercare is essential to success. From day one, we help identify options that build on your new foundation.",
  },
];

/**
 * Team cards link to a per-person bio page. Staff pulled from the support
 * portal have no such page, so they render as a plain card instead of a link
 * pointing at /about/undefined.
 */
function CardShell({
  slug,
  delay,
  children,
}: {
  slug: string;
  delay: number;
  children: React.ReactNode;
}) {
  if (!slug) {
    return (
      <div className="text-center reveal" data-delay={delay}>
        {children}
      </div>
    );
  }
  return (
    <Link href={`/about/${slug}`} className="group text-center reveal" data-delay={delay}>
      {children}
    </Link>
  );
}

export default async function AboutPage() {
  // Local entries win; the portal only contributes people not listed in lib/data.
  const roster = [...team, ...(await extraStaff("laguna-view-detox", team))];
  return (
    <>
      <PageHero
        path="/about"
        eyebrow="About Laguna View Detox"
        title="Who We Are"
        subtitle={page?.heroSubtitle}
        image="/images/NIK_5848-scaled.jpg"
        crumbs={[{ label: "About" }]}
      />

      {/* Story + image */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-023-Small.jpg"
                  alt="Interior of the Laguna View Detox facility"
                  width={1100}
                  height={825}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-navy px-7 py-6 text-white shadow-lift sm:block lg:-left-8">
                <p className="font-serif text-4xl font-semibold text-gold-400">Since 2015</p>
                <p className="mt-1 max-w-[180px] text-sm text-white/75">
                  Helping hundreds of people find their path to recovery
                </p>
              </div>
            </div>

            <div className="reveal order-1 lg:order-2">
              <SectionHeading
                eyebrow="Our Story"
                title="We understand addiction — and we know how to help."
              />
              <div className="prose-body mt-6">
                <p>
                  At Laguna View Detox, we understand addiction and know how to help you break free
                  from drug and alcohol abuse once and for all. Addiction is different for every
                  client who comes through our doors, which is why we use individualized plans for
                  each and every person.
                </p>
                <p>
                  Since 2015, our caring and professional staff have helped hundreds of people find
                  their individual path to recovery, combining evidence-based treatment with the
                  dignity and comfort every person deserves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section bg-sand-50 bg-grid-navy">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Laguna View Difference"
            title="How we help you heal."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <div key={p.title} className="card reveal p-7" data-delay={i * 80}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold-300">
                  <p.Icon className="h-6 w-6" />
                </span>
                <h3 className="h-card mt-5 !text-lg">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-900/70">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section bg-white scroll-mt-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Experienced Professionals"
            title="Meet our team"
            lead="Our team is made up of experienced professionals wholly dedicated to your recovery."
            align="center"
          />
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {roster.map((m, i) => (
              <CardShell
                key={m.slug || m.name}
                slug={m.slug}
                delay={i * 90}
              >
                <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-2xl bg-sand-100 shadow-soft">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(min-width: 640px) 30vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy font-serif text-5xl font-semibold text-gold-300">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-navy-900 group-hover:text-gold-700">
                  {m.name}
                </h3>
                <p className="mt-1 text-sm text-navy-900/60">{m.role}</p>
                {/* Rendered conditionally, not with the `hidden` attribute: the
                    UA's [hidden]{display:none} loses to the `inline-flex`
                    class, so `hidden` did nothing and portal-managed staff —
                    who have no bio page — showed a "Read bio" affordance that
                    was not even a link, since CardShell renders a plain div
                    when there is no slug. */}
                {m.slug ? (
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gold-700">
                    Read bio
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                ) : null}
              </CardShell>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
      <AdmissionsSteps withBg />
      <CtaBand />
    </>
  );
}
