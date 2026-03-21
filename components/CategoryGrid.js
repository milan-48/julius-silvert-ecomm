import { CategoryCarousel } from "./CategoryCarousel";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section
      className="relative z-10 flex w-full min-w-0 max-w-full flex-col items-center justify-center bg-[#F9FAFB] py-10 min-h-[min(320px,48svh)] sm:min-h-[min(340px,44svh)] sm:py-12 lg:min-h-[min(360px,40svh)] lg:py-16 -mt-8 sm:-mt-10 lg:-mt-12"
      aria-labelledby="category-grid-title"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col justify-center px-4 sm:px-6 lg:px-8">
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
