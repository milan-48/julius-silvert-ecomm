"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { CartQuantityInput } from "@/components/CartQuantityInput";
import {
  changeCartLinePurchaseSize,
  clearCart,
  closeCartDrawer,
  decrementCartLine,
  incrementCartLine,
  removeCartLine,
  selectCartCount,
  selectCartDrawerOpen,
  selectCartItems,
  selectCartSubtotal,
} from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function sizeLabel(purchaseSize) {
  if (purchaseSize === "single") return "";
  if (purchaseSize === "case") return "Case";
  if (purchaseSize === "pc") return "PC";
  return purchaseSize;
}

function CartLineRow({ line }) {
  const dispatch = useAppDispatch();
  const lineTotal = line.unitPrice * line.quantity;
  const sz = sizeLabel(line.purchaseSize);
  const editableSizeOptions =
    Array.isArray(line.sizeOptions) && line.priceBySize
      ? line.sizeOptions.filter((opt) => line.priceBySize[opt.value])
      : [];
  const canEditSize = editableSizeOptions.length > 1;

  return (
    <li className="relative rounded-lg border border-neutral-200/90 bg-neutral-50/80 p-2.5 pr-10 sm:p-3 sm:pr-11">
      <button
        type="button"
        className="absolute right-2 top-2 rounded-md p-1 text-neutral-400 transition-colors hover:bg-white hover:text-red-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 sm:right-2.5 sm:top-2.5"
        aria-label={`Remove ${line.title}`}
        onClick={() => dispatch(removeCartLine(line.lineId))}
      >
        <Trash2 className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
      </button>
      <p className="pr-5 text-[13px] font-bold leading-tight text-[#0f172a] sm:text-sm">
        <span className="line-clamp-2">{line.title}</span>
        {sz ? (
          <span className="font-medium text-neutral-500"> ({sz})</span>
        ) : null}
      </p>
      <p className="mt-0.5 pr-5 text-[11px] leading-snug text-neutral-500 sm:text-xs">
        <span className="font-medium text-neutral-600">Item#:</span>{" "}
        <span className="tabular-nums text-neutral-700">
          {line.sku || line.slug}
        </span>
      </p>
      {/* Unit price + line total on one row */}
      <div className="mt-1 flex items-baseline justify-between gap-2 border-b border-neutral-200/60 pb-2">
        <p className="min-w-0 flex-1 truncate text-[11px] leading-snug text-neutral-500 sm:text-xs">
          <span className="tabular-nums">{formatUsd(line.unitPrice)}</span>
          {line.unitLabel ? (
            <span className="tabular-nums"> {line.unitLabel}</span>
          ) : null}
        </p>
        <p className="shrink-0 text-sm font-bold tabular-nums text-[#0f172a]">
          {formatUsd(lineTotal)}
        </p>
      </div>

      {/* Size chips + qty stepper — single band, no stacked section labels */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {canEditSize
            ? editableSizeOptions.map((opt) => {
                const selected = line.purchaseSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={`Size: ${opt.label}`}
                    onClick={() =>
                      dispatch(
                        changeCartLinePurchaseSize({
                          lineId: line.lineId,
                          purchaseSize: opt.value,
                        }),
                      )
                    }
                    className={`min-h-7 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 sm:min-h-8 sm:px-2.5 sm:text-[11px] ${
                      selected
                        ? "bg-[#0f172a] text-white"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })
            : null}
        </div>
        <div
          className="flex h-8 shrink-0 items-center justify-between rounded-full border border-neutral-200 bg-white px-1 sm:h-9"
          role="group"
          aria-label="Quantity"
        >
          <button
            type="button"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 sm:size-8"
            aria-label="Decrease quantity"
            onClick={() => dispatch(decrementCartLine(line.lineId))}
          >
            <Minus className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
          </button>
          <CartQuantityInput
            lineId={line.lineId}
            quantity={line.quantity}
            className="min-w-[1.75rem] max-w-[2.5rem] border-0 bg-transparent p-0 text-center text-xs font-bold tabular-nums text-neutral-900 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 sm:min-w-[2rem] sm:text-sm"
          />
          <button
            type="button"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 sm:size-8"
            aria-label="Increase quantity"
            disabled={line.quantity >= 99}
            onClick={() => dispatch(incrementCartLine(line.lineId))}
          >
            <Plus className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      <p className="mt-1.5">
        <Link
          href={`/${line.slug}`}
          className="text-[11px] font-medium text-blue-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-xs"
          onClick={() => dispatch(closeCartDrawer())}
        >
          View product details
        </Link>
      </p>
    </li>
  );
}

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector(selectCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  /** Avoid hydration mismatch: SSR + first client paint match `null`; portal only after mount. */
  const [mounted, setMounted] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(closeCartDrawer());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  async function handleCheckoutAndPay() {
    if (items.length === 0) return;
    setCheckoutBusy(true);
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            sku: i.sku,
            purchaseSize: i.purchaseSize,
            quantity: i.quantity,
          })),
        }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore */
      }
      if (!res.ok) {
        toast.error(
          typeof data.message === "string"
            ? data.message
            : typeof data.error === "string"
              ? data.error
              : "Checkout failed",
        );
        return;
      }
      toast.success("Payment complete — inventory updated");
      dispatch(clearCart());
      dispatch(closeCartDrawer());
      router.refresh();
    } catch {
      toast.error("Network error — try again");
    } finally {
      setCheckoutBusy(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] transition-[visibility] duration-200 ${
        open ? "visible" : "pointer-events-none invisible delay-200"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-neutral-900/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        tabIndex={open ? 0 : -1}
        aria-label="Close cart"
        onClick={() => dispatch(closeCartDrawer())}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-neutral-200 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <ShoppingBag
            className="size-6 shrink-0 text-[#0f172a]"
            strokeWidth={1.75}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h2
              id="cart-drawer-title"
              className="text-lg font-bold leading-tight text-[#0f172a]"
            >
              Your Cart
            </h2>
            <p className="text-sm text-neutral-500">
              ({count} {count === 1 ? "item" : "items"})
            </p>
          </div>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close cart"
            onClick={() => dispatch(closeCartDrawer())}
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-12 text-center text-sm text-neutral-500">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 sm:gap-2.5">
              {items.map((line) => (
                <CartLineRow key={line.lineId} line={line} />
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-neutral-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between text-sm text-neutral-700">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums text-[#0f172a]">
              {formatUsd(subtotal)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-bold text-[#0f172a]">
            <span>Total</span>
            <span className="tabular-nums">{formatUsd(subtotal)}</span>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-[#0f172a] py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e293b] focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5 sm:py-3.5"
            disabled={items.length === 0 || checkoutBusy}
            onClick={() => void handleCheckoutAndPay()}
          >
            {checkoutBusy ? "Processing…" : "Checkout & pay"}
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
