import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: "/datenschutz" },
};

/**
 * ENTWURF – nicht anwaltlich geprüft.
 * Vor Veröffentlichung durch die bestehende, rechtlich geprüfte Datenschutzerklärung
 * von Schake's Bier ersetzen bzw. durch eine Fachperson prüfen lassen.
 */
export default function DatenschutzPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutz"
      note={<>Entwurf für die Vorschauversion. Dieser Text ist nicht rechtlich geprüft und wird vor der Veröffentlichung durch die geprüfte Datenschutzerklärung von Schake&rsquo;s Bier ersetzt.</>}
    >
      <h2>1. Verantwortlicher</h2>
      <address>
        <p>
          {site.name}, {site.owner}
          <br />
          {site.address.street}, {site.address.postalCode} {site.address.city}
          <br />
          Telefon: <a href={site.phone.href}>{site.phone.display}</a> · E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </address>

      <h2>2. Allgemeines</h2>
      <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser Website, zur Bearbeitung Ihrer Anfragen und zur Abwicklung von Bestellungen erforderlich ist.</p>

      <h2>3. Kontakt- und Anfrageformulare</h2>
      <p>Wenn Sie uns über ein Formular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben (z. B. Name, E-Mail-Adresse, Telefonnummer, Nachricht), um Ihre Anfrage zu beantworten. In der aktuellen Vorschauversion werden Formulardaten nicht übertragen oder gespeichert.</p>

      <h2>4. Bestellungen</h2>
      <p>Für die Abwicklung einer Bestellung benötigen wir Liefer- und Kontaktdaten. Diese verwenden wir zur Lieferung, zur Terminabstimmung und zur Abrechnung.</p>

      <h2>5. Speicherung im Browser</h2>
      <p>Der Inhalt Ihres Warenkorbs wird lokal in Ihrem Browser (Local Storage) gespeichert, damit er beim nächsten Besuch erhalten bleibt. Diese Daten werden nicht an uns übertragen und können jederzeit über die Browsereinstellungen gelöscht werden.</p>

      <h2>6. Hosting und Server-Logfiles</h2>
      <p>Angaben zum Hosting-Anbieter und zu technisch notwendigen Server-Logfiles werden mit der Veröffentlichung ergänzt.</p>

      <h2>7. Ihre Rechte</h2>
      <p>Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Zudem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren.</p>
      <p>
        Für Anliegen zum Datenschutz erreichen Sie uns unter <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
