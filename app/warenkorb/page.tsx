import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { Breadcrumb } from "@/components/sections/Shared";

export const metadata: Metadata = {
  title: "Warenkorb",
  robots: { index: false },
};

export default function WarenkorbPage() {
  return (
    <section className="min-h-[70vh] pb-24 pt-[104px] lg:pt-[128px]">
      <div className="container-x">
        <Breadcrumb items={[{ href: "/sortiment", label: "Sortiment" }, { label: "Warenkorb" }]} />
        <CartPage />
      </div>
    </section>
  );
}
