import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { whoWeTreat } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return whoWeTreat.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const w = whoWeTreat.find((x) => x.slug === params.slug);
  const page = w && getPage(w.contentSlug);
  if (!page) return {};
  return pageMeta({
    title: page.title,
    description: page.metaDescription,
    path: `/who-we-treat/${params.slug}`,
    image: w?.image,
  });
}

export default function WhoWeTreatPage({ params }: { params: { slug: string } }) {
  const w = whoWeTreat.find((x) => x.slug === params.slug);
  const page = w && getPage(w.contentSlug);
  if (!w || !page) notFound();

  const related = whoWeTreat
    .filter((x) => x.slug !== params.slug)
    .map((x) => ({ label: x.label, href: `/who-we-treat/${x.slug}` }));

  return (
    <ContentPage
      path={`/who-we-treat/${params.slug}`}
      page={page}
      eyebrow="Who We Treat"
      heroImage={w.image}
      crumbs={[{ label: "Who We Treat" }, { label: w.label }]}
      related={related}
      relatedTitle="More Programs"
    />
  );
}
