import type { Metadata } from "next";
import { Account } from "@/components/account/Account";
import { Breadcrumb } from "@/components/sections/Shared";

export const metadata: Metadata = {
  title: "Kundenkonto",
  robots: { index: false },
};

export default function KontoPage() {
  return (
    <section className="min-h-[80vh] pb-24 pt-[104px] lg:pt-[128px]">
      <div className="container-x">
        <Breadcrumb items={[{ label: "Kundenkonto" }]} />
        <div className="mt-10">
          <Account />
        </div>
      </div>
    </section>
  );
}
