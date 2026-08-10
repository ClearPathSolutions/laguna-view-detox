import { site } from "./site";

/**
 * Single source of truth for whose name may be published as an author.
 *
 * `lib/schema.ts` already refused to emit unconfirmed names into structured
 * data. This applies the same rule to the *visible* byline, so the two cannot
 * disagree — previously 13 posts rendered "By Kris Brace, CADC II" on the page
 * while deliberately omitting her from the JSON-LD, which is an incoherent
 * position: the credential was still published, just less machine-readably.
 *
 * Names here are confirmed against the QHG staff roster (bios doc, source 7).
 * "CADC II", "LCSW" and "AMFT" are licensure claims — on a YMYL healthcare site
 * an unverifiable one is the single item in this project with real regulatory
 * exposure, so the default is to withhold rather than assert.
 *
 * ⚠️ TO RESTORE A NAME: add it here once HR confirms employment and credential.
 * That is a one-line change and the byline reappears everywhere at once.
 *
 * Pending HR (issues.md T-42/T-43):
 *   - "Kris Brace, CADC II" — 13 posts. Absent from the current roster.
 *   - "Nick", "lagunaview" — internal handles, not publishable names anyway.
 *   - "Louis Iacona", "Sam Staples" — 1 post each, unverified.
 */
export const VERIFIED_AUTHORS: Record<string, { name: string; jobTitle?: string }> = {
  "Riky Hanaumi, LCSW": {
    name: "Riky Hanaumi, LCSW",
    jobTitle: "Clinical Director",
  },
};

export function isVerifiedAuthor(author: string): boolean {
  return Boolean(VERIFIED_AUTHORS[author.trim()]);
}

/**
 * The name to show a reader. Falls back to the organisation, which is accurate:
 * the post was published by Laguna View Detox regardless of which staffer or
 * contractor drafted it.
 */
export function displayAuthor(author: string): string {
  return isVerifiedAuthor(author) ? VERIFIED_AUTHORS[author.trim()].name : site.name;
}
