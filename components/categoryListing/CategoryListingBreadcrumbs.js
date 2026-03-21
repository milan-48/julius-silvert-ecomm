import Link from "next/link";

/**
 * @param {{ categoryLabel: string; parentCategory?: { name: string; slug: string } }} props
 */
export function CategoryListingBreadcrumbs({ categoryLabel, parentCategory }) {
  const label = categoryLabel.toUpperCase();

  return (
    <nav
      className="text-[11px] font-medium uppercase leading-4 tracking-[0.08em] text-neutral-500 sm:text-xs"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          >
            Home
          </Link>
        </li>
        <li className="text-neutral-400" aria-hidden>
          &gt;
        </li>
        {parentCategory ? (
          <>
            <li>
              <Link
                href={`/${parentCategory.slug}`}
                className="transition-colors hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              >
                {parentCategory.name.toUpperCase()}
              </Link>
            </li>
            <li className="text-neutral-400" aria-hidden>
              &gt;
            </li>
            <li className="text-neutral-800" aria-current="page">
              {label}
            </li>
          </>
        ) : (
          <li className="text-neutral-800" aria-current="page">
            {label}
          </li>
        )}
      </ol>
    </nav>
  );
}
