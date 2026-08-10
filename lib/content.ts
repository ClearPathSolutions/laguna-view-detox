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

/**
 * Split a body string into clean paragraphs.
 *
 * Splits on BLANK lines only. Blog bodies (`content/blog.json`) use `\n\n`
 * between paragraphs and a single `\n` inside bullet runs, so this must keep
 * single newlines intact for the blog renderer to find its `- ` lists.
 *
 * Page bodies (`content/pages.raw.json`) use the opposite convention — a single
 * `\n` per item — so page templates must use `parseBody()` instead, or lists
 * collapse into one run-on paragraph.
 */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Split a page body into its individual items.
 *
 * Page bodies use a single `\n` per item, so callers that want "the first N
 * items" must split on single newlines — `paragraphs()` would return one blob
 * and any `.slice()` on it would be a no-op.
 */
export function lines(body: string): string[] {
  return body
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Structured page-body parsing                                        */
/* ------------------------------------------------------------------ */

export type Block =
  | { kind: "prose"; items: string[] }
  | { kind: "definitions"; items: { label?: string; text: string }[] }
  | { kind: "cards"; items: { title: string; body: string }[] };

/** "Core Specializations: Luxury Alcohol Detox…" — a labelled fact. */
function isLabelLine(l: string): boolean {
  const m = l.match(/^([A-Z][A-Za-z0-9 '&/-]{2,42}):\s+\S/);
  return !!m && m[1].split(" ").length <= 5;
}

/** "Alcohol Detox" — a short heading with no terminal punctuation. */
function isTitleLine(l: string): boolean {
  return l.length <= 60 && !/[.!?:]$/.test(l) && l.split(/\s+/).length <= 7;
}

/**
 * Parse a page section body into renderable blocks.
 *
 * The scraped source stores three different shapes with the same single-`\n`
 * delimiter, so the shape has to be inferred:
 *
 *   A. definitions — most lines are "Label: value"
 *   B. cards       — strict title/body/title/body alternation
 *   C. prose       — everything else, one paragraph per line
 */
export function parseBody(body: string): Block[] {
  const lines = body
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];
  if (lines.length === 1) return [{ kind: "prose", items: lines }];

  const labelled = lines.filter(isLabelLine).length;
  if (labelled >= Math.ceil(lines.length / 2)) {
    return [
      {
        kind: "definitions",
        items: lines.map((l) => {
          const { label, text } = splitLabel(l);
          return label ? { label, text } : { text: l };
        }),
      },
    ];
  }

  const alternates =
    lines.length >= 4 &&
    lines.length % 2 === 0 &&
    lines.every((l, i) => (i % 2 === 0 ? isTitleLine(l) : !isTitleLine(l)));
  if (alternates) {
    const items = [];
    for (let i = 0; i < lines.length; i += 2) {
      items.push({ title: lines[i], body: lines[i + 1] });
    }
    return [{ kind: "cards", items }];
  }

  return [{ kind: "prose", items: lines }];
}

/** Detect a "Label: rest of sentence" lead-in for emphasis rendering. */
export function splitLabel(p: string): { label?: string; text: string } {
  const m = p.match(/^([A-Z][A-Za-z0-9 '&/-]{2,42}):\s+([\s\S]+)$/);
  if (m && m[1].split(" ").length <= 5) {
    return { label: m[1], text: m[2] };
  }
  return { text: p };
}
