import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import {
  PhoneIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  YelpIcon,
} from "./icons";

const columns = [
  {
    title: "Programs",
    links: [
      { label: "Medical Detox", href: "/treatment/detoxification" },
      { label: "Residential Inpatient", href: "/treatment/residential-inpatient" },
      { label: "Dual Diagnosis", href: "/treatment/dual-diagnosis" },
      { label: "Addiction Therapies", href: "/treatment/addiction-therapies" },
      { label: "Aftercare & Alumni", href: "/treatment/aftercare" },
      { label: "Drug Addiction Treatment", href: "/drug-addiction-treatment" },
      { label: "Alcohol Detox & Rehab", href: "/alcohol-detox-and-treatment-programs" },
    ],
  },
  {
    title: "Who We Treat",
    links: [
      { label: "Women", href: "/who-we-treat/women" },
      { label: "Men", href: "/who-we-treat/men" },
      { label: "Professionals", href: "/who-we-treat/professionals" },
      { label: "Veterans", href: "/who-we-treat/veterans" },
      { label: "First Responders", href: "/who-we-treat/first-responders" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Tour the Facility", href: "/tour" },
      { label: "Admissions", href: "/admissions" },
      { label: "Verify Insurance", href: "/insurance" },
      { label: "The Luxury Experience", href: "/luxury-addiction-treatment" },
      { label: "Recovery Blog", href: "/blog" },
    ],
  },
];

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  { label: "Yelp", href: site.social.yelp, Icon: YelpIcon },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="eyebrow text-gold-300">Reset with Recovery</p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-white sm:text-4xl">
              Your journey to recovery begins today.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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

      {/* Main footer */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Laguna View Detox home">
            <Image
              src="/logos/logo-white.png"
              alt="Laguna View Detox"
              width={120}
              height={114}
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            At Laguna View Detox our mission is to provide quality, evidence-based treatment that
            leads to long-term recovery for every client who walks through our doors.
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-white">
              <PhoneIcon className="h-4 w-4 text-gold-300" />
              {site.phone}
            </a>
            <p className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {site.address.full}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-gold hover:bg-gold hover:text-navy-900"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold uppercase tracking-eyebrow text-gold-300">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accreditation */}
        <div className="lg:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-eyebrow text-gold-300">
            Licensed & Accredited
          </p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
              <Image
                src="/logos/joint-commission.png"
                alt="Joint Commission Accredited"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl bg-white px-3 py-2">
              <Image
                src="/logos/dhcs.png"
                alt="California DHCS Licensed"
                width={110}
                height={54}
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Accredited by The Joint Commission. Licensed by the State of California Department of
            Health Care Services. {site.license} · Expires {site.licenseExpiry}.
          </p>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Laguna View Detox. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
