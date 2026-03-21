import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import {
  NEW_ARRIVALS_SECTION,
  NEW_ARRIVALS_PRODUCTS,
} from "@/lib/constants";

/**
 * Homepage product rail — data from `NEW_ARRIVALS_*` in constants (swap for API later).
 */
export function NewArrivalsSection() {
  return (
    <section
      className="bg-white pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-10"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h2
              id="new-arrivals-heading"
              className="text-[30px] font-bold leading-9 tracking-[0.4px] text-[#0A0A0A]"
            >
              {NEW_ARRIVALS_SECTION.title}
            </h2>
            <p className="mt-1.5 text-base font-normal leading-6 tracking-[-0.31px] text-[#4A5565]">
              {NEW_ARRIVALS_SECTION.subtitle}
            </p>
          </div>
          <Link
            href={NEW_ARRIVALS_SECTION.viewAllHref}
            className="inline-flex shrink-0 items-center justify-center gap-1 self-start rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-auto"
          >
            {NEW_ARRIVALS_SECTION.viewAllLabel}
            <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {NEW_ARRIVALS_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
