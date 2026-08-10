import { parseBody } from "@/lib/content";
import { CheckIcon } from "./icons";

/**
 * Renders a page section body in the shape its source actually is.
 *
 * `content/pages.raw.json` stores three different structures with the same
 * single-newline delimiter — labelled facts, title/body pairs, and plain
 * prose. Rendering all three as one paragraph produced the run-on blocks the
 * owner flagged on /treatment/detoxification. `parseBody()` infers the shape;
 * this component draws it.
 */
export default function SectionBody({
  body,
  className = "",
}: {
  body: string;
  className?: string;
}) {
  const blocks = parseBody(body);

  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        if (block.kind === "definitions") {
          return (
            <dl key={bi} className="grid gap-4 sm:grid-cols-2">
              {block.items.map((it, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-sand-50 p-5 ring-1 ring-navy-900/5"
                >
                  {it.label && (
                    <dt className="flex items-start gap-2 font-semibold text-navy-900">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                      {it.label}
                    </dt>
                  )}
                  <dd
                    className={`text-[15px] leading-relaxed text-navy-900/75 ${
                      it.label ? "mt-1.5 pl-6" : ""
                    }`}
                  >
                    {it.text}
                  </dd>
                </div>
              ))}
            </dl>
          );
        }

        if (block.kind === "cards") {
          return (
            <div key={bi} className="grid gap-5 sm:grid-cols-2">
              {block.items.map((it, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy-900/5"
                >
                  <h3 className="font-serif text-lg font-semibold text-navy-900">
                    {it.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-navy-900/75">
                    {it.body}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={bi} className="space-y-5">
            {block.items.map((p, i) => (
              <p key={i} className="leading-[1.8] text-navy-900/75">
                {p}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
