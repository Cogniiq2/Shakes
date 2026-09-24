/**
 * Zentrale Unternehmensdaten (NAP, Öffnungszeiten, Liefergebiet, Bewertungen).
 * Eine einzige Quelle, damit Header, Footer, Kontaktseite und strukturierte Daten
 * immer konsistent bleiben. Später durch CMS / Supabase ersetzbar.
 */

export const site = {
  name: "Schake's Bier",
  descriptor: "Getränkeheimdienst Bayreuth",
  claim: "Regional geliefert. Persönlich betreut.",
  owner: "Achim Schake",
  url: "https://www.schakesbier.de",
  address: {
    street: "Teichweg 14",
    postalCode: "95448",
    city: "Bayreuth",
    region: "Bayern",
    country: "DE",
  },
  phone: {
    display: "0921 800 254 32",
    href: "tel:+4992180025432",
    international: "+49 921 80025432",
  },
  email: "info@schakesbier.de",
  social: {
    instagram: {
      handle: "@schakes.bier",
      href: "https://www.instagram.com/schakes.bier/",
    },
    facebook: {
      handle: "Schake's Bier Getränkehandel",
      href: "https://www.facebook.com/search/top?q=Schake%27s%20Bier%20Getr%C3%A4nkehandel",
    },
  },
  /** Bestell- und Kontaktzeiten */
  hours: [
    { days: "Mo–Do", label: "Montag bis Donnerstag", open: "08:00", close: "18:00", schema: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
    { days: "Fr", label: "Freitag", open: "08:00", close: "11:30", schema: ["Friday"] },
  ],
  delivery: {
    days: "Montag bis Freitag",
    leadTime: "1–2 Werktage",
    emptiesOnlyFee: 4.95,
  },
} as const;

/**
 * Google-Bewertungen – aktueller Prototyp-Stand.
 * Später dynamisch über die Google Places API befüllbar.
 */
export const reviews = {
  source: "Google-Bewertungen",
  rating: 4.9,
  max: 5,
  count: 16,
  profileUrl: "https://www.google.com/search?q=Schake%27s+Bier+Bayreuth",
} as const;

export type AreaTier = "regular" | "scheduled";

export interface DeliveryArea {
  name: string;
  tier: AreaTier;
  postcodes: string[];
  /** Position auf der stilisierten Karte (viewBox 400 × 500) */
  map: { x: number; y: number };
  note: string;
}

export const deliveryAreas: DeliveryArea[] = [
  { name: "Bayreuth", tier: "regular", postcodes: ["95444", "95445", "95447", "95448"], map: { x: 196, y: 150 }, note: "Regelmäßige Belieferung Montag bis Freitag" },
  { name: "Bindlach", tier: "regular", postcodes: ["95463"], map: { x: 244, y: 78 }, note: "Regelmäßige Belieferung Montag bis Freitag" },
  { name: "Heinersreuth", tier: "regular", postcodes: ["95500"], map: { x: 118, y: 96 }, note: "Regelmäßige Belieferung Montag bis Freitag" },
  { name: "Creußen", tier: "scheduled", postcodes: ["95473"], map: { x: 268, y: 292 }, note: "Alle vier Wochen mittwochs" },
  { name: "Schnabelwaid", tier: "scheduled", postcodes: ["91289"], map: { x: 214, y: 356 }, note: "Alle vier Wochen mittwochs" },
  { name: "Zips", tier: "scheduled", postcodes: ["91257"], map: { x: 172, y: 396 }, note: "Alle vier Wochen mittwochs" },
  { name: "Pegnitz", tier: "scheduled", postcodes: ["91257"], map: { x: 138, y: 444 }, note: "Alle vier Wochen mittwochs" },
];

export type PostcodeResult =
  | { status: "regular"; areas: DeliveryArea[] }
  | { status: "scheduled"; areas: DeliveryArea[] }
  | { status: "outside" }
  | { status: "invalid" };

/** Reine Frontend-Logik für den Prototyp – keine Backend-Anbindung. */
export function checkPostcode(input: string): PostcodeResult {
  const plz = input.replace(/\D/g, "");
  if (plz.length !== 5) return { status: "invalid" };
  const matches = deliveryAreas.filter((a) => a.postcodes.includes(plz));
  if (matches.length === 0) return { status: "outside" };
  const regular = matches.filter((a) => a.tier === "regular");
  if (regular.length) return { status: "regular", areas: regular };
  return { status: "scheduled", areas: matches };
}

export const mainNav = [
  { href: "/sortiment", label: "Sortiment" },
  { href: "/privatkunden", label: "Privatkunden" },
  { href: "/firmen-gastronomie", label: "Firmen & Gastronomie" },
  { href: "/liefergebiet", label: "Liefergebiet" },
  { href: "/ueber-uns", label: "Über uns" },
] as const;
