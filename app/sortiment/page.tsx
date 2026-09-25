import type { Metadata } from "next";
import { Shop } from "@/components/shop/ShopClient";
import { Breadcrumb } from "@/components/sections/Shared";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sortiment – Wasser, Bier, Softdrinks & mehr",
  description: "Das Sortiment von Schake's Bier: Mineralwasser, regionale Biere aus Bayreuth und Kulmbach, Softdrinks, Säfte, Alkoholfreies und Wein – geliefert in Bayreuth und Umgebung.",
  alternates: { canonical: "/sortiment" },
};

export default function SortimentPage() {
  return (
    <>
      <section className="pt-[104px] lg:pt-[128px]">
        <div className="container-x pb-7 lg:pb-14">
          <Reveal>
            <Breadcrumb items={[{ label: "Sortiment" }]} />
          </Reveal>
          <div className="mt-7 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <Eyebrow>Unser Sortiment</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="display-1 mt-6">
                  Von Mineralwasser
                  <span className="serif-accent block text-bottle">bis Feierabendbier.</span>
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.16} className="lg:col-span-4">
              <p className="lede text-muted">Eine große Auswahl verschiedener Hersteller – regional verwurzelt, unabhängig zusammengestellt.</p>
            </Reveal>
          </div>
        </div>
      </section>
      <Shop />
    </>
  );
}
