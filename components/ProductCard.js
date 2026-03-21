"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { getPricingForSize } from "@/lib/productPricing";
import { addToCartWithNotification } from "@/lib/store/cartThunks";
import { decrementCartLine, incrementCartLine } from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CartQuantityInput } from "@/components/CartQuantityInput";
import { RequistionIcon } from "@/lib/icons";
import { LOW_STOCK_THRESHOLD } from "@/lib/memoryDb/stockUtils";
import {
  availableUnitsForPurchase,
  coerceListingStock,
  stockStatusForPurchaseChannel,
} from "@/lib/productStock";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const ICON_STROKE = 1.75;

/**
 * Product tile — Add adds to Redux cart + toast; then shows pill qty stepper.
 *
 * Image area uses a **button + router.push** (not an overlay `Link`) so iOS Safari hit-testing
 * doesn’t swallow taps meant for CASE/PC and quantity controls below.
 *
 * @param {Record<string, { price: number; unitPrice: string; netWeight?: string }> | undefined} priceBySize
 * @param {Record<string, "in_stock"|"low_stock"|"out_of_stock">} [stockStatus] — per channel from `withStockView`
 * @param {number} [stockCase] — fallback counts from `withStockView` when nested `stock` is missing on the client
 * @param {number} [stockPc]
 * @param {number} [stockSingle]
 */
