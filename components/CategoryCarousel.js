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
  /* Mobile-first: default 2 — avoids SSR + first paint showing 6 squeezed columns on iPhone */
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
    <div className="w-full min-w-0 max-w-full">
      {/* Vertical padding so card borders/shadows aren’t clipped by the horizontal scroller */}
      <div
        ref={scrollerRef}
        className="category-carousel-scroller flex w-full min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto py-3 sm:py-3"
        aria-label="Shop by category"
      >
        {pages.map((chunk, pageIndex) => (
          <div
            key={pageIndex}
            className="box-border max-w-full shrink-0 snap-start snap-always px-0.5 [flex:0_0_100%] [width:100%]"
          >
            <div className="flex min-w-0 max-w-full items-stretch gap-2.5 sm:gap-4 lg:gap-5">
              {chunk.map((category) => (
                <div
                  key={category.slug}
                  className="flex min-h-0 min-w-0 flex-1 basis-0"
                >
                  <CategoryCard
                    name={category.name}
                    count={category.count}
                    slug={category.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 ? (
        <div
          className="mt-6 flex w-full min-w-0 items-center justify-center gap-2 px-1"
          role="tablist"
          aria-label="Category pages"
        >
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Show categories page ${i + 1} of ${pageCount}`}
              className={`h-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 ${
                i === page
                  ? "w-6 bg-neutral-800"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              onClick={() => scrollToPage(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
