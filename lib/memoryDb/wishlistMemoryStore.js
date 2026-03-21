/**
 * Process-local wishlist (same pattern as `getMemoryDb`): survives page refresh,
 * shared across Route Handlers + RSC via `globalThis`. Resets on server restart.
 */
const GLOBAL_WISHLIST_KEY = "__juliusSilvertWishlistItems";

/** @param {Record<string, unknown>} raw */
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

function getItemsArray() {
  const g = globalThis;
  if (!Array.isArray(g[GLOBAL_WISHLIST_KEY])) {
    g[GLOBAL_WISHLIST_KEY] = [];
  }
  return g[GLOBAL_WISHLIST_KEY];
}

/** JSON-safe snapshot */
export function getWishlistSnapshot() {
  const items = getItemsArray();
  try {
    return structuredClone(items);
  } catch {
    return JSON.parse(JSON.stringify(items));
  }
}

/**
 * @param {Record<string, unknown>} raw
 * @returns {object[]} updated list snapshot
 */
export function wishlistMemoryToggle(raw) {
  const next = normalizeWishlistItem(raw);
  if (!next) return getWishlistSnapshot();
  const items = getItemsArray();
  const idx = items.findIndex((i) => i.sku === next.sku);
  if (idx !== -1) {
    items.splice(idx, 1);
  } else {
    if (!items.some((i) => i.sku === next.sku)) {
      items.push(next);
    }
  }
  return getWishlistSnapshot();
}

/**
 * @param {string} sku
 * @returns {object[]} updated list snapshot
 */
export function wishlistMemoryRemoveSku(sku) {
  const s = String(sku ?? "").trim();
  const items = getItemsArray();
  const filtered = items.filter((i) => i.sku !== s);
  items.length = 0;
  items.push(...filtered);
  return getWishlistSnapshot();
}

/** Test / dev: clear in-memory wishlist */
export function resetWishlistMemory() {
  const items = getItemsArray();
  items.length = 0;
}
