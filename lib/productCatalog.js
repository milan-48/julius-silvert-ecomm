import {
  CENTER_PLATE_PRODUCTS,
  NEW_ARRIVALS_PRODUCTS,
} from "@/lib/constants";

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
  const urls = [primarySrc];
  for (const u of GALLERY_EXTRA) {
    if (u !== primarySrc && urls.length < 4) urls.push(u);
  }
  while (urls.length < 4) urls.push(urls[0] ?? primarySrc);
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

/** Homepage pools merged, unique by `slug` (first occurrence wins). */
export function getCatalogProductSources() {
  const seen = new Set();
  const out = [];
  for (const p of [...NEW_ARRIVALS_PRODUCTS, ...CENTER_PLATE_PRODUCTS]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

/**
 * Other catalog SKUs for PDP “You may also like” (excludes current slug).
 * @param {string} slug
 * @param {number} [limit=4]
 */
export function getRelatedProductsForSlug(slug, limit = 4) {
  const pool = getCatalogProductSources().filter((p) => p.slug !== slug);
  return pool.slice(0, Math.max(0, limit));
}

/**
 * Full PDP payload for a catalog SKU (demo enrichment until API exists).
 * @param {string} slug
 */
export function getProductDetailBySlug(slug) {
  const base = getCatalogProductSources().find((p) => p.slug === slug);
  if (!base) return null;

  const galleryImages = buildGallery(base.imageSrc);
  const galleryAlts = galleryImages.map(
    (_, i) => (i === 0 ? base.imageAlt : `${base.imageAlt} — view ${i + 1}`),
  );

  const reviewCount = 80 + (base.slug.charCodeAt(0) % 48);
  const rating = 4.3 + (base.slug.length % 7) * 0.1;

  return {
    ...base,
    itemNumber: itemNumberForSlug(base.slug),
    brandDisplay: base.vendor,
    inStock: true,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    breadcrumbCategorySlug: "whats-new",
    breadcrumbCategoryLabel: "What's New",
    galleryImages,
    galleryAlts,
    tabDescription: `Our ${base.title} is chosen for dependable quality, consistent sizing, and the kind of flavor chefs build menus around. Pack sizing supports both high-volume service and smart plate costing — whether you're roasting, braising, grinding, or showcasing a signature cut.\n\nJulius Silvert focuses on traceable sourcing and careful cold-chain handling so what arrives matches what you approved on the spec sheet.`,
    tabFeatures: [
      "Restaurant-grade specification with reliable availability",
      "Cold-chain minded handling from warehouse to your door",
      "Case and pack options where applicable for your operation",
      "Backed by Julius Silvert service teams who understand foodservice pace",
    ],
    tabAboutBrand: `${base.vendor} works with specialty distributors including Julius Silvert to supply professional kitchens with ingredients they can trust — from portion consistency to dependable fulfillment and knowledgeable support.`,
  };
}
