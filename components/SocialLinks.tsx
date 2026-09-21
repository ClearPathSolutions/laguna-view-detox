import { site } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  GoogleIcon,
  LinkedinIcon,
} from "./icons";

type Social = {
  label: string;
  href: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

/**
 * Shared social row — previously duplicated in Footer.tsx and contact/page.tsx.
 */
const socials: Social[] = [
  { label: "Google Business Profile", href: site.social.google, Icon: GoogleIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
];

export default function SocialLinks({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const chip =
    tone === "dark"
      ? "border-white/15 text-white/70 hover:border-gold hover:bg-gold hover:text-navy-900"
      : "border-navy-900/15 text-navy-900/70 hover:border-gold hover:bg-gold hover:text-navy-900";

  return (
    <div className="flex flex-wrap gap-3">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${chip}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
