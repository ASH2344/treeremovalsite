import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import siteConfig from "@/site.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";
import "./globals.css";

// Self-hosted fonts (no request to Google at build or run time)
const barlow = localFont({
  src: [{ path: "./fonts/barlow-condensed-latin-700-normal.woff2", weight: "700" }],
  variable: "--font-barlow",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});
const publicSans = localFont({
  src: "./fonts/public-sans-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-public",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
  ...(siteConfig.googleSiteVerification ? { verification: { google: siteConfig.googleSiteVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#18482f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga = siteConfig.googleAnalyticsId;
  return (
    <html lang="en-US" className={`${barlow.variable} ${publicSans.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCallBar />
        {ga && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
            <Script id="ga4" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="tel:"]');if(a)gtag('event','phone_call_click',{link_url:a.href});});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
