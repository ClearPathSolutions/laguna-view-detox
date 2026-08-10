import Image from "next/image";
import PageHero from "@/components/PageHero";
import { CtaBand, InsuranceBand } from "@/components/sections";
import { SectionHeading } from "@/components/ui";
import { getPage, paragraphs } from "@/lib/content";
import { HeartIcon, SparkleIcon, LeafIcon, WaveIcon, UsersIcon, ShieldIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";

const page = getPage("luxury-rehab");
export const metadata = pageMeta({
  title: page?.title ?? "Luxury Rehab",
  description: page?.metaDescription ?? "",
  path: "/luxury-rehab",
});

const amenities = [
  { Icon: WaveIcon, label: "180° Pacific Ocean views" },
  { Icon: UsersIcon, label: "Private, six-bed setting" },
  { Icon: HeartIcon, label: "Personalized clinical care" },
  { Icon: LeafIcon, label: "Holistic wellness modalities" },
  { Icon: SparkleIcon, label: "Chef-prepared nutrition" },
  { Icon: ShieldIcon, label: "24/7 medical supervision" },
];

export default function LuxuryPage() {
  const sections = page?.sections || [];
  return (
    <>
      <PageHero
        path="/luxury-rehab"
        eyebrow="The Luxury Experience"
        title="Luxury drug & alcohol treatment"
        subtitle="A comfortable environment has been proven to ease early recovery. Our premier center offers high-quality care and amenities that mimic the comforts of home — overlooking the Pacific in Laguna Beach."
        image="/images/lvd-pool-3.jpg"
        crumbs={[{ label: "Luxury Treatment" }]}
      />

      {/* Amenities */}
      <section className="section-sm bg-white">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-5 reveal"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold-300">
                  <a.Icon className="h-6 w-6" />
                </span>
                <span className="font-medium text-navy-900">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating content sections */}
      {sections.slice(0, 4).map((s, i) => {
        const img = [
          "/images/NIK_9853-scaled.jpg",
          "/images/lvd-tour-22.jpg",
          "/images/NIK_5789-scaled.jpg",
          "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-004-Small.jpg",
        ][i % 4];
        const flip = i % 2 === 1;
        return (
          <section key={i} className={`section-sm ${i % 2 === 0 ? "bg-white" : "bg-sand-50"}`}>
            <div className="container-x">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`reveal ${flip ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-3xl shadow-card">
                    <Image
                      src={img}
                      alt={s.heading}
                      width={1100}
                      height={800}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className={`reveal ${flip ? "lg:order-1" : ""}`}>
                  {i === 0 ? (
                    <SectionHeading eyebrow="A Luxury Standard of Care" title={s.heading} />
                  ) : (
                    <h2 className="h-section">{s.heading}</h2>
                  )}
                  <div className="prose-body mt-6">
                    {paragraphs(s.body).slice(0, 3).map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <InsuranceBand />
      <CtaBand />
    </>
  );
}
