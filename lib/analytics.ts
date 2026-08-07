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
export const analyticsEnabled = Boolean(GA_ID);

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

/** Report a client-side pageview. Called by the route-change listener. */
export function pageview(url: string): void {
  if (typeof window === "undefined" || !GA_ID) return;
  window.gtag?.("config", GA_ID, { page_path: url });
}
