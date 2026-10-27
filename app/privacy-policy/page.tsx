import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Laguna View Detox collects, uses, discloses and protects information submitted through this website or shared with our team.",
  path: LEGAL_PATHS.privacy,
});

export default function PrivacyPage() {
  return (
    <LegalPage
      doc="privacy-policy"
      path={LEGAL_PATHS.privacy}
      title="Privacy Policy"
      subtitle="Your privacy and confidentiality are foundational to the care we provide."
    />
  );
}
