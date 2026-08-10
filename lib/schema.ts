import { site } from "./site";
import type { Faq } from "./content";
import type { BlogPost } from "./blog";

/**
 * JSON-LD builders. Each is driven off the same data the page renders, so the
 * markup cannot describe something a visitor does not see — which is both a
 * Google requirement and the only way to keep them from drifting.
 */

const ORG = {
  "@type": "MedicalBusiness",
  name: site.name,
  url: site.url,
} as const;

/**
 * Names we are permitted to publish as a credentialed `Person` in structured
 * data. Confirmed against the QHG staff roster.
 *
 * ⚠️ Everyone else falls back to the organisation as author. `content/blog.json`
 * currently attributes 13 posts to "Kris Brace, CADC II", who is NOT on the
 * current roster — asserting that name with its credential inside machine-
 * readable schema would escalate an unverified human byline into a claim
 * search engines and regulators treat as authoritative. Do not add a name here
 * until HR confirms employment and credential.
 */
const VERIFIED_AUTHORS: Record<string, { name: string; jobTitle?: string }> = {
  "Riky Hanaumi, LCSW": {
    name: "Riky Hanaumi, LCSW",
    jobTitle: "Clinical Director",
  },
};

function authorNode(author: string) {
  const verified = VERIFIED_AUTHORS[author.trim()];
  if (verified) {
    return {
      "@type": "Person",
      name: verified.name,
      ...(verified.jobTitle ? { jobTitle: verified.jobTitle } : {}),
      worksFor: { "@type": "Organization", name: site.name },
    };
  }
  return { "@type": "Organization", name: site.name, url: site.url };
}

/** FAQPage — only call this where the questions are actually rendered. */
export function faqPageSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function blogPostingSchema(post: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.slice(0, 110),
    description: post.excerpt || undefined,
    image: post.image ? `${site.url}${post.image}` : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}${url}` },
    // Only emitted when the source carries a parseable date — no invented dates.
    datePublished: post.ts ? new Date(post.ts).toISOString() : undefined,
    author: authorNode(post.author),
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logos/logo-color.png`,
      },
    },
    articleSection: post.category || undefined,
  };
}

export type SchemaCrumb = { label: string; href?: string };

/**
 * BreadcrumbList mirroring the visible breadcrumb trail. `path` is the current
 * page, used for the final item so the last crumb still resolves.
 */
export function breadcrumbSchema(crumbs: SchemaCrumb[], path: string) {
  const trail: SchemaCrumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href ?? (i === trail.length - 1 ? path : "/")}`,
    })),
  };
}

export function medicalWebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: `${site.url}${path}`,
    about: ORG,
  };
}
