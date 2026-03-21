/**
 * Resolve price, unit suffix, and net-weight copy for a selected size / UOM.
 * Use on cards, PDP, and cart when CASE vs PC (or more) change $ / lb / pc.
 *
 * @param {{ price: number; unitPrice: string; netWeight?: string; priceBySize?: Record<string, { price: number; unitPrice: string; netWeight?: string }> }} product
 * @param {string} selectedSize - matches `sizeOptions[].value`
 */
export function getPricingForSize(product, selectedSize) {
  const v = product.priceBySize?.[selectedSize];
  return {
    price: v?.price ?? product.price,
    unitPrice: v?.unitPrice ?? product.unitPrice,
    netWeight: v?.netWeight ?? product.netWeight,
  };
}
