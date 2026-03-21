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

export default async function Home() {
  const newArrivals = getNewArrivalsPool(8);
  const centerPlate = getCenterPlatePool(8);

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
