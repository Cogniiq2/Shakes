const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const num = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

export function formatEuro(value: number): string {
  return eur.format(value);
}

/** 0.5 → "0,5 L", 0.33 → "0,33 L" */
export function formatLitre(value: number): string {
  return `${num.format(value)} L`;
}

export function formatPack(qty: number, volume: number): string {
  return qty === 1 ? formatLitre(volume) : `${qty} × ${formatLitre(volume)}`;
}

/** Grundpreis je Liter nach PAngV */
export function basePricePerLitre(price: number, totalVolume: number): string {
  return `${eur.format(price / totalVolume)} / L`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
