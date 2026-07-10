import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { relatedPrograms } from "@/lib/programNav";
import { pageMeta } from "@/lib/seo";

const page = getPage("dual-diagnosis");
export const metadata = pageMeta({
  title: page?.title ?? "",
  description: page?.metaDescription ?? "",
  path: "/treatment/dual-diagnosis",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      page={page}
      eyebrow="Levels of Care"
      heroImage="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-004-Small.jpg"
      crumbs={[{ label: "Treatment", href: "/treatment" }, { label: "Dual Diagnosis" }]}
      related={relatedPrograms("/treatment/dual-diagnosis")}
      relatedTitle="Our Programs"
    />
  );
}
