import { createSlice, nanoid } from "@reduxjs/toolkit";

/**
 * @typedef {{
 *   lineId: string;
 *   sku: string;
 *   slug: string;
 *   title: string;
 *   imageSrc?: string;
 *   purchaseSize: string;
 *   quantity: number;
 *   unitPrice: number;
 *   unitLabel: string;
 *   sizeOptions?: { value: string; label: string }[] | null;
 *   priceBySize?: Record<string, { price: number; unitPrice: string }> | null;
 * }} CartLine
 */

const initialState = {
  /** @type {CartLine[]} */
  items: [],
  drawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Add or merge line (same sku + purchaseSize increases qty).
     */
    addToCart: {
      reducer(state, action) {
        const line = action.payload;
        const existing = state.items.find(
          (i) => i.sku === line.sku && i.purchaseSize === line.purchaseSize,
        );
        if (existing) {
          existing.quantity += line.quantity;
          if (!existing.sizeOptions && line.sizeOptions) {
            existing.sizeOptions = line.sizeOptions;
            existing.priceBySize = line.priceBySize;
          }
        } else {
          state.items.push(line);
        }
      },
      prepare(payload) {
        const sizeOptions =
          Array.isArray(payload.sizeOptions) && payload.sizeOptions.length > 1
            ? payload.sizeOptions
            : null;
        const priceBySize =
          payload.priceBySize &&
          typeof payload.priceBySize === "object" &&
          !Array.isArray(payload.priceBySize)
            ? payload.priceBySize
            : null;
        return {
          payload: {
            lineId: nanoid(),
            sku: payload.sku,
            slug: payload.slug,
            title: payload.title,
            imageSrc: payload.imageSrc ?? "",
            purchaseSize: payload.purchaseSize,
            quantity: Math.max(1, Number(payload.quantity) || 1),
            unitPrice: Number(payload.unitPrice),
            unitLabel: String(payload.unitLabel ?? ""),
            sizeOptions,
            priceBySize,
          },
        };
      },
    },
    /**
     * Switch CASE/PC (or other size) on a line; merges qty if same sku+size already exists.
     */
    changeCartLinePurchaseSize(state, action) {
      const { lineId, purchaseSize } = action.payload;
      const idx = state.items.findIndex((i) => i.lineId === lineId);
      if (idx === -1) return;
      const line = state.items[idx];
      const pricing = line.priceBySize?.[purchaseSize];
      if (!pricing) return;

      const duplicate = state.items.find(
        (i, i2) =>
          i2 !== idx &&
          i.sku === line.sku &&
          i.purchaseSize === purchaseSize,
      );
      if (duplicate) {
        duplicate.quantity += line.quantity;
        state.items.splice(idx, 1);
        return;
      }

      line.purchaseSize = purchaseSize;
      line.unitPrice = Number(pricing.price);
      line.unitLabel = String(pricing.unitPrice ?? "");
    },
    removeCartLine(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.lineId !== id);
    },
    setCartLineQuantity(state, action) {
      const { lineId, quantity } = action.payload;
      const line = state.items.find((i) => i.lineId === lineId);
      if (!line) return;
      const q = Math.max(1, Math.min(99, Math.floor(Number(quantity)) || 1));
      line.quantity = q;
    },
    clearCart(state) {
      state.items = [];
    },
    openCartDrawer(state) {
      state.drawerOpen = true;
    },
    closeCartDrawer(state) {
      state.drawerOpen = false;
    },
    incrementCartLine(state, action) {
      const line = state.items.find((i) => i.lineId === action.payload);
      if (line) line.quantity = Math.min(99, line.quantity + 1);
    },
    decrementCartLine(state, action) {
      const id = action.payload;
      const line = state.items.find((i) => i.lineId === id);
      if (!line) return;
      if (line.quantity <= 1) {
        state.items = state.items.filter((i) => i.lineId !== id);
      } else {
        line.quantity -= 1;
      }
    },
    /**
     * Replace cart lines from validated browser storage (does not touch drawerOpen).
     */
    rehydrateCart(state, action) {
      const next = action.payload?.items;
      state.items = Array.isArray(next) ? next : [];
    },
  },
});

export const {
  addToCart,
  removeCartLine,
  setCartLineQuantity,
  clearCart,
  openCartDrawer,
  closeCartDrawer,
  incrementCartLine,
  decrementCartLine,
  changeCartLinePurchaseSize,
  rehydrateCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

export const selectCartDrawerOpen = (state) => state.cart.drawerOpen;

export default cartSlice.reducer;
