import Link from "next/link";

/**
 * @param {object} props
 * @param {string} props.name - Category name (e.g. "Beef")
 * @param {number} props.count - Number of items
 * @param {string} props.slug - URL slug for linking
 */
export function CategoryCard({ name, count, slug }) {
  return (
    <Link
      href={`#/${slug}`}
      className="group flex flex-col items-center justify-center py-10 px-6 bg-white rounded-lg border border-[#e5e7eb] shadow-sm hover:shadow transition-all duration-200"
    >
      <span className="font-bold text-[#000000] text-xl mb-1.5 group-hover:text-[#B91C1C] transition-colors">
        {name}
      </span>
      <span className="text-sm text-[#6b7280] font-normal">
        {count} items
      </span>
    </Link>
  );
}
