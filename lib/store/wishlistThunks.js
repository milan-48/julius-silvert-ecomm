import { rehydrateWishlist } from "./wishlistSlice";
import { markWishlistMutated } from "./wishlistMutationClock";

async function postWishlist(body) {
  const r = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(data.error || "Wishlist sync failed");
  }
  return Array.isArray(data.items) ? data.items : [];
}

/**
 * Toggle heart — persists to server in-memory wishlist, then rehydrates Redux.
 * @param {Record<string, unknown>} item
 */
export function persistToggleWishlistItem(item) {
  return async (dispatch) => {
    const items = await postWishlist({ action: "toggle", item });
    dispatch(rehydrateWishlist(items));
  };
}

/**
 * Remove by SKU (X on wishlist page, or after add to cart).
 * @param {string} sku
 */
export function persistRemoveWishlistSku(sku) {
  return async (dispatch) => {
    markWishlistMutated();
    const items = await postWishlist({ action: "remove", sku: String(sku ?? "") });
    dispatch(rehydrateWishlist(items));
  };
}
