import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Clarion from "@/components/Clarion";
import Analytics from "@/components/Analytics";
import StickyCallBar from "@/components/StickyCallBar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Luxury Drug Rehab in Laguna Beach | Laguna View Detox",
    template: "%s | Laguna View Detox",
  },
  description: site.description,
  keywords: [
    "luxury drug rehab",
    "Laguna Beach detox",
    "alcohol detox",
    "drug detox Orange County",
    "residential inpatient rehab",
    "dual diagnosis treatment",
  ],
  icons: {
    icon: "/logos/favicon.png",
    apple: "/logos/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "Luxury Drug Rehab in Laguna Beach | Laguna View Detox",
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/images/NIK_5883-hero.jpg", width: 1920, height: 1281 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Drug Rehab in Laguna Beach | Laguna View Detox",
    description: site.description,
  },
  // NOTE: canonical is intentionally NOT set here. A layout-level canonical
  // applies to every page and would make all interior pages look like
  // duplicates of one URL. Each page sets its own self-referential canonical
  // via lib/seo.ts → pageMeta().
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    url: site.url,
    telephone: site.phoneRaw,
    image: `${site.url}/logos/logo-color.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    medicalSpecialty: "Addiction Medicine",
    priceRange: "$$$",
    sameAs: [
      site.social.google,
      site.social.facebook,
      site.social.instagram,
      site.social.youtube,
      site.social.yelp,
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Orange County, California" },
      { "@type": "State", name: "California" },
    ],
    hasMap: `https://maps.google.com/?q=${encodeURIComponent(site.address.full)}`,
    identifier: {
      "@type": "PropertyValue",
      name: "California DHCS License",
      value: "300024AP",
    },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {/* Call-tracking pixel (tctm.co) — swaps/tracks phone numbers for
            attribution. Loads early in <head>. The account ID is per-site. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src={`//${site.widgets.callTracking.accountId}.tctm.co/t.js`} />
      </head>
      <body>
        {/* Mark JS as available before paint so scroll-reveal can hide/animate
            content; without JS the content stays visible (see globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
        <StickyCallBar />
        {/* Clarion chat widget + form-capture script, loaded once. */}
        <Clarion />
        {/* useSearchParams needs a Suspense boundary or it opts the whole
            route out of static generation. */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
