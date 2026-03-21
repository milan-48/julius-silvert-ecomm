import { CategoryCarousel } from "./CategoryCarousel";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section
      className="relative z-10 bg-[#F9FAFB] pb-12 pt-4 sm:pb-16 sm:pt-5 lg:pb-20 lg:pt-6 -mt-8 sm:-mt-10 lg:-mt-12"
      aria-labelledby="category-grid-title"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2
          id="category-grid-title"
          className="sr-only"
        >
          Shop by Category
        </h2>
        <CategoryCarousel categories={CATEGORIES} />
      </div>
    </section>
  );
}
