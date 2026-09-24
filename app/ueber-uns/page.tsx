import type { Metadata } from "next";
import { ContactCTA, PageHero } from "@/components/sections/Shared";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Scene } from "@/components/visual/Scene";
import { Crate } from "@/components/visual/Crate";
import { DeliveryMap } from "@/components/sections/DeliveryMap";
import { getProduct } from "@/data/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns – Getränkeheimdienst mit persönlichem Anspruch",
  description: "Schake's Bier aus dem Teichweg in Bayreuth: unabhängiger Getränkehandel mit breiter Auswahl, verlässlichem Service und persönlicher Beratung.",
  alternates: { canonical: "/ueber-uns" },
};

const chapters = [
  {
    eyebrow: "01 · Region",
    title: "Regional verwurzelt.",
    copy: "Mit Sitz im Teichweg in Bayreuth beliefert Schake's Bier Privatkunden, Unternehmen und Gastronomiebetriebe in der Stadt und im Umland.",
    link: { href: "/liefergebiet", label: "Zum Liefergebiet" },
    visual: "map" as const,
  },
  {
    eyebrow: "02 · Auswahl",
    title: "Unabhängig in der Auswahl.",
    copy: "Schake's Bier ist nicht an eine einzelne Brauerei gebunden. Dadurch können Produkte verschiedener Hersteller und regionale Spezialitäten gemeinsam angeboten werden.",
    link: { href: "/sortiment", label: "Sortiment entdecken" },
    visual: "crates" as const,
  },
  {
    eyebrow: "03 · Service",
    title: "Persönlich im Service.",
    copy: "Fragen zum Sortiment oder eine individuelle Lösung für Unternehmen und Gastronomie? Persönliche Beratung gehört zum Geschäft.",
    link: { href: "/kontakt", label: "Kontakt aufnehmen" },
    visual: "person" as const,
  },
];

export default function UeberUnsPage() {
  const kulmbacher = getProduct("kulmbacher-lager-hell")!;
  const maisels = getProduct("maisels-weisse-original")!;
  const adel = getProduct("adelholzener-classic")!;
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        breadcrumb={[{ label: "Über uns" }]}
        title={
          <>
            Getränkeservice
            <span className="serif-accent block text-bottle">mit persönlichem Anspruch.</span>
          </>
        }
        lede="Schake's Bier steht für eine einfache Idee: gute Auswahl, verlässlicher Service und Getränke dort, wo sie gebraucht werden."
      />

      {/* Bildstrecke – REAL BUSINESS PHOTO RECOMMENDED HERE: Achim Schake, Lager, Lieferfahrzeug, Kästen */}
      <section className="pb-24 md:pb-32">
        <div className="container-x grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[300px_300px]">
          <Reveal className="col-span-2 overflow-hidden rounded-[18px] lg:col-span-7 lg:row-span-2">
            {/* REAL BUSINESS PHOTO RECOMMENDED HERE: Lager im Teichweg */}
            <Parallax range={40} className="h-full">
              <Scene kind="warehouse" className="aspect-[4/3] size-full lg:aspect-auto" />
            </Parallax>
          </Reveal>
          <Reveal delay={0.08} className="overflow-hidden rounded-[18px] bg-bottle lg:col-span-5">
            {/* REAL BUSINESS PHOTO RECOMMENDED HERE: Porträt Achim Schake */}
            <div className="grain relative flex h-full min-h-[220px] flex-col justify-between p-6 text-ivory sm:p-8">
              <p className="eyebrow text-amber">Inhaber</p>
              <div>
                <p className="font-serif text-[2.2rem] leading-none sm:text-[3rem]">Achim Schake</p>
                <p className="mt-2 text-[0.9rem] text-ivory/60">Ihr Ansprechpartner im Teichweg 14</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14} className="overflow-hidden rounded-[18px] bg-stone lg:col-span-5">
            {/* REAL BUSINESS PHOTO RECOMMENDED HERE: Kästen / Lieferfahrzeug */}
            <div className="flex h-full min-h-[220px] items-end justify-center gap-2 px-6 pb-6 pt-10">
              <Crate visual={kulmbacher.visual} id="about-1" brand={kulmbacher.brand} className="w-1/3 max-w-[180px]" />
              <Crate visual={maisels.visual} id="about-2" brand={maisels.brand} className="w-1/3 max-w-[180px]" />
              <Crate visual={adel.visual} id="about-3" brand={adel.brand} className="w-1/3 max-w-[180px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {chapters.map((c, i) => (
        <section key={c.title} className={`py-20 md:py-28 ${i % 2 ? "bg-paper" : ""}`}>
          <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
              <Reveal>
                <Eyebrow>{c.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="display-2 mt-6">{c.title}</h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lede mt-6 text-muted">{c.copy}</p>
              </Reveal>
              <Reveal delay={0.18} className="mt-8">
                <ArrowLink href={c.link.href}>{c.link.label}</ArrowLink>
              </Reveal>
            </div>
            <Reveal delay={0.1} className={`lg:col-span-6 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
              {c.visual === "map" && (
                <div className="rounded-[18px] border border-line bg-paper p-6 sm:p-10">
                  <DeliveryMap />
                </div>
              )}
              {c.visual === "crates" && (
                <div className="overflow-hidden rounded-[18px]">
                  <Scene kind="gastro" className="aspect-[4/3.2]" />
                </div>
              )}
              {c.visual === "person" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <a href={site.phone.href} className="group rounded-[18px] bg-bottle p-8 text-ivory transition-colors hover:bg-bottle-700">
                    <p className="eyebrow text-amber">Anrufen</p>
                    <p className="mt-10 text-[1.6rem] font-semibold tracking-[-0.02em] tabular-nums">{site.phone.display}</p>
                    <p className="mt-2 text-[0.85rem] text-ivory/55">Mo–Do 08:00–18:00 · Fr 08:00–11:30</p>
                  </a>
                  <a href={`mailto:${site.email}`} className="group rounded-[18px] border border-line bg-paper p-8 transition-colors hover:border-ink/25">
                    <p className="eyebrow text-amber-deep">Schreiben</p>
                    <p className="mt-10 break-all text-[1.25rem] font-semibold tracking-[-0.02em]">{site.email}</p>
                    <p className="mt-2 text-[0.85rem] text-muted">Wir antworten persönlich.</p>
                  </a>
                </div>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      <ContactCTA />
    </>
  );
}
