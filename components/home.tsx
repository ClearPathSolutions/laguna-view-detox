import Link from "next/link";
import Image from "next/image";
import { programs, detoxTypes, whoWeTreat, testimonials } from "@/lib/data";
import { SectionHeading, TextLink } from "./ui";
import { ArrowRightIcon, QuoteIcon, WaveIcon, LeafIcon, HeartIcon } from "./icons";

/* ---------- Intro: A Luxury Experience ---------- */
export function IntroSection() {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative">
            <div className="relative overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/NIK_9847-scaled.jpg"
                alt="Bright, comfortable guest bedroom at Laguna View Detox"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] rounded-2xl bg-gold p-6 text-navy-900 shadow-lift sm:block lg:-right-8">
              <p className="font-serif text-4xl font-semibold">180°</p>
              <p className="mt-1 text-sm font-medium leading-tight">
                Unobstructed Pacific Ocean views from our estate
              </p>
            </div>
          </div>

          <div className="reveal">
            <SectionHeading
              eyebrow="A Luxury Experience"
              title="Escape addiction in beautiful Laguna Beach."
            />
            <div className="prose-body mt-6">
              <p>
                At our luxury drug rehab in Laguna, we understand that achieving and maintaining
                sobriety should include mind-body wellness and the dignity to realize the infinite
                potential you have to live the life you deserve.
              </p>
              <p>
                Our caring and professional staff are dedicated to providing the best possible care
                to each and every client — combining holistic treatment modalities with
                evidence-based practices to build a strong foundation in early recovery.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                { Icon: HeartIcon, label: "Personalized, dignified care" },
                { Icon: LeafIcon, label: "Holistic mind-body wellness" },
                { Icon: WaveIcon, label: "Serene oceanview setting" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-navy-900/80">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <TextLink href="/about">Learn more about our approach</TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Levels of Care ---------- */
export function LevelsOfCare() {
  return (
    <section className="section bg-sand-50 bg-grid-navy">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our Levels of Care"
            title="Quality treatment services, every step of the way."
            lead="From medically supervised detox to residential care and lifelong alumni support, we meet you wherever you are on the path to recovery."
          />
          <Link href="/treatment" className="btn-outline-navy shrink-0">
            View All Programs
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => (
            <Link
              key={p.slug}
              href={p.href}
              className="card group reveal flex flex-col hover:-translate-y-1.5 hover:shadow-card"
              data-delay={i * 80}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="h-card !text-xl">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70">{p.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Detox sub-types strip */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
          <span className="text-sm font-semibold text-navy-900">We safely detox from:</span>
          {detoxTypes.map((d) => (
            <Link
              key={d.slug}
              href={d.href}
              className="rounded-full bg-sand-100 px-4 py-1.5 text-sm font-medium text-navy-900/80 transition-colors hover:bg-gold hover:text-navy-900"
            >
              {d.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Facility Feature ---------- */
export function FacilityFeature() {
  return (
    <section className="section relative overflow-hidden bg-navy-950 text-white">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal order-2 lg:order-1">
            <p className="eyebrow text-gold-300">
              <span className="h-px w-6 bg-gold-400" />
              Comfortable &amp; Safe
            </p>
            <h2 className="h-section mt-4 !text-white">The Laguna Recovery Center</h2>
            <div className="mt-6 space-y-4 text-white/75">
              <p className="leading-[1.8]">
                Our luxury drug rehab in Laguna Beach provides medication-assisted detox services to
                those suffering from substance use and co-occurring disorders. Within the serene,
                home-like environment of our treatment center, we prioritize safety and security to
                make detox more comfortable and far less perilous.
              </p>
              <p className="leading-[1.8]">
                Upon completion of detox, clients can continue into our Residential Treatment
                Program. Distinguished by a top-tier clinical team, we combine holistic modalities
                with evidence-based practices to establish a robust foundation in early recovery.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { v: "2015", l: "Serving families since" },
                { v: "6", l: "Private beds" },
                { v: "24/7", l: "Medical oversight" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-3xl font-semibold text-gold-400 sm:text-4xl">
                    {s.v}
                  </div>
                  <div className="mt-1.5 text-xs leading-tight text-white/60">{s.l}</div>
                </div>
              ))}
            </div>

            <Link href="/tour" className="btn-gold mt-9">
              Tour Our Facility
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="reveal order-1 grid grid-cols-2 gap-4 lg:order-2">
            <div className="mt-8 overflow-hidden rounded-2xl">
              <Image
                src="/images/lvd-tour-12.jpg"
                alt="Comfortable common living area"
                width={700}
                height={500}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/lvd-pool-3.jpg"
                alt="Outdoor pool and patio overlooking the coast"
                width={700}
                height={500}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <Image
                src="/images/NIK_5789-scaled.jpg"
                alt="Modern kitchen and dining area at Laguna View Detox"
                width={1200}
                height={700}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Who We Treat ---------- */
export function WhoWeTreatGrid() {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Personalized For You"
          title="Compassionate care for every journey."
          lead="Addiction affects everyone differently. Our programs are tailored to the unique needs of the people we serve."
          align="center"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whoWeTreat.map((w, i) => (
            <Link
              key={w.slug}
              href={`/who-we-treat/${w.slug}`}
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl reveal"
              data-delay={(i % 4) * 70}
            >
              <Image
                src={w.image}
                alt={w.label}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 to-navy-950/5 transition-colors duration-300 group-hover:from-navy-950/95 group-hover:via-navy-950/60" />
              <div className="relative p-5">
                <h3 className="font-serif text-xl font-semibold text-white text-shadow-hero">{w.label}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-sm leading-snug text-white/85 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                  {w.blurb}
                </p>
              </div>
            </Link>
          ))}
          {/* Fill the 8th cell with a CTA tile for a balanced 2x4 grid */}
          <Link
            href="/admissions"
            className="group flex aspect-[4/5] flex-col justify-between rounded-2xl bg-navy p-6 text-white reveal"
            data-delay={210}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-300">
              <HeartIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif text-xl font-semibold">Not sure where to start?</h3>
              <p className="mt-2 text-sm text-white/70">
                Our admissions team will help you find the right fit.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
                See how it works
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
export function Testimonials() {
  return (
    <section className="section bg-sand-100">
      <div className="container-x">
        <SectionHeading
          eyebrow="Stories of Recovery"
          title="We believe your recovery is possible."
          lead="Real words from the clients and families who have walked through our doors."
          align="center"
        />
        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="break-inside-avoid rounded-2xl bg-white p-7 shadow-soft ring-1 ring-navy-900/5 reveal"
            >
              <QuoteIcon className="h-8 w-8 text-gold-300" />
              <blockquote className="mt-4 leading-relaxed text-navy-900/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-serif text-sm font-semibold text-gold-300">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-navy-900">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
