import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { locations } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const locationImages: Record<string, string> = {
  "orange-county": "/images/lvd-hp-bk-.jpg",
  "newport-beach": "/images/ralph-ravi-kayden-4OtlI5Oju-M-unsplash.jpg",
  "los-angeles": "/images/shutterstock_1081362986-scaled.jpg",
  "san-diego": "/images/shutterstock_1550078711-scaled.jpeg",
  ventura: "/images/lvd-hp-bk-.jpg",
  california: "/images/lvd-hp-bk-.jpg",
};

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const loc = locations.find((x) => x.slug === params.slug);
  const page = loc && getPage(loc.contentSlug);
  if (!page) return {};
  return pageMeta({
    title: page.title,
    description: page.metaDescription,
    path: `/locations/${params.slug}`,
    image: locationImages[params.slug],
  });
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const loc = locations.find((x) => x.slug === params.slug);
  const page = loc && getPage(loc.contentSlug);
  if (!loc || !page) notFound();

  const related = locations
    .filter((x) => x.slug !== params.slug)
    .map((x) => ({ label: x.label, href: `/locations/${x.slug}` }));

  return (
    <ContentPage
      page={page}
      eyebrow="Areas We Serve"
      heroImage={locationImages[params.slug]}
      crumbs={[{ label: "Locations" }, { label: loc.label }]}
      related={related}
      relatedTitle="Other Areas We Serve"
    />
  );
}
