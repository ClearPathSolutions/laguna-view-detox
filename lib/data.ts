/* Structured site data derived from lagunaviewdetox.com content. */

export type Program = {
  slug: string;
  title: string;
  short: string;
  blurb: string;
  image: string;
  href: string;
};

export const programs: Program[] = [
  {
    slug: "detoxification",
    title: "Medical Detox",
    short: "Detox",
    blurb:
      "A state-of-the-art, physician-led drug & alcohol detox that is safe and effective, with 24/7 monitoring in our Orange County estate.",
    image: "/images/lvd-tour-25.jpg",
    href: "/treatment/detoxification",
  },
  {
    slug: "residential-inpatient",
    title: "Residential Inpatient",
    short: "Inpatient",
    blurb:
      "An evidence-based residential program that offers world-class, world-tested methods in a comfortable, home-like setting.",
    image: "/images/lvd-tour-12.jpg",
    href: "/treatment/residential-inpatient",
  },
  {
    slug: "dual-diagnosis",
    title: "Dual Diagnosis",
    short: "Dual Diagnosis",
    blurb:
      "We treat the root causes of addiction by addressing both co-occurring mental health disorders and substance use together.",
    image: "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-004-Small.jpg",
    href: "/treatment/dual-diagnosis",
  },
  {
    slug: "aftercare",
    title: "Aftercare & Alumni",
    short: "Aftercare",
    blurb:
      "Thorough aftercare planning and alumni programming keep clients connected to the recovery community long after they leave.",
    image: "/images/lvd-tour-22.jpg",
    href: "/treatment/aftercare",
  },
];

export const detoxTypes = [
  { slug: "alcohol", label: "Alcohol", href: "/treatment/detoxification/alcohol" },
  { slug: "heroin", label: "Heroin & Opioids", href: "/treatment/detoxification/heroin" },
  { slug: "cocaine", label: "Cocaine", href: "/treatment/detoxification/cocaine" },
  { slug: "meth", label: "Meth", href: "/treatment/detoxification/meth" },
  {
    slug: "benzodiazepines",
    label: "Benzodiazepines",
    href: "/treatment/detoxification/benzodiazepines",
  },
];

export type WhoWeTreat = {
  slug: string;
  label: string;
  contentSlug: string;
  blurb: string;
  image: string;
};

export const whoWeTreat: WhoWeTreat[] = [
  {
    slug: "women",
    label: "Women",
    contentSlug: "women",
    blurb: "Gender-responsive care that addresses the unique needs of women in recovery.",
    image: "/images/Women-in-Therapy-scaled.jpg",
  },
  {
    slug: "men",
    label: "Men",
    contentSlug: "men",
    blurb: "Focused, judgment-free treatment designed around the realities men face.",
    image: "/images/nik-shuliahin-BuNWp1bL0nc-unsplash-scaled.jpg",
  },
  {
    slug: "professionals",
    label: "Professionals",
    contentSlug: "professionals",
    blurb: "Discreet, flexible care for executives and working professionals.",
    image: "/images/scott-graham-OQMZwNd3ThU-unsplash-scaled.jpg",
  },
  {
    slug: "young-adults",
    label: "Young Adults",
    contentSlug: "young-adults",
    blurb: "Age-appropriate treatment that meets young adults where they are.",
    image: "/images/vasily-koloda-8CqDvPuo_kI-unsplash-scaled.jpg",
  },
  {
    slug: "college-students",
    label: "College Students",
    contentSlug: "college-students",
    blurb: "Support that helps students heal without losing their momentum.",
    image: "/images/shutterstock_1208448832-scaled.jpg",
  },
  {
    slug: "veterans",
    label: "Veterans",
    contentSlug: "veterans",
    blurb: "Trauma-informed care honoring those who served our country.",
    image: "/images/shutterstock_377243737-scaled.jpg",
  },
  {
    slug: "first-responders",
    label: "First Responders",
    contentSlug: "first-responders",
    blurb: "Confidential treatment for the people who answer our calls for help.",
    image: "/images/rehab-for-firefighters-scaled.jpg",
  },
];

export type LocationItem = {
  slug: string;
  label: string;
  contentSlug: string;
  region: string;
};

