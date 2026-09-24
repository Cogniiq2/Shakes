import type { CategorySlug } from "./categories";

/**
 * Produktdaten des Prototyps.
 *
 * Struktur ist bewusst flach und relational gedacht, damit sie später
 * 1:1 in eine Datenbanktabelle (z. B. Supabase `products`) überführt werden kann.
 *
 * Preise: Nur dort gesetzt, wo sie aus der Preisliste (Stand März 2026) bestätigt sind.
 * `price: null` → im Frontend „Preis auf Anfrage“, niemals ein erfundener Preis.
 */

export type BottleShape =
  | "euro" // 0,5 L Euroflasche / NRW
  | "longneck" // 0,33 L
  | "steinie" // kurze 0,33 L
  | "weizen" // Weissbierflasche
  | "swingtop" // Bügelflasche
  | "water" // 0,7 / 0,75 L Mineralwasser-Glas
  | "juice" // 1,0 L Saftflasche
  | "pet" // PET-Flasche
  | "bocksbeutel"; // fränkischer Bocksbeutel

export type PackageType = "Glas" | "PET";
export type ReturnType = "Mehrweg" | "Einweg";

export interface ProductVisual {
  shape: BottleShape;
  /** Glasfarbe; bei Klarglas "clear" + liquid */
  glass: string;
  liquid?: string;
  label: string;
  labelInk: string;
  cap: string;
  /** Kastenfarbe für die Kastenansicht */
  crate: string;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  variety: string;
  category: CategorySlug;
  packQuantity: number;
  bottleVolume: number;
  totalVolume: number;
  price: number | null;
  deposit: number | null;
  packageType: PackageType;
  returnType: ReturnType;
  alcoholic: boolean;
  alcoholFree: boolean;
  regional: boolean;
  origin?: string;
  featured: boolean;
  /** Pfad zu echtem Produktfoto, sobald vorhanden. Bis dahin stilisierte Darstellung. */
  image: string | null;
  available: boolean;
  gastroOnly: boolean;
  /** Empfohlene Reihenfolge */
  rank: number;
  visual: ProductVisual;
}

type Seed = Omit<Product, "id" | "totalVolume" | "image" | "available" | "gastroOnly" | "featured" | "regional" | "alcoholic" | "alcoholFree" | "rank"> &
  Partial<Pick<Product, "image" | "available" | "gastroOnly" | "featured" | "regional" | "alcoholic" | "alcoholFree">>;

