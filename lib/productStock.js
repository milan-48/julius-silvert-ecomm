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
