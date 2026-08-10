export const site = {
  name: "Laguna View Detox",
  shortName: "LVD",
  tagline: "World-Class Luxury Drug Rehab in Laguna Beach",
  description:
    "Escape drug & alcohol addiction at a luxury rehab in Laguna Beach that offers evidence-based detox and residential treatment that works. Get help today.",
  url: "https://lagunaviewdetox.com",
  phone: "(866) 932-3206",
  phoneHref: "tel:+18669323206",
  phoneRaw: "1-866-932-3206",
  email: "info@lagunaviewdetox.com",
  address: {
    street: "31305 Ceanothus Dr",
    city: "Laguna Beach",
    state: "CA",
    zip: "92651",
    full: "31305 Ceanothus Dr, Laguna Beach, CA 92651",
  },
  license: "DHCS License #300024AP",
  licenseExpiry: "01/31/2028",
  /**
   * California DHCS public licence record. QA row 1090 asked for the footer
   * licence number to link to the state's register so the claim is verifiable
   * rather than asserted.
   */
  licenseVerifyUrl:
    "https://geohub-cadhcs.hub.arcgis.com/datasets/63459617d2604decab840bd2ca047ee2_11/explore",
  social: {
    facebook: "https://www.facebook.com/lagunaViewDetox/",
    instagram: "https://www.instagram.com/lagunaviewdetox/",
    yelp: "https://www.yelp.com/biz/laguna-view-detox-laguna-beach",
    youtube: "https://www.youtube.com/channel/UC4PpcbTW5reQ61dQyHXDTYg",
    google: "https://g.page/r/CUMi-UYjQ10wEAI",
  },
  // Third-party widget config. The Clarion site key is the only per-site value
  // that changes when this stack is cloned to another property.
  widgets: {
    clarion: {
      siteKey: "cpx_T4KttBQTpAKWUWFZlFiNGOCnMr0pxPER",
      api: "https://api.clarionlabs.ai",
      widget: "https://www.clarionlabs.ai/widget.v1.js",
      formsCapture: "https://www.clarionlabs.ai/forms-capture.v1.js",
      // Blog posts are fetched server-side (see lib/blog.ts) rather than via the
      // client blog-embed script, so posts merge into the site's own blog list.
    },
    // Call-tracking pixel (tctm.co). The account ID lives in the script URL.
    callTracking: {
      accountId: "264810",
    },
  },
  /**
   * Google Business Profile *review request* URL from the facility master
   * record. Distinct from `social.google` (the profile): this deep-links
   * straight into the review composer, so it belongs on "leave us a review"
   * CTAs, not in navigation or `sameAs`.
   */
  googleReviewUrl: "https://g.page/r/CUMi-UYjQ10wEAI/review",
} as const;

export type NavColumn = {
  title: string;
  links: { label: string; href: string; note?: string }[];
};

export type NavItem = {
  label: string;
  href?: string;
  columns?: NavColumn[];
  feature?: { label: string; href: string; blurb: string; image: string };
};

export const nav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    columns: [
      {
        title: "Our Center",
        links: [
          { label: "About Laguna View", href: "/about" },
          { label: "Our Team", href: "/about#team" },
          { label: "Tour the Facility", href: "/tour" },
          { label: "The Luxury Experience", href: "/luxury-rehab" },
          { label: "Admissions", href: "/admissions" },
        ],
      },
    ],
    feature: {
      label: "Take a Tour",
      href: "/tour",
      blurb: "Step inside our oceanview estate in Laguna Beach.",
      image: "/images/lvd-tour-25.jpg",
    },
  },
  {
    label: "Programs",
    href: "/treatment",
    columns: [
      {
        title: "Levels of Care",
        links: [
          { label: "Medical Detox", href: "/treatment/detoxification" },
          { label: "Residential Inpatient", href: "/treatment/residential-inpatient" },
          { label: "Dual Diagnosis", href: "/treatment/dual-diagnosis" },
          { label: "Addiction Therapies", href: "/treatment/addiction-therapies" },
          { label: "Aftercare & Alumni", href: "/treatment/aftercare" },
        ],
      },
      {
        title: "What We Detox",
        links: [
          { label: "Alcohol", href: "/treatment/detoxification/alcohol" },
          { label: "Heroin & Opioids", href: "/treatment/detoxification/heroin" },
          { label: "Cocaine", href: "/treatment/detoxification/cocaine" },
          { label: "Meth", href: "/treatment/detoxification/meth" },
          { label: "Benzodiazepines", href: "/treatment/detoxification/benzodiazepines" },
        ],
      },
    ],
  },
  {
    label: "Who We Treat",
    columns: [
      {
        title: "Personalized Care",
        links: [
          { label: "Women", href: "/who-we-treat/women" },
          { label: "Men", href: "/who-we-treat/men" },
          { label: "Professionals", href: "/who-we-treat/professionals" },
          { label: "Young Adults", href: "/who-we-treat/young-adults" },
        ],
      },
      {
        title: " ",
        links: [
          { label: "College Students", href: "/who-we-treat/college-students" },
          { label: "Veterans", href: "/who-we-treat/veterans" },
          { label: "First Responders", href: "/who-we-treat/first-responders" },
        ],
      },
    ],
  },
  {
    label: "Locations",
    columns: [
      {
        title: "Southern California",
        links: [
          { label: "Orange County", href: "/locations/orange-county" },
          { label: "Newport Beach", href: "/locations/newport-beach" },
          { label: "Los Angeles", href: "/locations/los-angeles" },
        ],
      },
      {
        title: " ",
        links: [
          { label: "San Diego", href: "/locations/san-diego" },
          { label: "Ventura", href: "/locations/ventura" },
          { label: "All of California", href: "/locations/california" },
        ],
      },
    ],
  },
  {
    label: "Insurance",
    href: "/insurance",
    columns: [
      {
        title: "Verify Coverage",
        links: [
          { label: "Verify Your Insurance", href: "/insurance", note: "Free & confidential" },
          { label: "Anthem", href: "/insurance/anthem" },
          { label: "Aetna", href: "/insurance/aetna" },
          { label: "Blue Cross Blue Shield", href: "/insurance/bcbs" },
          { label: "Cigna", href: "/insurance/cigna" },
        ],
      },
      {
        title: " ",
        links: [
          { label: "ConnectiCare", href: "/insurance/connecticare" },
          { label: "MultiPlan", href: "/insurance/multiplan" },
          { label: "NYSHIP", href: "/insurance/nyship" },
          { label: "Oxford / Pilgrim", href: "/insurance/oxford-pilgrim" },
          { label: "Tufts Health Plan", href: "/insurance/tufts" },
        ],
      },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Flat mobile nav groups (accordion) — mirrors desktop but collapsible.
export const mobileNav = nav;
