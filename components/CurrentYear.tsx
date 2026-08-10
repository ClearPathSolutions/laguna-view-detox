"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current calendar year.
 *
 * The site is statically prerendered, so a bare `new Date().getFullYear()` in a
 * server component freezes at *build* time — a site built in December 2026 and
 * left untouched would still read "2026" well into 2027. This renders the build
 * year for the initial HTML (so crawlers and no-JS visitors see a sensible
 * value) and corrects it on the client if the real year has moved on.
 */
export default function CurrentYear({ buildYear }: { buildYear?: number }) {
  const fallback = buildYear ?? new Date().getFullYear();
  const [year, setYear] = useState(fallback);

  useEffect(() => {
    const actual = new Date().getFullYear();
    if (actual !== fallback) setYear(actual);
  }, [fallback]);

  return <>{year}</>;
}
