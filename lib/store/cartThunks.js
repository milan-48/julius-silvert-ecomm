import { toast } from "sonner";
import { addToCart } from "./cartSlice";

/**
 * Add line to cart without opening the drawer; Sonner toast (styled in globals.css, max 3 visible).
 * @param {Record<string, unknown>} payload — same shape as `addToCart` prepare input (sku, slug, title, …)
 */
export function addToCartWithNotification(payload) {
  return (dispatch) => {
    dispatch(addToCart(payload));
    const name = String(payload.title ?? "").trim();
    toast.success("Added to cart", name ? { description: name } : undefined);
  };
}
