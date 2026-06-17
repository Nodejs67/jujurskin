import type { MetadataRoute } from "next";
import { INGREDIENTS } from "@/lib/ingredients";
import { ARTICLES } from "@/lib/articles";
import { PRODUCTS } from "@/lib/products";

const BASE = "https://jujurskin.vercel.app";

const STATIC_PAGES = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/analisis", priority: 0.9, changeFrequency: "monthly" as const },
  { url: "/edukasi", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/produk", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/panduan", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/cek-konflik", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/tidak-perlu", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/simulasi", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/cek-klaim", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/mitos-fakta", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/iklim", priority: 0.6, changeFrequency: "monthly" as const },
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

  const artikelEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/artikel/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const artikelHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/artikel`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const produkEntries: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/produk/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...ingredientEntries, ...artikelHub, ...artikelEntries, ...produkEntries];
}
