import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "SMS Terms",
  description: "Terms for text-message communications from Laguna View Detox: program description, cost, opt-out and privacy.",
  path: LEGAL_PATHS.sms,
});

export default function SmsTermsPage() {
  return (
    <LegalPage
      doc="sms-terms"
      path={LEGAL_PATHS.sms}
      title="SMS Terms"
    />
  );
}
