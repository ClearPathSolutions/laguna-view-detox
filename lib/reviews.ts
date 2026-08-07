/**
 * Google Business Profile reviews.
 *
 * ⚠️ THIS ARRAY MUST ONLY EVER CONTAIN REAL, VERIFIABLE GOOGLE REVIEWS.
 *
 * Eight rows in the QA tracker ask for a "They Trusted Us With Their Recovery"
 * Google reviews section. The component and its placements are built and
 * shipped; this file is the only thing missing, and it is deliberately empty
 * rather than seeded.
 *
 * The six quotes in `lib/data.ts` are unattributed testimonials captured from
 * the old site. They are NOT Google reviews, they carry no rating, and copying
 * them here would turn `Review` / `aggregateRating` structured data into
 * fabricated markup — a manual-action risk with Google and a misrepresentation
 * on a healthcare site.
 *
 * To populate, either:
 *   1. Paste real reviews from the profile — https://g.page/r/CUMi-UYjQ10wEAI
 *      keeping author, rating and date exactly as published; or
 *   2. Wire the Google Places API `place_details` reviews field and generate
 *      this file at build time.
 *
 * Until then `<Reviews>` renders the on-site testimonials under an honest
 * heading and links out to the profile. No schema is emitted while this is
 * empty — see components/Reviews.tsx.
 */

export type GoogleReview = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date, e.g. "2026-05-14" */
  date: string;
  text: string;
};

export const googleReviews: GoogleReview[] = [];

/** Only meaningful once real reviews exist. */
export const aggregate = {
  get count() {
    return googleReviews.length;
  },
  get rating() {
    if (!googleReviews.length) return 0;
    const sum = googleReviews.reduce((n, r) => n + r.rating, 0);
    return Math.round((sum / googleReviews.length) * 10) / 10;
  },
};

export const hasVerifiedReviews = () => googleReviews.length > 0;
