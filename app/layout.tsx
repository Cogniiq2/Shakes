import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Schake's Bier | Getränkelieferdienst in Bayreuth",
    template: "%s | Schake's Bier Bayreuth",
  },
  description:
    "Schake's Bier liefert Wasser, Bier, Softdrinks, Säfte und mehr in Bayreuth und Umgebung – für Privatkunden, Unternehmen und Gastronomie.",
  applicationName: "Schake's Bier",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Schake's Bier",
    title: "Schake's Bier | Getränkelieferdienst in Bayreuth",
    description: "Getränkeheimdienst in Bayreuth: Wasser, regionale Biere, Softdrinks, Säfte und Wein – bequem geliefert, Leergut nehmen wir mit.",
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F6F3ED",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${site.url}/#business`,
  name: site.name,
  description: "Getränkeheimdienst und Getränkehandel in Bayreuth – Lieferung für Privatkunden, Unternehmen und Gastronomie.",
  url: site.url,
  telephone: site.phone.international,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  areaServed: ["Bayreuth", "Bindlach", "Heinersreuth", "Pegnitz", "Creußen", "Schnabelwaid"].map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: site.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.open, closes: h.close })),
  sameAs: [site.social.instagram.href],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${manrope.variable} ${instrument.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
