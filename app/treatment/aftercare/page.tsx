import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { relatedPrograms } from "@/lib/programNav";
import { pageMeta } from "@/lib/seo";

const page = getPage("aftercare");
export const metadata = pageMeta({
  title: page?.title ?? "",
  description: page?.metaDescription ?? "",
  path: "/treatment/aftercare",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/treatment/aftercare"}
      page={page}
      eyebrow="Levels of Care"
      heroImage="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-004-Small.jpg"
      crumbs={[{ label: "Treatment", href: "/treatment" }, { label: "Aftercare & Alumni" }]}
      related={relatedPrograms("/treatment/aftercare")}
      relatedTitle="Our Programs"
    />
  );
}
