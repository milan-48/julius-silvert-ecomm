import Link from "next/link";

/**
 * Shop category tile — full border, static shadow (no motion; avoids carousel clip).
 */
export function CategoryCard({ name, count, slug }) {
  return (
    <Link
      href={`/${slug}`}
      className="flex h-full min-h-[128px] w-full flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white px-4 py-6 shadow-sm hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 sm:min-h-[140px] sm:px-5 sm:py-7"
    >
      <span className="flex min-h-0 flex-1 items-center justify-center text-balance text-center text-base font-medium leading-snug tracking-tight text-neutral-900 sm:text-[1.125rem] sm:leading-tight">
        {name}
      </span>
      <span className="mt-3 shrink-0 text-sm tabular-nums leading-normal text-neutral-600">
        {count} items
      </span>
    </Link>
  );
}
