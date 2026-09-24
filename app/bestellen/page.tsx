import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";
import { Breadcrumb } from "@/components/sections/Shared";

export const metadata: Metadata = {
  title: "Bestellen",
  robots: { index: false },
};

export default function BestellenPage() {
  return (
    <section className="min-h-[80vh] pb-24 pt-[104px] lg:pt-[128px]">
      <div className="container-x">
        <Breadcrumb items={[{ href: "/warenkorb", label: "Warenkorb" }, { label: "Bestellen" }]} />
        <Checkout />
      </div>
    </section>
  );
}
