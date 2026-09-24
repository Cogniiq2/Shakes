import type { Product } from "@/data/products";
import { basePricePerLitre, cn, formatEuro } from "@/lib/format";

export function DepositBadge({ deposit, className, light }: { deposit: number | null; className?: string; light?: boolean }) {
  if (deposit === null) return <span className={cn("text-[0.8rem]", light ? "text-ivory/60" : "text-muted", className)}>zzgl. Pfand je nach Gebinde</span>;
  if (deposit === 0) return <span className={cn("text-[0.8rem]", light ? "text-ivory/60" : "text-muted", className)}>ohne Pfand</span>;
  return (
    <span className={cn("text-[0.8rem] tabular-nums", light ? "text-ivory/60" : "text-muted", className)}>
      zzgl. {formatEuro(deposit)} Pfand
    </span>
  );
}

export function PriceDisplay({ product, size = "md", className, light, showBase = true }: { product: Product; size?: "sm" | "md" | "lg"; className?: string; light?: boolean; showBase?: boolean }) {
  const priceCls = size === "lg" ? "text-[2.4rem] tracking-[-0.035em]" : size === "md" ? "text-[1.2rem] tracking-[-0.02em]" : "text-base";
  if (product.price === null) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <span className={cn("font-semibold", size === "lg" ? "text-[1.6rem] tracking-[-0.02em]" : "text-[1rem]", light ? "text-ivory" : "text-ink")}>Preis auf Anfrage</span>
        <span className={cn("text-[0.8rem]", light ? "text-ivory/60" : "text-muted")}>Wir bestätigen den aktuellen Preis persönlich.</span>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={cn("font-semibold leading-none tabular-nums", priceCls, light ? "text-ivory" : "text-ink")}>{formatEuro(product.price)}</span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <DepositBadge deposit={product.deposit} light={light} />
        {showBase && (
          <>
            <span aria-hidden className={cn("size-[3px] rounded-full", light ? "bg-ivory/30" : "bg-ink/25")} />
            <span className={cn("text-[0.8rem] tabular-nums", light ? "text-ivory/50" : "text-muted/80")}>{basePricePerLitre(product.price, product.totalVolume)}</span>
          </>
        )}
      </span>
    </div>
  );
}
