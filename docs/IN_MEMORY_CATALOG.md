# In-memory catalog + Redux (no backend)

## What this is

- **Catalog data** lives in **`lib/memoryDb/`**: built once per Node process from `CATEGORIES` in `lib/constants.js` and deterministic demo SKUs.
- **Not a real database** — data resets on server restart (and each serverless instance has its own copy). Good for demos and learning; swap the same query functions for Prisma/Postgres later.
- **Next.js Route Handlers** expose JSON under **`/api/catalog/*`** so the browser (or Redux) can fetch the same shape the server uses.

## Files

| Path | Role |
|------|------|
| `lib/memoryDb/catalogSeed.js` | Builds all products: `sku`, `slug`, `categorySlug`, CASE/PC or none, `isBeverage`, prices, `netWeight` / unit copy. |
| `lib/memoryDb/db.js` | Singleton: indexes products by slug and category. |
| `lib/memoryDb/queries.js` | Read helpers: `listCategories`, `listProductsByCategory`, `getProductBySlug`, `getNewArrivalsPool`, etc. |
| `lib/productCatalog.js` | PDP enrichment (gallery, tabs, breadcrumbs) on top of memory rows. |
| `app/api/catalog/categories/route.js` | `GET` → `{ categories }` |
| `app/api/catalog/products/route.js` | `GET ?category=slug` → `{ products }` |
| `app/api/catalog/products/[slug]/route.js` | `GET` → `{ product }` |
| `lib/store/*` | Redux Toolkit: **`cart`** + **`catalog`** (menu categories from API). |
| `components/providers/ReduxProvider.jsx` | Client store (one instance per tab). |
| `components/CatalogHydrator.jsx` | Dispatches `fetchCatalogCategories()` on load. |

## SKU & sizes

- **`sku`**: e.g. `JS-WHAT-0001` (stable per row in seed order).
- **CASE / PC**: `sizeOptions` + `priceBySize` when both exist; **empty `sizeOptions`** = single price (e.g. one supply SKU).
- **Beverages** (`isBeverage: true`): case/PC copy uses **bottles / fl oz**; meat-style uses **lb** and pieces-per-case language.

## Redux

- **`catalog`**: categories array from `GET /api/catalog/categories` (single menu source for future nav UI). Inspect with Redux DevTools.
- **`cart`**: lines with `sku`, `slug`, `purchaseSize` (`case` \| `pc` \| `single`), `quantity`, `unitPrice` (number), `unitLabel` (suffix string). Same `sku` + `purchaseSize` merges quantity.

## Frontend wiring

- **Home**: `getNewArrivalsPool` / `getCenterPlatePool` (server) → props into rails.
- **Category PLP**: `listProductsByCategory(slug)` in `[...slug]/page.js`.
- **PDP**: `getProductDetailBySlug(slug)` (memory + enrich).
- **Header cart badge**: `useAppSelector(selectCartCount)`.
- **Add to cart**: `ProductCard` (ADD / cart icon) and `ProductDetailPage` (Add / cart icon for qty mode).

## Legacy constants

`NEW_ARRIVALS_PRODUCTS` / `CENTER_PLATE_PRODUCTS` in `lib/constants.js` are **unused** by the homepage now; kept for reference until you delete them.