const seeds: Seed[] = [
  // ——— Wasser ———
  {
    slug: "adelholzener-classic", brand: "Adelholzener", name: "Adelholzener Classic", variety: "Mit Kohlensäure",
    category: "wasser", packQuantity: 12, bottleVolume: 0.75, price: 12.0, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg", featured: true,
    visual: { shape: "water", glass: "clear", liquid: "#D6E6EA", label: "#1E4B7A", labelInk: "#FFFFFF", cap: "#1E4B7A", crate: "#1E4B7A" },
  },
  {
    slug: "adelholzener-naturell", brand: "Adelholzener", name: "Adelholzener Naturell", variety: "Ohne Kohlensäure",
    category: "wasser", packQuantity: 12, bottleVolume: 0.75, price: 12.0, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg", featured: true,
    visual: { shape: "water", glass: "clear", liquid: "#DCEBE4", label: "#2F6B4F", labelInk: "#FFFFFF", cap: "#2F6B4F", crate: "#1E4B7A" },
  },
  {
    slug: "adelholzener-sanft", brand: "Adelholzener", name: "Adelholzener Sanft", variety: "Wenig Kohlensäure",
    category: "wasser", packQuantity: 12, bottleVolume: 0.75, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "water", glass: "clear", liquid: "#D9E8EE", label: "#5A93B8", labelInk: "#FFFFFF", cap: "#5A93B8", crate: "#1E4B7A" },
  },
  {
    slug: "frankenbrunnen-medium", brand: "Frankenbrunnen", name: "Frankenbrunnen Medium", variety: "Medium",
    category: "wasser", packQuantity: 12, bottleVolume: 0.7, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg", regional: true, origin: "Franken",
    visual: { shape: "water", glass: "clear", liquid: "#DDE9E6", label: "#A8322D", labelInk: "#FFFFFF", cap: "#A8322D", crate: "#8E2B27" },
  },
  {
    slug: "gerolsteiner-sprudel", brand: "Gerolsteiner", name: "Gerolsteiner Sprudel", variety: "Mit Kohlensäure",
    category: "wasser", packQuantity: 12, bottleVolume: 0.75, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "water", glass: "clear", liquid: "#D5E3EC", label: "#10408C", labelInk: "#FFFFFF", cap: "#10408C", crate: "#10408C" },
  },
  {
    slug: "plose-naturale", brand: "Plose", name: "Plose Naturale", variety: "Ohne Kohlensäure",
    category: "wasser", packQuantity: 12, bottleVolume: 0.75, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "water", glass: "clear", liquid: "#E2EEF0", label: "#F4F1EA", labelInk: "#2A5B8A", cap: "#2A5B8A", crate: "#2B3A45" },
  },
  {
    slug: "volvic-naturelle", brand: "Volvic", name: "Volvic Naturelle", variety: "Ohne Kohlensäure",
    category: "wasser", packQuantity: 6, bottleVolume: 1.5, price: null, deposit: 1.5, packageType: "PET", returnType: "Einweg",
    visual: { shape: "pet", glass: "clear", liquid: "#E3EEF3", label: "#C9455B", labelInk: "#FFFFFF", cap: "#C9455B", crate: "#C9455B" },
  },
  {
    slug: "adelholzener-classic-gastro", brand: "Adelholzener", name: "Adelholzener Classic Gastro", variety: "Gastro-Gebinde · mit Kohlensäure",
    category: "wasser", packQuantity: 24, bottleVolume: 0.25, price: null, deposit: null, packageType: "Glas", returnType: "Mehrweg", gastroOnly: true,
    visual: { shape: "steinie", glass: "clear", liquid: "#D6E6EA", label: "#1E4B7A", labelInk: "#FFFFFF", cap: "#1E4B7A", crate: "#1E4B7A" },
  },

  // ——— Softdrinks ———
  {
    slug: "spezi-original", brand: "Spezi", name: "Spezi Original", variety: "Cola-Mix",
    category: "softdrinks", packQuantity: 20, bottleVolume: 0.5, price: 18.0, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", featured: true,
    visual: { shape: "euro", glass: "clear", liquid: "#5A2A12", label: "#E7501E", labelInk: "#FFFFFF", cap: "#F2C230", crate: "#E7501E" },
  },
  {
    slug: "fritz-kola", brand: "fritz-kola", name: "Fritz-Kola", variety: "Cola",
    category: "softdrinks", packQuantity: 24, bottleVolume: 0.33, price: 30.0, deposit: 3.42, packageType: "Glas", returnType: "Mehrweg", featured: true,
    visual: { shape: "longneck", glass: "clear", liquid: "#2B150C", label: "#F4F1EA", labelInk: "#151917", cap: "#151917", crate: "#151917" },
  },
  {
    slug: "coca-cola", brand: "Coca-Cola", name: "Coca-Cola", variety: "Cola",
    category: "softdrinks", packQuantity: 24, bottleVolume: 0.33, price: null, deposit: 3.42, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "longneck", glass: "clear", liquid: "#2A140B", label: "#C8102E", labelInk: "#FFFFFF", cap: "#C8102E", crate: "#C8102E" },
  },
  {
    slug: "coca-cola-zero", brand: "Coca-Cola", name: "Coca-Cola Zero", variety: "Cola ohne Zucker",
    category: "softdrinks", packQuantity: 24, bottleVolume: 0.33, price: null, deposit: 3.42, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "longneck", glass: "clear", liquid: "#2A140B", label: "#151515", labelInk: "#E03A3E", cap: "#151515", crate: "#C8102E" },
  },
  {
    slug: "paulaner-spezi", brand: "Paulaner", name: "Paulaner Spezi", variety: "Cola-Mix",
    category: "softdrinks", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "euro", glass: "clear", liquid: "#5A2A12", label: "#1F3F8C", labelInk: "#F2C230", cap: "#1F3F8C", crate: "#1F3F8C" },
  },
  {
    slug: "bionade-holunder", brand: "Bionade", name: "Bionade Holunder", variety: "Bio-Erfrischungsgetränk",
    category: "softdrinks", packQuantity: 24, bottleVolume: 0.33, price: null, deposit: 3.42, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "steinie", glass: "clear", liquid: "#7A3B5C", label: "#5E2F6B", labelInk: "#FFFFFF", cap: "#5E2F6B", crate: "#3D5F3A" },
  },

  // ——— Säfte & Schorlen ———
  {
    slug: "adelholzener-apfelschorle", brand: "Adelholzener", name: "Adelholzener Apfelschorle", variety: "Apfelschorle",
    category: "saefte-schorlen", packQuantity: 12, bottleVolume: 0.75, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "water", glass: "clear", liquid: "#E1B35A", label: "#3E7D3A", labelInk: "#FFFFFF", cap: "#3E7D3A", crate: "#1E4B7A" },
  },
  {
    slug: "frucade-apfelschorle", brand: "Frucade", name: "Frucade Apfelschorle", variety: "Apfelschorle",
    category: "saefte-schorlen", packQuantity: 12, bottleVolume: 0.7, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "juice", glass: "clear", liquid: "#DDA946", label: "#F2E7C9", labelInk: "#6B8E23", cap: "#6B8E23", crate: "#6B8E23" },
  },
  {
    slug: "libella-orange", brand: "Libella", name: "Libella Orange", variety: "Orangenlimonade",
    category: "saefte-schorlen", packQuantity: 12, bottleVolume: 0.7, price: null, deposit: 3.3, packageType: "Glas", returnType: "Mehrweg",
    visual: { shape: "juice", glass: "clear", liquid: "#EE9A2A", label: "#F7E5B5", labelInk: "#C4561B", cap: "#C4561B", crate: "#C4561B" },
  },

  // ——— Bier ———
  {
    slug: "bayreuther-hell", brand: "Bayreuther Bierbrauerei", name: "Bayreuther Hell", variety: "Helles",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: 24.0, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", featured: true, regional: true, origin: "Bayreuth", alcoholic: true,
    visual: { shape: "euro", glass: "#5B3413", label: "#F1E6CC", labelInk: "#8E2426", cap: "#8E2426", crate: "#7A1F20" },
  },
  {
    slug: "maisels-weisse-original", brand: "Maisel's", name: "Maisel's Weisse Original", variety: "Weissbier",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: 24.0, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", featured: true, regional: true, origin: "Bayreuth", alcoholic: true,
    visual: { shape: "weizen", glass: "#5B3413", label: "#C4632A", labelInk: "#FFF5E6", cap: "#6B2D12", crate: "#6B2D12" },
  },
  {
    slug: "kulmbacher-lager-hell", brand: "Kulmbacher", name: "Kulmbacher Lager Hell", variety: "Helles",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: 20.0, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", featured: true, regional: true, origin: "Kulmbach", alcoholic: true,
    visual: { shape: "euro", glass: "#5B3413", label: "#1C3F7A", labelInk: "#E8C77A", cap: "#1C3F7A", crate: "#1C3F7A" },
  },
  {
    slug: "augustiner-hell", brand: "Augustiner", name: "Augustiner Hell", variety: "Lagerbier Hell",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: 25.0, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", featured: true, origin: "München", alcoholic: true,
    visual: { shape: "euro", glass: "#5B3413", label: "#EFE7D2", labelInk: "#A3262A", cap: "#C9A45A", crate: "#2F3A2E" },
  },
  {
    slug: "moenchshof-kellerbier", brand: "Mönchshof", name: "Mönchshof Kellerbier", variety: "Kellerbier",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 4.5, packageType: "Glas", returnType: "Mehrweg", regional: true, origin: "Kulmbach", alcoholic: true,
    visual: { shape: "swingtop", glass: "#5B3413", label: "#F0E3C4", labelInk: "#7A3B16", cap: "#EDE8DC", crate: "#5A3418" },
  },
  {
    slug: "moenchshof-natur-radler", brand: "Mönchshof", name: "Mönchshof Natur Radler", variety: "Radler",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 4.5, packageType: "Glas", returnType: "Mehrweg", regional: true, origin: "Kulmbach", alcoholic: true,
    visual: { shape: "swingtop", glass: "#5B3413", label: "#E7BE45", labelInk: "#4A2E0E", cap: "#EDE8DC", crate: "#5A3418" },
  },
  {
    slug: "eku-pils", brand: "EKU", name: "EKU Pils", variety: "Pils",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", regional: true, origin: "Kulmbach", alcoholic: true,
    visual: { shape: "euro", glass: "#5B3413", label: "#F4F1EA", labelInk: "#B21E28", cap: "#B21E28", crate: "#B21E28" },
  },
  {
    slug: "jever-pils", brand: "Jever", name: "Jever Pils", variety: "Pils",
    category: "bier", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", origin: "Friesland", alcoholic: true,
    visual: { shape: "euro", glass: "#1E4A2B", label: "#F4F1EA", labelInk: "#0F3B22", cap: "#0F3B22", crate: "#0F3B22" },
  },

  // ——— Alkoholfrei ———
  {
    slug: "maisels-weisse-alkoholfrei", brand: "Maisel's", name: "Maisel's Weisse Alkoholfrei", variety: "Weissbier alkoholfrei",
    category: "alkoholfrei", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", regional: true, origin: "Bayreuth", alcoholFree: true,
    visual: { shape: "weizen", glass: "#5B3413", label: "#2F6FA8", labelInk: "#FFFFFF", cap: "#2F6FA8", crate: "#6B2D12" },
  },
  {
    slug: "jever-fun", brand: "Jever", name: "Jever Fun", variety: "Pils alkoholfrei",
    category: "alkoholfrei", packQuantity: 20, bottleVolume: 0.5, price: null, deposit: 3.1, packageType: "Glas", returnType: "Mehrweg", origin: "Friesland", alcoholFree: true,
    visual: { shape: "euro", glass: "#1E4A2B", label: "#7FAE3E", labelInk: "#FFFFFF", cap: "#7FAE3E", crate: "#0F3B22" },
  },

  // ——— Wein & Spezialitäten ———
  {
    slug: "schmitt-silvaner-trocken", brand: "Schmitt", name: "Silvaner trocken", variety: "Frankenwein · Weiß",
    category: "wein-spezialitaeten", packQuantity: 6, bottleVolume: 0.75, price: null, deposit: 0, packageType: "Glas", returnType: "Einweg", regional: true, origin: "Franken", alcoholic: true,
    visual: { shape: "bocksbeutel", glass: "#3D4A26", label: "#F3EDDF", labelInk: "#3D4A26", cap: "#C9A27A", crate: "#693A36" },
  },
  {
    slug: "schmitt-domina-trocken", brand: "Schmitt", name: "Domina trocken", variety: "Frankenwein · Rot",
    category: "wein-spezialitaeten", packQuantity: 6, bottleVolume: 0.75, price: null, deposit: 0, packageType: "Glas", returnType: "Einweg", regional: true, origin: "Franken", alcoholic: true,
    visual: { shape: "bocksbeutel", glass: "#2A1A16", label: "#F3EDDF", labelInk: "#693A36", cap: "#693A36", crate: "#693A36" },
  },
];

