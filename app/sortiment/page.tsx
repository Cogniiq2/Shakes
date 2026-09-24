import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";
import { Breadcrumb } from "@/components/sections/Shared";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { categories, type CategorySlug } from "@/data/categories";
import { brands } from "@/data/products";
import type { Filters } from "@/components/shop/filters";

export const metadata: Metadata = {
  title: "Sortiment – Wasser, Bier, Softdrinks & mehr",
  description: "Das Sortiment von Schake's Bier: Mineralwasser, regionale Biere aus Bayreuth und Kulmbach, Softdrinks, Säfte, Alkoholfreies und Wein – geliefert in Bayreuth und Umgebung.",
  alternates: { canonical: "/sortiment" },
};

export default async function SortimentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const kat = one(sp.kategorie);
  const marke = one(sp.marke);
  const initial: Partial<Filters> = {
    category: categories.some((c) => c.slug === kat) ? (kat as CategorySlug) : "alle",
    q: one(sp.q) ?? "",
    brands: marke && brands.includes(marke) ? [marke] : [],
  };

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
      <ShopClient key={`${initial.category}-${initial.q}-${initial.brands?.join()}`} initial={initial} />
    </>
  );
}
