"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarClock, FileText, Heart, Info, Package, RotateCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem, EASE } from "@/components/ui/Reveal";
import { getProduct } from "@/data/products";
import { cn, formatEuro, formatPack } from "@/lib/format";

/** Demo-Daten – Kundenkonto ist eine visuelle Vorschau zukünftiger Funktionen. */
const lastOrder = {
  id: "SB-2026-04817",
  date: "12. September 2026",
  items: [
    { slug: "adelholzener-naturell", qty: 2 },
    { slug: "bayreuther-hell", qty: 1 },
    { slug: "spezi-original", qty: 1 },
  ],
};
const favorites = ["maisels-weisse-original", "kulmbacher-lager-hell", "fritz-kola"];

function greeting(h: number) {
  if (h < 11) return "Guten Morgen.";
  if (h < 18) return "Guten Tag.";
  return "Guten Abend.";
}

export function Account() {
  const { addMany } = useCart();
  const [hello, setHello] = useState("Guten Morgen.");
  const [reordered, setReordered] = useState(false);
  useEffect(() => setHello(greeting(new Date().getHours())), []);

  const lines = lastOrder.items.map((i) => ({ ...i, product: getProduct(i.slug)! }));
  const total = lines.reduce((s, l) => s + (l.product.price ?? 0) * l.qty + (l.product.deposit ?? 0) * l.qty, 0);

  const reorder = () => {
    addMany(lastOrder.items);
    setReordered(true);
    setTimeout(() => setReordered(false), 2000);
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber-soft/60 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-amber-deep">
            <Info className="size-3.5" /> Vorschau · Demo-Konto
          </span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="display-1 mt-6">
            {hello}
          </motion.h1>
          <p className="lede mt-4 text-muted">Schön, dass Sie da sind. Hier sehen Sie Ihre Bestellungen und Lieferungen auf einen Blick.</p>
        </div>
        <Button onClick={reorder} size="lg" icon={<RotateCcw />} className="w-full md:w-auto" variant={reordered ? "amber" : "primary"}>
          {reordered ? "Im Warenkorb" : "Letzte Bestellung erneut bestellen"}
        </Button>
      </div>

      <Stagger className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4" gap={0.07}>
        <StaggerItem>
          <Tile icon={Package} label="Letzte Bestellung" value={lastOrder.date} sub={`${lines.reduce((s, l) => s + l.qty, 0)} Kästen · ${formatEuro(total)}`} />
        </StaggerItem>
        <StaggerItem>
          <Tile icon={Truck} label="Nächste Lieferung" value="Keine geplant" sub="Bestellen Sie einfach erneut." />
        </StaggerItem>
        <StaggerItem>
          <Tile icon={Heart} label="Favoriten" value={`${favorites.length} Getränke`} sub="Schnell wieder bestellt." />
        </StaggerItem>
        <StaggerItem>
          <Tile icon={FileText} label="Rechnungen" value="Digital abrufbar" sub="Funktion in Vorbereitung" soon />
        </StaggerItem>
      </Stagger>

      <div className="mt-16 grid gap-6 lg:grid-cols-12">
        <section className="rounded-[20px] border border-line bg-paper p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-amber-deep">Letzte Bestellung</p>
              <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.02em]">{lastOrder.date}</h2>
              <p className="mt-1 text-[0.85rem] text-muted tabular-nums">Vorgang {lastOrder.id} · Geliefert</p>
            </div>
            <span className="rounded-full bg-success/10 px-3 py-1 text-[0.75rem] font-semibold text-success">Zugestellt</span>
          </div>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.slug} className="flex items-center gap-4 py-4">
                <ProductVisual product={l.product} variant="thumb" className="size-16 shrink-0 rounded-[10px]" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    <span className="tabular-nums text-muted">{l.qty}×</span> {l.product.name}
                  </p>
                  <p className="text-[0.82rem] text-muted tabular-nums">{formatPack(l.product.packQuantity, l.product.bottleVolume)}</p>
                </div>
                <p className="text-[0.92rem] font-semibold tabular-nums">{l.product.price !== null ? formatEuro(l.product.price * l.qty) : "auf Anfrage"}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9rem] text-muted">
              Gesamt inkl. Pfand <span className="ml-2 font-semibold text-ink tabular-nums">{formatEuro(total)}</span>
            </p>
            <Button onClick={reorder} variant="outline" icon={<RotateCcw />}>
              Erneut in den Warenkorb
            </Button>
          </div>
        </section>

        <div className="grid gap-6 lg:col-span-5">
          <section className="grain relative overflow-hidden rounded-[20px] bg-bottle p-6 text-ivory sm:p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <CalendarClock className="size-7 text-amber" strokeWidth={1.5} />
                <span className="rounded-full bg-ivory/10 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-amber">Demnächst</span>
              </div>
              <h2 className="mt-8 text-[1.6rem] font-semibold tracking-[-0.02em]">Regelmäßige Lieferung</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/65">Ihre Lieblingsgetränke automatisch im gewünschten Rhythmus – ideal für Haushalt und Büro.</p>
              <div className="mt-6 grid grid-cols-3 gap-2 opacity-60" aria-hidden>
                {["Wöchentlich", "14-tägig", "Monatlich"].map((r, i) => (
                  <span key={r} className={cn("rounded-[8px] border px-2 py-2.5 text-center text-[0.78rem] font-semibold", i === 1 ? "border-amber text-amber" : "border-ivory/15")}>
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[0.78rem] text-ivory/45">Diese Funktion ist in Vorbereitung.</p>
            </div>
          </section>

          <section className="rounded-[20px] border border-line bg-paper p-6 sm:p-8">
            <p className="eyebrow text-amber-deep">Favoriten</p>
            <ul className="mt-4 space-y-3">
              {favorites.map((s) => {
                const p = getProduct(s)!;
                return (
                  <li key={s}>
                    <Link href={`/sortiment/${s}`} className="group flex items-center gap-3">
                      <ProductVisual product={p} variant="thumb" className="size-12 shrink-0 rounded-[8px]" />
                      <span className="flex-1 font-semibold group-hover:text-bottle-700">{p.name}</span>
                      <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      <p className="mt-12 text-center text-[0.8rem] text-muted">
        Das Kundenkonto ist eine Vorschau. Anmeldung, Rechnungen und Liefer-Abos folgen in einer späteren Ausbaustufe.
      </p>
    </>
  );
}

function Tile({ icon: Icon, label, value, sub, soon }: { icon: typeof Package; label: string; value: string; sub: string; soon?: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-[16px] border border-line bg-paper p-6 transition-all duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-full bg-stone text-bottle">
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        {soon && <span className="rounded-full bg-amber-soft px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-amber-deep">Demnächst</span>}
      </div>
      <p className="mt-8 text-[0.8rem] font-semibold text-muted">{label}</p>
      <p className="mt-1 text-[1.25rem] font-semibold tracking-[-0.02em]">{value}</p>
      <p className="mt-1 text-[0.85rem] text-muted">{sub}</p>
    </div>
  );
}
