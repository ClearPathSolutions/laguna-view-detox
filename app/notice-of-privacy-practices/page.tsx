import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Notice of Privacy Practices",
  description: "How Laguna View Detox may use and disclose your health information, and how you can get access to it.",
  path: LEGAL_PATHS.npp,
});

export default function NoticeOfPrivacyPracticesPage() {
  return (
    <LegalPage
      doc="notice-of-privacy-practices"
      path={LEGAL_PATHS.npp}
      title="Notice of Privacy Practices"
    />
  );
}
