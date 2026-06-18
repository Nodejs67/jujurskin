import type { Metadata } from "next";

const title = "Kamus Istilah Skincare Indonesia — Bruntusan, Purging, Fungal Acne | JujurSkin";
const description =
  "Bingung istilah skincare? Kamus bahasa sehari-hari: bruntusan, purging vs breakout, fungal acne, PIH/PIE, skin barrier, double cleansing, dan banyak lagi — dijelaskan sederhana tanpa jargon.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "arti bruntusan",
    "purging vs breakout",
    "fungal acne adalah",
    "istilah skincare",
    "kamus skincare indonesia",
    "pih pie bekas jerawat",
  ],
  openGraph: { title, description, url: "https://jujurskin.com/kamus", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/kamus" },
};

export default function KamusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
