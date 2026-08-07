import { site } from "@/lib/site";
import { testimonials } from "@/lib/data";
import { googleReviews, aggregate, hasVerifiedReviews } from "@/lib/reviews";
import { SectionHeading } from "./ui";
import JsonLd from "./JsonLd";
import { QuoteIcon, StarIcon, GoogleIcon, ArrowRightIcon } from "./icons";

/**
 * Social proof section — the "They Trusted Us With Their Recovery" block
 * requested across eight QA rows.
 *
 * Two modes, chosen by whether `lib/reviews.ts` holds real Google data:
 *
 *   • Verified reviews present → renders them with author, star rating and
 *     date, and emits `Review` + `aggregateRating` structured data.
 *   • Empty (today) → renders the on-site testimonials under an honest
 *     heading, with NO rating markup and NO claim that they came from Google.
 *
 * The distinction is deliberate. Presenting unattributed on-site quotes as
 * Google reviews, or deriving an aggregateRating from them, is fabricated
 * structured data.
 */
export default function Reviews({
  title = "They Trusted Us With Their Recovery",
  eyebrow = "Stories of Recovery",
  bg = "bg-sand-100",
}: {
  title?: string;
  eyebrow?: string;
  bg?: string;
}) {
  const verified = hasVerifiedReviews();
  const items = verified
    ? googleReviews.map((r) => ({ quote: r.text, name: r.author, rating: r.rating, date: r.date }))
    : testimonials.slice(0, 6).map((t) => ({ quote: t.quote, name: t.name, rating: 0, date: "" }));

  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <SectionHeading
          eyebrow={eyebrow}
          title={verified ? title : "We believe your recovery is possible."}
          lead={
            verified
              ? "Verified reviews from our Google Business Profile."
              : "Words from the clients and families who have walked through our doors."
          }
          align="center"
        />

        {verified && (
          <div className="mt-6 flex items-center justify-center gap-3 text-navy-900/70">
            <span className="flex text-gold-500" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className="h-5 w-5" />
              ))}
            </span>
            <span className="text-sm font-semibold">
              {aggregate.rating} average · {aggregate.count} Google reviews
            </span>
          </div>
        )}

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {items.map((t, i) => (
            <figure
              key={i}
              className="break-inside-avoid rounded-2xl bg-white p-7 shadow-soft ring-1 ring-navy-900/5 reveal"
            >
              {t.rating ? (
                <div className="flex text-gold-500" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <StarIcon key={s} className="h-4 w-4" aria-hidden="true" />
                  ))}
                </div>
              ) : (
                <QuoteIcon className="h-8 w-8 text-gold-300" aria-hidden="true" />
              )}
              <blockquote className="mt-4 leading-relaxed text-navy-900/80">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-serif text-sm font-semibold text-gold-300">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{t.name}</span>
                  {t.date && (
                    <time dateTime={t.date} className="block text-xs text-navy-900/50">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={site.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-navy"
          >
            <GoogleIcon className="h-4 w-4" />
            Read our Google reviews
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a
            href={site.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gold-700 underline underline-offset-4"
          >
            Leave us a review
          </a>
        </div>
      </div>

      {/* Only emitted when the reviews are real. */}
      {verified && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: site.name,
            url: site.url,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: aggregate.rating,
              reviewCount: aggregate.count,
            },
            review: googleReviews.map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.author },
              datePublished: r.date,
              reviewBody: r.text,
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: 5,
                worstRating: 1,
              },
            })),
          }}
        />
      )}
    </section>
  );
}
