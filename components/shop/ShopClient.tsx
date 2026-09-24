"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Info, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories, type CategorySlug } from "@/data/categories";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { FilterPanel } from "./FilterPanel";
import { activeFilterCount, applyFilters, defaultFilters, sortOptions, type Filters, type SortKey } from "./filters";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { cn, formatEuro } from "@/lib/format";
import { site } from "@/lib/site";

const tabs: Array<{ slug: CategorySlug | "alle"; name: string }> = [
  { slug: "alle", name: "Alle" },
  { slug: "wasser", name: "Wasser" },
  { slug: "softdrinks", name: "Softdrinks" },
  { slug: "saefte-schorlen", name: "Säfte & Schorlen" },
  { slug: "bier", name: "Bier" },
  { slug: "alkoholfrei", name: "Alkoholfrei" },
  { slug: "wein-spezialitaeten", name: "Wein & Spezialitäten" },
];

export function ShopClient({ initial }: { initial: Partial<Filters> }) {
  const [filters, setAll] = useState<Filters>({ ...defaultFilters, ...initial });
  const [sheet, setSheet] = useState(false);
  const setFilters = useCallback((f: Partial<Filters>) => setAll((prev) => ({ ...prev, ...f })), []);
  const toggle = useCallback(<K extends "brands" | "packs" | "material" | "returnType" | "price">(key: K, value: Filters[K][number]) => {
    setAll((prev) => {
      const arr = prev[key] as Array<typeof value>;
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }, []);

  const results = useMemo(() => applyFilters([...products], filters), [filters]);
  const activeCount = activeFilterCount(filters);

  // URL synchron halten (teilbare Filterzustände), ohne Server-Roundtrip
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== "alle") params.set("kategorie", filters.category);
    if (filters.q) params.set("q", filters.q);
    if (filters.brands.length === 1) params.set("marke", filters.brands[0]);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/sortiment?${qs}` : "/sortiment");
  }, [filters.category, filters.q, filters.brands]);

  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [sheet]);

  const reset = () => setAll({ ...defaultFilters, q: "", category: "alle" });
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Suche */}
      <div className="container-x">
        <label htmlFor="shop-search" className="sr-only">
          Getränk, Marke oder Sorte suchen
        </label>
        <div className="flex h-16 items-center gap-3 rounded-[14px] border border-line bg-paper px-5 transition-[border-color,box-shadow] focus-within:border-bottle/40 focus-within:shadow-[0_0_0_4px_rgba(16,42,35,0.06)] sm:h-[72px]">
          <Search className="size-5 shrink-0 text-muted" strokeWidth={1.8} />
          <input
            id="shop-search"
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
            placeholder="Getränk, Marke oder Sorte suchen …"
            className="h-full min-w-0 flex-1 bg-transparent text-[1.05rem] font-medium outline-none placeholder:text-muted/70 sm:text-[1.15rem]"
            enterKeyHint="search"
            autoComplete="off"
          />
          <AnimatePresence>
            {filters.q && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} type="button" onClick={() => setFilters({ q: "" })} aria-label="Suche leeren" className="grid size-9 place-items-center rounded-full bg-stone text-ink hover:bg-stone-dark">
                <X className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Kategorie-Tabs */}
      <div ref={topRef} className="sticky top-[67px] z-30 mt-5 border-b sm:mt-8 border-line bg-ivory/90 backdrop-blur-xl">
        <div className="container-x flex items-center gap-4">
          <div role="tablist" aria-label="Kategorien" className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto px-1 py-3">
            {tabs.map((t) => {
              const active = filters.category === t.slug;
              return (
                <button
                  key={t.slug}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setFilters({ category: t.slug })}
                  className={cn("relative h-10 shrink-0 rounded-full px-4 text-[0.88rem] font-semibold transition-colors", active ? "text-ivory" : "text-ink/70 hover:text-ink")}
                >
                  {active && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-bottle" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{t.name}</span>
                </button>
              );
            })}
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <label htmlFor="sort" className="text-[0.82rem] text-muted">
              Sortieren
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value as SortKey })}
              className="h-10 cursor-pointer rounded-[8px] border border-line bg-paper px-3 text-[0.88rem] font-semibold outline-none focus:border-bottle/40"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container-x mt-8 grid gap-10 pb-28 lg:grid-cols-[250px_1fr] lg:gap-12 xl:grid-cols-[270px_1fr]">
        {/* Desktop-Filter */}
        <aside className="hidden lg:block" aria-label="Filter">
          <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between pb-2">
              <p className="eyebrow text-muted">Filter</p>
              {activeCount > 0 && (
                <button type="button" onClick={() => setAll((p) => ({ ...defaultFilters, q: p.q, category: p.category, sort: p.sort }))} className="text-[0.8rem] font-semibold text-bottle hover:underline">
                  Zurücksetzen ({activeCount})
                </button>
              )}
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} toggle={toggle} />
            <ShopNote className="mt-6" />
          </div>
        </aside>

        <div>
          {/* Ergebnisleiste */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.9rem] text-muted" aria-live="polite">
              <span className="font-semibold tabular-nums text-ink">{results.length}</span> {results.length === 1 ? "Produkt" : "Produkte"}
              {filters.category !== "alle" && <> in {categories.find((c) => c.slug === filters.category)?.name}</>}
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <select aria-label="Sortieren" value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as SortKey })} className="h-11 max-w-[150px] rounded-[10px] border border-line bg-paper px-3 text-[0.85rem] font-semibold">
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setSheet(true)} className="relative inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-paper px-4 text-[0.88rem] font-semibold active:scale-95">
                <SlidersHorizontal className="size-4" /> Filter
                {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-amber text-[0.7rem] font-bold text-ink">{activeCount}</span>}
              </button>
            </div>
          </div>

          {/* Aktive Filter */}
          <AnimatePresence initial={false}>
            {activeCount > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-wrap gap-2 pt-4">
                  {[...filters.brands.map((v) => ({ k: "brands" as const, v })), ...filters.packs.map((v) => ({ k: "packs" as const, v })), ...filters.material.map((v) => ({ k: "material" as const, v })), ...filters.returnType.map((v) => ({ k: "returnType" as const, v })), ...filters.price.map((v) => ({ k: "price" as const, v }))].map(({ k, v }) => (
                    <button key={`${k}-${v}`} type="button" onClick={() => toggle(k, v as never)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-bottle/[0.07] pl-3.5 pr-2.5 text-[0.82rem] font-semibold text-bottle hover:bg-bottle/[0.12]">
                      {k === "price" ? { "bis-15": "bis 15 €", "15-25": "15 – 25 €", "ab-25": "über 25 €" }[v as string] : v}
                      <X className="size-3.5" />
                    </button>
                  ))}
                  {filters.alcoholFree && (
                    <button type="button" onClick={() => setFilters({ alcoholFree: false })} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-bottle/[0.07] pl-3.5 pr-2.5 text-[0.82rem] font-semibold text-bottle">
                      Alkoholfrei <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Raster */}
          {results.length > 0 ? (
            <motion.ul layout className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:gap-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.03 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                  >
                    <ProductCard product={p} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <EmptyResults query={filters.q} onReset={reset} />
          )}
          <ShopNote className="mt-10 lg:hidden" />
        </div>
      </div>

      {/* Mobiles Filter-Sheet */}
      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter">
            <motion.button type="button" aria-label="Filter schließen" className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.55, ease: EASE }} className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[20px] bg-ivory">
              <div className="flex justify-center pt-2.5" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-ink/15" />
              </div>
              <div className="flex items-center justify-between border-b border-line px-5 pb-4 pt-2">
                <p className="text-[1.2rem] font-semibold">Filter</p>
                <div className="flex items-center gap-1">
                  {activeCount > 0 && (
                    <button type="button" onClick={() => setAll((p) => ({ ...defaultFilters, q: p.q, category: p.category, sort: p.sort }))} className="h-10 px-3 text-[0.85rem] font-semibold text-bottle">
                      Zurücksetzen
                    </button>
                  )}
                  <button type="button" onClick={() => setSheet(false)} aria-label="Schließen" className="grid size-11 place-items-center rounded-full hover:bg-ink/5">
                    <X className="size-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5">
                <FilterPanel filters={filters} setFilters={setFilters} toggle={toggle} />
              </div>
              <div className="border-t border-line bg-paper px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                <Button onClick={() => setSheet(false)} size="lg" className="w-full">
                  {results.length} {results.length === 1 ? "Produkt" : "Produkte"} anzeigen
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileCartBar />
    </>
  );
}

function ShopNote({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-line bg-paper p-4 text-[0.8rem] leading-relaxed text-muted", className)}>
      <p className="flex gap-2">
        <Info className="mt-0.5 size-3.5 shrink-0 text-amber-deep" strokeWidth={2.2} />
        <span>
          Alle Preise inkl. MwSt. zzgl. Pfand, sofern angegeben.
          <br />
          Nur sortenreine Kästen.
        </span>
      </p>
      <p className="mt-2 pl-[1.35rem]">Gastro-Gebinde bitte vorbestellen.</p>
    </div>
  );
}

function EmptyResults({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-center rounded-[16px] border border-dashed border-line-soft bg-paper px-6 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-stone">
        <Search className="size-6 text-bottle" strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-[1.5rem] font-semibold tracking-[-0.02em]">{query ? <>Nichts gefunden für „{query}“.</> : "Keine passenden Produkte."}</h2>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">Nicht alles aus unserem Sortiment ist bereits online. Passen Sie die Filter an – oder fragen Sie uns direkt, vieles ist auf Anfrage möglich.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onReset} variant="primary">
          Filter zurücksetzen
        </Button>
        <Button href={site.phone.href} variant="outline">
          {site.phone.display}
        </Button>
      </div>
    </motion.div>
  );
}

export function MobileCartBar() {
  const { count, total, openDrawer, ready } = useCart();
  return (
    <AnimatePresence>
      {ready && count > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", stiffness: 380, damping: 36 }} className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <button type="button" onClick={openDrawer} className="flex h-14 w-full items-center justify-between rounded-[14px] bg-bottle px-5 text-ivory shadow-[0_18px_40px_-16px_rgba(16,42,35,0.7)] active:scale-[0.99]">
            <span className="flex items-center gap-3 text-[0.9rem] font-semibold">
              <span className="grid size-7 place-items-center rounded-full bg-amber text-[0.78rem] font-bold tabular-nums text-ink">{count}</span>
              Warenkorb ansehen
            </span>
            <span className="flex items-center gap-2 text-[0.95rem] font-semibold tabular-nums">
              {formatEuro(total)} <ArrowRight className="size-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
