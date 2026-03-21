"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";

const DEBOUNCE_MS = 500;

/**
 * @param {{ className?: string }} props
 */
export function SearchBar({ className = "" }) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(/** @type {object[]} */ ([]));
  const [categories, setCategories] = useState(/** @type {object[]} */ ([]));

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebounced(query.trim());
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debounced) {
      setProducts([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    setLoading(true);

    fetch(
      `/api/catalog/search?q=${encodeURIComponent(debounced)}`,
      { signal: ac.signal, cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setProducts(Array.isArray(d.products) ? d.products : []);
        setCategories(Array.isArray(d.categories) ? d.categories : []);
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setProducts([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, [debounced]);

  useEffect(() => {
    function onPointerDown(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const navigateTo = useCallback(
    (href) => {
      setOpen(false);
      setQuery("");
      setDebounced("");
      setProducts([]);
      setCategories([]);
      router.push(href);
    },
    [router],
  );

  const showPanel = open && debounced.length > 0;
  const hasResults = categories.length > 0 || products.length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative z-[60] flex w-full min-w-0 max-w-full ${className}`}
    >
      <form
        role="search"
        className="relative flex w-full min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          if (products[0]) {
            navigateTo(`/${products[0].slug}`);
          } else if (categories[0]) {
            navigateTo(`/${categories[0].slug}`);
          }
        }}
      >
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <Search size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
        </span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Search for quality meats..."
          aria-label="Search products, categories, or SKU"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listboxId : undefined}
          aria-autocomplete="list"
          className="search-input h-11 w-full rounded-full border border-neutral-200/90 bg-white pl-11 pr-5 text-[15px] leading-normal text-neutral-900 transition-[border-color,box-shadow] duration-200 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-[3px] focus:ring-neutral-900/[0.05]"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
        />
      </form>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-neutral-200/90 bg-white py-2 shadow-[0_16px_48px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04]"
        >
          {loading ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">
              Searching…
            </p>
          ) : !hasResults ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">
              No results for &ldquo;{debounced}&rdquo;
            </p>
          ) : (
            <div className="flex flex-col gap-1 px-2 pb-1 pt-0.5">
              {categories.length > 0 ? (
                <div className="px-2 pb-1">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Categories
                  </p>
                  <ul className="space-y-0.5">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <button
                          type="button"
                          role="option"
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50"
                          onClick={() => navigateTo(`/${c.slug}`)}
                        >
                          <span className="font-medium text-neutral-900">
                            {c.name}
                          </span>
                          <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                            {c.count} items
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {products.length > 0 ? (
                <div className="px-2">
                  {categories.length > 0 ? (
                    <p className="mt-1 border-t border-neutral-100 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                      Products
                    </p>
                  ) : (
                    <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                      Products
                    </p>
                  )}
                  <ul className="space-y-0.5">
                    {products.map((p) => (
                      <li key={p.slug}>
                        <SearchProductRow item={p} onPick={() => navigateTo(`/${p.slug}`)} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * @param {{ item: Record<string, unknown>; onPick: () => void }} props
 */
function SearchProductRow({ item, onPick }) {
  const slug = String(item.slug ?? "");
  const src = String(item.imageSrc ?? "").trim();
  const urlOk =
    src &&
    (src.startsWith("https://") || src.startsWith("http://") || src.startsWith("/"));
  const [failed, setFailed] = useState(false);
  const showImg = urlOk && !failed;
  const placeholderBg = useMemo(() => softPlaceholderBg(slug), [slug]);

  return (
    <button
      type="button"
      role="option"
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-neutral-50"
      onClick={onPick}
    >
      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
        {showImg ? (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="44px"
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            className="absolute inset-0 block"
            style={{ backgroundColor: placeholderBg }}
            aria-hidden
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-medium text-neutral-900">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs text-neutral-500">
          <span className="font-medium text-neutral-600">SKU</span>{" "}
          <span className="tabular-nums">{item.sku}</span>
          {item.categoryLabel ? (
            <>
              {" "}
              · <span className="text-neutral-400">{item.categoryLabel}</span>
            </>
          ) : null}
        </span>
      </span>
    </button>
  );
}
