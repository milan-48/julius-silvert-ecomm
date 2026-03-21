import Link from "next/link";

const cardBase =
  "flex min-h-[4.25rem] w-full min-w-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] sm:min-h-[4.75rem] sm:px-4 sm:py-4";

/**
 * Single brand tile — screenshot-2 style (white rounded card, bold caps name).
 * Optional `href` renders as a link (e.g. featured partner).
 *
 * @param {{ id: string; name: string; href?: string }} brand
 */
export function BrandPartnerCard({ brand }) {
  const { name, href } = brand;
  const label = (
    <span
      className={`text-[11px] font-bold uppercase leading-snug tracking-wide sm:text-xs md:text-sm ${
        href ? "text-blue-600 underline decoration-blue-600/80 underline-offset-2" : "text-neutral-900"
      }`}
    >
      {name}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardBase} focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
      >
        {label}
      </Link>
    );
  }

  return <div className={cardBase}>{label}</div>;
}
