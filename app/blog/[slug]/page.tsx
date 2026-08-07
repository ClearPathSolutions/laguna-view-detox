import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPost, allPosts, categorySlug } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/content";
import { CtaBand } from "@/components/sections";
import { site } from "@/lib/site";
import { PhoneIcon, ChevronRightIcon, ArrowRightIcon, ShieldIcon } from "@/components/icons";

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
  });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const more = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const related = (more.length >= 3 ? more : allPosts.filter((p) => p.slug !== post.slug)).slice(0, 3);

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image src={post.image} alt="" fill sizes="100vw" className="object-cover opacity-25" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 to-navy-950/95" />
        <div className="container-x relative py-14 lg:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-300">Home</Link>
            <ChevronRightIcon className="h-3 w-3 text-white/30" />
            <Link href="/blog" className="hover:text-gold-300">Blog</Link>
          </nav>
          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gold-300">
              <Link
                href={`/blog/category/${categorySlug(post.category)}`}
                className="rounded-full bg-white/10 px-3 py-1 transition-colors hover:bg-white/20"
              >
                {post.category}
              </Link>
              {post.date && <span className="text-white/60">{post.date}</span>}
            </div>
            <h1 className="h-display mt-4 !text-white !text-[clamp(2rem,4.2vw,3.25rem)]">{post.title}</h1>
            <p className="mt-4 text-white/70">By {post.author}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <article className="reveal max-w-prose">
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl shadow-soft">
                <Image src={post.image} alt={post.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
              </div>

              {post.sections && post.sections.length > 0 ? (
                post.sections.map((s, i) => (
                  <div key={i} className={i === 0 ? "" : "mt-9"}>
                    {s.heading?.trim() && s.heading.toLowerCase() !== "introduction" && (
                      <h2 className="h-card !text-2xl">{s.heading}</h2>
                    )}
                    <div className="prose-body mt-4">
                      {paragraphs(s.body).map((p, pi) =>
                        p.startsWith("- ") ? (
                          <ul key={pi} className="my-4 space-y-2">
                            {p.split("\n").map((li, li2) => (
                              <li key={li2} className="flex items-start gap-2.5 text-navy-900/75">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                                {li.replace(/^-\s*/, "")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p key={pi}>{p}</p>
                        )
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="prose-body">{post.excerpt}</p>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl bg-navy-900 p-7 text-white shadow-card">
                <h3 className="font-serif text-xl font-medium">Ready to talk?</h3>
                <p className="mt-2 text-sm text-white/70">
                  Our admissions team is here 24/7 — free and confidential.
                </p>
                <a href={site.phoneHref} className="btn-gold mt-5 w-full">
                  <PhoneIcon className="h-4 w-4" /> {site.phone}
                </a>
                <Link href="/insurance" className="btn-outline mt-2.5 w-full">
                  <ShieldIcon className="h-4 w-4" /> Verify Insurance
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* More posts */}
      <section className="section-sm bg-sand-50">
        <div className="container-x">
          <h2 className="h-card !text-2xl">Keep reading</h2>
          <div className="mt-8 grid gap-7 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
                  <Image src={p.image} alt={p.title} fill sizes="30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium leading-snug text-navy-900 group-hover:text-gold-700">
                  {p.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                  Read <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
