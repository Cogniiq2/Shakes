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

const raw: Array<Omit<StoryStop, "product"> & { slug: string }> = [
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

export const storyStops: StoryStop[] = raw.map(({ slug, ...rest }) => ({ ...rest, product: getProduct(slug)! }));
