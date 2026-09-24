import type { Product, BottleShape } from "@/data/products";
import { getCategory } from "@/data/categories";
import { Bottle } from "./Bottle";
import { cn } from "@/lib/format";

/** Relative Flaschenhöhe je Form, damit Kompositionen glaubwürdig wirken. */
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
  wasser: "#E6ECE9",
  bier: "#EFE5D6",
  softdrinks: "#EAE6E1",
  "saefte-schorlen": "#F2E8D6",
  alkoholfrei: "#E4E8DD",
  "wein-spezialitaeten": "#EDE2DE",
};

interface Props {
  product: Product;
  variant?: "card" | "detail" | "thumb";
  className?: string;
}

/**
 * Produktvisual: echtes Foto, sobald `product.image` gesetzt ist –
 * bis dahin eine stilisierte Flaschen-Komposition.
 */
export function ProductVisual({ product, variant = "card", className }: Props) {
  const h = SHAPE_HEIGHT[product.visual.shape];
  const tone = getCategory(product.category).tone;
  const surface = CATEGORY_SURFACE[product.category];

  if (variant === "thumb") {
    return (
      <div className={cn("relative flex items-end justify-center overflow-hidden", className)} style={{ background: surface }}>
        <Bottle visual={product.visual} id={`${product.id}-t`} className="h-[86%] w-auto" condensation={false} shadow />
      </div>
    );
  }

  const size = `${Math.round(h * (variant === "detail" ? 80 : 74))}%`;
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: surface }}>
      {/* weiches Licht */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `radial-gradient(70% 60% at 50% 38%, rgba(255,255,255,0.8), transparent 70%), radial-gradient(60% 40% at 50% 100%, ${tone.accent}26, transparent 70%)` }}
      />
      {/* Standfläche */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[15%]" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0.06))" }} />
      <Bottle
        visual={product.visual}
        id={`${product.id}-l-${variant}`}
        className="absolute bottom-[9%] left-1/2 w-auto -translate-x-[108%] opacity-60"
        style={{ height: `calc(${size} * 0.9)` }}
        condensation={false}
      />
      <Bottle
        visual={product.visual}
        id={`${product.id}-r-${variant}`}
        className="absolute bottom-[9%] left-1/2 w-auto translate-x-[8%] opacity-60"
        style={{ height: `calc(${size} * 0.9)` }}
        condensation={false}
      />
      <Bottle
        visual={product.visual}
        id={`${product.id}-m-${variant}`}
        brand={product.brand}
        title={product.variety}
        className="absolute bottom-[7%] left-1/2 z-10 w-auto -translate-x-1/2 drop-shadow-[0_18px_22px_rgba(0,0,0,0.14)]"
        style={{ height: size }}
      />
    </div>
  );
}
