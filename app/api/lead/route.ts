import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  message?: string;
  dob?: string;
  insurer?: string;
  who?: string;
  variant?: string;
  consent?: boolean;
  consentText?: string;
  company?: string; // honeypot — real users never fill this
};

function clean(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/*                                                                     */
/* Fixed window per client IP. This is per-instance memory: on a        */
/* serverless platform each warm instance keeps its own counter, so it  */
/* is a speed bump against naive floods rather than a hard global cap.  */
/* Move to a shared store (Upstash/Redis) if abuse becomes targeted.    */
/* ------------------------------------------------------------------ */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }

  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/* ------------------------------------------------------------------ */
/* Field validation                                                    */
/* ------------------------------------------------------------------ */

/** North American numbers land at 10 digits, or 11 with a country code. */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  // Allow longer international numbers, but require something plausible.
  if (digits.length >= 8 && digits.length <= 15) return digits;
  return null;
}

function validEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw);
}

/**
 * Lead intake endpoint.
 *
 * Captures a confidential admissions inquiry and forwards it to the CRM / inbox
 * webhook configured via LEAD_WEBHOOK_URL (Vercel → Settings → Environment
 * Variables). A redacted record is also written to the server log so an inquiry
 * is never silently lost, and a timestamped consent record is stored for TCPA.
 *
 * IMPORTANT: point LEAD_WEBHOOK_URL at a HIPAA-appropriate destination under a
 * signed BAA before going live. Until it is set, leads exist only in the server
 * log.
 *
 * ⚠️ The log line deliberately omits the free-text `message`, which is the
 * field most likely to contain clinical detail about the person or their loved
 * one. Platform logs are not generally BAA-covered, so that content must not
 * land there. Name, phone and email are still logged because without them a
 * captured lead is unactionable — review this trade-off with compliance.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `You've sent several requests already — we have them. Please call us at ${site.phone} if you need to reach someone right now.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't read your request. Please try again." },
      { status: 400 }
    );
  }

  // Honeypot: bots fill hidden fields. Accept silently and drop.
  if (clean(data.company)) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    firstName: clean(data.firstName, 80),
    lastName: clean(data.lastName, 80),
    phone: clean(data.phone, 40),
    email: clean(data.email, 160),
    message: clean(data.message, 2000),
    dob: clean(data.dob, 40),
    insurer: clean(data.insurer, 120),
    who: clean(data.who, 80),
    variant: clean(data.variant, 40) || "contact",
    consent: data.consent === true,
    consentText: clean(data.consentText, 500),
    submittedAt: new Date().toISOString(),
    source: "lagunaviewdetox.com",
  };

  // Field-level validation. The form sets `noValidate` so it can render its own
  // messages, which means the browser enforces nothing — every check has to
  // happen here. A malformed phone number is an unreachable person, not just a
  // malformed record.
  const errors: Record<string, string> = {};
  if (!lead.firstName) errors.firstName = "Please enter your first name.";
  if (!lead.phone) {
    errors.phone = "Please enter a phone number so we can reach you.";
  } else if (!normalisePhone(lead.phone)) {
    errors.phone = "That phone number doesn't look right — please check it.";
  }
  if (lead.email && !validEmail(lead.email)) {
    errors.email = "That email address doesn't look right — please check it.";
  }
  if (!lead.consent) errors.consent = "Please confirm consent to be contacted.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      {
        ok: false,
        error: Object.values(errors)[0],
        fields: errors,
      },
      { status: 400 }
    );
  }

  const normalisedPhone = normalisePhone(lead.phone);
  const payload = { ...lead, phoneNormalised: normalisedPhone };

  // Safety net: capture enough to act on the lead, without putting the
  // free-text clinical detail into platform logs. See the note above.
  console.log(
    "[lead]",
    JSON.stringify({
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: normalisedPhone,
      email: lead.email,
      provider: lead.provider,
      variant: lead.variant,
      consent: lead.consent,
      messageLength: lead.message.length,
      submittedAt: lead.submittedAt,
    })
  );

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (!webhook) {
    // FAIL SAFE, NOT FAIL SILENT.
    //
    // With no delivery destination configured this inquiry reaches nobody in
    // admissions. Returning `ok` here would show the submitter "a member of
    // our admissions team will contact you shortly" — a promise the system
    // cannot keep, made to someone who may be in crisis. That is worse than
    // an error.
    //
    // So: keep the server-side record (the lead is still recoverable from
    // logs), shout in the logs, and tell the person the truth plus the one
    // route that definitely works — the 24/7 phone line.
    //
    // Setting LEAD_WEBHOOK_URL to a HIPAA-appropriate destination under a
    // signed BAA restores normal submit-and-confirm behaviour. issues.md T-48.
    console.error(
      "[lead] CRITICAL: LEAD_WEBHOOK_URL is not set — inquiry NOT delivered to admissions. " +
        "Recovered from this log entry only. Set the env var to restore delivery.",
      { submittedAt: payload.submittedAt, variant: payload.variant }
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Our online form is temporarily unavailable. Please call us at ${site.phone} — we're here 24/7 and can help you right now.`,
      },
      { status: 503 }
    );
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] delivery failed", err);
      return NextResponse.json(
        {
          ok: false,
          error: `We couldn't submit your request right now. Please call us at ${site.phone} — we're here 24/7.`,
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
