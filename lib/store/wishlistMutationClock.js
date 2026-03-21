/** Monotonic clock so initial GET can ignore stale responses if user mutated wishlist meanwhile. */
export let lastWishlistMutationAt = 0;

export function markWishlistMutated() {
  lastWishlistMutationAt = Date.now();
}
