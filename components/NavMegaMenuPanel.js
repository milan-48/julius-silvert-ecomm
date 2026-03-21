import Link from "next/link";
import { ChevronRight } from "lucide-react";

function desktopGridClass(columnCount) {
  if (columnCount >= 4) {
    return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0";
  }
  if (columnCount === 3) {
    return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0";
  }
  if (columnCount === 2) {
    return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-0";
  }
  return "grid grid-cols-1 gap-5 lg:max-w-md";
}

/**
 * Mega-menu body — dark premium theme (styles in globals.css .mega-*).
 */
export function NavMegaMenuPanel({ megaMenu, variant = "desktop", onNavigate }) {
  if (!megaMenu) return null;

  const isDesktop = variant === "desktop";
  const n = megaMenu.columns.length;

  return (
    <div className={isDesktop ? "" : "pb-1"}>
      <div
        className={
          isDesktop ? desktopGridClass(n) : "flex flex-col gap-5"
        }
      >
        {megaMenu.columns.map((col, i) => (
          <div
            key={col.heading ?? `col-${i}`}
            className={
              isDesktop
                ? `mega-col-animate ${
                    i > 0
                      ? "lg:border-l lg:border-neutral-200/60 lg:pl-7 lg:pr-1 xl:pl-8"
                      : "lg:pr-1"
                  }`
                : ""
            }
          >
            {col.heading ? (
              <p
                className={
                  isDesktop
                    ? "mega-col-heading"
                    : "mega-col-heading mb-2 border-b-0 pb-0"
                }
              >
                {col.heading}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={
                      isDesktop
                        ? "mega-nav-link"
                        : "mega-nav-link mega-nav-link--stacked py-2"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {megaMenu.viewAll ? (
        <div className={isDesktop ? "" : "mt-2"}>
          <div
            className={
              isDesktop ? "mega-view-all-divider" : "mega-view-all-divider mt-4"
            }
            aria-hidden
          />
          <Link
            href={megaMenu.viewAll.href}
            onClick={onNavigate}
            className="mega-view-all group/viewall"
          >
            <span>{megaMenu.viewAll.label}</span>
            <ChevronRight
              className="size-[18px] shrink-0 transition-transform duration-300 ease-out group-hover/viewall:translate-x-1"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
