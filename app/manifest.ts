import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JujurSkin — Platform Skincare Jujur Indonesia",
    short_name: "JujurSkin",
    description:
      "Platform skincare jujur Indonesia: rekomendasi berbasis kondisi kulit & budget, bukan iklan.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f6ef",
    theme_color: "#4f7a5b",
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
