"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import {
  CATEGORY_PLP_SHOP_BY_GROUPS,
  CATEGORY_PLP_SORT_OPTIONS,
} from "@/lib/constants";
import { useMinimumPending } from "@/lib/useMinimumPending";
import { CategoryShopByPanel } from "./CategoryShopByPanel";

/**
 * Demo milk facet by row index (no API yet).
 * @param {number} index
 */
function demoMilkType(index) {
  const types = ["cow", "goat", "sheep"];
  return types[index % 3];
}

export function CategoryListingClient({ products }) {
  const [isPending, startTransition] = useTransition();
  const showListingLoad = useMinimumPending(isPending, 280);

  const [sortBy, setSortBy] = useState("random");
  const [selectedBrands, setSelectedBrands] = useState(
    () => new Set(/** @type {string[]} */ ([])),
  );
  const [selectedMilk, setSelectedMilk] = useState(
    () => new Set(/** @type {string[]} */ ([])),
  );

  const toggleBrand = useCallback((id) => {
    startTransition(() => {
      setSelectedBrands((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    });
  }, []);

  const toggleMilk = useCallback((id) => {
    startTransition(() => {
      setSelectedMilk((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p, index) => {
      if (selectedBrands.size > 0) {
        const vendor = (p.vendor || "").toUpperCase();
        const brandGroup = CATEGORY_PLP_SHOP_BY_GROUPS.find((g) => g.id === "brand");
        const matches =
          brandGroup &&
          [...selectedBrands].some((bid) => {
            const opt = brandGroup.options.find((o) => o.id === bid);
            return opt && vendor.includes(opt.label.toUpperCase());
          });
        if (!matches) return false;
      }
      if (selectedMilk.size > 0) {
        const milk = demoMilkType(index);
        if (!selectedMilk.has(milk)) return false;
      }
      return true;
    });
  }, [products, selectedBrands, selectedMilk]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default: {
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
      }
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="mt-8">
      {/* Full-width row so filters + product grid share one top baseline below the sort bar */}
      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end lg:mb-8">
        <label className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span className="shrink-0 font-medium text-neutral-700">Sort by:</span>
          <select
            value={sortBy}
            disabled={showListingLoad}
            onChange={(e) =>
              startTransition(() => setSortBy(e.target.value))
            }
            aria-label="Sort products"
            className="select-plp-sort min-w-[10.5rem] cursor-pointer rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-neutral-900 transition-[border-color,box-shadow] focus-visible:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:cursor-wait disabled:opacity-60"
          >
            {CATEGORY_PLP_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-10 xl:gap-12">
        <CategoryShopByPanel
          selectedBrands={selectedBrands}
          selectedMilk={selectedMilk}
          onToggleBrand={toggleBrand}
          onToggleMilk={toggleMilk}
          filtersBusy={showListingLoad}
        />

        <div className="relative min-w-0 min-h-[min(360px,50vh)]">
          <div
            className={`transition-opacity duration-200 ${
              showListingLoad
                ? "pointer-events-none select-none opacity-40"
                : "opacity-100"
            }`}
            aria-busy={showListingLoad}
          >
            {sortedProducts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 py-16 text-center text-sm text-neutral-500">
                No products match these filters. Clear filters to see more items.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                {sortedProducts.map((p) => (
                  <li key={p.id} className="min-w-0">
                    <ProductCard
                      sku={p.sku}
                      slug={p.slug}
                      imageSrc={p.imageSrc}
                      imageAlt={p.imageAlt}
                      title={p.title}
                      vendor={p.vendor}
                      netWeight={p.netWeight}
                      price={p.price}
                      unitPrice={p.unitPrice}
                      priceBySize={p.priceBySize}
                      footerMode={p.footerMode}
                      sizeOptions={p.sizeOptions}
                      defaultSize={p.defaultSize}
                      stock={p.stock}
                      stockStatus={p.stockStatus}
                      stockCase={p.stockCase}
                      stockPc={p.stockPc}
                      stockSingle={p.stockSingle}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showListingLoad ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/70 px-4 py-12 backdrop-blur-[2px]"
              role="status"
              aria-live="polite"
              aria-label="Updating product list"
            >
              <Loader2
                className="size-9 shrink-0 animate-spin text-neutral-500"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-center text-sm font-medium text-neutral-600">
                Updating products…
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
