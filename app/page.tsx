import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ProductStory } from "@/components/story/ProductStory";
import { AudienceSection, CategorySection, DeliverySection, FeaturedSection, IndependentSection, RatingSection, RegionalSection, ServiceSection } from "@/components/home/Sections";
import { ContactCTA } from "@/components/sections/Shared";

export const metadata: Metadata = {
  title: { absolute: "Schake's Bier | Getränkelieferdienst in Bayreuth" },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSection />
      <CategorySection />
      <RegionalSection />
      <ProductStory />
      <FeaturedSection />
      <AudienceSection />
      <IndependentSection />
      <RatingSection />
      <DeliverySection />
      <ContactCTA />
    </>
  );
}
