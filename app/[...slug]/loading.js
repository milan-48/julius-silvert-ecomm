import { CategoryListingPageSkeleton } from "@/components/categoryListing/CategoryListingSkeletons";

/**
 * Shown during client navigations to `/[category]` while the segment loads.
 */
export default function CategorySegmentLoading() {
  return (
    <div className="bg-white pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
      <div className="site-container">
        <CategoryListingPageSkeleton />
      </div>
    </div>
  );
}