export const locations: LocationItem[] = [
  { slug: "orange-county", label: "Orange County", contentSlug: "orange-county-drug-rehab", region: "Southern California" },
  { slug: "newport-beach", label: "Newport Beach", contentSlug: "newport-beach", region: "Southern California" },
  { slug: "los-angeles", label: "Los Angeles", contentSlug: "los-angeles", region: "Southern California" },
  { slug: "san-diego", label: "San Diego", contentSlug: "san-diego", region: "Southern California" },
  { slug: "ventura", label: "Ventura", contentSlug: "ventura", region: "Southern California" },
  { slug: "california", label: "All of California", contentSlug: "california", region: "Statewide" },
];

export type Carrier = {
  slug: string;
  label: string;
  contentSlug: string;
};

export const carriers: Carrier[] = [
  { slug: "anthem", label: "Anthem", contentSlug: "anthem" },
  { slug: "aetna", label: "Aetna", contentSlug: "aetna" },
  { slug: "bcbs", label: "Blue Cross Blue Shield", contentSlug: "bcbs" },
  { slug: "cigna", label: "Cigna", contentSlug: "cigna" },
  { slug: "connecticare", label: "ConnectiCare", contentSlug: "connecticare" },
  { slug: "multiplan", label: "MultiPlan", contentSlug: "multiplan" },
  { slug: "nyship", label: "NYSHIP", contentSlug: "nyship" },
  { slug: "oxford-pilgrim", label: "Oxford / Pilgrim", contentSlug: "oxford-pilgrim" },
  { slug: "tufts", label: "Tufts Health Plan", contentSlug: "tufts" },
];

export type Testimonial = { quote: string; name: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Laguna View Detox was an amazing experience. The staff is patient, caring, and go above and beyond to make you feel comfortable.",
    name: "Alicia M.",
  },
  {
    quote:
      "Oceanfront facility with incredible staff and clinical care. Laguna View Detox helped save the life of a loved one for me.",
    name: "Michael S.",
  },
  {
    quote:
      "Beyond grateful for my experience at Laguna View. Staff is very professional but also comforting at the same time, which I've noticed is difficult to find.",
    name: "Chris L.",
  },
  {
    quote:
      "We were treated as humans, not numbers. At the drop of a hat, anything you needed was brought to you as quickly as they could. True integrity.",
    name: "Colin I.",
  },
  {
    quote:
      "I can't express enough how amazing this place is! The staff is by far the most loving and helpful people I have come across in treatment.",
    name: "Luke L.",
  },
  {
    quote:
      "LVD is head and shoulders above all the other detox facilities that I visit on a weekly basis. I always enjoy coming to this beautiful location.",
    name: "Frank S.",
  },
];

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image?: string;
  contentSlug: string;
};

export const team: TeamMember[] = [
  {
    slug: "karen-pettit",
    name: "Karen Pettit",
    role: "CADC II · Program Director",
    image: "/images/team-karen-pettit.jpeg",
    contentSlug: "karen-pettit",
  },
  {
    slug: "david-goodgame",
    name: "David Goodgame",
    role: "Program Director",
    image: "/images/team-david-goodgame.jpeg",
    contentSlug: "david-goodgame",
  },
  {
    slug: "nicole-burson",
    name: "Nicole Burson",
    role: "Clinical Team",
    contentSlug: "nicole-burson",
  },
];

/* Curated facility gallery for the Tour page. */
export const gallery: { src: string; alt: string }[] = [
  { src: "/images/lvd-tour-25.jpg", alt: "Private bedroom with ocean-inspired décor" },
  { src: "/images/lvd-tour-12.jpg", alt: "Comfortable common living area" },
  { src: "/images/lvd-tour-22.jpg", alt: "Bright shared lounge space" },
  { src: "/images/lvd-pool-3.jpg", alt: "Outdoor pool and patio" },
  { src: "/images/NIK_9847-scaled.jpg", alt: "Guest bedroom with two beds" },
  { src: "/images/NIK_5789-scaled.jpg", alt: "Modern kitchen and dining area" },
  { src: "/images/NIK_5848-scaled.jpg", alt: "Elegant interior living space" },
  { src: "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-004-Small.jpg", alt: "Facility interior detail" },
  { src: "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-009-Small.jpg", alt: "Serene treatment room" },
  { src: "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-021-Small.jpg", alt: "Comfortable furnishings" },
  { src: "/images/20230113-03-31305ceanothusdr-lagunabeach-ca-023-Small.jpg", alt: "Relaxing common area" },
  { src: "/images/Facility-4-1024x683-1.jpg", alt: "Facility exterior in Laguna Beach" },
];
