import {
  BRAND_PARTNERS,
  BRAND_PARTNERS_SECTION,
} from "@/lib/constants";
import { BrandPartnerCard } from "./BrandPartnerCard";

/**
 * Centered heading + responsive grid of partner cards (data from brand collage).
 */
export function BrandPartnersSection() {
  return (
    <section
      className="bg-[#F9FAFB] py-12 sm:py-16 lg:py-20"
      aria-labelledby="brand-partners-heading"
    >
      <div className="site-container">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="brand-partners-heading"
            className="text-[28px] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[32px] lg:text-[34px]"
          >
            {BRAND_PARTNERS_SECTION.title}
          </h2>
          <p className="mt-3 text-base font-normal leading-relaxed text-neutral-500 sm:text-lg">
            {BRAND_PARTNERS_SECTION.subtitle}
          </p>
        </div>

        <ul className="mx-auto grid max-w-[1400px] list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8 lg:gap-4">
          {BRAND_PARTNERS.map((brand) => (
            <li key={brand.id} className="min-w-0">
              <BrandPartnerCard brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
