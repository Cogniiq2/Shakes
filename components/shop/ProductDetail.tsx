"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Check, Clock, Info, Phone, Recycle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { unitLabel } from "@/data/products";
import { getCategory } from "@/data/categories";
import { useCart } from "@/components/cart/CartProvider";
import { CATEGORY_SURFACE, ProductVisual } from "@/components/visual/ProductVisual";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { cn, formatEuro, formatPack } from "@/lib/format";
import { site } from "@/lib/site";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const category = getCategory(product.category);
  const unit = unitLabel(product, qty);

  const onAdd = () => {
    add(product.slug, qty, { openDrawer: true });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const facts: Array<[string, string]> = [
    ["Gebinde", formatPack(product.packQuantity, product.bottleVolume)],
    ["Verpackung", `${product.packageType} ${product.returnType}`],
    ["Kategorie", category.name],
    ["Sorte", product.variety],
    ...(product.origin ? ([["Herkunft", product.origin]] as Array<[string, string]>) : []),
    ["Inhalt gesamt", `${product.totalVolume.toLocaleString("de-DE")} L`],
    ["Pfand", product.deposit === null ? "je nach Gebinde" : product.deposit === 0 ? "ohne Pfand" : formatEuro(product.deposit)],
  ];

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Galerie */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[96px]">
            <Gallery product={product} />
            {product.image && <p className="mt-3 text-[0.75rem] text-muted">Abbildung: Originalflasche des Herstellers. Geliefert wird im Kasten.</p>}
          </div>
        </div>

        {/* Kaufbereich */}
        <div className="lg:col-span-5">
          <p className="eyebrow text-amber-deep">{product.brand}</p>
          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1] tracking-[-0.035em] sm:text-[3.2rem]">{product.name}</h1>
          <p className="mt-3 text-[1.05rem] text-muted tabular-nums">
            {formatPack(product.packQuantity, product.bottleVolume)} <span className="px-1.5 text-line">|</span> {product.variety}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>{product.packageType} {product.returnType}</Badge>
            {product.regional && <Badge tone="amber">Regional · {product.origin}</Badge>}
            {product.alcoholFree && <Badge>Alkoholfrei</Badge>}
            {product.gastroOnly && <Badge tone="dark">Gastro-Gebinde · Vorbestellung</Badge>}
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <PriceDisplay product={product} size="lg" />
            <p className="mt-4 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-success">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/50" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {product.gastroOnly ? "Auf Vorbestellung" : "Im Sortiment"}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <QuantitySelector value={qty} onChange={setQty} size="lg" label="Anzahl" />
            <motion.button
              type="button"
              onClick={onAdd}
              whileTap={{ scale: 0.97 }}
              className={cn("relative flex h-14 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-[12px] text-base font-semibold transition-colors duration-300", added ? "bg-amber text-ink" : "bg-bottle text-ivory hover:bg-bottle-700")}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span key="a" className="flex items-center gap-2" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}>
                    <Check className="size-5" strokeWidth={2.6} /> Hinzugefügt
                  </motion.span>
                ) : (
                  <motion.span key="b" className="flex items-center gap-2" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}>
                    <ShoppingBag className="size-5" strokeWidth={1.8} /> In den Warenkorb
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <p className="mt-3 text-[0.82rem] text-muted tabular-nums">
            {qty} {unit}
            {product.price !== null && <> · {formatEuro(product.price * qty)} zzgl. {formatEuro((product.deposit ?? 0) * qty)} Pfand</>}
          </p>

          <ul className="mt-8 space-y-3 rounded-[14px] border border-line bg-paper p-5 text-[0.9rem]">
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-[18px] shrink-0 text-amber-deep" strokeWidth={1.8} />
              <span>Lieferung im regulären Liefergebiet in der Regel innerhalb von 1–2 Werktagen.</span>
            </li>
            <li className="flex gap-3">
              <Recycle className="mt-0.5 size-[18px] shrink-0 text-amber-deep" strokeWidth={1.8} />
              <span>Leergut aus unserem Sortiment nehmen wir bei der Lieferung gerne wieder mit.</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-[18px] shrink-0 text-amber-deep" strokeWidth={1.8} />
              <span>
                Fragen zum Produkt?{" "}
                <a href={site.phone.href} className="font-semibold tabular-nums link-underline">
                  {site.phone.display}
                </a>
              </span>
            </li>
          </ul>

          <div className="mt-10">
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em]">Auf einen Blick</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5 text-[0.93rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            {product.alcoholic && (
              <p className="mt-4 flex gap-2 text-[0.8rem] leading-relaxed text-muted">
                <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.2} />
                Alkoholhaltige Getränke geben wir nicht an Minderjährige ab.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Kaufleiste */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.82rem] font-semibold">{product.name}</p>
            <p className="text-[0.78rem] text-muted tabular-nums">{product.price !== null ? `${formatEuro(product.price)} + Pfand` : "Preis auf Anfrage"}</p>
          </div>
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onAdd} className={cn("inline-flex h-12 items-center gap-2 rounded-[10px] px-5 text-[0.92rem] font-semibold transition-colors", added ? "bg-amber text-ink" : "bg-bottle text-ivory")}>
            {added ? <Check className="size-4" strokeWidth={2.6} /> : <ShoppingBag className="size-4" strokeWidth={1.8} />}
            In den Warenkorb
          </motion.button>
        </div>
      </div>
    </>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: "amber" | "dark" }) {
  return (
    <span className={cn("inline-flex h-8 items-center rounded-[6px] px-3 text-[0.78rem] font-semibold", tone === "amber" ? "bg-amber-soft text-amber-deep" : tone === "dark" ? "bg-ink text-ivory" : "bg-stone text-ink/80")}>
      {children}
    </span>
  );
}

/** Große Produktbühne – Originalfoto mit sanfter Tiefenbewegung zum Cursor */
function Gallery({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 18 });
  const y = useSpring(my, { stiffness: 90, damping: 18 });
  return (
    <div
      className="relative overflow-hidden rounded-[20px]"
      style={{ background: CATEGORY_SURFACE[product.category] }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} style={{ x, y, scale: 1.03 }}>
        <ProductVisual product={product} variant="detail" priority className="aspect-[4/4.4] sm:aspect-[4/3.9]" />
      </motion.div>
    </div>
  );
}
