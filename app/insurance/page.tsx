import Link from "next/link";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { CtaBand } from "@/components/sections";
import { SectionHeading, Bullet } from "@/components/ui";
import { carriers } from "@/lib/data";
import { ArrowRightIcon, ShieldIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Verify Your Insurance | Drug Rehab Coverage",
  description:
    "Laguna View Detox works with most PPO & POS insurance carriers. Verify your benefits in minutes — free, confidential, and with no obligation.",
  path: "/insurance",
});

export default function InsurancePage() {
  return (
    <>
      <PageHero
        path="/insurance"
        eyebrow="Insurance Verification"
        title="Verify Your Insurance Coverage"
        subtitle="Most major PPO insurance providers will help cover the cost of treatment. Find out your benefits in minutes — free, confidential, and with no obligation."
        image="/images/20230113-03-31305ceanothusdr-lagunabeach-ca-021-Small.jpg"
        crumbs={[{ label: "Insurance" }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
            {/* Left: info */}
            <div className="reveal">
              <SectionHeading
                eyebrow="We Work With Most Insurance"
                title="Your treatment may be fully covered."
                lead="Laguna View Detox works with most PPO & POS insurance carriers. Submit the secure form and our admissions team will confirm your benefits — there's no cost and no obligation to enter treatment."
              />

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                <Bullet>Confidential benefits check</Bullet>
                <Bullet>Answer in minutes, not days</Bullet>
                <Bullet>No cost &amp; no obligation</Bullet>
                <Bullet>Out-of-network options available</Bullet>
              </ul>

              <div className="mt-12">
                <p className="text-sm font-semibold uppercase tracking-eyebrow text-gold-600">
                  Carriers We Work With
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {carriers.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/insurance/${c.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-navy-900/10 px-5 py-4 transition-colors hover:border-gold hover:bg-gold/5"
                    >
                      <span className="font-medium text-navy-900">{c.label}</span>
                      <ArrowRightIcon className="h-4 w-4 text-gold-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-sm text-navy-900/60">
                  Don&apos;t see your provider? We work with many more — just ask.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div className="reveal lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-sand-50 p-7 shadow-soft ring-1 ring-navy-900/5 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold-300">
                    <ShieldIcon className="h-5 w-5" />
                  </span>
                  <h2 className="font-serif text-2xl font-medium text-navy-900">
                    Check your coverage
                  </h2>
                </div>
                <p className="mt-3 text-sm text-navy-900/70">
                  Complete the secure form below and we&apos;ll get right back to you.
                </p>
                <div className="mt-6">
                  <LeadForm variant="insurance" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
