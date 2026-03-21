import { getMemoryDb } from "./db";

/**
 * Stable catalog order: SKU (fallback slug) so API + PLP stay consistent between loads.
 * @param {{ sku?: string; slug?: string }} a
 * @param {{ sku?: string; slug?: string }} b
 */
export function compareProductSku(a, b) {
  const sa = String(a?.sku ?? a?.slug ?? "");
  const sb = String(b?.sku ?? b?.slug ?? "");
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: "base" });
}

export function listCategories() {
  return getMemoryDb().categories;
}

export function listProductsByCategory(categorySlug) {
  const list = getMemoryDb().byCategory.get(categorySlug) ?? [];
  return [...list].sort(compareProductSku);
}

export function getProductBySlug(slug) {
  return getMemoryDb().bySlug.get(slug) ?? null;
}

export function listAllProducts() {
  return [...getMemoryDb().products].sort(compareProductSku);
}

/** New Arrivals rail — first N from whats-new, or any category mix */
export function getNewArrivalsPool(limit = 8) {
  const fromNew = listProductsByCategory("whats-new");
  if (fromNew.length >= limit) return fromNew.slice(0, limit);
  const rest = listAllProducts().filter((p) => p.categorySlug !== "whats-new");
  return [...fromNew, ...rest].slice(0, limit);
}

/** Center plate — meat & poultry focus */
export function getCenterPlatePool(limit = 8) {
  const meat = listProductsByCategory("meat-poultry");
  const extra = listProductsByCategory("seafood");
  return [...meat, ...extra].slice(0, limit);
}

export function listRelatedProducts(slug, limit = 4) {
  const current = getProductBySlug(slug);
  const cat = current?.categorySlug;
  const pool = cat
    ? listProductsByCategory(cat).filter((p) => p.slug !== slug)
    : listAllProducts().filter((p) => p.slug !== slug);
  if (pool.length >= limit) return pool.slice(0, limit);
  const fill = listAllProducts().filter((p) => p.slug !== slug && !pool.includes(p));
  return [...pool, ...fill].slice(0, limit);
}
