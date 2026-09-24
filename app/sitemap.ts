import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/sortiment", "/privatkunden", "/firmen-gastronomie", "/liefergebiet", "/ueber-uns", "/kontakt", "/impressum", "/datenschutz"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/sortiment/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
