import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { products } from "@/data/products";
import { ProductPhoto } from "@/components/visual/ProductPhoto";
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
  // Nur echte Produktfotos – bevorzugte Reihenfolge, dann weitere fotografierte Produkte der Kategorie
  const preferred = (COMPOSITION[category.slug] ?? []).map((s) => products.find((p) => p.slug === s)).filter((p) => p?.image);
  const others = products.filter((p) => p.category === category.slug && p.image && !preferred.includes(p));
  const items = [...preferred, ...others].filter((p): p is (typeof products)[number] => Boolean(p)).slice(0, size === "lg" ? 4 : 3);
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
      {items.length > 0 ? (
        <div aria-hidden className="pointer-events-none absolute bottom-[6%] right-5 flex h-[80%] items-end sm:right-7">
          {items.map((p, i) => {
            const offset = i - mid;
            return (
              <div
                key={p.slug}
                className="-ml-[3%] h-full first:ml-0"
                style={{ zIndex: 10 - Math.abs(Math.round(offset * 2)) }}
              >
                <div
                  className="flex h-full items-end transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover/cat:-translate-y-[3%]"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div style={{ height: `${(p.heightCm / 31) * 100 * (1 - Math.abs(offset) * 0.06)}%` }}>
                    <ProductPhoto product={p} size="sm" dark={category.tone.fg !== "#102A23" && category.tone.fg.toLowerCase().startsWith("#f")} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Link>
  );
}
