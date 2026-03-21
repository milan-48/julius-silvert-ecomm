import { publicStockFields, withStockView } from "@/lib/memoryDb/stockUtils";
import {
  getProductBySlug,
  listAllProducts,
  listRelatedProducts,
} from "@/lib/memoryDb/queries";

const GALLERY_EXTRA = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=960&q=80",
  "https://images.unsplash.com/photo-1558030006-450675393462?w=960&q=80",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=960&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=960&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=960&q=80",
];

/**
 * @param {string} primarySrc
 */
function buildGallery(primarySrc) {
  const urls = [];
  if (primarySrc) urls.push(primarySrc);
  for (const u of GALLERY_EXTRA) {
    if (u !== primarySrc && urls.length < 4) urls.push(u);
  }
  while (urls.length < 4) {
    urls.push(urls[0] ?? primarySrc ?? GALLERY_EXTRA[0]);
  }
  return urls.slice(0, 4);
}

/**
 * @param {string} slug
 */
function itemNumberForSlug(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return String(1_800_000 + (Math.abs(h) % 99_000));
}

/** All SKUs from in-memory catalog (unique by slug). */
export function getCatalogProductSources() {
  return listAllProducts();
}

/**
 * Other catalog SKUs for PDP “You may also like” (excludes current slug).
 * @param {string} slug
 * @param {number} [limit=4]
 */
export function getRelatedProductsForSlug(slug, limit = 4) {
  return listRelatedProducts(slug, limit).map((p) => withStockView(p));
}

/**
 * Full PDP payload — merges memory SKU + gallery + tabs.
 * @param {string} slug
 */
export function getProductDetailBySlug(slug) {
  const base = getProductBySlug(slug);
  if (!base) return null;

  const primary = base.imageSrc || GALLERY_EXTRA[0];
  const galleryImages = buildGallery(primary);
  const galleryAlts = galleryImages.map(
    (_, i) => (i === 0 ? base.imageAlt : `${base.imageAlt} — view ${i + 1}`),
  );

  const reviewCount = 80 + (base.slug.charCodeAt(0) % 48);
  const rating = 4.3 + (base.slug.length % 7) * 0.1;

  const bevNote = base.isBeverage
    ? " Bottles and multipacks are priced per case with a clear per-bottle reference for costing."
    : "";

  const { stock } = publicStockFields(base);
  const inStock = Object.values(stock).some((n) => Number(n) > 0);

  return {
    ...withStockView(base),
    itemNumber: itemNumberForSlug(base.slug),
    brandDisplay: base.vendor,
    inStock,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    breadcrumbCategorySlug: base.categorySlug,
    breadcrumbCategoryLabel: base.categoryLabel,
    galleryImages,
    galleryAlts,
    tabDescription: `Our ${base.title} is chosen for dependable quality, consistent sizing, and the kind of flavor chefs build menus around. Pack sizing supports both high-volume service and smart plate costing — whether you're roasting, braising, grinding, or showcasing a signature cut.${bevNote}\n\nJulius Silvert focuses on traceable sourcing and careful cold-chain handling so what arrives matches what you approved on the spec sheet.`,
    tabFeatures: base.isBeverage
      ? [
          "Foodservice pack sizes with case and single-unit options where listed",
          "Shelf-stable or cold-chain as appropriate — check label on receipt",
          "Consistent UPC/SKU for reordering and inventory control",
          "Julius Silvert support for volume planning and delivery windows",
        ]
      : [
          "Restaurant-grade specification with reliable availability",
          "Cold-chain minded handling from warehouse to your door",
          "Case and pack options where applicable for your operation",
          "Backed by Julius Silvert service teams who understand foodservice pace",
        ],
    tabAboutBrand: `${base.vendor} works with specialty distributors including Julius Silvert to supply professional kitchens with ingredients they can trust — from portion consistency to dependable fulfillment and knowledgeable support.`,
  };
}
