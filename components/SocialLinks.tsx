import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon, YoutubeIcon, GoogleIcon } from "./icons";

type Social = {
  label: string;
  href: string;
  Icon?: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
  /** Rendered instead of an icon. See the Yelp note below. */
  text?: string;
};

/**
 * Shared social row — previously duplicated in Footer.tsx and contact/page.tsx.
 *
 * Yelp deliberately has no glyph. The hand-rolled `YelpIcon` that used to sit
 * here rendered as a scatter of disconnected blobs (sheet row 1089, "broken
 * Yelp footer logo") — verified by rendering it. Rather than substitute an
 * approximate redraw of someone else's trademark, which Yelp's brand guidelines
 * do not permit and which read no better, the link carries a clean "Yelp"
 * wordmark chip.
 *
 * TODO(design): to show the real burst, drop Yelp's official SVG from
 * https://www.yelp.com/brand into public/logos/ and swap it in here. That is a
 * licensing call, not a code one.
 */
const socials: Social[] = [
  { label: "Google Business Profile", href: site.social.google, Icon: GoogleIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  { label: "Yelp reviews", href: site.social.yelp, text: "Yelp" },
];

export default function SocialLinks({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const chip =
    tone === "dark"
      ? "border-white/15 text-white/70 hover:border-gold hover:bg-gold hover:text-navy-900"
      : "border-navy-900/15 text-navy-900/70 hover:border-gold hover:bg-gold hover:text-navy-900";

  return (
    <div className="flex flex-wrap gap-3">
      {socials.map(({ label, href, Icon, text }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${chip}`}
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <span aria-hidden="true" className="text-[11px] font-semibold tracking-tight">
              {text}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
