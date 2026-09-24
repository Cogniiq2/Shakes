import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Impressum"
      note={<>Vorschauversion: Weitere Pflichtangaben (z. B. Umsatzsteuer-Identifikationsnummer, sofern vorhanden) werden vor der Veröffentlichung von Schake&rsquo;s Bier ergänzt und geprüft.</>}
    >
      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        <p>
          {site.name}
          <br />
          {site.owner}
          <br />
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}
        </p>
      </address>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={site.phone.href}>{site.phone.display}</a>
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Hinweis zu Marken</h2>
      <p>
        Die auf dieser Website genannten Marken und Produktnamen sind Eigentum der jeweiligen Hersteller. Schake&rsquo;s Bier ist ein unabhängiger Getränkehandel und führt diese Produkte als Teil seines Sortiments. Produktdarstellungen sind stilisiert.
      </p>
    </LegalLayout>
  );
}
