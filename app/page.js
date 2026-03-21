import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { CenterPlateProteinsSection } from "@/components/CenterPlateProteinsSection";
import { PromoBannersCarousel } from "@/components/PromoBannersCarousel";
import { BrandPartnersSection } from "@/components/BrandPartnersSection";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivalsSection />
      <PromoBannersCarousel />
      <CenterPlateProteinsSection />
      <BrandPartnersSection />
    </>
  );
}
