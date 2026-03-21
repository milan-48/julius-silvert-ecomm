import { stockStatusForQty } from "@/lib/memoryDb/stockUtils";

/**
 * If nested `stock` / `stockStatus` are missing after RSC serialization, rebuild from
 * top-level `stockCase` / `stockPc` / `stockSingle` (always attached in `withStockView`).
 *
 * @param {{
 *   stock?: Record<string, unknown> | null;
 *   stockStatus?: Record<string, string> | null;
 *   sizeOptions?: { value: string }[] | null | undefined;
 *   priceBySize?: Record<string, unknown> | null | undefined;
 *   stockCase?: number | null | undefined;
 *   stockPc?: number | null | undefined;
 *   stockSingle?: number | null | undefined;
 * }} args
 */
export function coerceListingStock(args) {
  const {
    stock,
    stockStatus,
    sizeOptions,
    priceBySize,
    stockCase,
    stockPc,
    stockSingle,
  } = args;

  const nestedOk =
    stock &&
    typeof stock === "object" &&
    (Object.prototype.hasOwnProperty.call(stock, "case") ||
      Object.prototype.hasOwnProperty.call(stock, "pc") ||
      Object.prototype.hasOwnProperty.call(stock, "single"));

  if (nestedOk) {
    const statusComplete =
      stockStatus &&
      typeof stockStatus === "object" &&
      Object.keys(stockStatus).length > 0;
    if (statusComplete) return { stock, stockStatus };

    const c = stock.case;
    const pc = stock.pc;
    const single = stock.single;
    if (c !== undefined || pc !== undefined) {
      return {
        stock,
        stockStatus: {
          case: stockStatusForQty(Number(c ?? 0)),
          pc: stockStatusForQty(Number(pc ?? 0)),
        },
      };
    }
    return {
      stock,
      stockStatus: { single: stockStatusForQty(Number(single ?? 0)) },
    };
  }

  const hasCasePcPicker =
    (Array.isArray(sizeOptions) && sizeOptions.length > 1) ||
    (priceBySize &&
      typeof priceBySize === "object" &&
      (Object.prototype.hasOwnProperty.call(priceBySize, "case") ||
        Object.prototype.hasOwnProperty.call(priceBySize, "pc")));

  if (hasCasePcPicker) {
    const c = Math.max(0, Math.floor(Number(stockCase ?? 0)));
    const pc = Math.max(0, Math.floor(Number(stockPc ?? 0)));
    return {
      stock: { case: c, pc },
      stockStatus: {
        case: stockStatusForQty(c),
        pc: stockStatusForQty(pc),
      },
    };
  }

  const s = Math.max(0, Math.floor(Number(stockSingle ?? 0)));
  return {
    stock: { single: s },
    stockStatus: { single: stockStatusForQty(s) },
  };
}

/**
 * Stock status for the active purchase channel (CASE / PC / single).
 * @param {Record<string, string> | null | undefined} stockStatus — from `withStockView`
 * @param {"case" | "pc" | "single"} purchaseSizeKey
 * @returns {"in_stock" | "low_stock" | "out_of_stock" | null}
 */
export function stockStatusForPurchaseChannel(stockStatus, purchaseSizeKey) {
  if (!stockStatus || typeof stockStatus !== "object") return null;
  const key =
    purchaseSizeKey === "pc"
      ? "pc"
      : purchaseSizeKey === "case"
        ? "case"
        : "single";
  const v = stockStatus[key];
  if (v === "in_stock" || v === "low_stock" || v === "out_of_stock") {
    return v;
  }
  return null;
}

/**
 * Client + server: how many units can still be sold for this purchase size.
 * @param {Record<string, unknown> | null | undefined} stock — from `withStockView`
 * @param {string} purchaseSizeKey — `case` | `pc` | `single`
 * @returns {number} use `Infinity` when stock object missing (don’t block UX)
 */
export function availableUnitsForPurchase(stock, purchaseSizeKey) {
  if (!stock || typeof stock !== "object") return Number.POSITIVE_INFINITY;
  const c = stock.case;
  const pc = stock.pc;
  const single = stock.single;
  const hasCasePc = c !== undefined || pc !== undefined;
  if (!hasCasePc && single !== undefined) {
    return Math.max(0, Math.floor(Number(single)));
  }
  if (purchaseSizeKey === "pc") {
    return Math.max(0, Math.floor(Number(pc ?? 0)));
  }
  return Math.max(0, Math.floor(Number(c ?? 0)));
}
