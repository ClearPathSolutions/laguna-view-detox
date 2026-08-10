import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import BlogArchive from "@/components/BlogArchive";
import { getAllPosts, categoryListFor, totalPagesFor } from "@/lib/blog";
import { ArrowRightIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";
import BlogPagination, { CategoryNav } from "@/components/BlogPagination";

// Re-generate hourly so newly published Clarion posts appear without a redeploy.
export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Addiction Recovery Blog",
  description:
    "Guidance, education, and encouragement on detox, treatment, and lasting recovery from the Laguna View Detox clinical team.",
  path: "/blog",
});

export default async function BlogIndex() {
  // Local + Clarion posts, newest first. The most recent post — wherever it
  // comes from — is the featured hero; everything else fills the archive.
  const posts = await getAllPosts();
  const featured = posts[0];
  // Strip heavy fields — the archive only renders card metadata.
  const rest = posts.slice(1).map(({ sections, bodyHtml, ...meta }) => meta);
  const usedCategories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  ).sort();

  return (
    <>
      <PageHero
        path="/blog"
        eyebrow="Stay Informed"
        title="Addiction Recovery Blog"
        subtitle="Guidance, education, and encouragement from the Laguna View Detox clinical team."
        image="/images/shutterstock_1122712238.jpg"
        crumbs={[{ label: "Blog" }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          {/* Featured — the newest post overall (local or Clarion) */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 overflow-hidden rounded-3xl bg-sand-50 shadow-soft ring-1 ring-navy-900/5 lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-10">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gold-600">
                  <span className="rounded-full bg-gold/15 px-3 py-1">{featured.category}</span>
                  {featured.date && <span className="text-navy-900/50">{featured.date}</span>}
                </div>
                <h2 className="mt-4 font-serif text-2xl font-medium leading-snug text-navy-900 group-hover:text-gold-700 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-relaxed text-navy-900/70">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                  Read article
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}

          {/* Real category links. The client filter inside BlogArchive is a
              convenience; these are what a crawler can actually follow. */}
          <div className="mt-14">
            <CategoryNav categories={categoryListFor(posts)} />
          </div>

          <div className="mt-10">
            <BlogArchive posts={rest} categories={usedCategories} />
          </div>

          {/* Crawlable path to the remaining 145 posts. */}
          <BlogPagination current={1} total={totalPagesFor(posts)} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
