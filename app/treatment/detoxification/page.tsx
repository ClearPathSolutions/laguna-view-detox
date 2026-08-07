import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { detoxTypes } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

const page = getPage("detoxification");

export const metadata = pageMeta({
  title: page?.title ?? "",
  description: page?.metaDescription ?? "",
  path: "/treatment/detoxification",
});

export default function DetoxPage() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/treatment/detoxification"}
      page={page}
      eyebrow="Levels of Care"
      heroImage="/images/lvd-tour-25.jpg"
      crumbs={[{ label: "Treatment", href: "/treatment" }, { label: "Medical Detox" }]}
      related={detoxTypes.map((d) => ({ label: `${d.label} Detox`, href: d.href }))}
      relatedTitle="What We Detox"
    />
  );
}
