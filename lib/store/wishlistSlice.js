import { createSlice } from "@reduxjs/toolkit";

/**
 * One saved product per SKU (same as cart line identity).
 * @typedef {{
 *   sku: string;
 *   slug: string;
 *   title: string;
 *   imageSrc: string;
 *   imageAlt: string;
 *   vendor?: string;
 *   defaultSize?: string;
 *   sizeOptions?: { value: string; label: string }[] | null;
 *   priceBySize?: Record<string, { price: number; unitPrice: string }> | null;
 *   price?: number;
 *   unitPrice?: string;
 *   netWeight?: string;
 * }} WishlistItem
 */

const initialState = {
  /** @type {WishlistItem[]} */
  items: [],
};

/** @param {Partial<WishlistItem> & { sku?: string }} raw */
function normalizeWishlistItem(raw) {
  const sku = String(raw.sku ?? "").trim();
  if (!sku) return null;
  return {
    sku,
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    imageSrc: String(raw.imageSrc ?? ""),
    imageAlt: String(raw.imageAlt ?? raw.title ?? ""),
    vendor: raw.vendor ? String(raw.vendor) : undefined,
    defaultSize: raw.defaultSize ? String(raw.defaultSize) : undefined,
    sizeOptions:
      Array.isArray(raw.sizeOptions) && raw.sizeOptions.length > 1
        ? raw.sizeOptions
        : null,
    priceBySize:
      raw.priceBySize && typeof raw.priceBySize === "object"
        ? raw.priceBySize
        : null,
    price: raw.price != null ? Number(raw.price) : undefined,
    unitPrice: raw.unitPrice != null ? String(raw.unitPrice) : undefined,
    netWeight: raw.netWeight != null ? String(raw.netWeight) : undefined,
  };
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /**
     * Add if not already present (same `sku` = one row only).
     * @param {import("@reduxjs/toolkit").PayloadAction<WishlistItem>} action
     */
    addWishlistItem(state, action) {
      const next = normalizeWishlistItem(action.payload);
      if (!next) return;
      if (state.items.some((i) => i.sku === next.sku)) return;
      state.items.push(next);
    },
    removeWishlistItemBySku(state, action) {
      const sku = String(action.payload ?? "").trim();
      if (!sku) return;
      state.items = state.items.filter((i) => i.sku !== sku);
    },
    /** Heart toggle: remove if present, else add. */
    toggleWishlistItem(state, action) {
      const next = normalizeWishlistItem(action.payload);
      if (!next) return;
      const idx = state.items.findIndex((i) => i.sku === next.sku);
      if (idx !== -1) {
        state.items.splice(idx, 1);
        return;
      }
      state.items.push(next);
    },
    clearWishlist(state) {
      state.items = [];
    },
    /** Replace state from server in-memory wishlist (after GET /api/wishlist). */
    rehydrateWishlist(state, action) {
      const next = action.payload;
      state.items = Array.isArray(next) ? next.map((x) => normalizeWishlistItem(x)).filter(Boolean) : [];
    },
  },
});

export const {
  addWishlistItem,
  removeWishlistItemBySku,
  toggleWishlistItem,
  clearWishlist,
  rehydrateWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistHasSku = (sku) => (state) =>
  state.wishlist.items.some((i) => i.sku === String(sku ?? ""));

export default wishlistSlice.reducer;
