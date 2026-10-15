"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CloseIcon, ChevronRightIcon } from "./icons";

/**
 * Column span for photo `i` of `n` (1 column on mobile, 2 from sm, a 6-track
 * grid from lg). From lg, photos run three to a row; a remainder of one turns
 * the last four into two pairs, a remainder of two turns the last two into a
 * pair, so every row is full. At sm, an odd count makes the first photo
 * full-width.
 */
function tileSpan(i: number, n: number): string {
  const sm = n % 2 === 1 && i === 0 ? "sm:col-span-2" : "sm:col-span-1";
  if (n === 1) return `${sm} lg:col-span-6`;
  const pairs = n % 3 === 1 ? 4 : n % 3 === 2 ? 2 : 0;
  const lg = i >= n - pairs ? "lg:col-span-3" : "lg:col-span-2";
  return `${sm} ${lg}`;
}

export default function Gallery({ items }: { items: { src: string; alt: string }[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  return (
    <>
      {/* Uniform 3:2 cards on a grid, sized by tileSpan so no row is left
          ragged. The masonry columns this replaced mixed 3:2 and 4:3 photos
          and ended the columns at different heights. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((it, i) => (
          <button
            key={it.src}
            onClick={() => setActive(i)}
            className={`${tileSpan(i, items.length)} group relative block aspect-[3/2] w-full overflow-hidden rounded-2xl reveal`}
            aria-label={`View ${it.alt}`}
          >
            <Image
              src={it.src}
              alt={it.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-navy-950/0 transition-colors group-hover:bg-navy-950/20" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 flex h-12 w-12 rotate-180 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
            aria-label="Previous"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[active].src}
              alt={items[active].alt}
              width={1400}
              height={1000}
              className="mx-auto h-auto max-h-[85vh] w-auto rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm text-white/70">{items[active].alt}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
