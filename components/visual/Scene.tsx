import { getProduct, type Product } from "@/data/products";
import { ProductPhoto } from "./ProductPhoto";
import { cn } from "@/lib/format";

/**
 * Studio-Stillleben mit echten Produktfotos für Zielgruppen- und Inhaltsflächen.
 * Jede Szene nennt Wunschprodukte; es erscheinen nur Produkte, für die ein Foto vorliegt.
 * REAL BUSINESS PHOTO RECOMMENDED HERE: Szenen aus dem echten Alltag (Lieferung, Büro,
 * Gastronomie) können diese Stillleben später ersetzen.
 */

type SceneKind = "home" | "office" | "gastro" | "warehouse";

const SCENES: Record<SceneKind, { bg: string; light: string; surface: string; dark?: boolean; slugs: string[]; max: number }> = {
  home: {
    bg: "#EDE5D6",
    light: "radial-gradient(60% 55% at 75% 18%, rgba(255,247,230,0.95), transparent 70%)",
    surface: "#DCCFB8",
    slugs: ["adelholzener-classic", "plose-naturale", "bayreuther-hell", "kulmbacher-lager-hell", "bionade-holunder", "spezi-original"],
    max: 3,
  },
  office: {
    bg: "#DEE4E1",
    light: "radial-gradient(70% 60% at 20% 8%, rgba(255,255,255,0.95), transparent 70%)",
    surface: "#C9D1CD",
    slugs: ["adelholzener-naturell", "adelholzener-sanft", "adelholzener-apfelschorle", "coca-cola-zero", "plose-naturale"],
    max: 3,
  },
  gastro: {
    bg: "#16302A",
    light: "radial-gradient(55% 50% at 50% 28%, rgba(200,138,56,0.42), transparent 70%)",
    surface: "#0D1F1A",
    dark: true,
    slugs: ["augustiner-hell", "maisels-weisse-original", "bayreuther-hell", "kulmbacher-lager-hell", "fritz-kola"],
    max: 4,
  },
  warehouse: {
    bg: "#E7E1D6",
    light: "radial-gradient(60% 50% at 30% 8%, rgba(255,250,240,0.9), transparent 70%)",
    surface: "#D1C8B8",
    slugs: ["bayreuther-hell", "kulmbacher-lager-hell", "maisels-weisse-original", "augustiner-hell", "fritz-kola", "spezi-original", "plose-naturale", "adelholzener-classic"],
    max: 5,
  },
};

export function Scene({ kind, className }: { kind: SceneKind; className?: string }) {
  const s = SCENES[kind];
  const items = s.slugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => Boolean(p?.image))
    .slice(0, s.max);
  const n = items.length;
  const mid = (n - 1) / 2;

  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: s.bg }} aria-hidden>
      <div className="absolute inset-0 -z-10" style={{ background: s.light }} />
      {kind === "home" && <div className="absolute right-[8%] top-[6%] h-[44%] w-[32%] rounded-t-full border-[10px] border-b-0 border-white/45" />}
      {kind === "office" && (
        <div className="absolute left-[6%] top-[8%] grid h-[38%] w-[38%] grid-cols-3 gap-2 opacity-40">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="rounded-sm bg-white/70" />
          ))}
        </div>
      )}
      {s.dark && <div className="absolute inset-x-[10%] top-[10%] h-px bg-amber/30" />}
      <div className="absolute inset-x-0 bottom-0 h-[20%]" style={{ background: s.surface }} />
      <div className="absolute inset-x-0 bottom-[20%] h-px" style={{ background: s.dark ? "rgba(200,138,56,0.3)" : "rgba(0,0,0,0.08)" }} />
      {items.map((p, i) => {
        const offset = i - mid;
        const x = n === 1 ? 50 : 50 + offset * (70 / Math.max(n - 1, 1));
        return (
          <div
            key={p.slug}
            className="absolute bottom-[17%] -translate-x-1/2"
            style={{ left: `${x}%`, height: `${70 * (p.heightCm / 31)}%`, zIndex: 10 - Math.round(Math.abs(offset) * 2) }}
          >
            <ProductPhoto product={p} size="sm" dark={s.dark} />
          </div>
        );
      })}
    </div>
  );
}
