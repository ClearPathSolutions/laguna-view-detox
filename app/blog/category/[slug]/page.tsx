import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import PostGrid from "@/components/PostGrid";
import { CategoryNav } from "@/components/BlogPagination";
import { categoryList, getCategory, postsInCategory } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return categoryList.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = getCategory(params.slug);
  if (!cat) return {};
  return pageMeta({
    title: `${cat.label} Articles`,
    description: `${cat.count} article${cat.count === 1 ? "" : "s"} on ${cat.label.toLowerCase()} from the Laguna View Detox clinical team — detox, treatment, and recovery guidance.`,
    path: `/blog/category/${cat.slug}`,
  });
}

export default function CategoryArchive({ params }: { params: { slug: string } }) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();

  // The largest category holds 33 posts, so a single page is fine here; if a
  // category ever outgrows that, reuse postsForPage()/BlogPagination.
  const posts = postsInCategory(cat.label);

  return (
    <>
      <PageHero
        eyebrow="Recovery Blog"
        title={`${cat.label} Articles`}
        subtitle={`${cat.count} article${cat.count === 1 ? "" : "s"} on ${cat.label.toLowerCase()} from our clinical team.`}
        image="/images/shutterstock_1122712238.jpg"
        crumbs={[{ label: "Blog", href: "/blog" }, { label: cat.label }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <CategoryNav categories={categoryList} activeSlug={cat.slug} />
          <div className="mt-10">
            <PostGrid posts={posts} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
