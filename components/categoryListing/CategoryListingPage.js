import { CategoryListingBreadcrumbs } from "./CategoryListingBreadcrumbs";
import { CategoryListingClient } from "./CategoryListingClient";

/**
 * @param {{ category: { name: string; slug: string }; products: object[] }} props
 */
export function CategoryListingPage({ category, products }) {
  return (
    <div className="bg-white pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
      <div className="site-container">
        <CategoryListingBreadcrumbs categoryLabel={category.name} />
        <h1 className="mt-4 text-3xl font-bold uppercase tracking-[0.06em] text-neutral-900 sm:mt-5 sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15] uppercase">
          {category.name}
        </h1>
        <CategoryListingClient products={products} />
      </div>
    </div>
  );
}