export function ProductCard({
  sku,
  slug,
  imageSrc,
  imageAlt,
  title,
  vendor,
  netWeight,
  price,
  unitPrice,
  footerMode: _footerMode,
  sizeOptions,
  defaultSize,
  priceBySize,
  stock,
  stockStatus,
  stockCase,
  stockPc,
  stockSingle,
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lineSku = sku ?? slug;
  const [wishlisted, setWishlisted] = useState(false);

  const [selectedSize, setSelectedSize] = useState(
    () => defaultSize ?? sizeOptions?.[0]?.value ?? "case",
  );
  const [imageFailed, setImageFailed] = useState(false);

  const productHref = `/${slug}`;
  const placeholderBg = useMemo(() => softPlaceholderBg(slug), [slug]);
  const renderImage = Boolean(imageSrc) && !imageFailed;
  const sizeCount = sizeOptions?.length ?? 0;
  const sizeOptionsScroll = sizeCount > 4;

  const purchaseSizeKey = useMemo(
    () => (sizeOptions && sizeOptions.length > 1 ? selectedSize : "single"),
    [sizeOptions, selectedSize],
  );

  const cartLine = useAppSelector((s) =>
    s.cart.items.find(
      (i) => i.sku === lineSku && i.purchaseSize === purchaseSizeKey,
    ),
  );

  const resolved = useMemo(
    () =>
      getPricingForSize(
        { price, unitPrice, netWeight, priceBySize },
        selectedSize,
      ),
    [priceBySize, selectedSize, price, unitPrice, netWeight],
  );

  const { stock: shelfStock, stockStatus: shelfStockStatus } = useMemo(
    () =>
      coerceListingStock({
        stock,
        stockStatus,
        sizeOptions,
        priceBySize,
        stockCase,
        stockPc,
        stockSingle,
      }),
    [
      stock,
      stockStatus,
      sizeOptions,
      priceBySize,
      stockCase,
      stockPc,
      stockSingle,
    ],
  );

  const maxShelfUnits = useMemo(
    () => availableUnitsForPurchase(shelfStock, purchaseSizeKey),
    [shelfStock, purchaseSizeKey],
  );
  const hasFiniteStock = Number.isFinite(maxShelfUnits);
  const channelStatus = useMemo(
    () => stockStatusForPurchaseChannel(shelfStockStatus, purchaseSizeKey),
    [shelfStockStatus, purchaseSizeKey],
  );
  /** Server `stockStatus` can flag OOS even if `stock` counts weren’t passed to the client. */
  const outOfStock =
    channelStatus === "out_of_stock" ||
    (hasFiniteStock && maxShelfUnits <= 0);
  const lowStock =
    !outOfStock &&
    hasFiniteStock &&
    maxShelfUnits > 0 &&
    (channelStatus === "low_stock" ||
      (channelStatus == null && maxShelfUnits <= LOW_STOCK_THRESHOLD));
  const atShelfCap =
    Number.isFinite(maxShelfUnits) &&
    Boolean(cartLine) &&
    cartLine.quantity >= maxShelfUnits;

  const unitLeftLabel =
    purchaseSizeKey === "case"
      ? "case(s)"
      : purchaseSizeKey === "pc"
        ? "PC(s)"
        : "unit(s)";

  const oosHint = useMemo(() => {
    if (!outOfStock || !sizeOptions || sizeOptions.length < 2) return null;
    const c = Number(shelfStock?.case ?? 0);
    const pc = Number(shelfStock?.pc ?? 0);
    if (purchaseSizeKey === "case" && pc > 0) return " — try PC";
    if (purchaseSizeKey === "pc" && c > 0) return " — try CASE";
    return null;
  }, [outOfStock, sizeOptions, shelfStock, purchaseSizeKey]);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  function handleFirstAdd(e) {
    e.stopPropagation();
    if (outOfStock) return;
    dispatch(
      addToCartWithNotification({
        sku: lineSku,
        slug,
        title,
        imageSrc,
        purchaseSize: purchaseSizeKey,
        quantity: 1,
        unitPrice: resolved.price,
        unitLabel: resolved.unitPrice,
        sizeOptions: sizeOptions?.length > 1 ? sizeOptions : undefined,
        priceBySize: priceBySize ?? undefined,
      }),
    );
  }

  return (
    <article className="flex h-full flex-col overflow-visible rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* z-[1]: media; must stay below the details column for iOS hit-testing */}
      <div className="relative z-[1] aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-xl bg-neutral-100">
        <button
          type="button"
          className="absolute inset-0 z-0 flex h-full w-full cursor-pointer touch-manipulation items-stretch justify-stretch border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          aria-label={`View ${title}`}
          onClick={() => router.push(productHref)}
        >
          {!renderImage ? (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: placeholderBg }}
              aria-hidden
            />
          ) : null}
          {renderImage ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="pointer-events-none object-cover transition-transform duration-300 lg:hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              onError={() => setImageFailed(true)}
            />
          ) : null}
        </button>
        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex size-10 touch-manipulation items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm ring-1 ring-black/[0.06] [-webkit-tap-highlight-color:transparent] transition-colors hover:bg-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 sm:size-9"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted((w) => !w);
          }}
        >
          <Heart
            size={18}
            strokeWidth={ICON_STROKE}
            className={wishlisted ? "fill-red-500 text-red-500" : ""}
            aria-hidden
          />
        </button>

        {outOfStock || lowStock ? (
          <div className="pointer-events-none absolute bottom-2 left-2 z-10 max-w-[calc(100%-1rem)]">
            {outOfStock ? (
              <span className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-medium leading-none tracking-tight text-rose-800 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-md ring-1 ring-black/[0.06] sm:px-4 sm:py-2 sm:text-[13px]">
                <span
                  className="size-2 shrink-0 rounded-full bg-rose-500 sm:size-2.5"
                  aria-hidden
                />
                Out of stock
              </span>
            ) : (
              <span className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-medium leading-none tracking-tight text-amber-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-md ring-1 ring-black/[0.06] sm:px-4 sm:py-2 sm:text-[13px]">
                <span
                  className="size-2 shrink-0 rounded-full bg-amber-500 sm:size-2.5"
                  aria-hidden
                />
                Low stock
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* z-[2]: always above image stack on iOS (later sibling + higher z-index) */}
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col gap-2 rounded-b-xl bg-white p-4">
        <h3 className="min-h-0 text-sm font-semibold leading-5 tracking-[-0.15px] text-[#0A0A0A]">
          <Link
            href={productHref}
            className="hover:text-neutral-800 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {title}
          </Link>
        </h3>
        <p className="text-xs font-normal uppercase leading-4 tracking-normal text-[#6A7282]">
          {vendor}
        </p>
        <p className="text-xs font-normal leading-4 tracking-normal text-[#6A7282]">
          <span className="font-medium">Item#:</span> {sku ?? lineSku}
        </p>
        <p className="text-xs font-normal leading-4 tracking-normal text-[#6A7282]">
          {resolved.netWeight}
        </p>

        {outOfStock ? (
          <p className="text-xs font-medium leading-4 text-rose-800/90" role="status">
            Not available for this unit{oosHint ?? ""}.
          </p>
        ) : hasFiniteStock && lowStock ? (
          <p className="text-xs font-medium leading-4 text-amber-800" role="status">
            Only {maxShelfUnits} {unitLeftLabel} left
          </p>
        ) : null}

        {sizeOptions?.length ? (
          <div
            role="radiogroup"
            aria-label="Purchase unit"
            className="mt-1.5 w-full touch-manipulation rounded-[10px] border border-neutral-200/90 bg-neutral-100 p-1"
          >
            <div
              className={
                sizeOptionsScroll
                  ? "product-size-options-scroll flex snap-x snap-mandatory gap-1 overflow-x-auto pb-0.5"
                  : "flex gap-1"
              }
            >
              {sizeOptions.map((opt) => {
                const selected = selectedSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    title={opt.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(opt.value);
                    }}
                    className={`min-h-11 rounded-lg py-2.5 text-center text-xs font-semibold uppercase tracking-[0.1em] transition-all [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 sm:min-h-10 sm:py-2 ${
                      sizeOptionsScroll
                        ? "shrink-0 snap-start whitespace-nowrap px-3 sm:px-4"
                        : "min-w-0 flex-1 truncate px-1.5 sm:px-2"
                    } ${
                      selected
                        ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/90"
                        : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-xl font-bold tabular-nums tracking-tight text-neutral-900">
            {formatUsd(resolved.price)}
          </span>
          <span className="text-xs tabular-nums text-neutral-500">{resolved.unitPrice}</span>
        </div>

        <div className="mt-auto flex min-w-0 touch-manipulation items-center gap-2 pt-3">
          {cartLine ? (
            <div className="flex h-11 min-h-11 min-w-0 flex-1 items-center justify-between rounded-full border border-neutral-200 bg-white px-1.5 sm:h-10 sm:min-h-0 sm:px-2">
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Decrease quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(decrementCartLine(cartLine.lineId));
                }}
              >
                <Minus className="size-4" strokeWidth={2} aria-hidden />
              </button>
              <CartQuantityInput
                lineId={cartLine.lineId}
                quantity={cartLine.quantity}
                readOnly={outOfStock}
                className="min-w-[2rem] max-w-[3rem] flex-1 border-0 bg-transparent p-0 text-center text-sm font-bold tabular-nums text-neutral-900 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40"
                aria-label="Increase quantity"
                disabled={cartLine.quantity >= 99 || atShelfCap}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(incrementCartLine(cartLine.lineId));
                }}
              >
                <Plus className="size-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={outOfStock}
              className="h-11 min-h-11 min-w-0 flex-1 touch-manipulation rounded-lg bg-neutral-900 text-sm font-semibold tracking-tight text-white transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-neutral-800 disabled:cursor-not-allowed disabled:border disabled:border-rose-200/90 disabled:bg-rose-50/95 disabled:text-rose-900/80 disabled:hover:bg-rose-50/95 sm:h-10 sm:min-h-0"
              onClick={handleFirstAdd}
            >
              {outOfStock ? "Unavailable" : "ADD"}
            </button>
          )}
          <button
            type="button"
            disabled={outOfStock}
            className="flex h-11 min-h-11 w-12 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-transparent text-[#6A7282] transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:hover:bg-neutral-50 sm:h-10 sm:min-h-0 sm:w-11"
            aria-label="Add to requisition list"
            onClick={(e) => e.stopPropagation()}
          >
            <RequistionIcon color="currentColor" width={28} height={28} />
          </button>
        </div>
      </div>
    </article>
  );
}
