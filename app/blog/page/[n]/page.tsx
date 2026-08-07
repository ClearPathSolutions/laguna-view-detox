import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import PostGrid from "@/components/PostGrid";
import BlogPagination, { CategoryNav } from "@/components/BlogPagination";
import { postsForPage, totalPages, categoryList, allPosts } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

/**
 * Pages 2..N. Page 1 is /blog itself, so it is deliberately not generated
 * here — /blog/page/1 would duplicate /blog.
 */
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

function parsePage(n: string): number | null {
  if (!/^\d+$/.test(n)) return null;
  const page = Number(n);
  if (page < 2 || page > totalPages) return null;
  return page;
}

export function generateMetadata({ params }: { params: { n: string } }): Metadata {
  const page = parsePage(params.n);
  if (!page) return {};
  return pageMeta({
    title: `Addiction Recovery Blog — Page ${page}`,
    description: `Page ${page} of ${totalPages} from the Laguna View Detox recovery blog: guidance on detox, treatment, insurance, and lasting sobriety.`,
    path: `/blog/page/${page}`,
  });
}

export default function BlogPageN({ params }: { params: { n: string } }) {
  const page = parsePage(params.n);
  if (!page) notFound();

  const posts = postsForPage(page);

  return (
    <>
      <PageHero
        path={`/blog/page/${page}`}
        eyebrow="Stay Informed"
        title="Addiction Recovery Blog"
        subtitle={`Page ${page} of ${totalPages} — ${allPosts.length} articles from the Laguna View Detox clinical team.`}
        image="/images/shutterstock_1122712238.jpg"
        crumbs={[{ label: "Blog", href: "/blog" }, { label: `Page ${page}` }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <CategoryNav categories={categoryList} />
          <p className="mt-6 text-sm text-navy-900/60">
            Showing {posts.length} of {allPosts.length} articles
          </p>
          <div className="mt-8">
            <PostGrid posts={posts} />
          </div>
          <BlogPagination current={page} total={totalPages} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
