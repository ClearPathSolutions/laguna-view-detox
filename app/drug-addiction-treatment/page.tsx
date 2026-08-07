import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { relatedPrograms } from "@/lib/programNav";
import { pageMeta } from "@/lib/seo";

const page = getPage("drug-addiction-treatment");
export const metadata = pageMeta({
  title: page?.title ?? "Drug Addiction Treatment",
  description: page?.metaDescription ?? "",
  path: "/drug-addiction-treatment",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/drug-addiction-treatment"}
      page={page}
      eyebrow="Addiction Treatment"
      heroImage="/images/shutterstock_1379119298-scaled.jpg"
      crumbs={[{ label: "Drug Addiction Treatment" }]}
      related={relatedPrograms("")}
      relatedTitle="Our Programs"
    />
  );
}
