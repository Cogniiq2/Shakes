import type { Metadata } from "next";
import { LayoutGrid, PackageOpen, Recycle, UserRound } from "lucide-react";
import { PageHero, ContactCTA } from "@/components/sections/Shared";
import { Button } from "@/components/ui/Button";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax, Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Scene } from "@/components/visual/Scene";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProduct } from "@/data/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Getränkelieferung für Privatkunden in Bayreuth",
  description: "Mehr Getränke, weniger Schleppen: Schake's Bier liefert Mineralwasser, Bier, Softdrinks und mehr zu Ihnen nach Hause – in Bayreuth und Umgebung. Leergut nehmen wir mit.",
  alternates: { canonical: "/privatkunden" },
};

const benefits = [
  { icon: PackageOpen, title: "Kein Kistenschleppen", copy: "Ihre Kästen kommen bis zu Ihnen – statt in den Kofferraum und die Treppe hinauf." },
  { icon: LayoutGrid, title: "Breite Auswahl", copy: "Wasser, regionale Biere, Softdrinks, Säfte und Wein verschiedener Hersteller in einer Lieferung." },
  { icon: Recycle, title: "Leergut direkt zurück", copy: "Leergut aus unserem Sortiment geben Sie bei der Lieferung einfach wieder mit." },
  { icon: UserRound, title: "Persönlicher Ansprechpartner", copy: "Bei Fragen oder Sonderwünschen erreichen Sie uns direkt – ohne Hotline-Schleife." },
];

const process = [
  { t: "Getränke auswählen", c: "Stöbern Sie im Sortiment oder rufen Sie uns an – wir beraten gerne." },
  { t: "Bestellung aufgeben", c: "Online zusammenstellen oder telefonisch zu unseren Bestellzeiten." },
  { t: "Lieferung erhalten", c: "Montag bis Freitag, in der Regel innerhalb von 1–2 Werktagen." },
  { t: "Leergut zurückgeben", c: "Passendes Leergut nehmen wir bei der Lieferung gleich wieder mit." },
];

const faq = [
  { q: "Wie kann ich bestellen?", a: <>Stellen Sie Ihre Bestellung bequem online zusammen oder rufen Sie uns an: {site.phone.display} (Mo–Do 08:00–18:00, Fr 08:00–11:30).</> },
  { q: "Wann wird geliefert?", a: "Wir liefern Montag bis Freitag. Im regulären Liefergebiet erfolgt die Lieferung in der Regel innerhalb von 1–2 Werktagen." },
  { q: "Kann ich verschiedene Sorten in einem Kasten bestellen?", a: "Aktuell bieten wir ausschließlich sortenreine Kästen an. Sie können aber beliebig viele verschiedene Kästen kombinieren." },
  { q: "Wie funktioniert die Leergut-Rückgabe?", a: "Leergut aus dem geführten Sortiment nehmen wir bei einer Lieferung gerne wieder mit. Die genaue Verrechnung erfolgt bei der Lieferung." },
  { q: "Kann ich Hinweise zur Lieferung geben?", a: "Ja. Bei der Bestellung können Sie Angaben zu Etage, Aufzug oder Ablageort machen. Alles Weitere stimmen wir bei Bedarf gerne persönlich mit Ihnen ab." },
];

export default function PrivatkundenPage() {
  const popular = ["adelholzener-naturell", "bayreuther-hell", "spezi-original", "maisels-weisse-original"].map((s) => getProduct(s)!);
  return (
    <>
      <PageHero
        eyebrow="Für Privatkunden"
        breadcrumb={[{ label: "Privatkunden" }]}
        title={
          <>
            Mehr Getränke.
            <span className="serif-accent block text-bottle">Weniger Schleppen.</span>
          </>
        }
        lede="Ob Mineralwasser für die Woche, Bier fürs Wochenende oder Getränke für die nächste Feier – Schake's Bier liefert Ihre Auswahl bequem in Bayreuth und Umgebung."
        aside={
          <div className="overflow-hidden rounded-[20px]">
            {/* REAL BUSINESS PHOTO RECOMMENDED HERE: Lieferung an eine Haustür in Bayreuth */}
            <Scene kind="home" className="aspect-[4/4.2]" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/sortiment" size="lg" arrow magnetic className="w-full sm:w-auto">
            Getränke auswählen
          </Button>
          <Button href={site.phone.href} size="lg" variant="outline" className="w-full tabular-nums sm:w-auto">
            {site.phone.display}
          </Button>
        </div>
      </PageHero>

      <section className="border-y border-line bg-paper py-16 md:py-20">
        <Stagger className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {benefits.map(({ icon: Icon, title, copy }) => (
            <StaggerItem key={title}>
              <Icon className="size-7 text-amber-deep" strokeWidth={1.5} />
              <h2 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.015em]">{title}</h2>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-muted">{copy}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="So einfach geht's" title={<>Ihr Getränkeeinkauf, <span className="serif-accent text-bottle">nur deutlich entspannter.</span></>} />
              <Reveal delay={0.2} className="mt-10 hidden overflow-hidden rounded-[16px] lg:block">
                <Parallax range={30}>
                  <Scene kind="warehouse" className="aspect-[4/3]" />
                </Parallax>
              </Reveal>
            </div>
          </div>
          <ol className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden className="absolute bottom-10 left-[23px] top-10 w-px bg-line" />
            {process.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 0.06} className="relative flex gap-7 pb-14 last:pb-0">
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-line bg-ivory font-serif text-[1.35rem] italic text-amber-deep">{i + 1}</span>
                <div className="pt-2">
                  <h3 className="text-[1.5rem] font-semibold tracking-[-0.025em] sm:text-[1.75rem]">{p.t}</h3>
                  <p className="mt-2 max-w-md text-[1rem] leading-relaxed text-muted">{p.c}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-stone/60 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Für den Alltag" title="Oft im Kühlschrank unserer Kunden." size="3" />
          <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {popular.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Häufige Fragen</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display-3 mt-5">Gut zu wissen.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <FAQAccordion items={faq} />
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
