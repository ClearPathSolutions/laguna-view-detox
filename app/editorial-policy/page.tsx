import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Editorial Policy",
  description:
    "How Laguna View Detox researches, writes, reviews and updates its addiction and mental health content, and the sources and standards we hold it to.",
  path: "/editorial-policy",
});

const sections: { h: string; p: string[] }[] = [
  {
    h: "Why we publish",
    p: [
      "People researching detox and treatment are often making an urgent decision for themselves or someone they love, frequently in the middle of a crisis. The information they find should help them decide clearly, not push them toward a sale. Everything we publish is written to that standard.",
      "Our content is educational. It does not diagnose, treat, or replace an assessment by a qualified clinician, and nothing on this site should be read as a promise about anyone's individual outcome.",
    ],
  },
  {
    h: "Who writes and reviews our content",
    p: [
      "Clinical and treatment content is written by staff and professional writers who work in behavioral health, and is reviewed by licensed clinicians on our team before it is published. Where a page carries a byline, the named author wrote it and the named reviewer read and approved it — we do not attach a clinician's name to work they have not reviewed.",
      "Reviewers hold current, relevant credentials, and we identify those credentials on the page so readers can weigh them.",
    ],
  },
  {
    h: "How we use sources",
    p: [
      "We cite recognized public-health and peer-reviewed sources — including SAMHSA, the National Institute on Drug Abuse, the National Institute on Alcohol Abuse and Alcoholism, and the CDC. Statistics are attributed to the body that published them, and we prefer primary sources to secondary reporting.",
      "Where evidence is mixed or evolving, we say so rather than presenting one position as settled.",
    ],
  },
  {
    h: "What we will not publish",
    p: [
      "We do not guarantee outcomes, promise a cure, or claim success rates we cannot substantiate. We do not use fear or shame to prompt a call. We do not publish reviews or testimonials we cannot verify, and we do not present testimonials as though they were independent reviews.",
      "We do not use a person's story without their permission, and we protect the confidentiality of everyone who has been treated here.",
    ],
  },
  {
    h: "Accuracy, corrections and updates",
    p: [
      "Pages are reviewed periodically and updated when clinical guidance, statistics, or our programs change. Where a page shows a last-updated date, that date reflects a genuine review rather than an automated timestamp.",
      "If you find something inaccurate or out of date, tell us and we will correct it. Substantive corrections are made to the page itself rather than quietly removed.",
    ],
  },
  {
    h: "Advertising and independence",
    p: [
      "We are a treatment provider, and this site exists in part so people can find our programs. We do not accept payment to feature or recommend other providers, and no third party pays for placement in our editorial content.",
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Standards"
        title="Editorial Policy"
        subtitle="How we research, write, review and update the information on this site."
        image="/images/NIK_5848-scaled.jpg"
        crumbs={[{ label: "Editorial Policy" }]}
        path="/editorial-policy"
      />

      <section className="section bg-white">
        <div className="container-x max-w-prose">
          {sections.map((s) => (
            <div key={s.h} className="mb-10">
              <h2 className="h-card !text-2xl">{s.h}</h2>
              <div className="prose-body mt-4">
                {s.p.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-navy-900/5">
            <p className="text-sm leading-relaxed text-navy-900/75">
              Questions or a correction? Call{" "}
              <a href={site.phoneHref} className="font-semibold text-gold-700 underline">
                {site.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-gold-700 underline">
                {site.email}
              </a>
              . See also our{" "}
              <Link href="/privacy-policy" className="font-semibold text-gold-700 underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
