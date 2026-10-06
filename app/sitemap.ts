import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { abs } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return getAllContent().map((p) => ({
    url: abs(p.url),
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.url === "/" ? 1 : ["/tree-removal/", "/warner-robins/", "/contact/"].includes(p.url) ? 0.9 : 0.7,
  }));
}
