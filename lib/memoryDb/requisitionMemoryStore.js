/**
 * Process-local requisition lists (same pattern as wishlist / catalog DB).
 * Resets when the Node process restarts.
 */
import { getProductBySlug } from "./queries";

const GLOBAL_KEY = "__juliusRequisitionLists";

/** Fill missing image URL from catalog (some seed SKUs use empty imageSrc). */
function enrichLineImageSrc(line) {
  let imageSrc = String(line.imageSrc ?? "").trim();
  const slug = String(line.slug ?? "").trim();
  if (!imageSrc && slug) {
    const p = getProductBySlug(slug);
    const fromCat = p?.imageSrc != null ? String(p.imageSrc).trim() : "";
    if (fromCat) imageSrc = fromCat;
  }
  return { ...line, imageSrc };
}

function newId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getListsArray() {
  const g = globalThis;
  if (!Array.isArray(g[GLOBAL_KEY])) {
    g[GLOBAL_KEY] = [];
  }
  return g[GLOBAL_KEY];
}

/** @param {Record<string, unknown>} raw */
function normalizeLine(raw) {
  const sku = String(raw.sku ?? "").trim();
  if (!sku) return null;
  const purchaseSize = String(raw.purchaseSize ?? "case");
  const line = {
    sku,
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    imageSrc: String(raw.imageSrc ?? "").trim(),
    purchaseSize,
    quantity: Math.max(1, Math.floor(Number(raw.quantity) || 1)),
    unitPrice: Number(raw.unitPrice) || 0,
    unitLabel: String(raw.unitLabel ?? ""),
    netWeight: raw.netWeight != null ? String(raw.netWeight) : undefined,
    sizeOptions:
      Array.isArray(raw.sizeOptions) && raw.sizeOptions.length > 1
        ? raw.sizeOptions
        : null,
    priceBySize:
      raw.priceBySize && typeof raw.priceBySize === "object"
        ? raw.priceBySize
        : null,
  };
  return enrichLineImageSrc(line);
}

function mapListsEnriched(lists) {
  return lists.map((list) => ({
    ...list,
    items: list.items.map((item) => enrichLineImageSrc(item)),
  }));
}

function cloneLists() {
  let lists;
  try {
    lists = structuredClone(getListsArray());
  } catch {
    lists = JSON.parse(JSON.stringify(getListsArray()));
  }
  return mapListsEnriched(lists);
}

export function getRequisitionListsSnapshot() {
  return cloneLists();
}

/** @param {string} id */
export function getRequisitionListById(id) {
  const list = getListsArray().find((l) => l.id === String(id ?? ""));
  if (!list) return null;
  let cloned;
  try {
    cloned = structuredClone(list);
  } catch {
    cloned = JSON.parse(JSON.stringify(list));
  }
  return {
    ...cloned,
    items: cloned.items.map((item) => enrichLineImageSrc(item)),
  };
}

/**
 * @param {string} name
 * @param {string} description
 * @param {Record<string, unknown>} item
 */
export function requisitionCreateWithItem(name, description, item) {
  const n = String(name ?? "").trim();
  if (!n) return { ok: false, code: "name_required", lists: cloneLists() };
  const line = normalizeLine(item);
  if (!line) return { ok: false, code: "invalid_item", lists: cloneLists() };
  const now = new Date().toISOString();
  const list = {
    id: newId(),
    name: n,
    description: String(description ?? "").trim(),
    createdAt: now,
    updatedAt: now,
    items: [line],
  };
  getListsArray().push(list);
  return { ok: true, list, lists: cloneLists() };
}

/**
 * @param {string} name
 * @param {string} description
 */
export function requisitionCreateEmpty(name, description) {
  const n = String(name ?? "").trim();
  if (!n) return { ok: false, code: "name_required", lists: cloneLists() };
  const now = new Date().toISOString();
  const list = {
    id: newId(),
    name: n,
    description: String(description ?? "").trim(),
    createdAt: now,
    updatedAt: now,
    items: [],
  };
  getListsArray().push(list);
  return { ok: true, list, lists: cloneLists() };
}

/**
 * @param {string} listId
 * @param {Record<string, unknown>} item
 */
export function requisitionAddItem(listId, item) {
  const id = String(listId ?? "").trim();
  const list = getListsArray().find((l) => l.id === id);
  if (!list) {
    return { ok: false, code: "list_not_found", lists: cloneLists() };
  }
  const line = normalizeLine(item);
  if (!line) return { ok: false, code: "invalid_item", lists: cloneLists() };
  const existing = list.items.find(
    (i) => i.sku === line.sku && i.purchaseSize === line.purchaseSize,
  );
  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + line.quantity);
  } else {
    list.items.push(line);
  }
  list.updatedAt = new Date().toISOString();
  return { ok: true, lists: cloneLists() };
}

/**
 * @param {string} listId
 * @param {string} sku
 * @param {string} purchaseSize
 */
export function requisitionRemoveLine(listId, sku, purchaseSize) {
  const list = getListsArray().find((l) => l.id === listId);
  if (!list) return { ok: false, lists: cloneLists() };
  const s = String(sku ?? "").trim();
  const ps = String(purchaseSize ?? "");
  list.items = list.items.filter(
    (i) => !(i.sku === s && i.purchaseSize === ps),
  );
  list.updatedAt = new Date().toISOString();
  return { ok: true, lists: cloneLists() };
}

/**
 * @param {string} listId
 * @param {string} sku
 * @param {string} purchaseSize
 * @param {number} quantity
 */
export function requisitionSetLineQuantity(listId, sku, purchaseSize, quantity) {
  const id = String(listId ?? "").trim();
  const list = getListsArray().find((l) => l.id === id);
  if (!list) {
    return { ok: false, code: "list_not_found", lists: cloneLists() };
  }
  const s = String(sku ?? "").trim();
  const ps = String(purchaseSize ?? "");
  const line = list.items.find((i) => i.sku === s && i.purchaseSize === ps);
  if (!line) {
    return { ok: false, code: "line_not_found", lists: cloneLists() };
  }
  const q = Math.max(1, Math.min(99, Math.floor(Number(quantity)) || 1));
  line.quantity = q;
  list.updatedAt = new Date().toISOString();
  return { ok: true, lists: cloneLists() };
}

/**
 * @param {string} listId
 */
export function requisitionDeleteList(listId) {
  const id = String(listId ?? "").trim();
  const lists = getListsArray();
  const idx = lists.findIndex((l) => l.id === id);
  if (idx === -1) return { ok: false, lists: cloneLists() };
  lists.splice(idx, 1);
  return { ok: true, lists: cloneLists() };
}
