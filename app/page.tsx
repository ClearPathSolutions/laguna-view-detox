import Hero from "@/components/Hero";
import { TrustBar, InsuranceBand, AdmissionsSteps, CtaBand } from "@/components/sections";
import {
  IntroSection,
  LevelsOfCare,
  FacilityFeature,
  WhoWeTreatGrid,
  Testimonials,
} from "@/components/home";
import BlogPreview from "@/components/BlogPreview";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Luxury Drug Rehab in Laguna Beach",
  description: site.description,
  path: "",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <IntroSection />
      <LevelsOfCare />
      <FacilityFeature />
      <WhoWeTreatGrid />
      <Testimonials />
      <AdmissionsSteps />
      <InsuranceBand />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
