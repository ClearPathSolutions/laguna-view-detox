"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { CheckIcon, PhoneIcon } from "./icons";

type Status = "idle" | "submitting" | "success" | "error";

const CONSENT_TEXT =
  "I consent to be contacted by Laguna View Detox by phone, text, or email about treatment, including via automated technology. Consent is not a condition of care. Message/data rates may apply. My information is kept strictly confidential.";

export default function LeadForm({
  variant = "contact",
}: {
  variant?: "contact" | "insurance";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so screen-reader users hear it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: fd.get("message") || undefined,
      provider: fd.get("provider") || undefined,
      memberId: fd.get("memberId") || undefined,
      company: fd.get("company") || undefined, // honeypot
      variant,
      consent: fd.get("consent") === "on",
      consentText: CONSENT_TEXT,
    };

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(
          json.error ||
            "Something went wrong submitting your request. Please try again."
        );
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please call us at " + site.phone + "."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl bg-navy-950 p-10 text-center text-white"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy-900">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-5 font-serif text-2xl font-medium outline-none"
        >
          Thank you for reaching out.
        </h3>
        <p className="mt-3 max-w-sm text-white/75">
          We&apos;ve received your request and a member of our admissions team will contact you
          shortly — your information is kept strictly confidential. Need to talk right now?
        </p>
        <a href={site.phoneHref} className="btn-gold mt-6">
          <PhoneIcon className="h-4 w-4" />
          Call {site.phone}
        </a>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users; bots that fill it are dropped. */}
      <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" required />
        <Field label="Last name" name="lastName" autoComplete="family-name" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
      </div>

      {variant === "insurance" ? (
        <>
          <Field
            label="Insurance provider"
            name="provider"
            autoComplete="off"
            placeholder="e.g. Anthem, Aetna, Cigna…"
          />
          <Field label="Member ID (optional)" name="memberId" autoComplete="off" />
        </>
      ) : (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-900" htmlFor="message">
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 transition-colors placeholder:text-navy-900/50 focus:border-gold"
            placeholder="Tell us a little about your situation…"
          />
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-navy-900/70">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 rounded border-navy-900/30 text-gold focus:ring-gold"
        />
        <span>
          I consent to being contacted by Laguna View Detox by phone, text, or email (including via
          automated technology). Consent is not a condition of care. My information is kept
          confidential — see our{" "}
          <Link href="/privacy-policy" className="font-medium text-gold-700 underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-gold w-full text-base disabled:opacity-70">
        {submitting
          ? "Sending…"
          : variant === "insurance"
            ? "Verify My Insurance"
            : "Request a Confidential Callback"}
      </button>
      <p className="text-center text-xs text-navy-900/60">
        100% confidential · No cost or obligation · Available 24/7
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900" htmlFor={name}>
        {label}
        {required && <span className="text-gold-700"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 transition-colors placeholder:text-navy-900/50 focus:border-gold"
      />
    </div>
  );
}
