import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Bottle } from "@/components/visual/Bottle";
import { getProduct } from "@/data/products";

export default function NotFound() {
  const p = getProduct("adelholzener-naturell")!;
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-[104px]">
      <div className="container-x grid items-center gap-12 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-amber-deep">Fehler 404</p>
          <h1 className="display-1 mt-6">
            Diese Seite ist
            <span className="serif-accent block text-bottle">leider leer.</span>
          </h1>
          <p className="lede mt-7 max-w-lg text-muted">Wie ein Kasten ohne Flaschen: Die gesuchte Seite gibt es nicht (mehr). Unser Sortiment ist aber gut gefüllt.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/sortiment" size="lg" arrow>
              Zum Sortiment
            </Button>
            <Button href="/" size="lg" variant="outline">
              Zur Startseite
            </Button>
          </div>
          <p className="mt-8 text-[0.9rem] text-muted">
            Oder direkt zu{" "}
            <Link href="/liefergebiet" className="font-semibold text-ink link-underline">
              Liefergebiet
            </Link>{" "}
            ·{" "}
            <Link href="/kontakt" className="font-semibold text-ink link-underline">
              Kontakt
            </Link>
          </p>
        </div>
        <div className="relative hidden h-[520px] lg:col-span-4 lg:col-start-9 lg:block" aria-hidden>
          <div className="absolute inset-0 rounded-full bg-mist blur-3xl" />
          <div className="relative flex h-full items-end justify-center">
            <Bottle visual={{ ...p.visual, liquid: undefined }} id="404" brand={p.brand} title="Leer" className="h-[90%] w-auto rotate-[8deg]" />
          </div>
        </div>
      </div>
    </section>
  );
}
