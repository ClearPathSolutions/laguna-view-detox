import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-navy-950 text-center text-white">
      <div className="container-x py-24">
        <p className="font-serif text-7xl font-semibold text-gold-400">404</p>
        <h1 className="mt-4 font-serif text-3xl font-medium sm:text-4xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          The page you&apos;re looking for may have moved. Let&apos;s get you back on the path — or
          call us anytime, day or night.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-gold">
            Return Home
          </Link>
          <a href={site.phoneHref} className="btn-outline">
            <PhoneIcon className="h-4 w-4" />
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
