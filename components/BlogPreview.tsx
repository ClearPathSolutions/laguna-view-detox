import Link from "next/link";
import Image from "next/image";
import { featured as featuredPosts } from "@/lib/blog";
import { SectionHeading } from "./ui";
import { ArrowRightIcon } from "./icons";

export default function BlogPreview() {
  const featured = featuredPosts;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Stay Informed"
            title="From our recovery blog"
            lead="Guidance, education, and encouragement from the Laguna View Detox clinical team."
          />
          <Link href="/blog" className="btn-outline-navy shrink-0">
            Visit the Blog
          </Link>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {featured.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col reveal"
              data-delay={i * 90}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-900 shadow-soft">
                  {post.category}
                </span>
              </div>
              <div className="mt-5 flex flex-1 flex-col">
                <p className="text-xs font-medium uppercase tracking-wider text-navy-900/50">
                  {post.date}
                </p>
                <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-navy-900 transition-colors group-hover:text-gold-700">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                  Read article
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
