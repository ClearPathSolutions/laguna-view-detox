import PageHero from "@/components/PageHero";
import { AdmissionsSteps, InsuranceBand, CtaBand } from "@/components/sections";
import Reviews from "@/components/Reviews";
import { SectionHeading, Bullet } from "@/components/ui";
import { getPage } from "@/lib/content";
import SectionBody from "@/components/SectionBody";
import { pageMeta } from "@/lib/seo";

const page = getPage("admissions");
export const metadata = pageMeta({
  title: page?.title ?? "Admissions",
  description: page?.metaDescription ?? "",
  path: "/admissions",
});

export default function AdmissionsPage() {
  const bodySections = page?.sections?.slice(0, 4) || [];
  const shortBullets = (page?.bullets || []).filter((b) => b.length <= 95 && !b.includes(":"));

  return (
    <>
      <PageHero
        path="/admissions"
        eyebrow="We Make Getting Help Easy"
        title={page?.h1 || "Admissions"}
        subtitle={page?.heroSubtitle}
        image="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-009-Small.jpg"
        crumbs={[{ label: "Admissions" }]}
      />

      <AdmissionsSteps withBg />

      {bodySections.length > 0 && (
        <section className="section-sm bg-sand-50">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {bodySections.map((s, i) => (
                <div key={i} className="reveal">
                  {s.heading?.trim() && <h2 className="h-card !text-2xl">{s.heading}</h2>}
                  <SectionBody body={s.body} className="mt-4" />
                </div>
              ))}
            </div>

            {shortBullets.length >= 3 && (
              <div className="mt-10 rounded-2xl bg-white p-7 shadow-soft ring-1 ring-navy-900/5">
                <h3 className="h-card !text-xl">What we help with</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {shortBullets.slice(0, 9).map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <Reviews />
      <InsuranceBand />
      <CtaBand />
    </>
  );
}
