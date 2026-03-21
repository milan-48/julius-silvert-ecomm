import { CATEGORIES } from "@/lib/constants";
import { buildCatalogProducts } from "./catalogSeed";

/**
 * Process-local in-memory “database”.
 * Resets when the Node process restarts (dev HMR / serverless cold start).
 */
function createDb() {
  const products = buildCatalogProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const byCategory = new Map();
  for (const p of products) {
    const list = byCategory.get(p.categorySlug) ?? [];
    list.push(p);
    byCategory.set(p.categorySlug, list);
  }
  return {
    categories: CATEGORIES.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: byCategory.get(c.slug)?.length ?? 0,
    })),
    products,
    bySlug,
    byCategory,
  };
}

let _db = null;

export function getMemoryDb() {
  if (!_db) _db = createDb();
  return _db;
}

/** Test / admin hooks — optional reset */
export function resetMemoryDb() {
  _db = null;
  return getMemoryDb();
}
