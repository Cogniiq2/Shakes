import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { products } from "@/data/products";
import { Bottle } from "@/components/visual/Bottle";
import { SHAPE_HEIGHT } from "@/components/visual/ProductVisual";
import { cn } from "@/lib/format";

/** Art-direktierte Kategorie-Kachel mit individueller Flaschen-Komposition */
const COMPOSITION: Record<string, string[]> = {
  wasser: ["plose-naturale", "adelholzener-classic", "gerolsteiner-sprudel"],
  bier: ["kulmbacher-lager-hell", "bayreuther-hell", "maisels-weisse-original", "moenchshof-kellerbier"],
  softdrinks: ["coca-cola", "spezi-original", "fritz-kola"],
  "saefte-schorlen": ["libella-orange", "adelholzener-apfelschorle", "frucade-apfelschorle"],
  alkoholfrei: ["jever-fun", "maisels-weisse-alkoholfrei"],
  "wein-spezialitaeten": ["schmitt-domina-trocken", "schmitt-silvaner-trocken"],
};

export function CategoryCard({ category, className, size = "md", index }: { category: Category; className?: string; size?: "md" | "lg" | "wide"; index?: number }) {
  const items = (COMPOSITION[category.slug] ?? []).map((s) => products.find((p) => p.slug === s)!).filter(Boolean);
  const count = products.filter((p) => p.category === category.slug).length;
  const mid = (items.length - 1) / 2;

  return (
    <Link
      href={`/sortiment?kategorie=${category.slug}`}
      className={cn("group/cat relative isolate flex overflow-hidden rounded-[16px] p-6 sm:p-7", className)}
      style={{ background: category.tone.bg, color: category.tone.fg }}
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-80" style={{ background: `radial-gradient(80% 70% at 70% 80%, ${category.tone.accent}55, transparent 70%)` }} />
      <div className="relative z-10 flex h-full w-full flex-col">
        <div className="flex items-start justify-between gap-4">
          {index !== undefined && <span className="text-[0.72rem] font-bold tabular-nums tracking-[0.14em] opacity-60">{String(index + 1).padStart(2, "0")}</span>}
          <span className="grid size-10 place-items-center rounded-full border border-current/20 transition-all duration-500 ease-[var(--ease-premium)] group-hover/cat:rotate-45 group-hover/cat:bg-current/10" style={{ borderColor: `${category.tone.fg}33` }}>
            <ArrowUpRight className="size-[18px]" strokeWidth={1.8} />
          </span>
        </div>
        <div className="mt-auto max-w-[62%]">
          <h3 className={cn("font-semibold tracking-[-0.03em]", size === "lg" ? "text-[2.2rem] leading-[1] sm:text-[2.8rem]" : "text-[1.7rem] leading-[1.02] sm:text-[1.9rem]")}>
            {category.name}
          </h3>
          <p className="mt-2 font-serif text-[1.1rem] italic opacity-75">{category.short}</p>
          <p className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] opacity-55">{count} Produkte online</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-2 bottom-0 flex h-[78%] items-end justify-end pr-5 sm:pr-7">
        {items.map((p, i) => {
          const h = SHAPE_HEIGHT[p.visual.shape];
          const offset = i - mid;
          return (
            <div
              key={p.slug}
              className="-ml-[6%] h-full origin-bottom transition-transform duration-[900ms] ease-[var(--ease-premium)] first:ml-0"
              style={{ transform: `scale(${1 - Math.abs(offset) * 0.1})`, zIndex: 10 - Math.abs(Math.round(offset * 2)) }}
            >
              <div className="flex h-full items-end transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover/cat:-translate-y-[4%]" style={{ transitionDelay: `${i * 50}ms` }}>
                <Bottle visual={p.visual} id={`cat-${category.slug}-${i}`} brand={p.brand} className="h-full w-auto" style={{ height: `${h * 100}%` }} condensation={category.slug !== "wein-spezialitaeten"} />
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
