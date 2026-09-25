# Schake's Bier – Website-Prototyp

Premium-Frontend-Prototyp für **Schake's Bier, Getränkeheimdienst Bayreuth** (Teichweg 14, 95448 Bayreuth).
Reines Frontend: keine Datenbank, keine Zahlungsabwicklung, kein Login. Warenkorb, Formulare und Checkout sind
voll klickbar und simulieren Erfolgszustände.

## Starten

```bash
npm install
npm run dev          # Entwicklung: http://localhost:3000
npm run build        # statischer Export nach /out
npm run preview      # /out lokal ausliefern (http://localhost:3000)
npm run typecheck
```

## Deployment (Cloudflare Pages)

Die Seite ist ein vollständig statischer Export (`output: "export"` in `next.config.ts`), alle URLs liegen unter `/`.

| Einstellung | Wert |
| --- | --- |
| Framework preset | None (oder „Next.js (Static HTML Export)“) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node-Version | 22 (über `.nvmrc`) |

`public/_headers` setzt Langzeit-Caching für gehashte Assets. `404.html` wird von Cloudflare automatisch verwendet.
Filter im Sortiment laufen clientseitig über Query-Parameter (`/sortiment/?kategorie=bier`, `?marke=…`, `?q=…`).

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS 4 · Motion · Lucide ·
Three.js + React Three Fiber + drei (nur für die 3D-Produktgeschichte, per Lazy-Load).

## Seiten

`/` · `/sortiment` · `/sortiment/[slug]` · `/privatkunden` · `/firmen-gastronomie` · `/liefergebiet` ·
`/ueber-uns` · `/kontakt` · `/warenkorb` · `/bestellen` · `/konto` · `/impressum` · `/datenschutz` · 404

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `data/products.ts` | Produktdaten (flach, Supabase-tauglich). `price: null` = „Preis auf Anfrage“ – es werden keine Preise erfunden. |
| `data/categories.ts` | Kategorien inkl. Art Direction |
| `lib/site.ts` | NAP, Bestellzeiten, Liefergebiet, PLZ-Logik, Google-Bewertung – eine zentrale Quelle |
| `components/cart` | Warenkorb (React State + localStorage), Drawer, Summen, Leergut-Option |
| `components/story` | 3D-Produktgeschichte (prozedurale Flaschen, Scroll-Choreografie, SVG-Fallback) |
| `components/visual` | Stilisierte Flaschen/Kästen/Szenen als hochwertige Platzhalter für Fotografie |

## Vor dem Livegang mit dem Inhaber klären

- **Lieferbedingungen:** Mindestmenge (Preisliste 03/2026: ab einem Kasten vs. ältere Angabe: 3 Kästen) und Lieferzeit final bestätigen.
- **Preise:** Nur die Preise aus der Preisliste 03/2026 sind hinterlegt; alle übrigen Artikel zeigen „Preis auf Anfrage“.
- **Fotografie:** Stellen mit `REAL BUSINESS PHOTO RECOMMENDED HERE` im Code (Inhaber, Lager, Fahrzeug, Kästen, Lieferung).
- **Logo:** Die Wortmarke ist typografisch und temporär (`components/layout/Logo.tsx`).
- **Etiketten:** 3D- und SVG-Etiketten sind bewusst neutrale Platzhalter, keine Nachbildung offizieller Markenetiketten.
- **Rechtstexte:** Impressum ergänzen (z. B. USt-IdNr.); Datenschutz ist ein ungeprüfter Entwurf und muss ersetzt werden.
- **Zahlungsarten:** „Bar bei Lieferung“ / „Rechnung nach Vereinbarung“ sind Darstellungsoptionen.
- **Social Links:** Facebook-URL ist ein Suchlink, bis die exakte Seiten-URL vorliegt.

## 3D-Produktgeschichte

Scroll-gesteuert (kein Scroll-Hijacking), fünf Stationen, pro Produkt eigene Lichtstimmung.
Qualitätsstufen passen sich per `PerformanceMonitor` automatisch an; `?story=low|medium|high` erzwingt eine Stufe.
Ohne WebGL oder vor dem Laden zeigt ein SVG-Poster dieselbe Choreografie. `prefers-reduced-motion` ersetzt die
Flugbewegung durch sanftes Überblenden.
