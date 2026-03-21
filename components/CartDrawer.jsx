"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  changeCartLinePurchaseSize,
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
    <li className="relative rounded-xl border border-neutral-200/90 bg-neutral-50/90 p-4 pr-12">
      <button
        type="button"
        className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-white hover:text-red-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`Remove ${line.title}`}
        onClick={() => dispatch(removeCartLine(line.lineId))}
      >
        <Trash2 className="size-4" strokeWidth={2} aria-hidden />
      </button>
      <p className="pr-8 text-sm font-bold leading-snug text-[#0f172a]">
        {line.title}
        {sz ? (
          <span className="ml-1 font-medium text-neutral-500">({sz})</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        <span className="tabular-nums">{formatUsd(line.unitPrice)}</span>
        {line.unitLabel ? (
          <span className="tabular-nums">{line.unitLabel}</span>
        ) : null}
      </p>

      {canEditSize ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            Size
          </p>
          <div className="flex flex-wrap gap-1.5">
            {editableSizeOptions.map((opt) => {
              const selected = line.purchaseSize === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    dispatch(
                      changeCartLinePurchaseSize({
                        lineId: line.lineId,
                        purchaseSize: opt.value,
                      }),
                    )
                  }
                  className={`min-h-9 rounded-lg px-3 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    selected
                      ? "bg-[#0f172a] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          Quantity
        </span>
        <div className="flex h-10 min-w-[9rem] max-w-full flex-1 items-center justify-between rounded-full border border-neutral-200 bg-white px-2 sm:flex-initial sm:min-w-[10rem]">
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Decrease quantity"
            onClick={() => dispatch(decrementCartLine(line.lineId))}
          >
            <Minus className="size-4" strokeWidth={2} aria-hidden />
          </button>
          <span className="min-w-[2rem] flex-1 text-center text-sm font-bold tabular-nums text-neutral-900">
            {line.quantity}
          </span>
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={line.quantity >= 99}
            onClick={() => dispatch(incrementCartLine(line.lineId))}
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      <p className="mt-2">
        <Link
          href={`/${line.slug}`}
          className="text-xs font-medium text-blue-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => dispatch(closeCartDrawer())}
        >
          View product details
        </Link>
      </p>

      <p className="mt-3 text-right text-base font-bold tabular-nums text-[#0f172a]">
        {formatUsd(lineTotal)}
      </p>
    </li>
  );
}

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);

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

  if (typeof document === "undefined") return null;

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
        <header className="flex shrink-0 items-center gap-3 border-b border-neutral-200 px-4 py-4 sm:px-5">
          <ShoppingBag
            className="size-6 shrink-0 text-blue-600"
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

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-12 text-center text-sm text-neutral-500">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((line) => (
                <CartLineRow key={line.lineId} line={line} />
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-neutral-200 bg-white px-4 py-4 sm:px-5">
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
            className="mt-5 w-full rounded-xl bg-[#0f172a] py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e293b] focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
