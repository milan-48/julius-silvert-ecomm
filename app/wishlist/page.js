import { WishlistView } from "@/components/WishlistView";

export const metadata = {
  title: "Wishlist | Julius Silvert",
  description: "Saved products",
};

export default function WishlistPage() {
  return (
    <div className="bg-white pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="site-container max-w-[1600px]">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Wishlist
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Items you save with the heart. Adding to cart removes them here.
        </p>
        <div className="mt-8">
          <WishlistView />
        </div>
      </div>
    </div>
  );
}
