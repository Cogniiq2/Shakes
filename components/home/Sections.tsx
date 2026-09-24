import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { brands, getFeatured, getProduct } from "@/data/products";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax, Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Crate } from "@/components/visual/Crate";
import { Scene } from "@/components/visual/Scene";
import { RatingDisplay } from "@/components/sections/Shared";
import { DeliveryBlock } from "./DeliveryBlock";
import { reviews } from "@/lib/site";

/* ——— 2 · Service ——— */
const steps = [
  { n: "01", title: "Auswählen", copy: "Von Mineralwasser über regionale Biere bis zu Säften, Softdrinks und Wein." },
  { n: "02", title: "Liefern lassen", copy: "Zuverlässige Getränkelieferung in Bayreuth und ausgewählten Orten der Umgebung." },
  { n: "03", title: "Leergut zurückgeben", copy: "Passendes Leergut aus unserem Sortiment nehmen wir bei der Lieferung bequem wieder mit." },
];

export function ServiceSection() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Getränkeheimdienst in Bayreuth" title={<>Wir bringen den Getränkemarkt <span className="serif-accent text-bottle">zu Ihnen.</span></>} />
          </div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="lede text-muted">Keine schweren Kästen im Kofferraum. Kein Schleppen bis zur Haustür. Sie wählen Ihre Getränke – wir kümmern uns um den Rest.</p>
          </Reveal>
        </div>

        <Stagger as="ol" className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-3" gap={0.12}>
          {steps.map((s, i) => (
            <StaggerItem key={s.n} as="li" className={`group relative flex flex-col border-b border-line py-10 md:border-b-0 md:py-12 ${i > 0 ? "md:border-l md:pl-10" : ""} ${i < 2 ? "md:pr-10" : ""}`}>
              <span aria-hidden className="font-serif text-[5.5rem] italic leading-[0.8] tracking-[-0.04em] text-amber/80 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 md:text-[7rem]">
                {s.n}
              </span>
              <h3 className="mt-8 text-[1.45rem] font-semibold tracking-[-0.025em]">{s.title}</h3>
              <p className="mt-3 max-w-xs text-[0.98rem] leading-relaxed text-muted">{s.copy}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ——— 3 · Kategorien ——— */
const layout: Record<string, string> = {
  bier: "lg:col-span-7 lg:row-span-2",
  wasser: "lg:col-span-5",
  softdrinks: "lg:col-span-5",
  "saefte-schorlen": "lg:col-span-4",
  alkoholfrei: "lg:col-span-4",
  "wein-spezialitaeten": "lg:col-span-4",
};
const order = ["bier", "wasser", "softdrinks", "saefte-schorlen", "alkoholfrei", "wein-spezialitaeten"];

export function CategorySection() {
  const ordered = order.map((s) => categories.find((c) => c.slug === s)!);
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Das Sortiment" title="Was darf es sein?" action={<ArrowLink href="/sortiment">Gesamtes Sortiment</ArrowLink>} />
      </div>
      {/* Mobil: horizontales Blättern */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:hidden">
        {ordered.map((c, i) => (
          <CategoryCard key={c.slug} category={c} index={i} className="h-[400px] w-[80vw] max-w-[360px] shrink-0 snap-start" />
        ))}
      </div>
      <Stagger className="container-x mt-16 hidden auto-rows-[290px] grid-cols-12 gap-4 lg:grid" gap={0.07}>
        {ordered.map((c, i) => (
          <StaggerItem key={c.slug} className={layout[c.slug]}>
            <CategoryCard category={c} index={i} size={c.slug === "bier" ? "lg" : "md"} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ——— 4 · Region ——— */
const regional = [
  { name: "Bayreuther", origin: "Bayreuth" },
  { name: "Maisel's", origin: "Bayreuth" },
  { name: "Kulmbacher", origin: "Kulmbach" },
  { name: "Mönchshof", origin: "Kulmbach" },
  { name: "EKU", origin: "Kulmbach" },
  { name: "Krug Bräu", origin: "Fränkische Schweiz" },
];

export function RegionalSection() {
  const hell = getProduct("bayreuther-hell")!;
  return (
    <section className="grain relative overflow-hidden bg-bottle py-24 text-ivory md:py-36">
      <div aria-hidden className="absolute right-[-10%] top-[10%] size-[620px] rounded-full bg-amber/15 blur-[130px]" />
      <div className="container-x relative z-10 grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow light>Aus der Region</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display-1 mt-6">
              Bayreuth <span className="serif-accent text-amber">im Kasten.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede mt-8 max-w-[34rem] text-ivory/70">
              Regionale Braukultur gehört bei Schake&rsquo;s Bier selbstverständlich ins Sortiment. Entdecken Sie bekannte Biere aus Bayreuth, Kulmbach und Franken – gemeinsam mit Klassikern aus ganz Deutschland.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/sortiment?kategorie=bier" variant="amber" size="lg" arrow magnetic>
              Regionale Biere
            </Button>
            <ArrowLink href="/ueber-uns" light>
              Warum unabhängig?
            </ArrowLink>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative lg:col-span-5 lg:col-start-8">
          <Parallax range={36}>
            <div className="relative mx-auto max-w-[460px]">
              <div aria-hidden className="absolute inset-x-[8%] bottom-[6%] h-[40%] rounded-full bg-amber/25 blur-[60px]" />
              <Crate visual={hell.visual} id="regional" brand={hell.brand} className="relative w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]" />
            </div>
          </Parallax>
          <p className="mt-6 text-center text-[0.78rem] text-ivory/45">Bayreuther Hell · 20 × 0,5 L · Glas Mehrweg</p>
        </Reveal>
      </div>

      {/* Typografische Marken-Schiene */}
      <div className="relative z-10 mt-20 border-y border-ivory/10 py-7 md:mt-28" aria-label="Regionale Marken im Sortiment">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="animate-marquee flex shrink-0 items-center hover:[animation-play-state:paused]">
            {[...regional, ...regional, ...regional, ...regional].map((b, i) => (
              <li key={i} aria-hidden={i >= regional.length} className="flex items-center gap-5 px-8 md:px-12">
                <span className={i % 2 ? "font-serif text-[2.6rem] italic tracking-[-0.02em] md:text-[3.6rem]" : "text-[2.2rem] font-semibold tracking-[-0.04em] md:text-[3.1rem]"}>{b.name}</span>
                <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-amber/80">{b.origin}</span>
                <span aria-hidden className="ml-7 size-1.5 rounded-full bg-ivory/25 md:ml-12" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="container-x relative z-10 mt-6 text-[0.75rem] text-ivory/40">
        Die genannten Marken sind Teil unseres Sortiments. Alle Markenrechte liegen bei den jeweiligen Herstellern.
      </p>
    </section>
  );
}

/* ——— 5 · Beliebte Produkte ——— */
export function FeaturedSection() {
  const featured = getFeatured();
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          eyebrow="Beliebt im Sortiment"
          title={<>Für Kühlschrank, Büro <span className="serif-accent text-bottle">und Feierabend.</span></>}
          action={<ArrowLink href="/sortiment">Alle Produkte ansehen</ArrowLink>}
        />
        <Stagger className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5" gap={0.06}>
          {featured.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} priority={i < 4} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-[0.8rem] text-muted">Alle Preise inkl. MwSt. zzgl. Pfand, sofern angegeben. Nur sortenreine Kästen.</p>
      </div>
    </section>
  );
}

/* ——— 6 · Zielgruppen ——— */
const audiences = [
  {
    kind: "home" as const,
    label: "Privat",
    title: "Getränke zuhause, ohne Kistenschleppen.",
    copy: "Für den Alltag, das Wochenende oder die nächste Feier: Stellen Sie Ihre Getränkebestellung bequem zusammen und lassen Sie sich Ihre Kästen liefern.",
    cta: "Für Privatkunden",
    href: "/privatkunden",
  },
  {
    kind: "office" as const,
    label: "Unternehmen",
    title: "Das Büro bleibt versorgt.",
    copy: "Mineralwasser, Säfte und Erfrischungsgetränke für Unternehmen – persönlich betreut und auf Wunsch regelmäßig geliefert.",
    cta: "Für Unternehmen",
    href: "/firmen-gastronomie#unternehmen",
  },
  {
    kind: "gastro" as const,
    label: "Gastronomie",
    title: "Ein Sortiment, das zu Ihren Gästen passt.",
    copy: "Als unabhängiger Getränkehandel bietet Schake's Bier Gastronomiebetrieben eine breite Auswahl verschiedener Hersteller und persönliche Beratung.",
    cta: "Für Gastronomie",
    href: "/firmen-gastronomie#gastronomie",
  },
];

export function AudienceSection() {
  return (
    <section className="bg-stone/60 py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <h2 className="display-2 max-w-4xl">
            <span className="block">Für Zuhause.</span>
            <span className="block text-muted/60">Fürs Team.</span>
            <span className="serif-accent block text-bottle">Für Ihre Gäste.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-6 lg:gap-8" gap={0.12}>
          {audiences.map((a, i) => (
            <StaggerItem key={a.kind} as="article" className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-8" : ""}>
              <Link href={a.href} className="group block">
                <div className="overflow-hidden rounded-[16px]">
                  <Scene kind={a.kind} className="aspect-[4/4.4] transition-transform duration-[1100ms] ease-[var(--ease-premium)] group-hover:scale-[1.035]" />
                </div>
                <p className="eyebrow mt-7 text-amber-deep">{a.label}</p>
                <h3 className="mt-3 text-[1.5rem] font-semibold leading-tight tracking-[-0.025em] lg:text-[1.7rem]">{a.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{a.copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold">
                  <span className="link-underline">{a.cta}</span>
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ——— 7 · Unabhängig ——— */
export function IndependentSection() {
  const regionalBrands = new Set(["Bayreuther Bierbrauerei", "Maisel's", "Kulmbacher", "Mönchshof", "EKU", "Frankenbrunnen", "Schmitt"]);
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Unabhängig ausgewählt</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display-2 mt-6">
              Nicht an eine Brauerei gebunden.
              <span className="serif-accent mt-2 block text-bottle">Sondern an gute Auswahl.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="lede text-muted">
            Als unabhängiger Getränkehandel kann Schake&rsquo;s Bier Produkte verschiedener Hersteller anbieten. So entsteht ein Sortiment, das sich an den Wünschen der Kunden orientiert – nicht an einer einzelnen Marke.
          </p>
        </Reveal>
      </div>

      <div className="container-x mt-16 md:mt-24">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-serif text-[5rem] italic leading-none tracking-[-0.04em] text-amber-deep">{brands.length}</p>
            <p className="mt-3 max-w-[14rem] text-[0.9rem] leading-relaxed text-muted">Marken bereits online – und vieles mehr auf Anfrage.</p>
          </div>
          <Reveal delay={0.1} className="md:col-span-9">
            <p className="text-[1.6rem] font-semibold leading-[1.35] tracking-[-0.025em] text-ink/25 sm:text-[2rem] lg:text-[2.35rem]">
              {brands.map((b, i) => (
                <span key={b}>
                  <Link href={`/sortiment?marke=${encodeURIComponent(b)}`} className={regionalBrands.has(b) ? "text-bottle transition-colors hover:text-amber-deep" : "transition-colors hover:text-ink"}>
                    {b}
                  </Link>
                  {i < brands.length - 1 && <span className="px-2 font-serif font-normal italic text-amber/70 sm:px-3">/</span>}{" "}
                </span>
              ))}
            </p>
            <p className="mt-6 text-[0.82rem] text-muted">
              <span className="font-semibold text-bottle">Grün</span> markiert: Hersteller aus Bayreuth und Franken.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ——— 8 · Bewertungen ——— */
export function RatingSection() {
  return (
    <section className="border-y border-line bg-paper py-20 md:py-28">
      <div className="container-x grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="font-serif text-[6.5rem] leading-[0.85] tracking-[-0.04em] text-bottle sm:text-[8.5rem]">
            {reviews.rating.toLocaleString("de-DE")}
            <span className="text-[0.4em] italic text-muted"> / {reviews.max}</span>
          </p>
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <RatingDisplay />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-3 mt-8">Persönlicher Service wird vor Ort entschieden.</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <a href={reviews.profileUrl} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold">
              <span className="link-underline">Bewertungen auf Google ansehen</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ——— 9 · Liefergebiet ——— */
export function DeliverySection() {
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <DeliveryBlock />
      </div>
    </section>
  );
}
