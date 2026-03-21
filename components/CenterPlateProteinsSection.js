import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import {
  CENTER_PLATE_PRODUCTS,
  CENTER_PLATE_SECTION,
} from "@/lib/constants";

/**
 * Homepage “Center of the Plate Proteins” — horizontal scroll on small screens, 4-up grid on lg.
 */
export function CenterPlateProteinsSection() {
  return (
    <section
      className="bg-white pt-6 pb-6 sm:pt-8 sm:pb-8 lg:pt-10 lg:pb-10"
      aria-labelledby="center-plate-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h2
              id="center-plate-heading"
              className="text-[30px] font-bold leading-9 tracking-[0.4px] text-[#0A0A0A]"
            >
              {CENTER_PLATE_SECTION.title}
            </h2>
            <p className="mt-1.5 text-base font-normal leading-6 tracking-[-0.31px] text-[#4A5565]">
              {CENTER_PLATE_SECTION.subtitle}
            </p>
          </div>
          <Link
            href={CENTER_PLATE_SECTION.viewAllHref}
            className="inline-flex shrink-0 items-center justify-center gap-1 self-start rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-auto"
          >
            {CENTER_PLATE_SECTION.viewAllLabel}
            <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <div
          className="product-rail-scroller -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none"
          role="list"
        >
          {CENTER_PLATE_PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="w-[min(85vw,20rem)] shrink-0 snap-start lg:w-auto lg:min-w-0 lg:snap-none"
              role="listitem"
            >
              <ProductCard
                slug={p.slug}
                imageSrc={p.imageSrc}
                imageAlt={p.imageAlt}
                tier={p.tier}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
