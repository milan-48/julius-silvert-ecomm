"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { getPricingForSize } from "@/lib/productPricing";
import { addToCartWithNotification } from "@/lib/store/cartThunks";
import { selectWishlistItems } from "@/lib/store/wishlistSlice";
import { persistRemoveWishlistSku } from "@/lib/store/wishlistThunks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function WishlistCard({ item }) {
  const dispatch = useAppDispatch();
  const defaultSize =
    item.defaultSize ?? item.sizeOptions?.[0]?.value ?? "case";
  const resolved = useMemo(
    () =>
      getPricingForSize(
        {
          price: item.price ?? 0,
          unitPrice: item.unitPrice ?? "",
          netWeight: item.netWeight ?? "",
          priceBySize: item.priceBySize ?? undefined,
        },
        defaultSize,
      ),
    [item, defaultSize],
  );

  const purchaseSize =
    item.sizeOptions && item.sizeOptions.length > 1 ? defaultSize : "single";

  const placeholderBg = useMemo(
    () => softPlaceholderBg(item.slug),
    [item.slug],
  );

  return (
    <li className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-neutral-100">
        <Link
          href={`/${item.slug}`}
          className="absolute inset-0 block"
          aria-label={`View ${item.title}`}
        >
          {item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.imageAlt || item.title}
              fill
              className="object-cover transition-opacity hover:opacity-95"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: placeholderBg }}
              aria-hidden
            />
          )}
        </Link>
        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-500 shadow-sm ring-1 ring-black/[0.06] transition-colors hover:bg-white hover:text-neutral-800"
          aria-label={`Remove ${item.title} from wishlist`}
          onClick={() => void dispatch(persistRemoveWishlistSku(item.sku))}
        >
          <X className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/${item.slug}`}
            className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 hover:text-neutral-700"
          >
            {item.title}
          </Link>
          {item.vendor ? (
            <p className="mt-1 text-[11px] font-normal uppercase leading-4 tracking-wide text-neutral-500">
              {item.vendor}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-neutral-500">
            <span className="font-medium">Item#:</span> {item.sku}
          </p>
        </div>
        <p className="text-lg font-bold tabular-nums tracking-tight text-neutral-900">
          {formatUsd(resolved.price)}
          <span className="ml-1 block text-xs font-normal text-neutral-500 sm:ml-1.5 sm:inline">
            {resolved.unitPrice}
          </span>
        </p>
        <button
          type="button"
          className="mt-auto w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          onClick={() =>
            dispatch(
              addToCartWithNotification({
                sku: item.sku,
                slug: item.slug,
                title: item.title,
                imageSrc: item.imageSrc,
                purchaseSize,
                quantity: 1,
                unitPrice: resolved.price,
                unitLabel: resolved.unitPrice,
                sizeOptions:
                  item.sizeOptions && item.sizeOptions.length > 1
                    ? item.sizeOptions
                    : undefined,
                priceBySize: item.priceBySize ?? undefined,
              }),
            )
          }
        >
          Add to cart
        </button>
      </div>
    </li>
  );
}

export function WishlistView() {
  const items = useAppSelector(selectWishlistItems);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-base text-neutral-600">Your wishlist is empty.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Tap the heart on a product to save it here.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
      {items.map((item) => (
        <WishlistCard key={item.sku} item={item} />
      ))}
    </ul>
  );
}
