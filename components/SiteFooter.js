import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SITE_CONFIG, SITE_FOOTER } from "@/lib/constants";

const ICON_STROKE = 1.65;

function SocialGlyph({ icon, className }) {
  const cls = `size-5 ${className ?? ""}`;
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

function ColumnHeading({ children }) {
  return (
    <p className="text-base font-semibold leading-6 tracking-[-0.31px] text-white after:mt-4 after:block after:h-px after:w-7 after:bg-gradient-to-r after:from-white/[0.22] after:to-transparent">
      {children}
    </p>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto w-full overflow-hidden text-white">
      {/* Depth: soft vertical gradient + top hairline (premium restraint) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#141d31] via-[#101828] to-[#0c121c]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[20%] top-0 h-[min(280px,42vw)] w-[min(720px,78vw)] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_72%)]"
        aria-hidden
      />

      <div className="site-container relative py-9 sm:py-10 lg:py-11">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 xl:gap-x-12">
          {/* Brand */}
          <div className="lg:max-w-[17rem]">
            <div
              className="mb-3 h-px w-10 bg-gradient-to-r from-white/[0.38] to-transparent"
              aria-hidden
            />
            <p className="text-[20px] font-bold leading-[28px] tracking-[-0.45px] text-white [text-rendering:optimizeLegibility]">
              {SITE_CONFIG.name}
            </p>
            <p className="mt-2 max-w-[16rem] text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#99A1AF] [text-rendering:optimizeLegibility]">
              {SITE_FOOTER.tagline}
            </p>
          </div>

          <div>
            <ColumnHeading>{SITE_FOOTER.contact.heading}</ColumnHeading>
            <address className="mt-3 not-italic">
              <ul className="space-y-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#99A1AF] [text-rendering:optimizeLegibility]">
                {SITE_FOOTER.contact.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </address>
          </div>

          <div>
            <ColumnHeading>{SITE_FOOTER.support.heading}</ColumnHeading>
            <ul className="mt-3 space-y-1.5 text-[14px] font-normal leading-5 tracking-[-0.15px]">
              {SITE_FOOTER.support.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex text-[#99A1AF] decoration-white/0 decoration-1 underline-offset-[5px] transition-all duration-300 [text-rendering:optimizeLegibility] hover:text-white hover:decoration-white/35"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>{SITE_FOOTER.social.heading}</ColumnHeading>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SITE_FOOTER.social.links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex size-10 items-center justify-center rounded-full bg-white/[0.055] shadow-[0_2px_10px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.09] transition-all duration-300 hover:-translate-y-px hover:bg-white/[0.1] hover:shadow-[0_6px_18px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:ring-white/[0.18] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101828]"
                    aria-label={item.label}
                  >
                    <SocialGlyph
                      icon={item.icon}
                      className="text-[#99A1AF] transition-colors duration-300 group-hover:text-white"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-9 pt-6 sm:mt-10 sm:pt-7">
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
            aria-hidden
          />
          <p className="text-center text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#99A1AF]/90 [text-rendering:optimizeLegibility]">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
