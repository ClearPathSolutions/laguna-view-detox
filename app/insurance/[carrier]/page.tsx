import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { carriers } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return carriers.map((c) => ({ carrier: c.slug }));
}

export function generateMetadata({ params }: { params: { carrier: string } }): Metadata {
  const c = carriers.find((x) => x.slug === params.carrier);
  const page = c && getPage(c.contentSlug);
  if (!page) return {};
  return pageMeta({
    title: page.title,
    description: page.metaDescription,
    path: `/insurance/${params.carrier}`,
  });
}

export default function CarrierPage({ params }: { params: { carrier: string } }) {
  const c = carriers.find((x) => x.slug === params.carrier);
  const page = c && getPage(c.contentSlug);
  if (!c || !page) notFound();

  const related = [
    { label: "Verify Your Insurance", href: "/insurance" },
    ...carriers
      .filter((x) => x.slug !== params.carrier)
      .map((x) => ({ label: x.label, href: `/insurance/${x.slug}` })),
  ];

  return (
    <ContentPage
      path={`/insurance/${params.carrier}`}
      page={page}
      eyebrow="Insurance Coverage"
      heroImage="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-021-Small.jpg"
      crumbs={[{ label: "Insurance", href: "/insurance" }, { label: c.label }]}
      related={related}
      relatedTitle="Other Carriers"
    />
  );
}
