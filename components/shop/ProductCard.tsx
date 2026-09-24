"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { cn, formatEuro, formatPack, basePricePerLitre } from "@/lib/format";

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    add(product.slug, 1);
    setAdded(true);
  };

  const href = `/sortiment/${product.slug}`;

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-[14px] border border-line-soft bg-paper transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-line hover:shadow-[0_24px_48px_-28px_rgba(21,25,23,0.28)]",
        className,
      )}
      data-priority={priority ? "" : undefined}
    >
      <Link href={href} className="relative block overflow-hidden" aria-label={`${product.name}, ${formatPack(product.packQuantity, product.bottleVolume)}`}>
        <div className="aspect-[4/4.3] transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover/card:scale-[1.04]">
          <ProductVisual product={product} className="size-full" />
        </div>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.regional && <Tag>Regional</Tag>}
          {product.alcoholFree && <Tag>Alkoholfrei</Tag>}
          {product.gastroOnly && <Tag dark>Gastro · Vorbestellung</Tag>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">{product.brand}</p>
        <h3 className="mt-1.5 text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] sm:text-[1.08rem]">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.82rem] tabular-nums text-muted">
          {formatPack(product.packQuantity, product.bottleVolume)} · {product.packageType} {product.returnType}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            {product.price !== null ? (
              <>
                <p className="text-[1.15rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">{formatEuro(product.price)}</p>
                <p className="mt-1.5 text-[0.74rem] leading-tight text-muted tabular-nums">
                  {product.deposit ? `+ ${formatEuro(product.deposit)} Pfand` : "ohne Pfand"}
                  <span className="hidden sm:inline"> · {basePricePerLitre(product.price, product.totalVolume)}</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-[0.95rem] font-semibold leading-none">Preis auf Anfrage</p>
                <p className="mt-1.5 text-[0.74rem] leading-tight text-muted">{product.deposit ? `+ ${formatEuro(product.deposit)} Pfand` : product.deposit === 0 ? "ohne Pfand" : "Pfand je Gebinde"}</p>
              </>
            )}
          </div>
          <motion.button
            type="button"
            onClick={onAdd}
            whileTap={{ scale: 0.88 }}
            aria-label={`${product.name} in den Warenkorb`}
            className={cn(
              "relative z-10 grid size-11 shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-300",
              added ? "bg-amber text-ink" : "bg-bottle text-ivory hover:bg-bottle-700",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {added ? (
                <motion.span key="c" initial={{ scale: 0.3, rotate: -45, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ type: "spring", stiffness: 520, damping: 22 }}>
                  <Check className="size-[18px]" strokeWidth={2.6} />
                </motion.span>
              ) : (
                <motion.span key="p" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Plus className="size-[18px]" strokeWidth={2.2} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </article>
  );
}

function Tag({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={cn("rounded-[5px] px-2 py-1 text-[0.64rem] font-bold uppercase tracking-[0.1em] backdrop-blur", dark ? "bg-ink/85 text-ivory" : "bg-paper/85 text-bottle")}>
      {children}
    </span>
  );
}
