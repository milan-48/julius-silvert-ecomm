"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { getPricingForSize } from "@/lib/productPricing";
import { RequistionIcon } from "@/lib/icons";
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
const QTY_MIN = 1;
const QTY_MAX = 99;

function clampQty(n) {
  const x = Math.floor(Number(n));
  if (Number.isNaN(x)) return QTY_MIN;
  return Math.min(QTY_MAX, Math.max(QTY_MIN, x));
}

/**
 * Product tile — static data from constants; cart actions are UI-only until checkout exists.
 *
 * Image area uses a **button + router.push** (not an overlay `Link`) so iOS Safari hit-testing
 * doesn’t swallow taps meant for CASE/PC and quantity controls below.
 *
 * @param {Record<string, { price: number; unitPrice: string; netWeight?: string }> | undefined} priceBySize
 */
export function ProductCard({
  slug,
  imageSrc,
  imageAlt,
  tier,
  title,
  vendor,
  netWeight,
  price,
  unitPrice,
  footerMode,
  sizeOptions,
  defaultSize,
  priceBySize,
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");
  const qtyFieldRef = useRef(null);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const el = qtyFieldRef.current;
    if (!el) return;
    const onWheel = (e) => e.preventDefault();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const [selectedSize, setSelectedSize] = useState(
    () => defaultSize ?? sizeOptions?.[0]?.value ?? "case",
  );
  const [imageFailed, setImageFailed] = useState(false);

  const productHref = `/${slug}`;
  const placeholderBg = useMemo(() => softPlaceholderBg(slug), [slug]);
  const renderImage = Boolean(imageSrc) && !imageFailed;
  const sizeCount = sizeOptions?.length ?? 0;
  const sizeOptionsScroll = sizeCount > 4;

  function setQtyCommitted(next) {
    const q = clampQty(next);
    setQty(q);
    setQtyInput(String(q));
  }

  const resolved = useMemo(
    () =>
      getPricingForSize(
        { price, unitPrice, netWeight, priceBySize },
        selectedSize,
      ),
    [priceBySize, selectedSize, price, unitPrice, netWeight],
  );

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

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
      </div>

      {/* z-[2]: always above image stack on iOS (later sibling + higher z-index) */}
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col gap-2 rounded-b-xl bg-white p-4">
        <p className="text-xs font-normal uppercase leading-4 tracking-normal text-[#6A7282]">
          {tier}
        </p>
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
          {resolved.netWeight}
        </p>

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
          {footerMode === "quantity" ? (
            <div className="flex h-11 min-h-11 min-w-0 flex-1 items-center justify-between rounded-lg border border-neutral-200 bg-white px-1 sm:h-10 sm:min-h-0 sm:px-2">
              <button
                type="button"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-neutral-600 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-neutral-100 disabled:opacity-40 sm:size-9"
                aria-label="Decrease quantity"
                disabled={qty <= QTY_MIN}
                onClick={(e) => {
                  e.stopPropagation();
                  setQtyCommitted(qty - 1);
                }}
              >
                <Minus
                  className="size-[18px] sm:size-4"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
              <input
                ref={qtyFieldRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Quantity"
                value={qtyInput}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setQtyInput(v);
                  if (v !== "") {
                    const n = parseInt(v, 10);
                    if (!Number.isNaN(n)) setQty(clampQty(n));
                  }
                }}
                onBlur={() => {
                  const n = parseInt(qtyInput, 10);
                  const q =
                    qtyInput === "" || Number.isNaN(n)
                      ? QTY_MIN
                      : clampQty(n);
                  setQtyCommitted(q);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="min-h-11 min-w-[2rem] max-w-[3.5rem] flex-1 touch-manipulation bg-transparent text-center text-sm font-semibold tabular-nums text-neutral-900 outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 sm:min-h-0"
              />
              <button
                type="button"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-neutral-600 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-neutral-100 sm:size-9"
                aria-label="Increase quantity"
                disabled={qty >= QTY_MAX}
                onClick={(e) => {
                  e.stopPropagation();
                  setQtyCommitted(qty + 1);
                }}
              >
                <Plus
                  className="size-[18px] sm:size-4"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="h-11 min-h-11 min-w-0 flex-1 touch-manipulation rounded-lg bg-neutral-900 text-sm font-semibold tracking-tight text-white transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-neutral-800 sm:h-10 sm:min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              ADD
            </button>
          )}
          <button
            type="button"
            className="flex h-11 min-h-11 w-12 shrink-0 touch-manipulation items-center justify-center rounded-lg text-[#6A7282] transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-neutral-100 sm:h-10 sm:min-h-0 sm:w-11"
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
