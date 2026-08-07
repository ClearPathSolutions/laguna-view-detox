import Link from "next/link";
import Image from "next/image";
import { programs } from "@/lib/data";
import { ArrowRightIcon } from "./icons";

/**
 * Program-link widget. 29 sheet rows repeat the same request — "add the
 * different programs as widgets in this section with a link back to the
 * referred page (Detoxification, Residential Inpatient, Aftercare & Alumni)" —
 * so this is one component driven off `programs` in lib/data.ts rather than 29
 * hand-built blocks. It also does real work for the internal-linking weakness
 * behind T-01 and T-09.
 *
 * `exclude` drops the current page's own programme so a page never links to
 * itself.
 */
export default function ProgramCards({
  title = "Our Programs",
  exclude,
  limit = 3,
}: {
  title?: string;
  /** href of the current page, if it is itself a programme page. */
  exclude?: string;
  limit?: number;
}) {
  const items = programs.filter((p) => p.href !== exclude).slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="mt-12 rounded-2xl bg-sand-50 p-6 ring-1 ring-navy-900/5 sm:p-8">
      <h3 className="h-card !text-xl">{title}</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width: 640px) 30vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-serif text-lg font-medium leading-snug text-navy-900 group-hover:text-gold-700">
                {p.title}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-900/70">{p.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                Learn more
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
