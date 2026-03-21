"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "@/lib/memoryDb/stockUtils";
import { getRelatedProductsForSlug } from "@/lib/productCatalog";
import { getPricingForSize } from "@/lib/productPricing";
import {
  availableUnitsForPurchase,
  stockStatusForPurchaseChannel,
} from "@/lib/productStock";
import { RequistionIcon } from "@/lib/icons";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";
import { addToCartWithNotification } from "@/lib/store/cartThunks";
import { decrementCartLine, incrementCartLine } from "@/lib/store/cartSlice";
import { selectWishlistHasSku } from "@/lib/store/wishlistSlice";
import { persistToggleWishlistItem } from "@/lib/store/wishlistThunks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CartQuantityInput } from "@/components/CartQuantityInput";
import { RequisitionPickModal } from "@/components/requisitions/RequisitionPickModal";
import { YouMayAlsoLike } from "./YouMayAlsoLike";

const ICON_STROKE = 1.75;

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const TABS = [
  { id: "description", label: "Product Description" },
  { id: "features", label: "Key Features" },
  { id: "brand", label: "About the Brand" },
  { id: "reviews", label: "Reviews" },
];

/** Figma tab panel headings: 20px / 28px / bold / -0.45px / #0A0A0A */
function TabSectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-[20px] font-bold leading-[28px] tracking-[-0.45px] text-[#0A0A0A] sm:mb-5">
      {children}
    </h2>
  );
}

/** Figma tab panel body: 16px / 26px / regular / -0.31px / #0A0A0A */
const TAB_BODY_CLASS =
  "text-[16px] font-normal leading-[26px] tracking-[-0.31px] text-[#0A0A0A]";

/**
 * @param {{ product: Record<string, unknown> }} props
 */
