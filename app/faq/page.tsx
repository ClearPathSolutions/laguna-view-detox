import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";
import JsonLd from "@/components/JsonLd";
import { faqGroups, allFaqs } from "@/lib/faq";
import { faqPageSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PhoneIcon, ChevronRightIcon } from "@/components/icons";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Answers about medical detox, residential treatment, dual diagnosis, insurance and what to expect at Laguna View Detox in Laguna Beach, CA.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        path="/faq"
        eyebrow="Answers"
        title="Frequently Asked Questions"
        subtitle={`${allFaqs.length} questions about detox, treatment, and what to expect — answered by our clinical team.`}
        image="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-009-Small.jpg"
        crumbs={[{ label: "FAQ" }]}
      />

      {/* One FAQPage covering every question rendered on this page. */}
      <JsonLd data={faqPageSchema(allFaqs)} />

      <section className="section bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            {/* Jump list */}
            <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-semibold uppercase tracking-eyebrow text-gold-700">
                Topics
              </p>
              <ul className="mt-4 space-y-1">
                {faqGroups.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className="block rounded-lg px-3 py-2 text-[15px] font-medium text-navy-900/75 transition-colors hover:bg-sand-100 hover:text-navy-900"
                    >
                      {g.title}
                      <span className="ml-1.5 text-xs text-navy-900/60">{g.faqs.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Groups. Rendered open — this is a reference page, so the answers
                should be readable (and indexable) without interaction. */}
            <div className="space-y-14">
              {faqGroups.map((g) => (
                <section key={g.id} id={g.id} className="scroll-mt-28">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="h-card !text-2xl">{g.title}</h2>
                    <Link
                      href={g.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700"
                    >
                      Read the full page
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                  <dl className="mt-6 divide-y divide-navy-900/10 overflow-hidden rounded-2xl bg-sand-50 ring-1 ring-navy-900/5">
                    {g.faqs.map((f, i) => (
                      <div key={i} className="px-6 py-5">
                        <dt className="font-serif text-lg font-medium text-navy-900">
                          {f.question}
                        </dt>
                        <dd className="mt-2 leading-relaxed text-navy-900/70">{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-navy-900 p-8 text-center text-white">
            <h2 className="font-serif text-2xl font-medium">Still have a question?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">
              Our admissions team answers the phone around the clock — no cost, no obligation, and
              completely confidential.
            </p>
            <a href={site.phoneHref} className="btn-gold mt-6">
              <PhoneIcon className="h-4 w-4" />
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
