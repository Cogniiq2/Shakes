import { getProduct, type Product } from "@/data/products";

/**
 * Kuratierte Produktfolge der 3D-Produktgeschichte auf der Startseite.
 * Jede Station hat eine eigene, dezente Lichtstimmung – nur innerhalb dieser Sektion.
 */
export interface StoryStop {
  product: Product;
  kicker: string;
  line: string;
  word: string;
  meta: string[];
  env: { bg: string; glow: string; rim: string };
}

type RawStop = Omit<StoryStop, "product"> & { slug: string };

/** Ersatz-Stationen, solange für die Wunschprodukte noch kein Originalfoto vorliegt */
const substitutes: Record<string, RawStop> = {
  "bayreuther-hell": {
    slug: "kulmbacher-lager-hell",
    kicker: "Regional aus Kulmbach",
    line: "Ein Helles aus Kulmbach.",
    word: "Kulmbach",
    meta: ["Glas Mehrweg", "20 × 0,5 L", "Regional"],
    env: { bg: "#102A23", glow: "#C88A38", rim: "#E7B56C" },
  },
  "adelholzener-naturell": {
    slug: "plose-naturale",
    kicker: "Mineralwasser · still",
    line: "Natürliches Mineralwasser aus Südtirol.",
    word: "Naturale",
    meta: ["Glas Mehrweg", "12 × 1,0 L", "Ohne Kohlensäure"],
    env: { bg: "#1A292C", glow: "#8FB3BE", rim: "#DDEBEE" },
  },
};

const raw: RawStop[] = [
  {
    slug: "bayreuther-hell",
    kicker: "Regional aus Bayreuth",
    line: "Ein Klassiker aus Bayreuth.",
    word: "Bayreuth",
    meta: ["Glas Mehrweg", "20 × 0,5 L", "Regional"],
    env: { bg: "#102A23", glow: "#C88A38", rim: "#E7B56C" },
  },
  {
    slug: "adelholzener-naturell",
    kicker: "Mineralwasser · still",
    line: "Stilles Mineralwasser aus den bayerischen Alpen.",
    word: "Naturell",
    meta: ["Glas Mehrweg", "12 × 0,75 L", "Ohne Kohlensäure"],
    env: { bg: "#1A292C", glow: "#8FB3BE", rim: "#DDEBEE" },
  },
  {
    slug: "maisels-weisse-original",
    kicker: "Regional aus Bayreuth",
    line: "Bayreuther Weissbier-Tradition.",
    word: "Weisse",
    meta: ["Glas Mehrweg", "20 × 0,5 L", "Regional"],
    env: { bg: "#261A0D", glow: "#DDA24A", rim: "#F2CF8A" },
  },
  {
    slug: "fritz-kola",
    kicker: "Softdrinks",
    line: "Die Kola aus Hamburg.",
    word: "Kola",
    meta: ["Glas Mehrweg", "24 × 0,33 L", "Koffeinhaltig"],
    env: { bg: "#151311", glow: "#7A5641", rim: "#CDB49C" },
  },
  {
    slug: "spezi-original",
    kicker: "Softdrinks · Cola-Mix",
    line: "Das Original aus Augsburg.",
    word: "Spezi",
    meta: ["Glas Mehrweg", "20 × 0,5 L", "Cola-Mix"],
    env: { bg: "#27160E", glow: "#D9692C", rim: "#F2B27A" },
  },
];

export const storyStops: StoryStop[] = raw.map((stop) => {
  const chosen = getProduct(stop.slug)?.image || !substitutes[stop.slug] ? stop : substitutes[stop.slug];
  const { slug, ...rest } = chosen;
  return { ...rest, product: getProduct(slug)! };
});
