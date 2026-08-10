import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Laguna View Detox collects, uses, and protects your personal information.",
  path: "/privacy-policy",
});

/**
 * Editorial date — the last time this policy's text actually changed. Bump it
 * by hand when the policy is revised. It must NOT be derived from the current
 * date: an auto-incrementing "last updated" would assert a revision that never
 * happened, which is exactly the wrong behaviour for a privacy notice.
 * TODO(legal): confirm the true last-revision date and correct if needed.
 */
const LAST_UPDATED = "July 2026";

const sections = [
  {
    h: "Our Commitment to Your Privacy",
    p: [
      "Laguna View Detox is committed to protecting the privacy and confidentiality of every person who contacts us or visits this website. This Privacy Policy explains what information we collect, how we use it, and the choices you have.",
      "Because we are a healthcare provider, we treat any information you share with the utmost confidentiality and in accordance with applicable state and federal law, including HIPAA where it applies.",
    ],
  },
  {
    h: "Information We Collect",
    p: [
      "We collect information you voluntarily provide — such as your name, phone number, email address, and any details you share when you call us, submit a form, or verify insurance. We may also collect limited technical information automatically, such as your IP address, browser type, and pages visited, to improve our website.",
    ],
  },
  {
    h: "How We Use Your Information",
    p: [
      "We use the information you provide to respond to your inquiries, verify insurance benefits, coordinate admissions and care, and communicate with you about treatment. We do not sell your personal information. We share information only with staff and partners who help us provide care, and only as permitted by law.",
    ],
  },
  {
    h: "Confidentiality of Health Information",
    p: [
      "Any protected health information you share is handled in accordance with HIPAA and 42 CFR Part 2 where applicable. Your enrollment in, or contact with, a substance use treatment program is kept strictly confidential.",
    ],
  },
  {
    h: "Cookies & Analytics",
    p: [
      "This website may use cookies and analytics tools to understand how visitors use the site. You can disable cookies in your browser settings, though some features may not function as intended.",
    ],
  },
  {
    h: "Your Choices",
    p: [
      "You may opt out of marketing communications at any time by contacting us. You may also request that we correct or delete the personal information you have provided, subject to legal and clinical record-keeping requirements.",
    ],
  },
  {
    h: "Contact Us",
    p: [
      `If you have questions about this Privacy Policy or how your information is handled, please contact us at ${site.phone} or visit us at ${site.address.full}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        path="/privacy-policy"
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy and confidentiality are foundational to the care we provide."
        image="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-021-Small.jpg"
        crumbs={[{ label: "Privacy Policy" }]}
      />
      <section className="section bg-white">
        <div className="container-x max-w-prose">
          {sections.map((s) => (
            <div key={s.h} className="mb-9">
              <h2 className="h-card !text-2xl">{s.h}</h2>
              <div className="prose-body mt-4">
                {s.p.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-4 text-sm text-navy-900/60">
            This policy may be updated from time to time. Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>
    </>
  );
}
