import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SITE_CONFIG, SITE_FOOTER } from "@/lib/constants";

const ICON_STROKE = 1.75;

function SocialGlyph({ icon }) {
  const cls = "size-5 text-neutral-300";
  switch (icon) {
    case "facebook":
      return <Facebook className={cls} strokeWidth={ICON_STROKE} aria-hidden />;
    case "linkedin":
      return <Linkedin className={cls} strokeWidth={ICON_STROKE} aria-hidden />;
    case "instagram":
      return <Instagram className={cls} strokeWidth={ICON_STROKE} aria-hidden />;
    default:
      return null;
  }
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#1e293b] text-white">
      <div className="site-container py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              {SITE_CONFIG.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {SITE_FOOTER.tagline}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {SITE_FOOTER.contact.heading}
            </p>
            <address className="mt-3 not-italic">
              <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-400">
                {SITE_FOOTER.contact.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </address>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {SITE_FOOTER.support.heading}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE_FOOTER.support.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {SITE_FOOTER.social.heading}
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SITE_FOOTER.social.links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e293b]"
                    aria-label={item.label}
                  >
                    <SocialGlyph icon={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-neutral-500 sm:text-sm">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
