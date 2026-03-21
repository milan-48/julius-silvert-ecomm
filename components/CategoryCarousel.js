"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CategoryCard } from "./CategoryCard";

function getItemsPerView(width) {
  if (width >= 1024) return 6;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}

function chunkCategories(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * Single-row pages of category cards; swipe / scroll + dot pagination.
 */
export function CategoryCarousel({ categories }) {
  const scrollerRef = useRef(null);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [page, setPage] = useState(0);

  useLayoutEffect(() => {
    const update = () => setItemsPerView(getItemsPerView(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = useMemo(
    () => chunkCategories(categories, itemsPerView),
    [categories, itemsPerView],
  );

  const pageCount = pages.length;

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = 0;
    setPage(0);
  }, [itemsPerView]);

  const scrollToPage = useCallback(
    (index) => {
      const el = scrollerRef.current;
      if (!el) return;
      const i = Math.max(0, Math.min(index, pageCount - 1));
      el.scrollTo({ left: i * el.clientWidth, behavior: "auto" });
      setPage(i);
    },
    [pageCount],
  );

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    setPage(Math.min(i, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let t;
    const debounced = () => {
      clearTimeout(t);
      t = setTimeout(onScroll, 50);
    };
    el.addEventListener("scroll", debounced, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", debounced);
    };
  }, [onScroll]);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center">
      <div
        ref={scrollerRef}
        className="category-carousel-scroller flex w-full min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-3 sm:py-3"
        aria-label="Shop by category"
      >
        {pages.map((chunk, pageIndex) => (
          <div
            key={pageIndex}
            className="box-border flex w-full min-w-full max-w-full shrink-0 snap-start snap-always justify-center px-0 [flex:0_0_100%]"
          >
            <div
              className="grid w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-4 lg:gap-5"
              style={{
                gridTemplateColumns: `repeat(${chunk.length}, minmax(0, 1fr))`,
              }}
            >
              {chunk.map((category, i) => (
                <div key={category.slug} className="min-h-0 min-w-0">
                  <CategoryCard
                    name={category.name}
                    count={category.count}
                    slug={category.slug}
                    layoutVariant={pageIndex * itemsPerView + i}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 ? (
        <div
          className="mt-7 flex w-full min-w-0 justify-center px-0"
          role="tablist"
          aria-label="Category pages"
        >
          <div className="flex items-center gap-2.5">
            {pages.map((_, i) => (
              <div
                key={i}
                className="flex h-2.5 w-9 shrink-0 items-center justify-center"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Show categories page ${i + 1} of ${pageCount}`}
                  className={`rounded-full border transition-[width,background-color,border-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 ${
                    i === page
                      ? "h-2.5 w-9 border-neutral-700 bg-neutral-800"
                      : "h-2.5 w-2.5 border-neutral-300/80 bg-white hover:border-neutral-400 hover:bg-neutral-100"
                  }`}
                  onClick={() => scrollToPage(i)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
