import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPage } from "@/lib/content";
import { relatedPrograms } from "@/lib/programNav";
import { pageMeta } from "@/lib/seo";

const page = getPage("addiction-therapies");
export const metadata = pageMeta({
  title: page?.title ?? "",
  description: page?.metaDescription ?? "",
  path: "/treatment/addiction-therapies",
});

export default function Page() {
  if (!page) notFound();
  return (
    <ContentPage
      path={"/treatment/addiction-therapies"}
      page={page}
      eyebrow="Levels of Care"
      heroImage="/images/Women-in-Therapy-scaled.jpg"
      crumbs={[{ label: "Treatment", href: "/treatment" }, { label: "Addiction Therapies" }]}
      related={relatedPrograms("/treatment/addiction-therapies")}
      relatedTitle="Our Programs"
    />
  );
}
