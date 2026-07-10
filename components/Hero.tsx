import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { PhoneIcon, ShieldIcon, StarIcon } from "./icons";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-108px)] items-center overflow-hidden bg-navy-950 lg:min-h-[720px]">
      <Image
        src="/images/lvd-hp-bk-.jpg"
        alt="Aerial view of the turquoise Pacific surf along the Laguna Beach coastline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility scrim: a solid base tone plus a left-weighted gradient keep the
          headline crisp over the bright surf, while the right stays open to the ocean.
          A bottom vignette anchors the CTAs and trust row. */}
      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/78 to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-navy-950/45" />

      <div className="container-x relative py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow animate-fade-in text-gold-200">
            <span className="h-px w-8 bg-gold-400" />
            Luxury Drug &amp; Alcohol Rehab · Laguna Beach, CA
          </p>

          <h1 className="mt-5 animate-fade-up font-serif text-[clamp(2.6rem,6.5vw,4.75rem)] font-medium leading-[1.02] text-white text-shadow-hero">
            World-Class Recovery,
            <br />
            <span className="text-gold-400">Overlooking the Pacific.</span>
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/90 sm:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            Experience a luxury drug &amp; alcohol rehab in Laguna Beach with evidence-based
            treatment that works. Escape addiction in a serene, six-bed oceanview estate and find
            your solution at Laguna View Detox.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <a href={site.phoneHref} className="btn-gold text-base">
              <PhoneIcon className="h-5 w-5" />
              Call {site.phone}
            </a>
            <Link href="/insurance" className="btn-outline text-base">
              <ShieldIcon className="h-5 w-5" />
              Verify Your Insurance
            </Link>
          </div>

          {/* Trust row */}
          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-7 text-white/80"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex text-gold-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <span className="text-sm">5-Star Rated Care</span>
            </div>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm">Joint Commission Accredited</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm">Most PPO Insurance Accepted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
