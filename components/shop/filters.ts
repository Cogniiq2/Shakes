import type { CategorySlug } from "@/data/categories";
import { products, type Product } from "@/data/products";
import { formatPack } from "@/lib/format";

export type SortKey = "empfohlen" | "name" | "preis-auf" | "preis-ab";
export type PriceBand = "bis-15" | "15-25" | "ab-25";

export interface Filters {
  q: string;
  category: CategorySlug | "alle";
  brands: string[];
  packs: string[];
  material: Array<"Glas" | "PET">;
  returnType: Array<"Mehrweg" | "Einweg">;
  alcoholFree: boolean;
  price: PriceBand[];
  sort: SortKey;
}

export const defaultFilters: Filters = {
  q: "",
  category: "alle",
  brands: [],
  packs: [],
  material: [],
  returnType: [],
  alcoholFree: false,
  price: [],
  sort: "empfohlen",
};

export const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "empfohlen", label: "Empfohlen" },
  { value: "name", label: "Name" },
  { value: "preis-auf", label: "Preis aufsteigend" },
  { value: "preis-ab", label: "Preis absteigend" },
];

export const priceBands: Array<{ value: PriceBand; label: string; test: (p: number) => boolean }> = [
  { value: "bis-15", label: "bis 15 €", test: (p) => p < 15 },
  { value: "15-25", label: "15 – 25 €", test: (p) => p >= 15 && p <= 25 },
  { value: "ab-25", label: "über 25 €", test: (p) => p > 25 },
];

export const packLabel = (p: Product) => formatPack(p.packQuantity, p.bottleVolume);
export const allPacks = Array.from(new Set(products.map(packLabel)));

export function applyFilters(list: Product[], f: Filters): Product[] {
  const q = f.q.trim().toLowerCase();
  const terms = q ? q.split(/\s+/) : [];
  const out = list.filter((p) => {
    if (f.category !== "alle" && p.category !== f.category) return false;
    if (terms.length) {
      const hay = `${p.name} ${p.brand} ${p.variety} ${p.origin ?? ""} ${p.category}`.toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.packs.length && !f.packs.includes(packLabel(p))) return false;
    if (f.material.length && !f.material.includes(p.packageType)) return false;
    if (f.returnType.length && !f.returnType.includes(p.returnType)) return false;
    if (f.alcoholFree && p.alcoholic) return false;
    if (f.price.length) {
      if (p.price === null) return false;
      if (!priceBands.filter((b) => f.price.includes(b.value)).some((b) => b.test(p.price!))) return false;
    }
    return true;
  });
  const priceOr = (p: Product, fallback: number) => (p.price === null ? fallback : p.price);
  switch (f.sort) {
    case "name":
      return out.sort((a, b) => a.name.localeCompare(b.name, "de"));
    case "preis-auf":
      return out.sort((a, b) => priceOr(a, Infinity) - priceOr(b, Infinity));
    case "preis-ab":
      return out.sort((a, b) => priceOr(b, -Infinity) - priceOr(a, -Infinity));
    default:
      return out.sort((a, b) => Number(b.featured) - Number(a.featured) || a.rank - b.rank);
  }
}

export function activeFilterCount(f: Filters): number {
  return f.brands.length + f.packs.length + f.material.length + f.returnType.length + f.price.length + (f.alcoholFree ? 1 : 0);
}
