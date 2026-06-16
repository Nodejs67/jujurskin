import type { MetadataRoute } from "next";
import { INGREDIENTS } from "@/lib/ingredients";

const BASE = "https://jujurskin.vercel.app";

const STATIC_PAGES = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/analisis", priority: 0.9, changeFrequency: "monthly" as const },
  { url: "/edukasi", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/produk", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/panduan", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/cek-konflik", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/bandingkan", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/kalkulator", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/rutinitas", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/progress", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const ingredientEntries: MetadataRoute.Sitemap = INGREDIENTS.map((ing) => ({
    url: `${BASE}/edukasi/ingredient/${ing.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...ingredientEntries];
}
