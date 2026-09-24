"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Check, Clock, Info, Phone, Recycle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { unitLabel } from "@/data/products";
import { getCategory } from "@/data/categories";
import { useCart } from "@/components/cart/CartProvider";
import { Bottle } from "@/components/visual/Bottle";
import { Crate } from "@/components/visual/Crate";
import { CATEGORY_SURFACE, ProductVisual } from "@/components/visual/ProductVisual";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { cn, formatEuro, formatPack } from "@/lib/format";
import { site } from "@/lib/site";

type View = "flasche" | "kasten" | "auswahl";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<View>("flasche");
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
            <Gallery product={product} view={view} />
            <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Produktansichten">
              {(
                [
                  ["flasche", "Flasche"],
                  ["kasten", product.packageType === "PET" || product.category === "wein-spezialitaeten" ? "Gebinde" : "Kasten"],
                  ["auswahl", "Im Sortiment"],
                ] as Array<[View, string]>
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={cn("group relative overflow-hidden rounded-[12px] border-2 text-left transition-colors", view === v ? "border-bottle" : "border-transparent hover:border-line")}
                >
                  <div className="aspect-[5/3.4]" style={{ background: CATEGORY_SURFACE[product.category] }}>
                    <Thumb product={product} view={v} />
                  </div>
                  <span className="absolute bottom-2 left-2.5 rounded-[5px] bg-paper/85 px-2 py-0.5 text-[0.7rem] font-semibold backdrop-blur">{label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.75rem] text-muted">Stilisierte Darstellung. Produktfotos folgen.</p>
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

/** Große Produktbühne mit sanfter Neigung zum Cursor */
function Gallery({ product, view }: { product: Product; view: View }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });
  return (
    <div
      className="relative aspect-[4/4.3] overflow-hidden rounded-[20px] [perspective:1200px] sm:aspect-[4/3.6]"
      style={{ background: CATEGORY_SURFACE[product.category] }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 40%, rgba(255,255,255,0.85), transparent 70%)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] bg-black/[0.04]" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0"
        >
          <motion.div style={{ rotateX: srx, rotateY: sry }} className="size-full [transform-style:preserve-3d]">
            {view === "flasche" && (
              <div className="flex size-full items-end justify-center pb-[8%]">
                <Bottle visual={product.visual} id={`pdp-${product.slug}`} brand={product.brand} title={product.variety} className="h-[82%] w-auto drop-shadow-[0_30px_30px_rgba(0,0,0,0.18)]" />
              </div>
            )}
            {view === "kasten" && (
              <div className="flex size-full items-end justify-center px-[10%] pb-[8%]">
                <Crate visual={product.visual} id={`pdp-${product.slug}`} brand={product.brand} className="h-auto w-full max-w-[520px]" />
              </div>
            )}
            {view === "auswahl" && <ProductVisual product={product} variant="detail" className="size-full !bg-transparent" />}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Thumb({ product, view }: { product: Product; view: View }) {
  if (view === "flasche")
    return (
      <div className="flex size-full items-end justify-center pb-[6%]">
        <Bottle visual={product.visual} id={`th-${product.slug}`} className="h-[84%] w-auto" condensation={false} />
      </div>
    );
  if (view === "kasten")
    return (
      <div className="flex size-full items-end justify-center px-[14%] pb-[6%]">
        <Crate visual={product.visual} id={`th-${product.slug}`} brand={product.brand} className="h-auto w-full" />
      </div>
    );
  return <ProductVisual product={product} variant="card" className="size-full !bg-transparent" />;
}
