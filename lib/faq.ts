import { getPage, type Faq } from "./content";

/**
 * Aggregates the FAQ blocks that already exist on individual programme pages
 * into one hub. The content is not duplicated in the data layer — each group
 * reads the same `page.faqs` array its source page renders, and links back to
 * it, so /faq can never drift from the pages it summarises.
 */
export type FaqGroup = {
  id: string;
  title: string;
  href: string;
  faqs: Faq[];
};

/** contentSlug -> the route that renders it, plus a display title. */
const SOURCES: { slug: string; id: string; title: string; href: string }[] = [
  { slug: "detoxification", id: "medical-detox", title: "Medical Detox", href: "/treatment/detoxification" },
  { slug: "alcohol", id: "alcohol-detox", title: "Alcohol Detox", href: "/treatment/detoxification/alcohol" },
  { slug: "heroin", id: "heroin-detox", title: "Heroin & Opioid Detox", href: "/treatment/detoxification/heroin" },
  { slug: "cocaine", id: "cocaine-detox", title: "Cocaine Detox", href: "/treatment/detoxification/cocaine" },
  { slug: "meth", id: "meth-detox", title: "Meth Detox", href: "/treatment/detoxification/meth" },
  { slug: "benzodiazepines", id: "benzo-detox", title: "Benzodiazepine Detox", href: "/treatment/detoxification/benzodiazepines" },
  { slug: "dual-diagnosis", id: "dual-diagnosis", title: "Dual Diagnosis", href: "/treatment/dual-diagnosis" },
  { slug: "addiction-therapies", id: "therapies", title: "Addiction Therapies", href: "/treatment/addiction-therapies" },
  { slug: "aftercare", id: "aftercare", title: "Aftercare & Alumni", href: "/treatment/aftercare" },
  { slug: "orange-county-drug-rehab", id: "orange-county", title: "Orange County", href: "/locations/orange-county" },
];

export const faqGroups: FaqGroup[] = SOURCES.map(({ slug, id, title, href }) => {
  const page = getPage(slug);
  return { id, title, href, faqs: page?.faqs ?? [] };
}).filter((g) => g.faqs.length > 0);

export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.faqs);
