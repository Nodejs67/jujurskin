import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JujurSkin — Platform Skincare Jujur Indonesia",
    short_name: "JujurSkin",
    description:
      "Platform skincare jujur Indonesia: rekomendasi berbasis kondisi kulit & budget, bukan iklan.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FB4E78",
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
