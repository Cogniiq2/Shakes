"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/categories";
import { brands, products } from "@/data/products";
import { allPacks, packLabel, priceBands, type Filters } from "./filters";
import { cn } from "@/lib/format";
import { Switch } from "@/components/cart/CartParts";

type Toggle = <K extends "brands" | "packs" | "material" | "returnType" | "price">(key: K, value: Filters[K][number]) => void;

export function FilterPanel({ filters, setFilters, toggle }: { filters: Filters; setFilters: (f: Partial<Filters>) => void; toggle: Toggle }) {
  const count = (pred: (p: (typeof products)[number]) => boolean) => products.filter(pred).length;
  return (
    <div className="divide-y divide-line">
      <Group title="Kategorie" defaultOpen>
        <ul className="space-y-0.5">
          {[{ slug: "alle" as const, name: "Alle Getränke" }, ...categories].map((c) => {
            const active = filters.category === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => setFilters({ category: c.slug })}
                  className={cn("flex h-10 w-full items-center justify-between rounded-md px-2 text-left text-[0.92rem] transition-colors", active ? "bg-bottle/[0.06] font-semibold text-bottle" : "text-ink/80 hover:bg-ink/[0.03]")}
                >
                  {c.name}
                  <span className="text-[0.78rem] tabular-nums text-muted">{c.slug === "alle" ? products.length : count((p) => p.category === c.slug)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>
      <Group title="Marke" defaultOpen>
        <div className="max-h-[260px] space-y-0.5 overflow-y-auto pr-1">
          {brands.map((b) => (
            <Check_ key={b} label={b} checked={filters.brands.includes(b)} onChange={() => toggle("brands", b)} count={count((p) => p.brand === b)} />
          ))}
        </div>
      </Group>
      <Group title="Gebinde">
        {allPacks.map((pk) => (
          <Check_ key={pk} label={pk} checked={filters.packs.includes(pk)} onChange={() => toggle("packs", pk)} count={count((p) => packLabel(p) === pk)} />
        ))}
      </Group>
      <Group title="Glas / PET">
        {(["Glas", "PET"] as const).map((m) => (
          <Check_ key={m} label={m} checked={filters.material.includes(m)} onChange={() => toggle("material", m)} count={count((p) => p.packageType === m)} />
        ))}
      </Group>
      <Group title="Mehrweg / Einweg">
        {(["Mehrweg", "Einweg"] as const).map((m) => (
          <Check_ key={m} label={m} checked={filters.returnType.includes(m)} onChange={() => toggle("returnType", m)} count={count((p) => p.returnType === m)} />
        ))}
      </Group>
      <div className="flex items-center justify-between py-5">
        <span className="text-[0.92rem] font-semibold">Nur alkoholfrei</span>
        <Switch checked={filters.alcoholFree} onChange={(v) => setFilters({ alcoholFree: v })} label="Nur alkoholfreie Getränke" />
      </div>
      <Group title="Preis">
        {priceBands.map((b) => (
          <Check_ key={b.value} label={b.label} checked={filters.price.includes(b.value)} onChange={() => toggle("price", b.value)} count={count((p) => p.price !== null && b.test(p.price))} />
        ))}
        <p className="mt-2 px-2 text-[0.76rem] leading-relaxed text-muted">Artikel mit Preis auf Anfrage werden beim Preisfilter ausgeblendet.</p>
      </Group>
    </div>
  );
}

function Group({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="py-2">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-12 w-full items-center justify-between text-left text-[0.92rem] font-semibold">
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="size-4 text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Check_({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count: number }) {
  return (
    <label className="group flex h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-[0.92rem] transition-colors hover:bg-ink/[0.03]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={cn("grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-amber", checked ? "border-bottle bg-bottle text-ivory" : "border-ink/25 bg-paper group-hover:border-ink/50")}>
        <motion.span initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ type: "spring", stiffness: 600, damping: 30 }}>
          <Check className="size-3" strokeWidth={3} />
        </motion.span>
      </span>
      <span className={cn("flex-1", checked && "font-semibold")}>{label}</span>
      <span className="text-[0.78rem] tabular-nums text-muted">{count}</span>
    </label>
  );
}
