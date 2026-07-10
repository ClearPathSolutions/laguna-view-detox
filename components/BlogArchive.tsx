"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { ArrowRightIcon } from "./icons";

const PAGE_SIZE = 12;

export default function BlogArchive({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active, posts]
  );
  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2.5">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => {
              setActive(c);
              setVisible(PAGE_SIZE);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === c
                ? "bg-navy text-white"
                : "bg-sand-100 text-navy-900/70 hover:bg-sand-200 hover:text-navy-900"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-navy-900/50">
        Showing {shown.length} of {filtered.length} article{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-900 shadow-soft">
                {post.category}
              </span>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              {post.date && (
                <p className="text-xs font-medium uppercase tracking-wider text-navy-900/50">
                  {post.date}
                </p>
              )}
              <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-navy-900 transition-colors group-hover:text-gold-700">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70 line-clamp-3">
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

      {visible < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="btn-outline-navy"
          >
            Load More Articles
          </button>
        </div>
      )}
    </>
  );
}
