import { CategoryCard } from "./CategoryCard";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section
      className="bg-[#F9FAFB] pt-0 pb-12 sm:pb-16 lg:pb-20 -mt-16 sm:-mt-20 lg:-mt-24"
      aria-labelledby="category-grid-title"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div id="category-grid-title" className="sr-only">
          Shop by Category
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              count={category.count}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
