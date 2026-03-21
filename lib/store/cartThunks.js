import { toast } from "sonner";
import { addToCart } from "./cartSlice";
import { markWishlistMutated } from "./wishlistMutationClock";
import { removeWishlistItemBySku } from "./wishlistSlice";

/**
 * Add line to cart without opening the drawer; Sonner toast (styled in globals.css, max 3 visible).
 * Removes the same SKU from wishlist in Redux and syncs removal to server in-memory wishlist.
 * @param {Record<string, unknown>} payload — same shape as `addToCart` prepare input (sku, slug, title, …)
 */
export function addToCartWithNotification(payload) {
  return (dispatch) => {
    dispatch(addToCart(payload));
    const sku = String(payload.sku ?? "").trim();
    if (sku) {
      dispatch(removeWishlistItemBySku(sku));
      markWishlistMutated();
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", sku }),
        cache: "no-store",
      }).catch(() => {});
    }
    const name = String(payload.title ?? "").trim();
    toast.success("Added to cart", name ? { description: name } : undefined);
  };
}
