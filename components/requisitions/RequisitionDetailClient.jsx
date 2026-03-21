"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  availableUnitsForPurchase,
  coerceListingStock,
  stockStatusForPurchaseChannel,
} from "@/lib/productStock";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";
import { addToCart, openCartDrawer } from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatActivity(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function sizeLabel(purchaseSize) {
  const s = String(purchaseSize ?? "");
  if (s === "case") return "CASE";
  if (s === "pc") return "PC";
  if (s === "single") return "UNIT";
  return s.toUpperCase() || "—";
}

/** @param {{ sku: string; purchaseSize: string }} line */
export function requisitionLineKey(line) {
  return `${line.sku}::${line.purchaseSize}`;
}

/**
 * @param {Record<string, unknown> | undefined} product
 * @param {{ purchaseSize?: string }} line
 */
function getStockContext(product, line) {
  const purchaseSize = String(line.purchaseSize ?? "single");
  const { stock, stockStatus } = coerceListingStock({
    stock: product?.stock,
    stockStatus: product?.stockStatus,
    sizeOptions: product?.sizeOptions,
    priceBySize: product?.priceBySize,
    stockCase: product?.stockCase,
    stockPc: product?.stockPc,
    stockSingle: product?.stockSingle,
  });
  const channelStatus = stockStatusForPurchaseChannel(stockStatus, purchaseSize);
  const maxShelf = availableUnitsForPurchase(stock, purchaseSize);
  const hasFinite = Number.isFinite(maxShelf);
  const oos =
    channelStatus === "out_of_stock" ||
    (hasFinite && maxShelf <= 0);
  return { maxShelf, oos, channelStatus, hasFinite };
}

/**
 * @param {Record<string, unknown> | undefined} product
 * @param {Record<string, unknown>} line
 * @param {number} requestedQty
 * @param {number} inCartQty — current cart qty for this sku + purchaseSize (include prior adds in same batch)
 */
function qtyToAddToCart(product, line, requestedQty, inCartQty) {
  if (!product) return { add: 0, reason: "no_product" };
  const purchaseSize = String(line.purchaseSize ?? "single");
  const { maxShelf, oos, hasFinite } = getStockContext(product, line);
  if (oos) return { add: 0, reason: "out" };
  const inCart = Math.max(0, Math.floor(Number(inCartQty) || 0));
  const roomInCart = Math.max(0, 99 - inCart);
  if (roomInCart <= 0) return { add: 0, reason: "cart_full" };
  if (hasFinite) {
    const roomShelf = Math.max(0, maxShelf - inCart);
    const add = Math.min(requestedQty, roomShelf, roomInCart);
    if (add <= 0) return { add: 0, reason: "no_room" };
    if (add < requestedQty) return { add, reason: "partial" };
    return { add, reason: "ok" };
  }
  const add = Math.min(requestedQty, roomInCart);
  if (add <= 0) return { add: 0, reason: "no_room" };
  if (add < requestedQty) return { add, reason: "partial" };
  return { add, reason: "ok" };
}

function stockBadgeLabel(oos, channelStatus, catalogLoaded, productMissing) {
  if (!catalogLoaded) return "Checking…";
  if (productMissing) return "Unavailable";
  if (oos) return "Out of stock";
  if (channelStatus === "low_stock") return "Low stock";
  if (channelStatus === "in_stock") return "In stock";
  return "Unavailable";
}

/**
 * @param {{ slug: string; imageSrc: string; href: string }} props
 */
function RequisitionLineThumb({ slug, imageSrc, href }) {
  const [failed, setFailed] = useState(false);
  const placeholderBg = useMemo(
    () => softPlaceholderBg(slug || "product"),
    [slug],
  );
  const src = String(imageSrc ?? "").trim();
  const canTryImage =
    Boolean(src) &&
    !failed &&
    (src.startsWith("https://") ||
      src.startsWith("http://") ||
      src.startsWith("/"));

  return (
    <Link
      href={href}
      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/80"
    >
      {canTryImage ? (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: placeholderBg }}
          aria-hidden
        />
      )}
    </Link>
  );
}

/**
 * @param {{ listId: string }} props
 */