export const products: Product[] = seeds.map((s, i) => ({
  featured: false,
  regional: false,
  alcoholic: false,
  alcoholFree: false,
  available: true,
  gastroOnly: false,
  image: null,
  ...s,
  id: `p_${String(i + 1).padStart(3, "0")}`,
  totalVolume: Math.round(s.packQuantity * s.bottleVolume * 100) / 100,
  rank: i,
}));

export const featuredOrder = [
  "bayreuther-hell",
  "adelholzener-naturell",
  "maisels-weisse-original",
  "spezi-original",
  "kulmbacher-lager-hell",
  "adelholzener-classic",
  "fritz-kola",
  "augustiner-hell",
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return featuredOrder.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
}

export function getRelated(product: Product, limit = 4): Product[] {
  const same = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  const others = products.filter((p) => p.slug !== product.slug && p.category !== product.category && p.featured);
  return [...same, ...others].slice(0, limit);
}

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b, "de"));

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products.filter((p) => {
    const hay = `${p.name} ${p.brand} ${p.variety} ${p.category} ${p.origin ?? ""}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

/** Artikel-Label für Gebinde, z. B. „Kasten“ oder „Flasche“ */
export function unitLabel(p: Product, count = 1): string {
  if (p.category === "wein-spezialitaeten") return count === 1 ? "Karton" : "Kartons";
  if (p.packageType === "PET") return "Gebinde";
  return count === 1 ? "Kasten" : "Kästen";
}
