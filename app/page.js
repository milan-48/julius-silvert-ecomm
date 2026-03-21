import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { CenterPlateProteinsSection } from "@/components/CenterPlateProteinsSection";
import { PromoBannersCarousel } from "@/components/PromoBannersCarousel";
import { BrandPartnersSection } from "@/components/BrandPartnersSection";
import {
  getCenterPlatePool,
  getNewArrivalsPool,
} from "@/lib/memoryDb/queries";
import { withStockView } from "@/lib/memoryDb/stockUtils";

/** Inventory is process-local memory; avoid static/RSC cache so stock edits show immediately. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const newArrivals = getNewArrivalsPool(8).map(withStockView);
  const centerPlate = getCenterPlatePool(8).map(withStockView);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivalsSection products={newArrivals} />
      <PromoBannersCarousel />
      <CenterPlateProteinsSection products={centerPlate} />
      <BrandPartnersSection />
    </>
  );
}
