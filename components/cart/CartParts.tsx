"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Info, Recycle, Trash2 } from "lucide-react";
import { useCart, type ResolvedLine } from "./CartProvider";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { cn, formatEuro, formatPack } from "@/lib/format";
import { unitLabel } from "@/data/products";

export function CartLineItem({ line, onNavigate, large }: { line: ResolvedLine; onNavigate?: () => void; large?: boolean }) {
  const { setQty, remove } = useCart();
  const p = line.product;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-4 py-5", large && "sm:gap-6 sm:py-7")}
    >
      <Link href={`/sortiment/${p.slug}`} onClick={onNavigate} className={cn("shrink-0 overflow-hidden rounded-[10px]", large ? "size-24 sm:size-32" : "size-[84px]")} aria-label={p.name}>
        <ProductVisual product={p} variant="thumb" className="size-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">{p.brand}</p>
            <Link href={`/sortiment/${p.slug}`} onClick={onNavigate} className={cn("mt-1 block truncate font-semibold leading-snug hover:text-bottle-700", large ? "text-[1.05rem] sm:text-lg" : "text-[0.98rem]")}>
              {p.name}
            </Link>
            <p className="mt-0.5 text-[0.82rem] text-muted tabular-nums">
              {formatPack(p.packQuantity, p.bottleVolume)} · {p.packageType} {p.returnType}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold tabular-nums">{line.lineTotal === null ? <span className="text-[0.85rem] font-semibold">auf Anfrage</span> : formatEuro(line.lineTotal)}</p>
            {line.lineDeposit > 0 && <p className="mt-0.5 text-[0.76rem] text-muted tabular-nums">+ {formatEuro(line.lineDeposit)} Pfand</p>}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantitySelector value={line.qty} onChange={(v) => setQty(p.slug, v)} min={0} size="sm" label={`Menge ${p.name}`} />
          <div className="flex items-center gap-1">
            <span className="hidden text-[0.78rem] text-muted xs:inline">
              {line.qty} {unitLabel(p, line.qty)}
            </span>
            <button
              type="button"
              onClick={() => remove(p.slug)}
              aria-label={`${p.name} entfernen`}
              className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-danger active:scale-90"
            >
              <Trash2 className="size-[17px]" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function LeergutToggle({ className }: { className?: string }) {
  const { hasEmpties, setHasEmpties } = useCart();
  return (
    <div className={cn("rounded-[12px] border border-line bg-paper p-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-mist text-bottle">
            <Recycle className="size-[18px]" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[0.95rem] font-semibold">Leergut bei Lieferung mitgeben?</p>
            <p className="mt-0.5 text-[0.82rem] text-muted">Ja, ich habe Leergut.</p>
          </div>
        </div>
        <Switch checked={hasEmpties} onChange={setHasEmpties} label="Ja, ich habe Leergut." />
      </div>
      <motion.div initial={false} animate={{ height: hasEmpties ? "auto" : 0, opacity: hasEmpties ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
        <p className="pt-3 text-[0.82rem] leading-relaxed text-muted">
          Wir nehmen Leergut aus unserem Sortiment gerne mit. Die genaue Verrechnung erfolgt bei der Lieferung.
        </p>
      </motion.div>
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-[3px] transition-colors duration-300", checked ? "bg-bottle" : "bg-stone-dark")}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 34 }} className={cn("size-[22px] rounded-full bg-paper shadow-[0_2px_6px_rgba(0,0,0,0.2)]", checked ? "ml-auto" : "")} />
    </button>
  );
}

export function CartTotals({ className, light }: { className?: string; light?: boolean }) {
  const { subtotal, deposit, total, onRequestCount } = useCart();
  return (
    <div className={cn("space-y-2.5 text-[0.95rem]", className)}>
      <Row label="Warenwert" value={formatEuro(subtotal)} light={light} />
      <Row label="Pfand" value={formatEuro(deposit)} light={light} />
      <div className={cn("my-3 h-px", light ? "bg-ivory/15" : "bg-line")} />
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">Gesamt</span>
        <motion.span key={total} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[1.35rem] font-semibold tracking-[-0.02em] tabular-nums">
          {formatEuro(total)}
        </motion.span>
      </div>
      <p className={cn("flex items-start gap-2 pt-1 text-[0.78rem] leading-relaxed", light ? "text-ivory/60" : "text-muted")}>
        <Info className="mt-[2px] size-3.5 shrink-0" strokeWidth={2} />
        <span>
          Alle Preise inkl. MwSt. Pfand wird separat ausgewiesen.
          {onRequestCount > 0 && ` ${onRequestCount === 1 ? "Ein Artikel" : `${onRequestCount} Artikel`} mit Preis auf Anfrage – wir bestätigen den Preis vor der Lieferung.`}
        </span>
      </p>
    </div>
  );
}

function Row({ label, value, light }: { label: string; value: string; light?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={light ? "text-ivory/70" : "text-muted"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
