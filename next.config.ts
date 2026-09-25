import type { NextConfig } from "next";

/**
 * Statischer Export für Cloudflare Pages: `npm run build` erzeugt den kompletten Auftritt in /out.
 * Alle URLs liegen direkt unter "/" (kein basePath).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
