import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import PostGrid from "@/components/PostGrid";
import BlogPagination, { CategoryNav } from "@/components/BlogPagination";
import {
  getAllPosts,
  postsForPage,
  totalPagesFor,
  categoryListFor,
} from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

// Matches the blog index: pick up newly published Clarion posts hourly
// without a redeploy. Pagination is computed from the merged list, so a new
// post can shift page boundaries.
export const revalidate = 3600;

/**
 * Pages 2..N. Page 1 is /blog itself, so it is deliberately not generated
 * here — /blog/page/1 would duplicate /blog.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return Array.from({ length: Math.max(0, totalPagesFor(posts) - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

function parsePage(n: string, total: number): number | null {
  if (!/^\d+$/.test(n)) return null;
  const page = Number(n);
  if (page < 2 || page > total) return null;
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: { n: string };
}): Promise<Metadata> {
  const posts = await getAllPosts();
  const total = totalPagesFor(posts);
  const page = parsePage(params.n, total);
  if (!page) return {};
  return pageMeta({
    title: `Addiction Recovery Blog — Page ${page}`,
    description: `Page ${page} of ${total} from the Laguna View Detox recovery blog: guidance on detox, treatment, insurance, and lasting sobriety.`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPageN({ params }: { params: { n: string } }) {
  const all = await getAllPosts();
  const total = totalPagesFor(all);
  const page = parsePage(params.n, total);
  if (!page) notFound();

  const posts = postsForPage(all, page);

  return (
    <>
      <PageHero
        path={`/blog/page/${page}`}
        eyebrow="Stay Informed"
        title="Addiction Recovery Blog"
        subtitle={`Page ${page} of ${total} — ${all.length} articles from the Laguna View Detox clinical team.`}
        image="/images/shutterstock_1122712238.jpg"
        crumbs={[{ label: "Blog", href: "/blog" }, { label: `Page ${page}` }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <CategoryNav categories={categoryListFor(all)} />
          <p className="mt-6 text-sm text-navy-900/60">
            Showing {posts.length} of {all.length} articles
          </p>
          <div className="mt-8">
            <PostGrid posts={posts} />
          </div>
          <BlogPagination current={page} total={total} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
