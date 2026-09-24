import type { Metadata } from "next";
import { Check, Handshake, Layers, Recycle } from "lucide-react";
import { PageHero } from "@/components/sections/Shared";
import { LeadForm } from "@/components/sections/LeadForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Scene } from "@/components/visual/Scene";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Getränke für Unternehmen & Gastronomie in Bayreuth",
  description: "Getränkeversorgung für Büros, Betriebe und Gastronomie in Bayreuth und Umgebung: breites Sortiment verschiedener Hersteller, persönliche Abstimmung, Leergutrücknahme.",
  alternates: { canonical: "/firmen-gastronomie" },
};

const paths = [
  {
    id: "unternehmen",
    kicker: "Für Unternehmen",
    title: "Das Büro bleibt versorgt.",
    copy: "Wasser, Säfte, Softdrinks und mehr für Mitarbeiter, Besprechungen und Besucher.",
    scene: "office" as const,
    benefits: ["Breite Getränkeauswahl", "Persönliche Abstimmung", "Regelmäßige Belieferung möglich", "Leergutrücknahme", "Individuelle Lösungen nach Absprache"],
    anchor: "#anfrage-unternehmen",
  },
  {
    id: "gastronomie",
    kicker: "Für Gastronomie",
    title: "Getränke, die zu Ihrem Konzept passen.",
    copy: "Von Mineralwasser über regionale Biere bis zu Wein und Gastro-Gebinden: Schake's Bier berät persönlich bei der passenden Auswahl.",
    scene: "gastro" as const,
    benefits: ["Verschiedene Hersteller", "Regionale Produkte", "Gastro-Gebinde", "Persönliche Beratung", "Individuelle Konditionen nach Absprache"],
    anchor: "#anfrage-gastronomie",
  },
];

const steps = [
  { t: "Anfrage", c: "Sie schildern kurz Ihren Bedarf – per Formular oder am Telefon." },
  { t: "Abstimmung", c: "Gemeinsam klären wir Sortiment, Mengen und den passenden Lieferrhythmus." },
  { t: "Belieferung", c: "Wir liefern zuverlässig und nehmen Leergut aus dem Sortiment wieder mit." },
];

export default function FirmenGastroPage() {
  return (
    <>
      <PageHero
        dark
        eyebrow="Unternehmen & Gastronomie"
        breadcrumb={[{ label: "Firmen & Gastronomie" }]}
        title={
          <>
            Getränkeversorgung,
            <span className="serif-accent block text-amber">auf die Ihr Betrieb zählen kann.</span>
          </>
        }
        lede="Schake's Bier beliefert Unternehmen und Gastronomiebetriebe in Bayreuth und Umgebung mit einem breiten Sortiment verschiedener Hersteller – persönlich, flexibel und zuverlässig."
        aside={
          <ul className="grid gap-px overflow-hidden rounded-[16px] border border-ivory/10 bg-ivory/10">
            {[
              { icon: Layers, t: "Unabhängiges Sortiment", c: "Nicht an eine Brauerei gebunden" },
              { icon: Handshake, t: "Persönliche Ansprechpartner", c: "Direkt, ohne Callcenter" },
              { icon: Recycle, t: "Leergutrücknahme", c: "Bei jeder Lieferung" },
            ].map(({ icon: Icon, t, c }) => (
              <li key={t} className="flex items-center gap-4 bg-bottle p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ivory/[0.07] text-amber">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-[0.85rem] text-ivory/55">{c}</p>
                </div>
              </li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#anfrage" variant="amber" size="lg" arrow magnetic className="w-full sm:w-auto">
            Individuell anfragen
          </Button>
          <Button href={site.phone.href} variant="outline-light" size="lg" className="w-full tabular-nums sm:w-auto">
            {site.phone.display}
          </Button>
        </div>
      </PageHero>

      {paths.map((p, i) => (
        <section key={p.id} id={p.id} className={`scroll-mt-20 py-20 md:py-32 ${i === 1 ? "bg-paper" : ""}`}>
          <div className={`container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className={`lg:col-span-6 ${i === 1 ? "lg:order-2" : ""}`}>
              <div className="overflow-hidden rounded-[20px]">
                {/* REAL BUSINESS PHOTO RECOMMENDED HERE */}
                <Scene kind={p.scene} className="aspect-[4/3.6]" />
              </div>
            </Reveal>
            <div className={`lg:col-span-5 ${i === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
              <Reveal>
                <Eyebrow>{p.kicker}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="display-2 mt-6">{p.title}</h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lede mt-6 text-muted">{p.copy}</p>
              </Reveal>
              <Stagger as="ul" className="mt-9 divide-y divide-line border-y border-line" delay={0.1}>
                {p.benefits.map((b) => (
                  <StaggerItem as="li" key={b} className="flex items-center gap-4 py-4 text-[1rem] font-semibold">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-bottle text-ivory">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {b}
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.2} className="mt-9">
                <Button href={p.anchor} variant="outline" arrow>
                  Individuell anfragen
                </Button>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="grain relative overflow-hidden bg-ink py-24 text-ivory md:py-32">
        <div className="container-x relative z-10">
          <SectionHeading light eyebrow="Zusammenarbeit" title={<>Klar abgestimmt. <span className="serif-accent text-amber">Zuverlässig geliefert.</span></>} />
          <Stagger as="ol" className="mt-16 grid gap-px overflow-hidden rounded-[16px] border border-ivory/10 bg-ivory/10 md:grid-cols-3">
            {steps.map((s, i) => (
              <StaggerItem as="li" key={s.t} className="bg-ink p-8 md:p-10">
                <span className="font-serif text-[3.5rem] italic leading-none text-amber/80">0{i + 1}</span>
                <h3 className="mt-8 text-[1.4rem] font-semibold tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/60">{s.c}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="anfrage" className="scroll-mt-20 py-24 md:py-36">
        <span id="anfrage-unternehmen" className="block -translate-y-20" aria-hidden />
        <span id="anfrage-gastronomie" className="block -translate-y-20" aria-hidden />
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Unverbindlich anfragen</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display-2 mt-6">Erzählen Sie uns von Ihrem Betrieb.</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-[1rem] leading-relaxed text-muted">Wir melden uns persönlich und stimmen eine Lösung ab, die zu Ihrem Bedarf passt – vom Wasser fürs Büro bis zur Getränkekarte Ihrer Gäste.</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-10 rounded-[14px] border border-line bg-paper p-6">
              <p className="eyebrow text-muted">Direkt erreichbar</p>
              <a href={site.phone.href} className="mt-4 block text-[1.5rem] font-semibold tracking-[-0.02em] tabular-nums hover:text-bottle-700">
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="mt-1 block text-[0.95rem] text-muted hover:text-ink">
                {site.email}
              </a>
              <p className="mt-4 text-[0.82rem] text-muted">Mo–Do 08:00–18:00 · Fr 08:00–11:30</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-[20px] border border-line bg-paper p-6 sm:p-10">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
