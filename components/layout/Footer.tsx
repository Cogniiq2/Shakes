import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const columns = [
  {
    title: "Sortiment",
    links: [
      { href: "/sortiment?kategorie=wasser", label: "Wasser" },
      { href: "/sortiment?kategorie=bier", label: "Bier" },
      { href: "/sortiment?kategorie=softdrinks", label: "Softdrinks" },
      { href: "/sortiment?kategorie=saefte-schorlen", label: "Säfte" },
      { href: "/sortiment?kategorie=alkoholfrei", label: "Alkoholfrei" },
      { href: "/sortiment?kategorie=wein-spezialitaeten", label: "Wein" },
    ],
  },
  {
    title: "Service",
    links: [
      { href: "/privatkunden", label: "Privatkunden" },
      { href: "/firmen-gastronomie", label: "Firmen & Gastronomie" },
      { href: "/liefergebiet", label: "Liefergebiet" },
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain relative overflow-hidden bg-ink text-ivory">
      <div className="container-x relative z-10 pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-8 max-w-xs font-serif text-[2rem] leading-[1.05] tracking-[-0.01em] text-ivory/90">
              Regional geliefert. <span className="italic text-amber">Persönlich betreut.</span>
            </p>
            <div className="mt-8 flex gap-2">
              <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${site.social.instagram.handle}`} className="grid size-11 place-items-center rounded-full border border-ivory/15 transition-colors hover:border-ivory/40 hover:bg-ivory/5">
                <InstagramIcon className="size-[18px]" />
              </a>
              <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${site.social.facebook.handle}`} className="grid size-11 place-items-center rounded-full border border-ivory/15 transition-colors hover:border-ivory/40 hover:bg-ivory/5">
                <FacebookIcon className="size-[18px]" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8 lg:gap-8">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="eyebrow text-ivory/45">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-[0.95rem] text-ivory/80 transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <p className="eyebrow text-ivory/45">Kontakt</p>
              <address className="mt-5 space-y-3 text-[0.95rem] not-italic text-ivory/80">
                <p>
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </p>
                <p>
                  <a href={site.phone.href} className="link-underline tabular-nums hover:text-ivory">
                    {site.phone.display}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${site.email}`} className="link-underline break-all hover:text-ivory">
                    {site.email}
                  </a>
                </p>
              </address>
            </div>
            <div>
              <p className="eyebrow text-ivory/45">Bestellzeiten</p>
              <dl className="mt-5 space-y-3 text-[0.95rem] text-ivory/80">
                {site.hours.map((h) => (
                  <div key={h.days}>
                    <dt className="text-ivory/50">{h.label}</dt>
                    <dd className="tabular-nums">
                      {h.open}–{h.close} Uhr
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none mt-20 select-none overflow-hidden md:mt-28">
          <p className="whitespace-nowrap font-serif text-[23vw] leading-[0.78] tracking-[-0.04em] text-ivory/[0.06] md:text-[19vw]">Schake&rsquo;s</p>
        </div>

        <div className="mt-6 flex flex-col gap-5 border-t border-ivory/10 pt-7 text-[0.85rem] text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} Schake&rsquo;s Bier · Getränkeheimdienst Bayreuth</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/impressum" className="link-underline hover:text-ivory">
              Impressum
            </Link>
            <Link href="/datenschutz" className="link-underline hover:text-ivory">
              Datenschutz
            </Link>
            <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ivory">
              Instagram <ArrowUpRight className="size-3.5" />
            </a>
            <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ivory">
              Facebook <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