export function ProductDetailPage({ product }) {
  const dispatch = useAppDispatch();
  const p = product;
  const slug = String(p.slug ?? "");
  const sku = String(p.sku ?? p.itemNumber ?? slug);
  const title = String(p.title ?? "");
  const brandDisplay = String(p.brandDisplay ?? p.vendor ?? "");
  const itemNumber = String(p.itemNumber ?? "");
  const inStock = Boolean(p.inStock);
  const stock = p.stock;
  const rating = Number(p.rating ?? 4.8);
  const reviewCount = Number(p.reviewCount ?? 0);
  const categorySlug = String(p.breadcrumbCategorySlug ?? "whats-new");
  const categoryLabel = String(p.breadcrumbCategoryLabel ?? "What's New");
  const galleryImages = /** @type {string[]} */ (p.galleryImages ?? []);
  const galleryAlts = /** @type {string[]} */ (p.galleryAlts ?? []);
  const tabDescription = String(p.tabDescription ?? "");
  const tabFeatures = /** @type {string[]} */ (p.tabFeatures ?? []);
  const tabAboutBrand = String(p.tabAboutBrand ?? "");

  const descriptionParagraphs = useMemo(() => {
    const stripped = tabDescription
      .replace(/^Product overview\s*\n+/i, "")
      .replace(/^Product Overview\s*\n+/i, "")
      .trim();
    return stripped.split(/\n\n/).map((s) => s.trim()).filter(Boolean);
  }, [tabDescription]);

  const price = Number(p.price ?? 0);
  const unitPrice = String(p.unitPrice ?? "");
  const netWeight = String(p.netWeight ?? "");
  const priceBySize = p.priceBySize;
  const sizeOptions = /** @type {{ value: string; label: string }[] | undefined} */ (
    p.sizeOptions
  );
  const defaultSize = String(p.defaultSize ?? sizeOptions?.[0]?.value ?? "case");
  /** Only show picker when there’s a real choice (0–1 options = hide). */
  const showSizePicker =
    Array.isArray(sizeOptions) && sizeOptions.length > 1;

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [tab, setTab] = useState("description");
  const [failedIdx, setFailedIdx] = useState(() => new Set());
  const [requisitionOpen, setRequisitionOpen] = useState(false);

  const placeholderBg = useMemo(() => softPlaceholderBg(slug), [slug]);

  useEffect(() => {
    setSelectedSize(defaultSize);
    setActiveIdx(0);
    setFailedIdx(new Set());
    setTab("description");
  }, [slug, defaultSize]);

  const purchaseSizeKey = useMemo(
    () => (showSizePicker ? selectedSize : "single"),
    [showSizePicker, selectedSize],
  );

  const cartLine = useAppSelector((s) =>
    s.cart.items.find(
      (i) => i.sku === sku && i.purchaseSize === purchaseSizeKey,
    ),
  );
  const inWishlist = useAppSelector(selectWishlistHasSku(sku));

  const resolved = useMemo(
    () =>
      getPricingForSize(
        { price, unitPrice, netWeight, priceBySize },
        selectedSize,
      ),
    [priceBySize, selectedSize, price, unitPrice, netWeight],
  );

  const relatedProducts = useMemo(
    () => getRelatedProductsForSlug(slug, 4),
    [slug],
  );

  const maxShelfUnits = useMemo(
    () => availableUnitsForPurchase(stock, purchaseSizeKey),
    [stock, purchaseSizeKey],
  );
  const hasFiniteShelf = Number.isFinite(maxShelfUnits);
  const channelStockStatus = useMemo(
    () => stockStatusForPurchaseChannel(p.stockStatus, purchaseSizeKey),
    [p.stockStatus, purchaseSizeKey],
  );
  const lineOutOfStock =
    channelStockStatus === "out_of_stock" ||
    (hasFiniteShelf && maxShelfUnits <= 0);
  const lineLowStock =
    !lineOutOfStock &&
    hasFiniteShelf &&
    maxShelfUnits > 0 &&
    (channelStockStatus === "low_stock" ||
      (channelStockStatus == null &&
        maxShelfUnits <= LOW_STOCK_THRESHOLD));
  const atShelfCap =
    Number.isFinite(maxShelfUnits) &&
    Boolean(cartLine) &&
    cartLine.quantity >= maxShelfUnits;

  function handleAddToCart() {
    if (lineOutOfStock) return;
    dispatch(
      addToCartWithNotification({
        sku,
        slug,
        title,
        imageSrc: galleryImages[0] ?? "",
        purchaseSize: purchaseSizeKey,
        quantity: 1,
        unitPrice: resolved.price,
        unitLabel: resolved.unitPrice,
        sizeOptions: showSizePicker ? sizeOptions : undefined,
        priceBySize: priceBySize ?? undefined,
      }),
    );
  }

  const requisitionProduct = useMemo(
    () => ({
      sku,
      slug,
      title,
      imageSrc: galleryImages[0] ?? "",
      purchaseSize: purchaseSizeKey,
      quantity: 1,
      unitPrice: resolved.price,
      unitLabel: resolved.unitPrice,
      netWeight: resolved.netWeight,
      sizeOptions: showSizePicker ? sizeOptions : undefined,
      priceBySize: priceBySize ?? undefined,
    }),
    [
      sku,
      slug,
      title,
      galleryImages,
      purchaseSizeKey,
      resolved.price,
      resolved.unitPrice,
      resolved.netWeight,
      showSizePicker,
      sizeOptions,
      priceBySize,
    ],
  );

  const mainSrc = galleryImages[activeIdx] ?? "";
  const mainAlt = galleryAlts[activeIdx] ?? title;
  const mainFailed = failedIdx.has(activeIdx);

  return (
    <div className="bg-white pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24">
      <div className="site-container max-w-[1600px]">
        <nav
          className="text-[11px] font-medium uppercase leading-4 tracking-[0.08em] text-neutral-500 sm:text-xs"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li className="text-neutral-400" aria-hidden>
              &gt;
            </li>
            <li>
              <Link
                href={`/${categorySlug}`}
                className="transition-colors hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              >
                {categoryLabel.toUpperCase()}
              </Link>
            </li>
            <li className="text-neutral-400" aria-hidden>
              &gt;
            </li>
            <li className="max-w-[min(100%,28rem)] truncate text-neutral-800" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="min-w-0 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/80">
              {!mainSrc || mainFailed ? (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: placeholderBg }}
                  aria-hidden
                />
              ) : (
                <Image
                  src={mainSrc}
                  alt={mainAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onError={() =>
                    setFailedIdx((s) => new Set(s).add(activeIdx))
                  }
                />
              )}
              <button
                type="button"
                className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm ring-1 ring-black/[0.06] transition-colors hover:bg-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={inWishlist}
                onClick={() =>
                  void dispatch(
                    persistToggleWishlistItem({
                      sku,
                      slug,
                      title,
                      imageSrc: galleryImages[0] ?? "",
                      imageAlt: galleryAlts[0] ?? title,
                      vendor: brandDisplay,
                      defaultSize: selectedSize,
                      sizeOptions: showSizePicker ? sizeOptions : undefined,
                      priceBySize,
                      price,
                      unitPrice,
                      netWeight,
                    }),
                  )
                }
              >
                <Heart
                  size={20}
                  strokeWidth={ICON_STROKE}
                  className={inWishlist ? "fill-red-500 text-red-500" : ""}
                  aria-hidden
                />
              </button>
              {lineOutOfStock || lineLowStock ? (
                <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)]">
                  {lineOutOfStock ? (
                    <span className="inline-flex items-center rounded-md border border-amber-200/35 bg-gradient-to-br from-[#0c0a09] via-[#1c1917] to-[#292524] px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.2em] text-amber-50 shadow-[0_10px_28px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
                      Out of stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md border border-amber-400/45 bg-gradient-to-br from-[#422006] via-[#1c1917] to-[#0c0a09] px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-amber-100 shadow-[0_10px_28px_rgba(0,0,0,0.35)] ring-1 ring-amber-500/25">
                      Limited stock
                    </span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex gap-2 overflow-x-auto px-0.5 pb-1 pt-0.5 sm:gap-3">
              {galleryImages.map((src, i) => {
                const sel = i === activeIdx;
                const failed = failedIdx.has(i);
                return (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="shrink-0 rounded-lg border-0 bg-transparent p-0"
                    aria-label={`Show image ${i + 1}`}
                    aria-current={sel ? "true" : undefined}
                  >
                    {/* Border (not ring): ring/box-shadow is clipped by overflow-x-auto on the row */}
                    <span
                      className={`relative box-border block h-16 w-20 overflow-hidden rounded-lg border-2 transition-[border-color] sm:h-[4.5rem] sm:w-24 ${
                        sel
                          ? "border-neutral-900"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                    >
                      {!src || failed ? (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: placeholderBg }}
                          aria-hidden
                        />
                      ) : (
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="96px"
                          onError={() =>
                            setFailedIdx((s) => new Set(s).add(i))
                          }
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buy box */}
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
              <h1 className="min-w-0 max-w-full text-[30px] font-bold leading-[36px] tracking-[0.4px] text-[#0A0A0A]">
                {title}
              </h1>
              {lineOutOfStock ? (
                <span className="inline-flex shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  Out of Stock
                </span>
              ) : lineLowStock ? (
                <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
                  Low Stock
                </span>
              ) : inStock ? (
                <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="text-[14px] font-normal leading-5 tracking-[-0.15px]">
                <span className="text-[#4A5565]">Brand:</span>{" "}
                <span className="font-semibold uppercase tracking-[-0.15px] text-[#0A0A0A]">
                  {brandDisplay}
                </span>
              </p>
              <p className="text-[14px] font-normal leading-5 tracking-[-0.15px]">
                <span className="text-[#4A5565]">Item:</span>{" "}
                <span className="text-[#0A0A0A]">{itemNumber}</span>
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[14px] leading-5 tracking-[-0.15px]">
                <Star
                  className="size-4 fill-amber-400 text-amber-400"
                  strokeWidth={0}
                  aria-hidden
                />
                <span className="font-semibold text-[#0A0A0A]">{rating}</span>
                <span className="font-normal text-[#4A5565]">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price first, then unit toggle — avoids a heavy divider + huge gap above price */}
            <div className="mt-6">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-bold tabular-nums tracking-tight text-neutral-900 sm:text-4xl">
                  {formatUsd(resolved.price)}
                </span>
                <span className="text-base text-neutral-500">
                  {resolved.unitPrice}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">{resolved.netWeight}</p>
              {lineOutOfStock ? (
                <p className="mt-2 text-sm font-semibold text-red-600" role="status">
                  This unit can’t be added to your cart right now.
                </p>
              ) : hasFiniteShelf && lineLowStock ? (
                <p className="mt-2 text-sm font-medium text-amber-800" role="status">
                  Low stock — only {maxShelfUnits}{" "}
                  {purchaseSizeKey === "case"
                    ? "case(s)"
                    : purchaseSizeKey === "pc"
                      ? "PC(s)"
                      : "unit(s)"}{" "}
                  left
                </p>
              ) : null}
            </div>

            {showSizePicker ? (
              <div className="mt-4">
                <p className="text-[14px] font-semibold leading-5 tracking-[-0.15px] text-[#0A0A0A]">
                  Size:
                </p>
                <div
                  role="radiogroup"
                  aria-label="Size"
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {sizeOptions.map((opt) => {
                    const selected = selectedSize === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedSize(opt.value)}
                        className={`inline-flex h-10 min-w-[4rem] shrink-0 items-center justify-center rounded-[8px] border px-5 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-[#0f172a] bg-[#0f172a] text-white"
                            : "border-[#E5E7EB] bg-[#F3F4F6] text-[#0f172a] hover:bg-[#ECEEF2]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex min-w-0 flex-wrap items-center gap-2">
              {cartLine ? (
                <div className="flex h-12 min-h-12 min-w-[220px] flex-1 items-center justify-between rounded-full border border-neutral-200 bg-white px-2 sm:min-w-0">
                  <button
                    type="button"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Decrease quantity"
                    onClick={() => dispatch(decrementCartLine(cartLine.lineId))}
                  >
                    <Minus className="size-4" strokeWidth={2} aria-hidden />
                  </button>
                  <CartQuantityInput
                    lineId={cartLine.lineId}
                    quantity={cartLine.quantity}
                    readOnly={lineOutOfStock}
                    className="min-w-[2.5rem] max-w-[3rem] flex-1 border-0 bg-transparent p-0 text-center text-sm font-bold tabular-nums text-neutral-900 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40"
                    aria-label="Increase quantity"
                    disabled={cartLine.quantity >= 99 || atShelfCap}
                    onClick={() => dispatch(incrementCartLine(cartLine.lineId))}
                  >
                    <Plus className="size-4" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={lineOutOfStock}
                  className="h-12 min-h-12 min-w-0 flex-1 rounded-lg bg-[#0f172a] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e293b] focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400"
                  onClick={handleAddToCart}
                >
                  {lineOutOfStock ? "Out of stock" : "Add"}
                </button>
              )}
              <button
                type="button"
                className="flex h-12 min-h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Add to requisition list"
                title={
                  lineOutOfStock
                    ? "Save to a requisition list (available even when out of stock)"
                    : undefined
                }
                onClick={() => setRequisitionOpen(true)}
              >
                <RequistionIcon color="currentColor" width={28} height={28} />
              </button>
            </div>
          </div>
        </div>

        <RequisitionPickModal
          open={requisitionOpen}
          onClose={() => setRequisitionOpen(false)}
          product={requisitionProduct}
        />

        {/* Tabs — single hairline under tab row only (#EAECF0); no extra top border */}
        <div className="mt-14 sm:mt-16">
          <div
            role="tablist"
            aria-label="Product information"
            className="relative flex w-full items-end justify-between gap-6 overflow-x-auto border-b border-[#EAECF0] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 lg:gap-12 xl:gap-16 [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t) => {
              const label =
                t.id === "reviews"
                  ? `${t.label} (${reviewCount})`
                  : t.label;
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  id={`tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className="relative min-w-max flex-1 px-1 pb-[17px] pt-3 text-center text-[14px] font-medium leading-5 tracking-[-0.15px] text-[#0A0A0A] sm:min-w-0 sm:px-2"
                >
                  <span className="relative z-10 inline-block">{label}</span>
                  {selected ? (
                    <span
                      className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-[#0A0A0A]"
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="pt-10 sm:pt-12 lg:pt-14">
            {tab === "description" ? (
              <div
                id="panel-description"
                role="tabpanel"
                aria-labelledby="tab-description"
                className="max-w-3xl"
              >
                <TabSectionTitle>Product Overview</TabSectionTitle>
                <div className={`space-y-5 ${TAB_BODY_CLASS}`}>
                  {descriptionParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "features" ? (
              <div
                id="panel-features"
                role="tabpanel"
                aria-labelledby="tab-features"
                className="max-w-3xl"
              >
                <TabSectionTitle>Key Features</TabSectionTitle>
                <ul
                  className={`list-outside list-disc space-y-3 pl-5 marker:text-[#0A0A0A] ${TAB_BODY_CLASS}`}
                >
                  {tabFeatures.map((line, i) => (
                    <li key={i} className="pl-1">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === "brand" ? (
              <div
                id="panel-brand"
                role="tabpanel"
                aria-labelledby="tab-brand"
                className="max-w-3xl"
              >
                <TabSectionTitle>About the Brand</TabSectionTitle>
                <p className={TAB_BODY_CLASS}>{tabAboutBrand}</p>
              </div>
            ) : null}

            {tab === "reviews" ? (
              <div
                id="panel-reviews"
                role="tabpanel"
                aria-labelledby="tab-reviews"
                className="max-w-3xl"
              >
                <TabSectionTitle>Customer Reviews</TabSectionTitle>
                <p className={TAB_BODY_CLASS}>
                  Customer reviews and verified ratings will appear here. Demo
                  listing shows{" "}
                  <strong className="font-semibold text-[#0A0A0A]">
                    {reviewCount}
                  </strong>{" "}
                  reviews at{" "}
                  <strong className="font-semibold text-[#0A0A0A]">
                    {rating}
                  </strong>{" "}
                  average — connect your review provider to go live.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <YouMayAlsoLike items={relatedProducts} />
      </div>
    </div>
  );
}
