/**
 * Inventory thresholds & helpers for in-memory catalog.
 */

/** Qty at or below this (and >0) => `low_stock` */
export const LOW_STOCK_THRESHOLD = 10;

/**
 * @param {number} qty
 * @returns {"out_of_stock" | "low_stock" | "in_stock"}
 */
export function stockStatusForQty(qty) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n) || n <= 0) return "out_of_stock";
  if (n <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

/**
 * @param {{ sizeOptions?: { value: string }[]; stockCase?: number; stockPc?: number; stockSingle?: number }} p
 */
export function publicStockFields(p) {
  const hasCasePc = Array.isArray(p.sizeOptions) && p.sizeOptions.length > 1;
  if (hasCasePc) {
    const c = Math.max(0, Math.floor(Number(p.stockCase ?? 0)));
    const pc = Math.max(0, Math.floor(Number(p.stockPc ?? 0)));
    return {
      stock: { case: c, pc },
      stockStatus: {
        case: stockStatusForQty(c),
        pc: stockStatusForQty(pc),
      },
    };
  }
  const s = Math.max(0, Math.floor(Number(p.stockSingle ?? 0)));
  return {
    stock: { single: s },
    stockStatus: { single: stockStatusForQty(s) },
  };
}

/**
 * Strip internal counters; attach `stock` + `stockStatus` for API / RSC → client.
 * @template T
 * @param {T} p
 */
export function withStockView(p) {
  if (!p || typeof p !== "object") return p;
  const { stockCase, stockPc, stockSingle, ...rest } = /** @type {any} */ (p);
  return {
    ...rest,
    ...publicStockFields(p),
  };
}

/**
 * @param {object} product — mutable row from memory DB
 * @param {string} purchaseSize — `case` | `pc` | `single`
 * @param {number} qty
 * @returns {{ ok: true } | { ok: false; code: string; message?: string }}
 */
export function deductStock(product, purchaseSize, qty) {
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 1) {
    return { ok: false, code: "invalid_quantity" };
  }
  const hasCasePc =
    Array.isArray(product.sizeOptions) && product.sizeOptions.length > 1;

  if (hasCasePc) {
    if (purchaseSize === "case") {
      const cur = Math.floor(Number(product.stockCase ?? 0));
      if (cur < q) {
        return {
          ok: false,
          code: "insufficient_stock",
          message: `Only ${cur} case(s) available`,
        };
      }
      product.stockCase = cur - q;
      return { ok: true };
    }
    if (purchaseSize === "pc") {
      const cur = Math.floor(Number(product.stockPc ?? 0));
      if (cur < q) {
        return {
          ok: false,
          code: "insufficient_stock",
          message: `Only ${cur} PC(s) available`,
        };
      }
      product.stockPc = cur - q;
      return { ok: true };
    }
    return { ok: false, code: "invalid_purchase_size" };
  }

  if (purchaseSize === "single") {
    const cur = Math.floor(Number(product.stockSingle ?? 0));
    if (cur < q) {
      return {
        ok: false,
        code: "insufficient_stock",
        message: `Only ${cur} in stock`,
      };
    }
    product.stockSingle = cur - q;
    return { ok: true };
  }
  return { ok: false, code: "invalid_purchase_size" };
}

/**
 * @param {object} patch
 * @returns {number | undefined}
 */
function normNonNegInt(patch) {
  if (patch === undefined) return undefined;
  const n = Math.floor(Number(patch));
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

/**
 * @param {object} product — mutable
 * @param {{ stockCase?: number; stockPc?: number; stockSingle?: number }} patch
 * @returns {boolean}
 */
export function applyStockPatch(product, patch) {
  let ok = false;
  const c = normNonNegInt(patch.stockCase);
  const pc = normNonNegInt(patch.stockPc);
  const s = normNonNegInt(patch.stockSingle);
  if (c !== undefined) {
    product.stockCase = c;
    ok = true;
  }
  if (pc !== undefined) {
    product.stockPc = pc;
    ok = true;
  }
  if (s !== undefined) {
    product.stockSingle = s;
    ok = true;
  }
  return ok;
}
