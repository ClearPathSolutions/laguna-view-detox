import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

/**
 * Google Tag Manager container.
 *
 * GTM is the single place tags are managed, so nothing vendor-specific is
 * hardcoded here beyond the container itself. Conversion events already land
 * in `window.dataLayer` via lib/analytics `track()`, which means every tag
 * configured in GTM can trigger on them without another code change.
 *
 * Renders nothing when NEXT_PUBLIC_GTM_ID is unset.
 *
 * NOTE: configure GA4 *inside* GTM and leave NEXT_PUBLIC_GA_ID unset —
 * setting both loads two measurement paths and double-counts every event.
 */
export default function Gtm() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
