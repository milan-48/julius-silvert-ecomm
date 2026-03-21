"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const SEARCH_DEBOUNCE_MS = 320;

const STOCK_FILTERS = [
  { value: "all", label: "All stock levels" },
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

const STOCK_LEVEL_PARAM_VALUES = new Set(
  STOCK_FILTERS.map((f) => f.value).filter((v) => v !== "all"),
);

/** URL: `?category=meat-poultry` or omit / `all` for every category */
function categoryFromSearchParam(raw) {
  if (!raw || raw === "all") return "all";
  return CATEGORIES.some((c) => c.slug === raw) ? raw : "all";
}

/** URL: `?stock=low_stock` etc. */
function stockLevelFromSearchParam(raw) {
  if (!raw || raw === "all") return "all";
  return STOCK_LEVEL_PARAM_VALUES.has(raw) ? raw : "all";
}

const FILTER_SELECT_BG = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>',
)}")`;

const filterSelectClassName =
  "box-border h-11 w-full min-w-[min(100%,260px)] cursor-pointer rounded-lg border border-neutral-300 bg-white " +
  "py-0 pl-3.5 pr-10 text-left text-[14px] font-normal text-neutral-900 " +
  "leading-[2.75rem] [-webkit-appearance:none] [appearance:none] " +
  "shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] " +
  "hover:border-neutral-400 " +
  "focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const inputClass =
  "w-[4.5rem] rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium tabular-nums text-neutral-900 " +
  "focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-neutral-100";

/** Category / SKU / product name — one type scale + weight for aligned table rows */
const STOCK_TABLE_TEXT_CELL =
  "min-w-0 px-3 py-2.5 text-sm font-normal leading-snug text-neutral-800";

