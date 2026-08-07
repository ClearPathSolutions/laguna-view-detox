import raw from "@/content/pages.raw.json";

export type Section = { heading: string; body: string };
export type Faq = { question: string; answer: string };

export type PageContent = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  sections: Section[];
  bullets?: string[];
  /** Curated 'At a Glance' items. Explicit per page — see T-17. */
  atAGlance?: string[];
  faqs?: Faq[];
  teamRole?: string;
};

const pages = raw as unknown as Record<string, PageContent>;

export function getPage(slug: string): PageContent | undefined {
  return pages[slug];
}

/** Split a body string into clean paragraphs. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Detect a "Label: rest of sentence" lead-in for emphasis rendering. */
export function splitLabel(p: string): { label?: string; text: string } {
  const m = p.match(/^([A-Z][A-Za-z0-9 '&/-]{2,42}):\s+([\s\S]+)$/);
  if (m && m[1].split(" ").length <= 5) {
    return { label: m[1], text: m[2] };
  }
  return { text: p };
}
