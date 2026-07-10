import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { detoxTypes } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const drugImages: Record<string, string> = {
  alcohol: "/images/shutterstock_289045124.jpg",
  heroin: "/images/Laguna-View-Detox-Blog-3-What-are-Heroin-Withdrawal-Symptoms.edited-scaled.jpg",
  cocaine: "/images/shutterstock_609133892.jpg",
  meth: "/images/shutterstock_1721252326-scaled.jpg",
  benzodiazepines: "/images/shutterstock_528864532-scaled.jpg",
};

export function generateStaticParams() {
  return detoxTypes.map((d) => ({ drug: d.slug }));
}

export function generateMetadata({ params }: { params: { drug: string } }): Metadata {
  const page = getPage(params.drug);
  if (!page) return {};
  return pageMeta({
    title: page.title,
    description: page.metaDescription,
    path: `/treatment/detoxification/${params.drug}`,
    image: drugImages[params.drug],
  });
}

export default function DetoxDrugPage({ params }: { params: { drug: string } }) {
  const page = getPage(params.drug);
  const meta = detoxTypes.find((d) => d.slug === params.drug);
  if (!page || !meta) notFound();

  const related = [
    { label: "Detox Overview", href: "/treatment/detoxification" },
    ...detoxTypes
      .filter((d) => d.slug !== params.drug)
      .map((d) => ({ label: `${d.label} Detox`, href: d.href })),
  ];

  return (
    <ContentPage
      page={page}
      eyebrow="Medical Detox"
      heroImage={drugImages[params.drug]}
      crumbs={[
        { label: "Treatment", href: "/treatment" },
        { label: "Detox", href: "/treatment/detoxification" },
        { label: meta.label },
      ]}
      related={related}
      relatedTitle="Detox Programs"
    />
  );
}
