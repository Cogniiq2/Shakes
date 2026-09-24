import type { Metadata } from "next";
import { CalendarDays, Clock, Recycle, Store } from "lucide-react";
import { ContactCTA, PageHero } from "@/components/sections/Shared";
import { AreaExplorer } from "@/components/sections/AreaExplorer";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { formatEuro } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liefergebiet – Getränkelieferung in Bayreuth & Umgebung",
  description: "Getränkelieferung in Bayreuth, Bindlach und Heinersreuth von Montag bis Freitag. Pegnitz, Zips, Schnabelwaid und Creußen alle vier Wochen mittwochs. PLZ jetzt prüfen.",
  alternates: { canonical: "/liefergebiet" },
};

const facts = [
  { icon: CalendarDays, t: "Montag bis Freitag", c: "Reguläre Belieferung an allen Werktagen." },
  { icon: Clock, t: "In der Regel 1–2 Werktage", c: "Je nach Liefergebiet und Verfügbarkeit." },
  { icon: Recycle, t: "Leergut inklusive", c: "Wir nehmen Leergut aus dem Sortiment mit." },
  { icon: Store, t: "Abholung möglich", c: "Direkt bei uns im Teichweg 14." },
];

const faq = [
  { q: "Wann wird geliefert?", a: "Die reguläre Belieferung erfolgt Montag bis Freitag. Je nach Liefergebiet und Verfügbarkeit erfolgt die Lieferung in der Regel innerhalb von 1–2 Werktagen." },
  { q: "Welche Orte werden beliefert?", a: "Regelmäßig beliefern wir Bayreuth, Bindlach und Heinersreuth. Pegnitz, Zips, Schnabelwaid und Creußen fahren wir alle vier Wochen mittwochs an." },
  { q: "Wird Leergut mitgenommen?", a: "Leergut aus dem geführten Sortiment nehmen wir bei einer Lieferung gerne wieder mit." },
  { q: "Kann ich nur Leergut abholen lassen?", a: `Für eine reine Leergutabholung ohne neue Lieferung wird laut aktueller Preisliste eine Gebühr von ${formatEuro(site.delivery.emptiesOnlyFee)} berechnet.` },
  { q: "Kann ich meine Bestellung abholen?", a: "Auch Abholung ist möglich. Abholpreise können von den Lieferpreisen abweichen." },
];

export default function LiefergebietPage() {
  return (
    <>
      <PageHero
        eyebrow="Liefergebiet"
        breadcrumb={[{ label: "Liefergebiet" }]}
        title={
          <>
            Regional unterwegs.
            <span className="serif-accent block text-bottle">Direkt für Sie.</span>
          </>
        }
        lede="Die reguläre Belieferung erfolgt Montag bis Freitag. Je nach Liefergebiet und Verfügbarkeit erfolgt die Lieferung in der Regel innerhalb von 1–2 Werktagen."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <AreaExplorer />
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16 md:py-20">
        <Stagger className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, t, c }) => (
            <StaggerItem key={t}>
              <Icon className="size-7 text-amber-deep" strokeWidth={1.5} />
              <p className="mt-5 text-[1.12rem] font-semibold tracking-[-0.015em]">{t}</p>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{c}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Häufige Fragen</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display-3 mt-5">Rund um die Lieferung.</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-muted">Noch Fragen? Wir sind Mo–Do 08:00–18:00 und Fr 08:00–11:30 für Sie da.</p>
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
