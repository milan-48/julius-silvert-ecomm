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

const DEFAULT_SEARCH_PRODUCTS = 20;
const DEFAULT_SEARCH_CATEGORIES = 10;

/**
 * Search categories + products by name, slug, SKU, vendor (case-insensitive).
 * @param {string} rawQuery
 * @param {{ limitProducts?: number; limitCategories?: number }} [options]
 */
export function searchCatalog(rawQuery, options = {}) {
  const maxProducts = options.limitProducts ?? DEFAULT_SEARCH_PRODUCTS;
  const maxCategories = options.limitCategories ?? DEFAULT_SEARCH_CATEGORIES;

  const q = String(rawQuery ?? "").trim().toLowerCase();
  if (!q) {
    return { query: String(rawQuery ?? "").trim(), products: [], categories: [] };
  }

  const categories = listCategories()
    .filter((c) => {
      const name = String(c.name ?? "").toLowerCase();
      const slug = String(c.slug ?? "").toLowerCase();
      const slugAsWords = slug.replace(/-/g, " ");
      return name.includes(q) || slug.includes(q) || slugAsWords.includes(q);
    })
    .slice(0, maxCategories)
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c.count,
    }));

  const products = listAllProducts()
    .filter((p) => {
      const blob = [
        p.title,
        p.sku,
        p.slug,
        p.vendor,
        p.categoryLabel,
        p.categorySlug,
      ]
        .map((x) => String(x ?? "").toLowerCase())
        .join(" ");
      return blob.includes(q);
    })
    .slice(0, maxProducts)
    .map((p) => ({
      slug: p.slug,
      sku: p.sku,
      title: p.title,
      categorySlug: p.categorySlug,
      categoryLabel: p.categoryLabel,
      vendor: p.vendor ?? "",
      imageSrc: p.imageSrc ?? "",
    }));

  return { query: String(rawQuery ?? "").trim(), products, categories };
}
