// OpenNext-Konfiguration für Cloudflare Workers.
// Alle Seiten sind vorgerendert (kein ISR) – daher kein R2-Incremental-Cache nötig.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
