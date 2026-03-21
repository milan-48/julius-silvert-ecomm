"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORY_PLP_SHOP_BY_GROUPS } from "@/lib/constants";

const ICON_STROKE = 2;

/**
 * @param {{
 *   selectedBrands: Set<string>;
 *   selectedMilk: Set<string>;
 *   onToggleBrand: (id: string) => void;
 *   onToggleMilk: (id: string) => void;
 *   filtersBusy?: boolean;
 * }} props
 */
export function CategoryShopByPanel({
  selectedBrands,
  selectedMilk,
  onToggleBrand,
  onToggleMilk,
  filtersBusy = false,
}) {
  const [open, setOpen] = useState(() =>
    Object.fromEntries(
      CATEGORY_PLP_SHOP_BY_GROUPS.map((g) => [g.id, Boolean(g.defaultOpen)]),
    ),
  );

  function toggleSection(id) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <aside className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
        Shop by
      </h2>
      <div className="mt-5 divide-y divide-neutral-200">
        {CATEGORY_PLP_SHOP_BY_GROUPS.map((group) => {
          const isOpen = open[group.id];
          const isBrand = group.id === "brand";
          const selected = isBrand ? selectedBrands : selectedMilk;
          const onToggle = isBrand ? onToggleBrand : onToggleMilk;
          return (
            <div key={group.id} className="py-1">
              <button
                type="button"
                onClick={() => toggleSection(group.id)}
                className="flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                aria-expanded={isOpen}
              >
                {group.title}
                <ChevronDown
                  className={`size-4 shrink-0 text-neutral-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={ICON_STROKE}
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <ul className="space-y-0.5 pb-3 pl-0.5">
                  {group.options.map((opt) => {
                    const checked = selected.has(opt.id);
                    return (
                      <li key={opt.id}>
                        <label
                          className={`flex items-center gap-3 rounded-lg py-2 pr-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-50 ${
                            filtersBusy ? "cursor-wait opacity-60" : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={filtersBusy}
                            className="size-4 shrink-0 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 disabled:cursor-wait"
                            checked={checked}
                            onChange={() => onToggle(opt.id)}
                          />
                          <span className="leading-snug">{opt.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
