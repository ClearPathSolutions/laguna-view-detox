import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";
import { CtaBand, InsuranceBand } from "@/components/sections";
import { SectionHeading } from "@/components/ui";
import { getPage, paragraphs } from "@/lib/content";
import { gallery } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const page = getPage("tour");
export const metadata = pageMeta({
  title: page?.title ?? "Tour Our Facility",
  description: page?.metaDescription ?? "",
  path: "/tour",
});

export default function TourPage() {
  const intro = page?.sections?.[0];
  return (
    <>
      <PageHero
        eyebrow="Tour Our Facility"
        title="Step inside our oceanview estate"
        subtitle={
          page?.heroSubtitle ||
          "A comfortable, home-like environment overlooking the Pacific — designed to make healing feel like coming home."
        }
        image="/images/lvd-tour-25.jpg"
        crumbs={[{ label: "Tour" }]}
      />

      {intro && (
        <section className="section-sm bg-white">
          <div className="container-x max-w-3xl text-center">
            <SectionHeading
              eyebrow="A Space to Heal"
              title={intro.heading || "Comfort, dignity, and serenity"}
              align="center"
            />
            <div className="prose-body mt-6 text-left sm:text-center">
              {paragraphs(intro.body).slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-sm bg-white pt-0">
        <div className="container-x">
          <Gallery items={gallery} />
        </div>
      </section>

      <InsuranceBand />
      <CtaBand />
    </>
  );
}
