import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import PostGrid from "@/components/PostGrid";
import { CategoryNav } from "@/components/BlogPagination";
import { getAllPosts, categoryListFor, getCategoryFrom, postsInCategoryFrom } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

// Category membership includes Clarion posts, which are fetched hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return categoryListFor(posts).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const posts = await getAllPosts();
  const cat = getCategoryFrom(posts, params.slug);
  if (!cat) return {};
  return pageMeta({
    title: `${cat.label} Articles`,
    description: `${cat.count} article${cat.count === 1 ? "" : "s"} on ${cat.label.toLowerCase()} from the Laguna View Detox clinical team — detox, treatment, and recovery guidance.`,
    path: `/blog/category/${cat.slug}`,
  });
}

export default async function CategoryArchive({ params }: { params: { slug: string } }) {
  const all = await getAllPosts();
  const cat = getCategoryFrom(all, params.slug);
  if (!cat) notFound();

  // The largest category holds 33 posts, so a single page is fine here; if a
  // category ever outgrows that, reuse postsForPage()/BlogPagination.
  const posts = postsInCategoryFrom(all, cat.label);

  return (
    <>
      <PageHero
        path={`/blog/category/${cat.slug}`}
        eyebrow="Recovery Blog"
        title={`${cat.label} Articles`}
        subtitle={`${cat.count} article${cat.count === 1 ? "" : "s"} on ${cat.label.toLowerCase()} from our clinical team.`}
        image="/images/shutterstock_1122712238.jpg"
        crumbs={[{ label: "Blog", href: "/blog" }, { label: cat.label }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <CategoryNav categories={categoryListFor(all)} activeSlug={cat.slug} />
          <div className="mt-10">
            <PostGrid posts={posts} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
