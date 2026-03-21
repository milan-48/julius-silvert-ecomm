/**
 * Client-side cart persistence (same idea as your in-memory catalog: durable snapshot, no backend).
 *
 * **Why localStorage, not cookies?** Cart lines include titles, image URLs, and `priceBySize`
 * maps — JSON often exceeds the ~4KB practical cookie limit. localStorage (~5MB) is the
 * standard pattern for browser carts; cookies are better for small session ids / A/B flags.
 *
 * @module lib/store/cartPersistence
 */

export const CART_STORAGE_KEY = "julius-silvert.cart.v1";
export const CART_SCHEMA_VERSION = 1;

/** Hard caps — protect storage & parse time */
const MAX_LINES = 80;
const MAX_TITLE_LEN = 280;
const MAX_SLUG_LEN = 220;
const MAX_SKU_LEN = 120;
const MAX_IMAGE_LEN = 2048;
const MAX_LABEL_LEN = 32;
const MAX_BYTES = 450_000; // ~450KB guardrail

function clip(s, max) {
  if (typeof s !== "string") return "";
  return s.length > max ? s.slice(0, max) : s;
}

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
function isPlainObject(raw) {
  return (
    raw !== null &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    Object.getPrototypeOf(raw) === Object.prototype
  );
}

/**
 * @param {unknown} row
 * @returns {object | null} normalized cart line or null
 */
function sanitizeLine(row) {
  if (!isPlainObject(row)) return null;

  const lineId = typeof row.lineId === "string" && row.lineId.trim() ? row.lineId.trim() : null;
  const sku = clip(String(row.sku ?? ""), MAX_SKU_LEN);
  const slug = clip(String(row.slug ?? ""), MAX_SLUG_LEN);
  const title = clip(String(row.title ?? ""), MAX_TITLE_LEN);
  const purchaseSize = clip(String(row.purchaseSize ?? ""), MAX_LABEL_LEN);
  const unitLabel = clip(String(row.unitLabel ?? ""), MAX_LABEL_LEN);
  const imageSrc = clip(String(row.imageSrc ?? ""), MAX_IMAGE_LEN);

  if (!lineId || !sku || !slug || !title || !purchaseSize) return null;

  const unitPrice = Number(row.unitPrice);
  if (!Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 999_999) return null;

  const q = Math.floor(Number(row.quantity));
  if (!Number.isFinite(q) || q < 1 || q > 99) return null;

  /** @type {{ value: string; label: string }[] | null} */
  let sizeOptions = null;
  if (Array.isArray(row.sizeOptions) && row.sizeOptions.length > 1) {
    const opts = [];
    for (const o of row.sizeOptions.slice(0, 12)) {
      if (!isPlainObject(o)) continue;
      const value = clip(String(o.value ?? ""), MAX_LABEL_LEN);
      const label = clip(String(o.label ?? ""), MAX_LABEL_LEN);
      if (value && label) opts.push({ value, label });
    }
    if (opts.length > 1) sizeOptions = opts;
  }

  /** @type {Record<string, { price: number; unitPrice: string }> | null} */
  let priceBySize = null;
  if (isPlainObject(row.priceBySize)) {
    const entries = Object.entries(row.priceBySize).slice(0, 24);
    const map = {};
    for (const [k, v] of entries) {
      const key = clip(String(k), MAX_LABEL_LEN);
      if (!key || !isPlainObject(v)) continue;
      const price = Number(v.price);
      const up = clip(String(v.unitPrice ?? ""), 120);
      if (!Number.isFinite(price) || price < 0) continue;
      map[key] = { price, unitPrice: up };
    }
    if (Object.keys(map).length) priceBySize = map;
  }

  return {
    lineId,
    sku,
    slug,
    title,
    imageSrc,
    purchaseSize,
    quantity: q,
    unitPrice,
    unitLabel,
    sizeOptions,
    priceBySize,
  };
}

/**
 * @param {unknown} parsed
 * @returns {object[]}
 */
export function parsePersistedCart(parsed) {
  if (!isPlainObject(parsed)) return [];
  const v = Number(parsed.v);
  if (v !== CART_SCHEMA_VERSION) return [];
  if (!Array.isArray(parsed.items)) return [];

  const out = [];
  for (const row of parsed.items.slice(0, MAX_LINES)) {
    const line = sanitizeLine(row);
    if (line) out.push(line);
  }
  return out;
}

/**
 * @returns {object[]}
 */
export function loadCartFromStorage() {
  if (typeof window === "undefined") return [];

  let storage = null;
  try {
    storage = window.localStorage;
    storage.setItem("__js_cart_probe__", "1");
    storage.removeItem("__js_cart_probe__");
  } catch {
    try {
      storage = window.sessionStorage;
    } catch {
      return [];
    }
  }

  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsePersistedCart(parsed);
  } catch {
    return [];
  }
}

/**
 * @param {object[]} items
 */
export function saveCartToStorage(items) {
  if (typeof window === "undefined") return;

  let storage = null;
  try {
    storage = window.localStorage;
  } catch {
    try {
      storage = window.sessionStorage;
    } catch {
      return;
    }
  }

  const payload = JSON.stringify({
    v: CART_SCHEMA_VERSION,
    items: items.slice(0, MAX_LINES),
  });

  if (payload.length > MAX_BYTES) {
    console.warn("[cart] persist payload too large; not saving");
    return;
  }

  try {
    if (items.length === 0) {
      storage.removeItem(CART_STORAGE_KEY);
    } else {
      storage.setItem(CART_STORAGE_KEY, payload);
    }
  } catch (e) {
    console.warn("[cart] persist failed", e);
  }
}
