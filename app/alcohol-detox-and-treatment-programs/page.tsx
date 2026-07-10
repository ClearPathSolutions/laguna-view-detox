import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { detoxTypes } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const page = getPage("alcohol-detox-and-treatment-programs");
export const metadata = pageMeta({
  title: page?.title ?? "Alcohol Detox & Treatment Programs",
  description: page?.metaDescription ?? "",
  path: "/alcohol-detox-and-treatment-programs",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      page={page}
      eyebrow="Alcohol Treatment"
      heroImage="/images/shutterstock_289045124.jpg"
      crumbs={[{ label: "Alcohol Detox & Treatment" }]}
      related={[
        { label: "Alcohol Detox", href: "/treatment/detoxification/alcohol" },
        { label: "Medical Detox", href: "/treatment/detoxification" },
        { label: "Residential Inpatient", href: "/treatment/residential-inpatient" },
        { label: "Dual Diagnosis", href: "/treatment/dual-diagnosis" },
      ]}
      relatedTitle="Related Programs"
    />
  );
}
