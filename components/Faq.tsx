"use client";

import { useState } from "react";
import type { Faq } from "@/lib/content";
import { faqPageSchema } from "@/lib/schema";
import { ChevronDownIcon } from "./icons";
import { SectionHeading } from "./ui";

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  eyebrow = "Answers",
}: {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs?.length) return null;

  return (
    <section className="section bg-sand-50">
      {/* FAQPage schema, driven off the same array rendered below so the markup
          can never describe questions a visitor cannot see. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
      />
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy-900/10 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy-900/5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="reveal">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-sand-50"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="font-serif text-lg font-medium text-navy-900">{f.question}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 shrink-0 text-gold-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* aria-hidden while collapsed: the answer is visually clipped
                    by grid-rows-[0fr], but without this it stays in the
                    accessibility tree and screen readers announce every answer
                    as though all of them were open. */}
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-navy-900/70">{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
