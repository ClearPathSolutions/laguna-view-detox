import Hero from "@/components/Hero";
import { TrustBar, InsuranceBand, AdmissionsSteps, CtaBand } from "@/components/sections";
import {
  IntroSection,
  LevelsOfCare,
  FacilityFeature,
  WhoWeTreatGrid,
} from "@/components/home";
import BlogPreview from "@/components/BlogPreview";
import Reviews from "@/components/Reviews";
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
      <Reviews />
      <AdmissionsSteps />
      <InsuranceBand />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
