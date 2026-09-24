import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GoogleIcon } from "@/components/ui/SocialIcons";
import { reviews, site } from "@/lib/site";
import { cn } from "@/lib/format";

export function Breadcrumb({ items, light }: { items: Array<{ href?: string; label: string }>; light?: boolean }) {
  return (
    <nav aria-label="Brotkrumen">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-[0.8rem]", light ? "text-ivory/60" : "text-muted")}>
        <li>
          <Link href="/" className={cn("transition-colors", light ? "hover:text-ivory" : "hover:text-ink")}>
            Start
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 opacity-50" />
            {it.href ? (
              <Link href={it.href} className={cn("transition-colors", light ? "hover:text-ivory" : "hover:text-ink")}>
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className={light ? "text-ivory" : "text-ink"}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Einheitlicher Seiten-Hero für Unterseiten */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumb,
  children,
  aside,
  dark,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumb: Array<{ href?: string; label: string }>;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-[104px] lg:pt-[128px]", dark ? "grain bg-bottle text-ivory" : "")}>
      {dark && <div aria-hidden className="absolute -right-40 top-0 size-[640px] rounded-full bg-amber/15 blur-[120px]" />}
      <div className="container-x relative z-10 pb-16 lg:pb-24">
        <Reveal>
          <Breadcrumb items={breadcrumb} light={dark} />
        </Reveal>
        <div className={cn("mt-10 grid gap-12 lg:mt-14", !!aside && "lg:grid-cols-12 lg:items-end lg:gap-10")}>
          <div className={aside ? "lg:col-span-7" : "max-w-4xl"}>
            <Reveal delay={0.05}>
              <Eyebrow light={dark}>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className={cn("display-1 mt-6", dark ? "text-ivory" : "text-ink")}>{title}</h1>
            </Reveal>
            {lede && (
              <Reveal delay={0.18}>
                <p className={cn("lede mt-7 max-w-[38rem]", dark ? "text-ivory/70" : "text-muted")}>{lede}</p>
              </Reveal>
            )}
            {children && <Reveal delay={0.26} className="mt-9">{children}</Reveal>}
          </div>
          {aside && <Reveal delay={0.2} className="lg:col-span-5">{aside}</Reveal>}
        </div>
      </div>
    </section>
  );
}

export function RatingDisplay({ light, compact }: { light?: boolean; compact?: boolean }) {
  const full = Math.floor(reviews.rating);
  const partial = reviews.rating - full;
  return (
    <div className={cn("flex items-center gap-4", compact && "gap-3")}>
      <span className={cn("grid shrink-0 place-items-center rounded-full bg-paper", compact ? "size-10" : "size-14", !light && "border border-line")}>
        <GoogleIcon className={compact ? "size-5" : "size-7"} />
      </span>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={cn("font-semibold tabular-nums tracking-[-0.03em]", compact ? "text-xl" : "text-[2rem]")}>
            {reviews.rating.toLocaleString("de-DE")}
          </span>
          <span className={cn("text-sm", light ? "text-ivory/55" : "text-muted")}>/ {reviews.max}</span>
          <span className="ml-1 flex" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="relative">
                <Star className={cn("size-4", light ? "text-ivory/20" : "text-stone-dark")} fill="currentColor" strokeWidth={0} />
                <span className="absolute inset-0 overflow-hidden" style={{ width: i < full ? "100%" : i === full ? `${partial * 100}%` : "0%" }}>
                  <Star className="size-4 text-amber" fill="currentColor" strokeWidth={0} />
                </span>
              </span>
            ))}
          </span>
        </div>
        <p className={cn("text-[0.82rem]", light ? "text-ivory/60" : "text-muted")}>
          {reviews.source} · {reviews.count} Bewertungen
        </p>
      </div>
    </div>
  );
}

/** Abschluss-CTA (dunkel) – wiederverwendbar */
export function ContactCTA({
  title = (
    <>
      Der nächste Getränkeeinkauf
      <br className="hidden sm:block" /> <span className="serif-accent text-amber">kann leichter sein.</span>
    </>
  ),
  copy = "Sortiment entdecken, Bestellung zusammenstellen und Schake's Bier den Rest überlassen.",
  primary = { href: "/sortiment", label: "Jetzt Sortiment entdecken" },
}: {
  title?: React.ReactNode;
  copy?: string;
  primary?: { href: string; label: string };
}) {
  return (
    <section className="grain relative overflow-hidden bg-bottle text-ivory">
      <div aria-hidden className="absolute -left-40 bottom-[-30%] size-[680px] rounded-full bg-amber/15 blur-[120px]" />
      <div aria-hidden className="absolute right-[-10%] top-[-20%] size-[520px] rounded-full border border-ivory/[0.06]" />
      <div aria-hidden className="absolute right-[-4%] top-[-8%] size-[380px] rounded-full border border-ivory/[0.06]" />
      <div className="container-x relative z-10 py-24 md:py-36">
        <Reveal>
          <Eyebrow light>Bestellen in Bayreuth</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="display-2 mt-6 max-w-5xl">{title}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mt-7 max-w-xl text-ivory/70">{copy}</p>
        </Reveal>
        <Reveal delay={0.18} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={primary.href} variant="amber" size="lg" arrow magnetic className="w-full sm:w-auto">
            {primary.label}
          </Button>
          <Button href={site.phone.href} variant="outline-light" size="lg" className="w-full tabular-nums sm:w-auto">
            {site.phone.display}
          </Button>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-8 text-[0.85rem] text-ivory/50">Bestellannahme Mo–Do 08:00–18:00 · Fr 08:00–11:30</p>
        </Reveal>
      </div>
    </section>
  );
}
