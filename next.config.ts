import type { NextConfig } from "next";

/**
 * Standard-Build: für Cloudflare Workers via OpenNext (`npx opennextjs-cloudflare build`).
 * Optional: `npm run build:static` erzeugt einen reinen statischen Export in /out.
 */
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
