import type { Metadata } from "next";
import siteConfig, { phoneE164 } from "@/site.config";
import type { PageContent } from "./content";
import { getPageDef } from "./pages";
import { imageInfo } from "./images";

export function abs(url: string) {
  return `${siteConfig.url}${url}`;
}

export function pageMetadata(page: PageContent): Metadata {
  const def = getPageDef(page.url);
  const img = imageInfo(def.image);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: abs(page.url) },
    openGraph: {
      type: "website",
      url: abs(page.url),
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      locale: "en_US",
      images: [{ url: abs(img.ogSrc), width: 1200, height: 630, alt: img.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [abs(img.ogSrc)],
    },
  };
}

const provider = () => ({
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: `${siteConfig.url}/`,
  logo: abs("/images/macon-tree-removal-co-logo.png"),
  ...(phoneE164() ? { telephone: phoneE164() } : {}),
});

const areaServed = (list: string[]) =>
  list.map((name) => ({ "@type": "City", name }));

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    ...provider(),
    areaServed: areaServed(siteConfig.areasServed),
  };
}

export function serviceSchema(page: PageContent) {
  const def = getPageDef(page.url);
  if (!def.serviceType) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    serviceType: def.serviceType,
    description: page.description,
    url: abs(page.url),
    provider: provider(),
    areaServed: def.city ? areaServed([`${def.city}, GA`]) : areaServed(siteConfig.areasServed),
  };
}

export function faqSchema(page: PageContent) {
  if (!page.faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.aText },
    })),
  };
}

export function breadcrumbSchema(items: { url: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: abs(item.url),
    })),
  };
}
