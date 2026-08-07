import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { relatedPrograms } from "@/lib/programNav";
import { pageMeta } from "@/lib/seo";

const page = getPage("residential-inpatient");
export const metadata = pageMeta({
  title: page?.title ?? "",
  description: page?.metaDescription ?? "",
  path: "/treatment/residential-inpatient",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/treatment/residential-inpatient"}
      page={page}
      eyebrow="Levels of Care"
      heroImage="/images/lvd-tour-12.jpg"
      crumbs={[{ label: "Treatment", href: "/treatment" }, { label: "Residential Inpatient" }]}
      related={relatedPrograms("/treatment/residential-inpatient")}
      relatedTitle="Our Programs"
    />
  );
}
