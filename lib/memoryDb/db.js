import { CATEGORIES } from "@/lib/constants";
import { buildCatalogProducts } from "./catalogSeed";

/**
 * Process-local in-memory “database”.
 * Resets when the Node process restarts (dev HMR / serverless cold start).
 *
 * **Important (Next.js + Turbopack):** `db.js` can be instantiated in more than one
 * server bundle (e.g. Route Handlers vs RSC). A module-level `let db` would mean
 * *two separate catalogs* — stock saves from `/api/...` would not match PLP reads.
 * `globalThis` keeps a single store per Node process.
 */
const GLOBAL_MEMORY_DB_KEY = "__juliusSilvertMemoryDb";

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

export function getMemoryDb() {
  const g = globalThis;
  if (!g[GLOBAL_MEMORY_DB_KEY]) {
    g[GLOBAL_MEMORY_DB_KEY] = createDb();
  }
  return g[GLOBAL_MEMORY_DB_KEY];
}

/** Test / admin hooks — optional reset */
export function resetMemoryDb() {
  delete globalThis[GLOBAL_MEMORY_DB_KEY];
  return getMemoryDb();
}
