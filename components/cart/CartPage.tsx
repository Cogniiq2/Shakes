"use client";

import { AnimatePresence } from "motion/react";
import { Clock, MapPin, Recycle } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartLineItem, CartTotals, LeergutToggle } from "./CartParts";
import { EmptyCart } from "./CartDrawer";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getFeatured } from "@/data/products";

export function CartPage() {
  const { lines, count, ready } = useCart();
  if (!ready) return <div className="mt-10 h-[40vh] animate-pulse rounded-[18px] bg-stone/60" />;

  if (lines.length === 0) {
    const suggestions = getFeatured().slice(0, 4);
    return (
      <>
        <div className="mt-10 rounded-[20px] border border-line bg-paper">
          <EmptyCart />
        </div>
        <h2 className="mt-20 text-[1.5rem] font-semibold tracking-[-0.02em]">Beliebt im Sortiment</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <h1 className="display-2">Ihr Warenkorb</h1>
        <p className="mt-3 text-muted">
          {count} {count === 1 ? "Artikel" : "Artikel"} · Lieferung in Bayreuth und Umgebung
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <CartLineItem key={l.slug} line={l} large />
            ))}
          </AnimatePresence>
        </ul>
        <LeergutToggle className="mt-8" />
      </div>
      <aside className="lg:col-span-5">
        <div className="rounded-[20px] border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 className="text-[1.2rem] font-semibold">Zusammenfassung</h2>
          <CartTotals className="mt-6" />
          <Button href="/bestellen" size="lg" arrow className="mt-7 w-full">
            Weiter zur Bestellung
          </Button>
          <Button href="/sortiment" variant="quiet" size="sm" className="mt-2 w-full text-muted">
            Weiter einkaufen
          </Button>
          <ul className="mt-7 space-y-3 border-t border-line pt-6 text-[0.85rem] text-muted">
            <li className="flex gap-3">
              <Clock className="size-4 shrink-0 text-amber-deep" strokeWidth={1.8} /> Lieferung in der Regel innerhalb von 1–2 Werktagen.
            </li>
            <li className="flex gap-3">
              <Recycle className="size-4 shrink-0 text-amber-deep" strokeWidth={1.8} /> Leergut nehmen wir bei der Lieferung gerne wieder mit.
            </li>
            <li className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-amber-deep" strokeWidth={1.8} /> Bayreuth, Bindlach, Heinersreuth und ausgewählte Orte.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
