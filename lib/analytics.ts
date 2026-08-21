/**
 * Conversion tracking.
 *
 * The site's whole purpose is admissions inquiries, and until now nothing was
 * measured — no page views, no form submissions, no phone taps. Every event
 * below routes through `track()` so there is exactly one place to swap or add
 * a vendor.
 *
 * Everything no-ops when NEXT_PUBLIC_GA_ID is unset, so local and preview
 * builds stay clean and the site works identically without consent to load a
 * third-party script.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
export const CTM_ID = process.env.NEXT_PUBLIC_CTM_ID || "";

/** True when any measurement path is active, so listeners are worth attaching. */
export const analyticsEnabled = Boolean(GA_ID || GTM_ID);

type GtagArgs =
  | ["event", string, Record<string, unknown>?]
  | ["config", string, Record<string, unknown>?]
  | ["js", Date];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/** The conversions that matter. Named, not free-form, so reports stay stable. */
export type ConversionEvent =
  | "lead_submit" // admissions form submitted successfully
  | "lead_error" // submission failed — watch this, it means lost leads
  // Clarion captured the lead but /api/lead errored. Not a lost lead, so the
  // submitter still sees the confirmation — but the API needs looking at.
  | "lead_api_failed_clarion_ok"
  | "phone_click" // any tel: link tapped
  | "insurance_start" // opened insurance verification
  | "review_click"; // clicked through to the Google review composer

export function track(
  event: ConversionEvent,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;
  // Queue into dataLayer regardless, so a tag manager added later still sees
  // the event even if gtag itself never loaded.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  window.gtag?.("event", event, params);
}

/**
 * Report a client-side pageview. Called by the route-change listener.
 *
 * App Router transitions are not real navigations, so neither GA4's automatic
 * pageview nor GTM's History Listener fires reliably. Pushing an explicit
 * dataLayer event gives GTM a stable trigger, and the gtag config call keeps
 * a direct GA4 install working if one is configured instead.
 */
export function pageview(url: string): void {
  if (typeof window === "undefined") return;
  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view_spa", page_path: url });
  }
  if (GA_ID) window.gtag?.("config", GA_ID, { page_path: url });
}
