import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { SectionHeading } from "./ui";
import { PhoneIcon, ShieldIcon, CheckIcon } from "./icons";

/* ------------------------------------------------------------------ */
/* Recovery CTA band — deep navy with the coastal photo                */
/* ------------------------------------------------------------------ */
export function CtaBand({
  title = "Ready to Experience Recovery?",
  text = "Request a confidential callback to speak with our caring admissions team now. Most major PPO insurance providers will help cover the cost of treatment.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 lg:py-28">
      <Image
        src="/images/NIK_5928-cta.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/60" />
      <div className="container-x relative">
        <div className="max-w-2xl reveal">
          <p className="eyebrow text-gold-300">
            <span className="h-px w-6 bg-gold-400" />
            We Believe Your Recovery Is Possible
          </p>
          <h2 className="h-section mt-4 !text-white">{title}</h2>
          <p className="lead mt-5 !text-white/80">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn-gold">
              <PhoneIcon className="h-4 w-4" />
              Call {site.phone}
            </a>
            <Link href="/contact" className="btn-outline">
              Request a Callback
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Insurance verification band                                         */
/* ------------------------------------------------------------------ */
export function InsuranceBand() {
  return (
    <section className="section-sm bg-sand-100">
      <div className="container-x">
        <div className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-soft ring-1 ring-navy-900/5 lg:grid-cols-2 lg:p-12 reveal">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-gold-400" />
              We Work With Most Insurance
            </p>
            <h2 className="h-section mt-4">Your treatment may be fully covered.</h2>
            <p className="lead mt-5">
              Laguna View Detox works with most PPO &amp; POS insurance carriers. Find out in minutes
              whether your plan will help cover the cost of our program — free, confidential, and with
              no obligation.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {["Anthem", "Aetna", "Blue Cross Blue Shield", "Cigna", "MultiPlan", "Oxford / Pilgrim"].map(
                (c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-navy-900/75">
                    <CheckIcon className="h-4 w-4 text-gold-600" />
                    {c}
                  </li>
                )
              )}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/insurance" className="btn-navy">
                <ShieldIcon className="h-4 w-4" />
                Verify Your Insurance
              </Link>
              <a href={site.phoneHref} className="btn-outline-navy">
                <PhoneIcon className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-sand-50 p-6 ring-1 ring-navy-900/5">
            <Image
              src="/logos/insurance-carriers.png"
              alt="Accepted insurance carriers including Anthem, Aetna, Blue Cross Blue Shield, Cigna and more"
              width={900}
              height={600}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Admissions steps                                                    */
/* ------------------------------------------------------------------ */
const steps = [
  {
    n: "01",
    title: "Contact Us 24/7",
    text: "Reach our caring, compassionate admissions team day or night. They've been in your shoes and will help you find the options that work best for you.",
  },
  {
    n: "02",
    title: "Customized Solutions",
    text: "We work hard to find the treatment options that fit your personal situation — at no cost or obligation. We truly care about helping others.",
  },
  {
    n: "03",
    title: "Find Recovery",
    text: "Once we determine our program is the right fit, we help you prepare for treatment — from travel assistance to FMLA paperwork, we have you covered.",
  },
];

export function AdmissionsSteps({ withBg = true }: { withBg?: boolean }) {
  return (
    <section className={`section ${withBg ? "bg-white" : ""}`}>
      <div className="container-x">
        <SectionHeading
          eyebrow="We Make Getting Help Easy"
          title="Our Admissions Process"
          lead="Getting started is simple. Three caring steps stand between you and a life in recovery."
          align="center"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="card reveal p-8 hover:-translate-y-1 hover:shadow-card"
              data-delay={i * 90}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lg font-semibold text-gold-300">
                {s.n}
              </div>
              <h3 className="h-card mt-6">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-navy-900/70">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a href={site.phoneHref} className="btn-navy">
            <PhoneIcon className="h-4 w-4" />
            Ready to Get Started? Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Accreditation / trust bar                                           */
/* ------------------------------------------------------------------ */
export function TrustBar() {
  return (
    <section className="border-y border-navy-900/10 bg-white">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-8 text-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/joint-commission.png"
            alt="Joint Commission Accredited"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="text-left text-sm font-medium leading-tight text-navy-900/70">
            Joint Commission
            <br />
            Accredited
          </span>
        </div>
        <span className="hidden h-8 w-px bg-navy-900/10 sm:block" />
        <div className="flex items-center gap-3">
          <Image
            src="/logos/dhcs.png"
            alt="California DHCS Licensed"
            width={90}
            height={44}
            className="h-11 w-auto object-contain"
          />
          <span className="text-left text-sm font-medium leading-tight text-navy-900/70">
            State of California
            <br />
            DHCS Licensed
          </span>
        </div>
        <span className="hidden h-8 w-px bg-navy-900/10 sm:block" />
        <div className="text-sm font-medium text-navy-900/70">
          <span className="font-serif text-2xl font-semibold text-gold-600">24/7</span>
          <br />
          Confidential Admissions
        </div>
        <span className="hidden h-8 w-px bg-navy-900/10 sm:block" />
        <div className="text-sm font-medium text-navy-900/70">
          <span className="font-serif text-2xl font-semibold text-gold-600">6-Bed</span>
          <br />
          Private Facility
        </div>
      </div>
    </section>
  );
}
