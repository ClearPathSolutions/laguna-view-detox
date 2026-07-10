import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { detoxTypes, whoWeTreat, locations, carriers, team } from "@/lib/data";
import { allPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  // Public, indexable routes. /privacy-policy is intentionally excluded — it is
  // marked noindex, so it should not appear in the sitemap.
  const staticPaths = [
    "",
    "/about",
    "/treatment",
    "/treatment/detoxification",
    "/treatment/residential-inpatient",
    "/treatment/dual-diagnosis",
    "/treatment/aftercare",
    "/treatment/addiction-therapies",
    "/luxury-rehab",
    "/tour",
    "/admissions",
    "/insurance",
    "/contact",
    "/blog",
    "/drug-addiction-treatment",
    "/alcohol-detox-and-treatment-programs",
    "/luxury-addiction-treatment",
  ];

  const dynamicPaths = [
    ...detoxTypes.map((d) => d.href),
    ...whoWeTreat.map((w) => `/who-we-treat/${w.slug}`),
    ...locations.map((l) => `/locations/${l.slug}`),
    ...carriers.map((c) => `/insurance/${c.slug}`),
    ...team.map((t) => `/about/${t.slug}`),
  ];

  const pages: MetadataRoute.Sitemap = [...staticPaths, ...dynamicPaths].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  // Blog posts carry their own publish date so search engines see real freshness.
  const posts: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.ts ? new Date(p.ts) : now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
