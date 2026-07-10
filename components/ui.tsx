import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { clsx } from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <p className={clsx("eyebrow", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-gold-400" />
          {eyebrow}
        </p>
      )}
      <h2 className={clsx("h-section mt-4", light && "!text-white")}>{title}</h2>
      {lead && (
        <p className={clsx("lead mt-5", light && "!text-white/75")}>{lead}</p>
      )}
    </div>
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx("link-underline group", className)}>
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-4xl font-semibold text-gold-700 sm:text-5xl">{value}</div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-navy-900/60">
        {label}
      </div>
    </div>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-700">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="leading-relaxed text-navy-900/75">{children}</span>
    </li>
  );
}
