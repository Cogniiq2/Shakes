import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/Shared";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt – Getränke bestellen in Bayreuth",
  description: "Schake's Bier, Teichweg 14, 95448 Bayreuth. Telefon 0921 800 254 32, info@schakesbier.de. Bestellannahme Mo–Do 08:00–18:00, Fr 08:00–11:30.",
  alternates: { canonical: "/kontakt" },
};

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`)}`;

const cards = [
  { icon: Phone, label: "Anrufen", title: site.phone.display, copy: "Direkt persönlich sprechen.", href: site.phone.href, dark: true },
  { icon: Mail, label: "E-Mail", title: site.email, copy: "Für Bestellung, Anfrage oder Rückfrage.", href: `mailto:${site.email}` },
  { icon: MapPin, label: "Vor Ort", title: `${site.address.street}, ${site.address.city}`, copy: `${site.address.postalCode} ${site.address.city} · Route planen`, href: mapsHref, external: true },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        breadcrumb={[{ label: "Kontakt" }]}
        title={
          <>
            Was dürfen wir
            <span className="serif-accent block text-bottle">Ihnen bringen?</span>
          </>
        }
      />

      <section className="pb-20">
        <Stagger className="container-x grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, label, title, copy, href, dark, external }) => (
            <StaggerItem key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group flex h-full min-h-[190px] flex-col justify-between rounded-[18px] p-7 md:min-h-[240px] transition-all duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 sm:p-8 ${dark ? "bg-bottle text-ivory hover:bg-bottle-700" : "border border-line bg-paper hover:border-ink/25 hover:shadow-[0_24px_48px_-30px_rgba(0,0,0,0.3)]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid size-12 place-items-center rounded-full ${dark ? "bg-ivory/10 text-amber" : "bg-stone text-bottle"}`}>
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <ArrowUpRight className={`size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${dark ? "text-ivory/50" : "text-muted"}`} />
                </div>
                <div>
                  <p className={`eyebrow ${dark ? "text-amber" : "text-amber-deep"}`}>{label}</p>
                  <p className="mt-3 break-words text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] tabular-nums sm:text-[1.5rem]">{title}</p>
                  <p className={`mt-2 text-[0.9rem] ${dark ? "text-ivory/60" : "text-muted"}`}>{copy}</p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-line bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Bestell- & Kontaktzeiten</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between py-5">
                    <dt className="text-[1.05rem] font-semibold">{h.label}</dt>
                    <dd className="text-[1.05rem] tabular-nums text-muted">
                      {h.open}–{h.close}
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between py-5">
                  <dt className="text-[1.05rem] font-semibold">Lieferungen</dt>
                  <dd className="text-[1.05rem] text-muted">Mo–Fr</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.12} className="mt-12">
              <Eyebrow>Folgen Sie uns</Eyebrow>
              <div className="mt-6 space-y-3">
                <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-[12px] border border-line p-4 transition-colors hover:border-ink/25">
                  <InstagramIcon className="size-6" />
                  <span>
                    <span className="block text-[0.78rem] text-muted">Instagram</span>
                    <span className="font-semibold">{site.social.instagram.handle}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-[12px] border border-line p-4 transition-colors hover:border-ink/25">
                  <FacebookIcon className="size-6" />
                  <span>
                    <span className="block text-[0.78rem] text-muted">Facebook</span>
                    <span className="font-semibold">{site.social.facebook.handle}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <h2 className="display-3">Schreiben Sie uns.</h2>
            <p className="mt-3 text-[1rem] text-muted">Wir melden uns persönlich – in der Regel am nächsten Werktag.</p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
