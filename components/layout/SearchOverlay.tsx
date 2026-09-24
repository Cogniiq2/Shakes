"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { products, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { EASE } from "@/components/ui/Reveal";
import { formatEuro, formatPack } from "@/lib/format";

const suggestions = ["Bayreuther", "Maisel's", "Apfelschorle", "Alkoholfrei", "Spezi", "Wasser still"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!searchOpen) return;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const direct = searchProducts(q);
    if (direct.length || !q.trim()) return direct;
    // Synonyme für häufige Suchbegriffe
    const term = q.trim().toLowerCase();
    if (term.includes("still")) return products.filter((p) => p.variety.toLowerCase().includes("ohne kohlensäure"));
    const cat = categories.find((c) => c.name.toLowerCase().includes(term));
    return cat ? products.filter((p) => p.category === cat.slug) : [];
  }, [q]);

  const close = () => setSearchOpen(false);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Suche">
          <motion.button type="button" aria-label="Suche schließen" className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-ivory shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] sm:inset-x-4 sm:top-4 sm:mx-auto sm:max-w-3xl sm:rounded-[20px]"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                close();
                router.push(`/sortiment?q=${encodeURIComponent(q.trim())}`);
              }}
              className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-ivory/95 px-5 py-4 backdrop-blur sm:px-7 sm:py-5"
            >
              <Search className="size-5 shrink-0 text-muted" strokeWidth={1.8} />
              <label htmlFor="global-search" className="sr-only">
                Getränk, Marke oder Sorte suchen
              </label>
              <input
                ref={inputRef}
                id="global-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Getränk, Marke oder Sorte suchen …"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 min-w-0 flex-1 bg-transparent text-[1.15rem] font-medium tracking-[-0.01em] outline-none placeholder:text-muted/70 sm:text-[1.35rem]"
              />
              <button type="button" onClick={close} aria-label="Schließen" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/5 active:scale-90">
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </form>

            <div className="px-5 pb-7 pt-5 sm:px-7">
              {!q.trim() ? (
                <>
                  <p className="eyebrow text-muted">Häufig gesucht</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setQ(s)} className="h-10 rounded-full border border-line bg-paper px-4 text-[0.9rem] font-medium transition-colors hover:border-ink/30 active:scale-95">
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="eyebrow mt-8 text-muted">Kategorien</p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/sortiment?kategorie=${c.slug}`} onClick={close} className="group flex items-center justify-between border-b border-line py-3 text-[0.98rem] font-semibold">
                          {c.name}
                          <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-lg font-semibold">Keine Treffer für „{q}“.</p>
                  <p className="mx-auto mt-2 max-w-sm text-[0.92rem] text-muted">Nicht alles aus unserem Sortiment ist schon online. Fragen Sie uns gern direkt – vieles ist auf Anfrage möglich.</p>
                  <Link href="/kontakt" onClick={close} className="mt-5 inline-flex text-[0.92rem] font-semibold link-underline">
                    Direkt anfragen
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-[0.82rem] text-muted">
                    {results.length} {results.length === 1 ? "Treffer" : "Treffer"}
                  </p>
                  <ul className="mt-3 divide-y divide-line">
                    {results.slice(0, 8).map((p, i) => (
                      <motion.li key={p.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                        <Link href={`/sortiment/${p.slug}`} onClick={close} className="group flex items-center gap-4 py-3">
                          <ProductVisual product={p} variant="thumb" className="size-14 shrink-0 rounded-[8px]" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold group-hover:text-bottle-700">{p.name}</p>
                            <p className="text-[0.82rem] text-muted tabular-nums">
                              {p.brand} · {formatPack(p.packQuantity, p.bottleVolume)}
                            </p>
                          </div>
                          <span className="text-[0.92rem] font-semibold tabular-nums">{p.price === null ? "auf Anfrage" : formatEuro(p.price)}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  {results.length > 8 && (
                    <Link href={`/sortiment?q=${encodeURIComponent(q)}`} onClick={close} className="mt-4 inline-flex items-center gap-2 text-[0.92rem] font-semibold">
                      Alle {results.length} Treffer ansehen <ArrowRight className="size-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
