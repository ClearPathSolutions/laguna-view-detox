import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  message?: string;
  provider?: string;
  memberId?: string;
  variant?: string;
  consent?: boolean;
  consentText?: string;
  company?: string; // honeypot — real users never fill this
};

function clean(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Lead intake endpoint.
 *
 * Captures a confidential admissions inquiry and forwards it to the CRM / inbox
 * webhook configured via the LEAD_WEBHOOK_URL environment variable (set this in
 * Vercel → Project → Settings → Environment Variables). Every lead is also
 * written to the server log as a safety net so an inquiry is never silently
 * lost, and a timestamped consent record is stored for TCPA compliance.
 *
 * IMPORTANT: point LEAD_WEBHOOK_URL at a HIPAA-appropriate destination under a
 * signed BAA before going live. Until it is set, leads are captured in the
 * server logs only.
 */
export async function POST(req: Request) {
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
    provider: clean(data.provider, 120),
    memberId: clean(data.memberId, 80),
    variant: clean(data.variant, 40) || "contact",
    consent: data.consent === true,
    consentText: clean(data.consentText, 500),
    submittedAt: new Date().toISOString(),
    source: "lagunaviewdetox.com",
  };

  if (!lead.firstName || !lead.phone) {
    return NextResponse.json(
      { ok: false, error: "Please include your name and a phone number so we can reach you." },
      { status: 400 }
    );
  }
  if (!lead.consent) {
    return NextResponse.json(
      { ok: false, error: "Please confirm consent to be contacted." },
      { status: 400 }
    );
  }

  // Safety net: always capture the lead server-side so it is never lost.
  console.log("[lead]", JSON.stringify(lead));

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] delivery failed", err);
      return NextResponse.json(
        {
          ok: false,
          error:
            "We couldn't submit your request right now. Please call us at (866) 932-3206 — we're here 24/7.",
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
