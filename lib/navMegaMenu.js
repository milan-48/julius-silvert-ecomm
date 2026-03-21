import { NAV_LINKS } from "@/lib/constants";

/**
 * Find a mega-menu row by exact href (e.g. `/meat-poultry/beef`).
 * @param {string} hrefPath
 * @returns {{ label: string; parentLabel: string; parentSlug: string; parentHref: string } | null}
 */
export function findMegaMenuLinkByHref(hrefPath) {
  const normalized = hrefPath.startsWith("/") ? hrefPath : `/${hrefPath}`;
  for (const nav of NAV_LINKS) {
    if (!nav.megaMenu?.columns) continue;
    for (const col of nav.megaMenu.columns) {
      for (const link of col.links ?? []) {
        if (link.href === normalized) {
          return {
            label: link.label,
            parentLabel: nav.label,
            parentSlug: nav.id,
            parentHref: nav.href,
          };
        }
      }
    }
    const va = nav.megaMenu.viewAll;
    if (va?.href === normalized) {
      return {
        label: va.label,
        parentLabel: nav.label,
        parentSlug: nav.id,
        parentHref: nav.href,
      };
    }
  }
  return null;
}

/** Title-case a URL segment when no mega-menu label exists. */
export function humanizePathSegment(segment) {
  if (!segment) return "Shop";
  return segment
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
