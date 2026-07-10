import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  YelpIcon,
} from "@/components/icons";

export const metadata = pageMeta({
  title: "Contact Us",
  description:
    "Contact Laguna View Detox 24/7. Call our confidential admissions line or request a callback. Located at 31305 Ceanothus Dr, Laguna Beach, CA 92651.",
  path: "/contact",
});

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  { label: "Yelp", href: site.social.yelp, Icon: YelpIcon },
];

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    site.address.full
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="We're Here to Help"
        title="Contact Laguna View Detox"
        subtitle="Our caring, compassionate team is available around the clock, eager to help you begin your path to freedom from addiction — on your terms."
        image="/images/lvd-tour-22.jpg"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Info */}
            <div className="reveal">
              <p className="eyebrow">
                <span className="h-px w-6 bg-gold-400" />
                Reach Out Anytime
              </p>
              <h2 className="h-section mt-4">Let&apos;s talk — confidentially.</h2>
              <p className="lead mt-5">
                If speaking on the phone doesn&apos;t suit you, request a callback and we&apos;ll
                reach out on your schedule. Your journey to recovery begins with the support you
                need.
              </p>

              <div className="mt-9 space-y-4">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-5 transition-colors hover:border-gold hover:bg-gold/5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold-300">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-navy-900/60">Confidential 24/7 admissions</span>
                    <span className="font-serif text-xl font-semibold text-navy-900">
                      {site.phone}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold-300">
                    <MapPinIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-navy-900/60">Our facility</span>
                    <span className="font-medium text-navy-900">{site.address.full}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold-300">
                    <ClockIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-navy-900/60">Hours</span>
                    <span className="font-medium text-navy-900">Open 24 hours · 7 days a week</span>
                  </span>
                </div>

                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-5 transition-colors hover:border-gold hover:bg-gold/5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold-300">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-navy-900/60">Email</span>
                    <span className="font-medium text-navy-900">{site.email}</span>
                  </span>
                </a>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-navy-900">Follow our community</p>
                <div className="mt-3 flex gap-3">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-900/70 transition-all hover:border-gold hover:bg-gold hover:text-navy-900"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="reveal">
              <div className="rounded-3xl bg-sand-50 p-7 shadow-soft ring-1 ring-navy-900/5 sm:p-9">
                <h2 className="font-serif text-2xl font-medium text-navy-900">
                  Request a confidential callback
                </h2>
                <p className="mt-2 text-sm text-navy-900/70">
                  Fill out the form and a member of our admissions team will reach out shortly.
                </p>
                <div className="mt-6">
                  <LeadForm variant="contact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="relative h-[420px] w-full bg-sand-100">
        <iframe
          title="Laguna View Detox location map"
          src={mapSrc}
          className="h-full w-full border-0 grayscale-[0.2]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
