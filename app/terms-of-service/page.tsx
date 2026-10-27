import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Service",
  description: "The terms that govern your use of the Laguna View Detox website, including our website disclaimer.",
  path: LEGAL_PATHS.terms,
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      doc="terms-of-service"
      path={LEGAL_PATHS.terms}
      title="Terms of Service"
    />
  );
}
