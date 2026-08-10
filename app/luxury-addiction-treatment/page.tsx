import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const page = getPage("luxury-addiction-treatment");
export const metadata = pageMeta({
  title: page?.title ?? "Luxury Addiction Treatment",
  description: page?.metaDescription ?? "",
  path: "/luxury-addiction-treatment",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/luxury-addiction-treatment"}
      page={page}
      eyebrow="Luxury Treatment"
      heroImage="/images/lvd-pool-3.jpg"
      crumbs={[{ label: "Luxury Addiction Treatment" }]}
      related={[
        { label: "The Luxury Experience", href: "/luxury-rehab" },
        { label: "Tour the Facility", href: "/tour" },
        { label: "Residential Inpatient", href: "/treatment/residential-inpatient" },
        { label: "Admissions", href: "/admissions" },
      ]}
      relatedTitle="Explore More"
    />
  );
}
