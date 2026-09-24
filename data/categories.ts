export type CategorySlug =
  | "wasser"
  | "softdrinks"
  | "saefte-schorlen"
  | "bier"
  | "alkoholfrei"
  | "wein-spezialitaeten";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  /** Art Direction der Kategorie-Kachel */
  tone: { bg: string; fg: string; accent: string };
}

export const categories: Category[] = [
  {
    slug: "wasser",
    name: "Wasser",
    short: "Still, medium, spritzig",
    description: "Mineralwasser in Glas und PET – von Adelholzener bis Plose.",
    tone: { bg: "#DCE4E0", fg: "#102A23", accent: "#7FA39A" },
  },
  {
    slug: "bier",
    name: "Bier",
    short: "Hell, Weisse, Keller, Pils",
    description: "Regionale Braukultur aus Bayreuth, Kulmbach und Franken.",
    tone: { bg: "#B7772C", fg: "#FCFBF8", accent: "#E7B56C" },
  },
  {
    slug: "softdrinks",
    name: "Softdrinks",
    short: "Cola, Spezi, Limonade",
    description: "Klassiker und Lieblinge für Kühlschrank und Kantine.",
    tone: { bg: "#1B1F1C", fg: "#F6F3ED", accent: "#C0392B" },
  },
  {
    slug: "saefte-schorlen",
    name: "Säfte & Schorlen",
    short: "Fruchtig und erfrischend",
    description: "Apfelschorlen, Säfte und Fruchtiges für jeden Tag.",
    tone: { bg: "#EFD9B4", fg: "#3A2A12", accent: "#D98B2B" },
  },
  {
    slug: "alkoholfrei",
    name: "Alkoholfrei",
    short: "Voller Geschmack, 0,0 %",
    description: "Alkoholfreie Biere und Weissbiere mit Charakter.",
    tone: { bg: "#C9D3BF", fg: "#1D2B1C", accent: "#5E7A4C" },
  },
  {
    slug: "wein-spezialitaeten",
    name: "Wein & Spezialitäten",
    short: "Franken im Bocksbeutel",
    description: "Ausgewählte Weine und Besonderes für den Anlass.",
    tone: { bg: "#693A36", fg: "#F6F3ED", accent: "#C9A27A" },
  },
];

export function getCategory(slug: CategorySlug): Category {
  const c = categories.find((c) => c.slug === slug);
  if (!c) throw new Error(`Unknown category ${slug}`);
  return c;
}