export function RequisitionDetailClient({ listId }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);

  const [list, setList] = useState(/** @type {object | null} */ (null));
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadGen, setLoadGen] = useState(0);
  const [catalogBySlug, setCatalogBySlug] = useState(
    /** @type {Map<string, Record<string, unknown>>} */ (new Map()),
  );
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [selected, setSelected] = useState(
    /** @type {Set<string>} */ (new Set()),
  );
  const [qtyByKey, setQtyByKey] = useState(/** @type {Record<string, number>} */ ({}));
  const [qtyBusy, setQtyBusy] = useState(/** @type {Record<string, boolean>} */ ({}));
  const [addCartBusy, setAddCartBusy] = useState(false);

  const selectAllRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/requisitions/${encodeURIComponent(listId)}`, {
        cache: "no-store",
      });
      const d = await r.json();
      if (r.status === 404) {
        setNotFound(true);
        setList(null);
        return;
      }
      if (!r.ok || !d.list) {
        toast.error("Could not load list");
        setList(null);
        return;
      }
      setNotFound(false);
      setList(d.list);
      setLoadGen((g) => g + 1);
    } catch {
      toast.error("Could not load list");
      setList(null);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch("/api/catalog/products", { cache: "no-store" });
        const d = await r.json();
        if (cancel || !Array.isArray(d.products)) return;
        setCatalogBySlug(new Map(d.products.map((p) => [p.slug, p])));
      } catch {
        /* ignore */
      } finally {
        if (!cancel) setCatalogLoaded(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!list?.items) return;
    const o = {};
    for (const line of list.items) {
      const k = requisitionLineKey(line);
      o[k] = Math.max(1, Math.min(99, Number(line.quantity) || 1));
    }
    setQtyByKey(o);
    setSelected(new Set());
  }, [loadGen]);

  const persistQty = useCallback(
    async (line, nextQty) => {
      const k = requisitionLineKey(line);
      const q = Math.max(1, Math.min(99, Math.floor(Number(nextQty)) || 1));
      const prev = Math.max(1, Math.min(99, Number(line.quantity) || 1));
      setQtyByKey((s) => ({ ...s, [k]: q }));
      setQtyBusy((s) => ({ ...s, [k]: true }));
      try {
        const r = await fetch("/api/requisitions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "setItemQty",
            listId,
            sku: line.sku,
            purchaseSize: line.purchaseSize,
            quantity: q,
          }),
          cache: "no-store",
        });
        if (!r.ok) throw new Error("bad");
        setList((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((it) =>
              it.sku === line.sku && it.purchaseSize === line.purchaseSize
                ? { ...it, quantity: q }
                : it,
            ),
            updatedAt: new Date().toISOString(),
          };
        });
      } catch {
        toast.error("Could not update quantity");
        setQtyByKey((s) => ({ ...s, [k]: prev }));
      } finally {
        setQtyBusy((s) => ({ ...s, [k]: false }));
      }
    },
    [listId],
  );

  async function removeLine(sku, purchaseSize) {
    try {
      const r = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "removeItem",
          listId,
          sku,
          purchaseSize,
        }),
        cache: "no-store",
      });
      if (!r.ok) {
        toast.error("Could not remove item");
        return;
      }
      await load();
      toast.success("Removed from list");
    } catch {
      toast.error("Could not remove item");
    }
  }

  const items = Array.isArray(list?.items) ? list.items : [];
  const desc = String(list?.description ?? "").trim();

  const { selectableKeys, lineMeta } = useMemo(() => {
    const meta = new Map();
    const selectable = [];
    for (const line of items) {
      const k = requisitionLineKey(line);
      const product = catalogBySlug.get(String(line.slug ?? ""));
      const ctx = getStockContext(product, line);
      const productMissing = catalogLoaded && !product;
      const disabled = !product || ctx.oos;
      meta.set(k, { product, ...ctx, productMissing, disabled });
      if (!disabled) selectable.push(k);
    }
    return { selectableKeys: selectable, lineMeta: meta };
  }, [items, catalogBySlug, catalogLoaded]);

  const allSelectableSelected =
    selectableKeys.length > 0 &&
    selectableKeys.every((k) => selected.has(k));
  const someSelected = selectableKeys.some((k) => selected.has(k));

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = someSelected && !allSelectableSelected;
  }, [someSelected, allSelectableSelected]);

  function toggleKey(k) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelectableSelected) setSelected(new Set());
    else setSelected(new Set(selectableKeys));
  }

  function addSelectedToCart() {
    if (selected.size === 0) {
      toast.error("Select at least one in-stock item");
      return;
    }
    setAddCartBusy(true);
    try {
      let addedUnits = 0;
      const partial = [];
      const skipped = [];

      /** Running cart qty per line so multiple adds in one batch respect shelf + 99 cap */
      const cartQty = new Map();
      for (const i of cartItems) {
        cartQty.set(`${i.sku}::${i.purchaseSize}`, i.quantity);
      }

      for (const line of items) {
        const k = requisitionLineKey(line);
        if (!selected.has(k)) continue;
        const product = /** @type {Record<string, unknown> | undefined} */ (
          catalogBySlug.get(String(line.slug ?? ""))
        );
        const fromState = qtyByKey[k];
        const requested = Math.max(
          1,
          Math.min(
            99,
            fromState !== undefined ? fromState : Number(line.quantity) || 1,
          ),
        );
        const inCart = cartQty.get(k) ?? 0;
        const { add, reason } = qtyToAddToCart(product, line, requested, inCart);

        if (add <= 0) {
          if (reason === "out") skipped.push(`${line.title} (out of stock)`);
          else if (reason === "cart_full")
            skipped.push(`${line.title} (cart limit reached)`);
          else if (reason === "no_product")
            skipped.push(`${line.title} (unavailable)`);
          else skipped.push(`${line.title} (cannot add more)`);
          continue;
        }

        dispatch(
          addToCart({
            sku: line.sku,
            slug: line.slug,
            title: line.title,
            imageSrc: line.imageSrc ?? "",
            purchaseSize: line.purchaseSize,
            quantity: add,
            unitPrice: Number(line.unitPrice) || 0,
            unitLabel: String(line.unitLabel ?? ""),
            sizeOptions: line.sizeOptions ?? undefined,
            priceBySize: line.priceBySize ?? undefined,
          }),
        );
        cartQty.set(k, inCart + add);
        addedUnits += add;
        if (add < requested) {
          partial.push(`${line.title}: added ${add} of ${requested}`);
        }
      }

      if (addedUnits > 0) {
        dispatch(openCartDrawer());
        toast.success(
          addedUnits === 1
            ? "Added 1 item to cart"
            : `Added ${addedUnits} items to cart`,
        );
      }
      if (partial.length) {
        toast("Limited by availability", {
          description: partial.slice(0, 4).join("\n"),
        });
      }
      if (skipped.length && addedUnits === 0) {
        toast.error("Nothing added to cart", {
          description: skipped.slice(0, 3).join("\n"),
        });
      } else if (skipped.length) {
        toast("Some items skipped", {
          description: skipped.slice(0, 4).join("\n"),
        });
      }
    } finally {
      setAddCartBusy(false);
    }
  }

  if (loading && !list) {
    return (
      <main className="site-container py-10 sm:py-14">
        <p className="text-sm text-neutral-500">Loading…</p>
      </main>
    );
  }

  if (notFound || !list) {
    return (
      <main className="site-container py-10 sm:py-14">
        <h1 className="text-xl font-bold text-neutral-900">List not found</h1>
        <p className="mt-2 text-sm text-neutral-600">
          This requisition list may have been deleted.
        </p>
        <Link
          href="/requisitions"
          className="mt-6 inline-block text-sm font-medium text-[#E7000B] underline-offset-4 hover:underline"
        >
          Back to all lists
        </Link>
      </main>
    );
  }

  return (
    <main className="site-container py-10 sm:py-14">
      <nav className="text-xs font-medium text-neutral-500">
        <Link href="/requisitions" className="hover:text-neutral-800 hover:underline">
          Requisition lists
        </Link>
        <span className="mx-2 text-neutral-300">/</span>
        <span className="text-neutral-800">{list.name}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {list.name}
          </h1>
          {desc ? (
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
              {desc}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-neutral-500">
            Updated {formatActivity(list.updatedAt)} · {items.length} item
            {items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/requisitions"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            All lists
          </Link>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-rose-200/80 bg-white px-4 text-sm font-medium text-rose-800 transition-colors hover:bg-rose-50"
            onClick={async () => {
              if (!window.confirm(`Delete “${list.name}”?`)) return;
              const r = await fetch("/api/requisitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "deleteList", listId: list.id }),
                cache: "no-store",
              });
              if (!r.ok) {
                toast.error("Could not delete");
                return;
              }
              toast.success("List deleted");
              router.push("/requisitions");
            }}
          >
            Delete list
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 px-6 py-14 text-center">
          <p className="text-sm font-medium text-neutral-800">This list is empty</p>
          <p className="mt-2 text-sm text-neutral-500">
            Add products using the checklist icon next to <strong>Add</strong> on any product.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-800">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelectableSelected}
                onChange={toggleSelectAll}
                disabled={selectableKeys.length === 0}
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20"
              />
              Select all in stock
            </label>
            <button
              type="button"
              disabled={addCartBusy || selected.size === 0}
              onClick={addSelectedToCart}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            >
              {addCartBusy ? "Adding…" : "Add selected to cart"}
            </button>
          </div>

          <ul className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            {items.map((line, idx) => {
              const href = `/${line.slug}`;
              const k = requisitionLineKey(line);
              const meta = lineMeta.get(k);
              const product = meta?.product;
              const oos = meta?.oos ?? true;
              const channelStatus = meta?.channelStatus ?? null;
              const productMissing = meta?.productMissing ?? false;
              const rowDisabled = meta?.disabled ?? true;
              const qty = qtyByKey[k] ?? Math.max(1, Math.min(99, Number(line.quantity) || 1));
              const unit = Number(line.unitPrice) || 0;
              const lineTotal = qty * unit;
              const busy = Boolean(qtyBusy[k]);

              const badge = stockBadgeLabel(
                oos,
                channelStatus,
                catalogLoaded,
                productMissing,
              );
              const badgeClass =
                oos || productMissing
                  ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200/80"
                  : channelStatus === "low_stock"
                    ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200/70"
                    : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/70";

              return (
                <li
                  key={`${line.sku}-${line.purchaseSize}-${idx}`}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:items-center">
                    <input
                      type="checkbox"
                      checked={selected.has(k)}
                      onChange={() => toggleKey(k)}
                      disabled={rowDisabled}
                      aria-label={`Select ${line.title}`}
                      className="mt-1 size-4 shrink-0 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-0"
                    />
                    <RequisitionLineThumb
                      slug={String(line.slug ?? "")}
                      imageSrc={String(line.imageSrc ?? "")}
                      href={href}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={href}
                      className="font-semibold text-neutral-900 underline-offset-2 hover:underline"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-1 text-xs text-neutral-500">
                      Item# {line.sku}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}
                      >
                        {badge}
                      </span>
                      <span className="inline-flex rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-700">
                        {sizeLabel(line.purchaseSize)}
                      </span>
                      <span className="text-sm tabular-nums text-neutral-700">
                        {formatUsd(unit)}{" "}
                        <span className="text-neutral-400">·</span>{" "}
                        <span className="text-neutral-500">{line.unitLabel}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-4 sm:ml-auto sm:w-auto sm:justify-end sm:gap-8 sm:pl-2 md:pl-4">
                    <div
                      className="inline-grid h-9 w-24 shrink-0 grid-cols-3 items-center justify-items-center rounded-full border border-neutral-200 bg-white px-px"
                      role="group"
                      aria-label="Quantity"
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy || qty <= 1}
                        className="flex size-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                        onClick={() => void persistQty(line, qty - 1)}
                      >
                        <Minus className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                      <div className="flex h-9 w-full min-w-0 items-center justify-center">
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={qty}
                          disabled={busy}
                          aria-label="Quantity on list"
                          className="w-full min-w-0 border-0 bg-transparent p-0 text-center text-sm font-bold tabular-nums leading-none text-neutral-900 outline-none focus:ring-0 disabled:opacity-50 [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          onChange={(e) => {
                            const v = Math.max(
                              1,
                              Math.min(99, Math.floor(Number(e.target.value)) || 1),
                            );
                            setQtyByKey((s) => ({ ...s, [k]: v }));
                          }}
                          onBlur={() => {
                            const serverLine = list?.items?.find(
                              (it) =>
                                it.sku === line.sku &&
                                it.purchaseSize === line.purchaseSize,
                            );
                            const serverQ = Math.max(
                              1,
                              Math.min(99, Number(serverLine?.quantity) || 1),
                            );
                            const local = qtyByKey[k] ?? serverQ;
                            if (local !== serverQ) void persistQty(line, local);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={busy || qty >= 99}
                        className="flex size-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                        onClick={() => void persistQty(line, qty + 1)}
                      >
                        <Plus className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                    </div>

                    <div className="min-w-[6.5rem] shrink-0 text-right sm:min-w-[7rem]">
                      <p className="text-sm font-bold tabular-nums text-neutral-900">
                        {formatUsd(lineTotal)}
                      </p>
                      <button
                        type="button"
                        className="mt-1 text-xs font-medium text-rose-700 hover:underline"
                        onClick={() => void removeLine(line.sku, line.purchaseSize)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
