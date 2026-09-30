import type { Product, BottleShape } from "@/data/products";
import { getCategory } from "@/data/categories";
import { ProductPhoto } from "./ProductPhoto";
import { cn, formatPack } from "@/lib/format";

/** Relative Flaschenhöhe je Form (für Flaschen-Kompositionen) */
export const SHAPE_HEIGHT: Record<BottleShape, number> = {
  euro: 0.86,
  longneck: 0.8,
  steinie: 0.64,
  weizen: 0.96,
  swingtop: 0.86,
  water: 0.94,
  juice: 0.9,
  pet: 1,
  bocksbeutel: 0.76,
};

/** Dezenter Hintergrundton pro Kategorie – für Produktflächen */
export const CATEGORY_SURFACE: Record<string, string> = {
  wasser: "#E7ECEA",
  bier: "#EFE7DA",
  softdrinks: "#ECE8E3",
  "saefte-schorlen": "#F2EADB",
  alkoholfrei: "#E6E9E0",
  "wein-spezialitaeten": "#EEE5E1",
};

interface Props {
  product: Product;
  variant?: "card" | "detail" | "thumb";
  className?: string;
  priority?: boolean;
}

/**
 * Produktdarstellung: freigestelltes Originalfoto auf ruhiger Studiofläche.
 * Ohne Foto: ehrlicher typografischer Platzhalter – keine nachgebaute Flasche.
 */
export function ProductVisual({ product, variant = "card", className, priority }: Props) {
  const surface = CATEGORY_SURFACE[product.category];
  const tone = getCategory(product.category).tone;

  if (!product.image) return <PhotoPending product={product} variant={variant} className={className} />;

  if (variant === "thumb") {
    return (
      <div className={cn("relative flex items-end justify-center overflow-hidden", className)} style={{ background: surface }}>
        <div className="h-[88%] pb-[6%]">
          <ProductPhoto product={product} size="sm" reflection={false} shadow={false} />
        </div>
      </div>
    );
  }

  // Leicht maßstabsbezogen: größere Flaschen wirken größer, ohne kleine Flaschen zu verlieren
  const scale = variant === "detail" ? 0.9 + 0.1 * Math.min(1, product.heightCm / 31) : 0.82 + 0.18 * Math.min(1, product.heightCm / 31);
  const stage = variant === "detail" ? 0.8 : 0.78;
  return (
    <div className={cn("relative isolate flex items-end justify-center overflow-hidden", className)} style={{ background: surface }}>
      {/* Studiolicht */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(55% 48% at 50% 40%, rgba(255,255,255,0.95), transparent 72%), radial-gradient(70% 30% at 50% 100%, ${tone.accent}24, transparent 70%)`,
        }}
      />
      {/* Standfläche */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[17%] bg-gradient-to-b from-black/[0.035] to-black/[0.07]" />
      <div aria-hidden className="absolute inset-x-0 bottom-[17%] -z-10 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
      <div className="relative mb-[12%]" style={{ height: `${Math.round(stage * scale * 100)}%` }}>
        <ProductPhoto product={product} size={variant === "detail" ? "lg" : "sm"} priority={priority} />
      </div>
    </div>
  );
}

/** Platzhalter, solange kein freigegebenes Produktfoto vorliegt – ruhig, typografisch, keine Fake-Flasche */
function PhotoPending({ product, variant, className }: { product: Product; variant: "card" | "detail" | "thumb"; className?: string }) {
  const tone = getCategory(product.category).tone;
  const surface = CATEGORY_SURFACE[product.category];
  const initial = product.brand.replace(/[^A-Za-zÄÖÜäöü]/g, "").charAt(0).toUpperCase();
  if (variant === "thumb") {
    return (
      <div className={cn("grid place-items-center overflow-hidden", className)} style={{ background: surface }}>
        <span className="font-serif text-[1.4rem] italic leading-none" style={{ color: tone.accent }}>
          {initial}
        </span>
      </div>
    );
  }
  const detail = variant === "detail";
  return (
    <div className={cn("relative isolate flex flex-col items-center justify-center overflow-hidden px-5 text-center", className)} style={{ background: surface }}>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 50% at 50% 42%, rgba(255,255,255,0.85), transparent 72%)" }} />
      <span
        aria-hidden
        className={cn("grid place-items-center rounded-full border font-serif italic leading-none", detail ? "size-28 text-[3.4rem]" : "size-16 text-[2rem] sm:size-20 sm:text-[2.4rem]")}
        style={{ borderColor: `${tone.accent}55`, color: tone.accent }}
      >
        {initial}
      </span>
      <p className={cn("mt-4 font-bold uppercase text-muted", detail ? "text-[0.72rem] tracking-[0.22em]" : "text-[0.6rem] tracking-[0.18em]")}>{product.brand}</p>
      {detail && (
        <>
          <p className="mt-3 max-w-md text-balance font-serif text-[2.4rem] italic leading-[1.05] text-ink/80">{product.name}</p>
          <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted/80">Produktfoto folgt</p>
        </>
      )}
    </div>
  );
}