function FilterSelect({ className = "", style, ...rest }) {
  return (
    <select
      {...rest}
      className={`${filterSelectClassName} ${className}`.trim()}
      style={{
        backgroundImage: FILTER_SELECT_BG,
        backgroundSize: "1.25rem",
        backgroundPosition: "right 0.625rem center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

function StatusPill({ status }) {
  const map = {
    in_stock: {
      label: "In stock",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    low_stock: {
      label: "Low",
      className: "border-amber-200 bg-amber-50 text-amber-900",
    },
    out_of_stock: {
      label: "Out of stock",
      className: "border-neutral-200 bg-neutral-100 text-neutral-600",
    },
  };
  const x = map[status] ?? map.out_of_stock;
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${x.className}`}
    >
      {x.label}
    </span>
  );
}

function categoryLabel(slug) {
  const c = CATEGORIES.find((x) => x.slug === slug);
  return c?.name ?? slug;
}

function StockColgroup() {
  return (
    <colgroup>
      <col style={{ width: "12%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "42%" }} />
      <col style={{ width: "13%" }} />
    </colgroup>
  );
}

function matchesStockFilter(stockStatus, filter) {
  if (filter === "all") return true;
  if (!stockStatus || typeof stockStatus !== "object") return false;
  return Object.values(stockStatus).includes(filter);
}

/** @param {{ sku?: string; title?: string }} p @param {string} needleLower trimmed lowercase */
function matchesSkuOrTitle(p, needleLower) {
  if (!needleLower) return true;
  const sku = String(p.sku ?? "").toLowerCase();
  const title = String(p.title ?? "").toLowerCase();
  return sku.includes(needleLower) || title.includes(needleLower);
}

function rowDraftFor(product, draft) {
  const d = draft[product.slug];
  if (d) return d;
  return {
    case: product.stockCase ?? 0,
    pc: product.stockPc ?? 0,
    single: product.stockSingle ?? 0,
  };
}

/** Compare draft to server for all loaded products (not only filtered rows). */
function buildUpdates(products, draft) {
  const updates = [];
  for (const p of products) {
    const d = rowDraftFor(p, draft);
    if (p.hasCasePc) {
      const sc = p.stockCase ?? 0;
      const sp = p.stockPc ?? 0;
      if (d.case !== sc || d.pc !== sp) {
        updates.push({
          slug: p.slug,
          stockCase: d.case,
          stockPc: d.pc,
        });
      }
    } else {
      const ss = p.stockSingle ?? 0;
      if (d.single !== ss) {
        updates.push({ slug: p.slug, stockSingle: d.single });
      }
    }
  }
  return updates;
}

function PinSaveModal({
  open,
  pin,
  onPinChange,
  onClose,
  onConfirm,
  busy,
  error,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-pin-title"
        className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          id="stock-pin-title"
          className="text-lg font-semibold tracking-tight text-neutral-900"
        >
          Confirm stock save
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your 6-digit PIN to write changes to the catalog.
        </p>
        <label className="mt-5 block text-sm font-medium text-neutral-800">
          PIN
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={pin}
            onChange={(e) =>
              onPinChange(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              if (busy || pin.length !== 6) return;
              onConfirm();
            }}
            className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-center text-lg font-semibold tracking-[0.35em] text-neutral-900 tabular-nums focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            placeholder="••••••"
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || pin.length !== 6}
            className="rounded-lg bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StockCountPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categorySlug = categoryFromSearchParam(searchParams.get("category"));
  const stockFilter = stockLevelFromSearchParam(searchParams.get("stock"));

  const setFilterParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams.toString());
      if (patch.category !== undefined) {
        if (!patch.category || patch.category === "all") {
          next.delete("category");
        } else {
          next.set("category", patch.category);
        }
      }
      if (patch.stock !== undefined) {
        if (!patch.stock || patch.stock === "all") {
          next.delete("stock");
        } else {
          next.set("stock", patch.stock);
        }
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState({});
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [pinModalError, setPinModalError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/catalog/inventory", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to load");
      const list = d.products ?? [];
      setProducts(list);
      const initial = {};
      for (const p of list) {
        initial[p.slug] = {
          case: p.stockCase ?? 0,
          pc: p.stockPc ?? 0,
          single: p.stockSingle ?? 0,
        };
      }
      setDraft(initial);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categorySlug !== "all" && p.categorySlug !== categorySlug) {
        return false;
      }
      if (!matchesStockFilter(p.stockStatus, stockFilter)) {
        return false;
      }
      return matchesSkuOrTitle(p, debouncedSearch);
    });
  }, [products, categorySlug, stockFilter, debouncedSearch]);

  const pendingUpdates = useMemo(
    () => buildUpdates(products, draft),
    [products, draft],
  );
  const hasPending = pendingUpdates.length > 0;

  const setChannel = useCallback((slug, product, partial) => {
    setDraft((prev) => {
      const cur = rowDraftFor(product, prev);
      return { ...prev, [slug]: { ...cur, ...partial } };
    });
  }, []);

  const closePinModal = useCallback(() => {
    if (pinBusy) return;
    setPinOpen(false);
    setPin("");
    setPinModalError(null);
  }, [pinBusy]);

  const confirmSaveWithPin = useCallback(async () => {
    const updates = buildUpdates(products, draft);
    if (updates.length === 0) {
      closePinModal();
      return;
    }
    if (pin.length !== 6) return;
    setPinBusy(true);
    setPinModalError(null);
    try {
      const r = await fetch("/api/catalog/inventory/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, updates }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Save failed");
      setPinOpen(false);
      setPin("");
      await load();
      /** Drop stale prefetched RSC payloads so PLP/PDP show updated inventory after save. */
      router.refresh();
    } catch (e) {
      setPinModalError(
        e instanceof Error ? e.message : "Save failed",
      );
    } finally {
      setPinBusy(false);
    }
  }, [pin, products, draft, load, closePinModal, router]);

  return (
    <div className="site-container max-w-[1400px] py-8 sm:py-12">
      <PinSaveModal
        open={pinOpen}
        pin={pin}
        onPinChange={setPin}
        onClose={closePinModal}
        onConfirm={confirmSaveWithPin}
        busy={pinBusy}
        error={pinModalError}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Stock count
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Edit quantities in the table, then use <strong>Save</strong> at the
            bottom (6-digit PIN). Status pills update after a successful save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Refresh
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-[#E7000B] hover:underline"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 border-b border-neutral-200/80 pb-8 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-10 lg:gap-y-4">
        <div className="flex w-full min-w-0 flex-col gap-2.5 lg:min-w-[min(100%,280px)] lg:max-w-md lg:flex-1">
          <label
            htmlFor="stockcount-search"
            className="text-sm font-semibold leading-5 tracking-[-0.01em] text-neutral-800"
          >
            Search SKU or product
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
              aria-hidden
            />
            <input
              id="stockcount-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. JS-MEAT or ribeye"
              autoComplete="off"
              className="box-border h-11 w-full rounded-lg border border-neutral-300 bg-white py-0 pl-10 pr-3.5 text-[14px] text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.05)] placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Search by SKU or product name"
            />
          </div>
        </div>
        <div className="flex min-w-[min(100%,280px)] max-w-sm flex-col gap-2.5">
          <label
            htmlFor="stockcount-category"
            className="text-sm font-semibold leading-5 tracking-[-0.01em] text-neutral-800"
          >
            Category
          </label>
          <FilterSelect
            id="stockcount-category"
            value={categorySlug}
            onChange={(e) => setFilterParams({ category: e.target.value })}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </FilterSelect>
        </div>
        <div className="flex min-w-[min(100%,280px)] max-w-sm flex-col gap-2.5">
          <label
            htmlFor="stockcount-stock"
            className="text-sm font-semibold leading-5 tracking-[-0.01em] text-neutral-800"
          >
            Stock level
          </label>
          <FilterSelect
            id="stockcount-stock"
            value={stockFilter}
            onChange={(e) => setFilterParams({ stock: e.target.value })}
            aria-label="Filter by stock level"
          >
            {STOCK_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </FilterSelect>
        </div>
        <p className="text-sm leading-5 text-neutral-600 lg:ml-auto lg:pb-1">
          <span className="font-semibold tabular-nums text-neutral-900">
            {filtered.length}
          </span>
          <span className="text-neutral-500"> / {products.length} items</span>
          {hasPending ? (
            <span className="ml-2 font-medium text-amber-800">
              · {pendingUpdates.length} unsaved
            </span>
          ) : null}
        </p>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-neutral-500">Loading inventory…</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
          <div className="overflow-x-auto">
            <div className="flex min-w-[920px] flex-col">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <StockColgroup />
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-3 py-3 text-left font-semibold text-neutral-800">
                      Category
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-neutral-800">
                      SKU
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-neutral-800">
                      Product
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-neutral-800">
                      Channels
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-neutral-800">
                      Link
                    </th>
                  </tr>
                </thead>
              </table>
              <div
                className="max-h-[min(28rem,60dvh)] overflow-y-auto overflow-x-hidden overscroll-y-contain outline-none [-webkit-overflow-scrolling:touch] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/30"
                style={{ scrollbarGutter: "stable" }}
                role="region"
                aria-label="Stock table rows — scroll vertically"
                tabIndex={0}
              >
                <table className="w-full table-fixed border-collapse text-left text-sm">
                  <StockColgroup />
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 text-center text-sm text-neutral-500"
                        >
                          {debouncedSearch
                            ? "No SKUs or products match your search."
                            : "No items match these filters."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p) => {
                        const d = rowDraftFor(p, draft);
                        return (
                          <tr
                            key={p.slug}
                            className="border-b border-neutral-100 hover:bg-neutral-50/80"
                          >
                            <td className={STOCK_TABLE_TEXT_CELL}>
                              <span className="line-clamp-2">
                                {categoryLabel(p.categorySlug)}
                              </span>
                            </td>
                            <td
                              className={`${STOCK_TABLE_TEXT_CELL} whitespace-nowrap tabular-nums`}
                            >
                              {p.sku}
                            </td>
                            <td className={STOCK_TABLE_TEXT_CELL}>
                              <span className="line-clamp-2">{p.title}</span>
                            </td>
                            <td className="min-w-0 px-3 py-2.5 align-top">
                              {p.hasCasePc ? (
                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                      Case
                                    </span>
                                    <input
                                      className={inputClass}
                                      value={String(d.case)}
                                      onChange={(e) =>
                                        setChannel(p.slug, p, {
                                          case:
                                            Number(
                                              e.target.value.replace(
                                                /\D/g,
                                                "",
                                              ),
                                            ) || 0,
                                        })
                                      }
                                      aria-label={`${p.title} case stock`}
                                    />
                                    <StatusPill
                                      status={p.stockStatus?.case}
                                    />
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                      PC
                                    </span>
                                    <input
                                      className={inputClass}
                                      value={String(d.pc)}
                                      onChange={(e) =>
                                        setChannel(p.slug, p, {
                                          pc:
                                            Number(
                                              e.target.value.replace(
                                                /\D/g,
                                                "",
                                              ),
                                            ) || 0,
                                        })
                                      }
                                      aria-label={`${p.title} PC stock`}
                                    />
                                    <StatusPill status={p.stockStatus?.pc} />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                    Single
                                  </span>
                                  <input
                                    className={inputClass}
                                    value={String(d.single)}
                                    onChange={(e) =>
                                      setChannel(p.slug, p, {
                                        single:
                                          Number(
                                            e.target.value.replace(
                                              /\D/g,
                                              "",
                                            ),
                                          ) || 0,
                                      })
                                    }
                                    aria-label={`${p.title} single stock`}
                                  />
                                  <StatusPill
                                    status={p.stockStatus?.single}
                                  />
                                </div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 align-top">
                              <Link
                                href={`/${p.slug}`}
                                className="text-xs font-medium text-blue-600 hover:underline"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50/95 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-600">
                  {hasPending
                    ? `${pendingUpdates.length} unsaved — Save applies all changes with PIN.`
                    : "No pending changes."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!hasPending) return;
                    setPinModalError(null);
                    setPin("");
                    setPinOpen(true);
                  }}
                  disabled={!hasPending || loading}
                  className="shrink-0 rounded-lg bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save{hasPending ? ` (${pendingUpdates.length})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StockCountPageFallback() {
  return (
    <div className="site-container max-w-[1400px] py-8 sm:py-12">
      <p className="mt-10 text-sm text-neutral-500">Loading…</p>
    </div>
  );
}

export default function StockCountPage() {
  return (
    <Suspense fallback={<StockCountPageFallback />}>
      <StockCountPageClient />
    </Suspense>
  );
}
