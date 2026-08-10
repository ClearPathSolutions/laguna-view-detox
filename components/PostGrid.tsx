import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { categorySlug } from "@/lib/blog";
import { ArrowRightIcon } from "./icons";

/**
 * Server-rendered grid of post cards. This is the crawlable substrate for the
 * blog: every card is a real <a> in the initial HTML, unlike the client-side
 * "Load More" archive on /blog which only ever emits its first page.
 */
export default function PostGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.slug} className="flex flex-col">
          <Link href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-5 font-serif text-xl font-medium leading-snug text-navy-900 transition-colors group-hover:text-gold-700">
              {post.title}
            </h3>
          </Link>
          {post.date && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-navy-900/60">
              {post.date}
            </p>
          )}
          <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700"
            >
              Read article
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href={`/blog/category/${categorySlug(post.category)}`}
              className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-navy-900/75 transition-colors hover:bg-gold hover:text-navy-900"
            >
              {post.category}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
