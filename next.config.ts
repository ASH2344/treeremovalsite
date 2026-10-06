import type { NextConfig } from "next";
import siteConfig from "./site.config";

// Loud reminder if business details are still placeholders
for (const [key, value] of Object.entries({
  phone: siteConfig.phone,
  leadEmail: siteConfig.leadEmail,
  web3formsAccessKey: siteConfig.web3formsAccessKey,
})) {
  if (/^\[.*\]$/.test(value)) console.warn(`\n⚠️  site.config.ts: "${key}" is still a placeholder (${value}).\n`);
}

const nextConfig: NextConfig = {
  output: "export", // fully static HTML in /out
  trailingSlash: true, // /page/index.html for clean URLs on Apache
  images: { unoptimized: true }, // no image server on static hosting
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
