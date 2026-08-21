import Script from "next/script";
import { CTM_ID } from "@/lib/analytics";

/**
 * CallTrackingMetrics.
 *
 * Attributes inbound calls to the session that produced them and performs
 * dynamic number insertion, rewriting the displayed phone number so each
 * traffic source gets a distinct tracking line. Phone is the primary
 * conversion on this site, so calls are the number that matters most.
 *
 * Loaded over https rather than the vendor's protocol-relative `//` snippet:
 * the CSP sets upgrade-insecure-requests, and being explicit avoids a
 * needless upgrade round trip.
 *
 * Renders nothing when NEXT_PUBLIC_CTM_ID is unset.
 */
export default function CallTracking() {
  if (!CTM_ID) return null;

  return (
    <Script
      id="ctm-tracker"
      src={`https://${CTM_ID}.tctm.co/t.js`}
      strategy="afterInteractive"
    />
  );
}
