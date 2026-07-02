import type { Metadata } from "next";

const title = "Panduan Skincare Pemula — Urutan & Cara Pakai yang Benar";
const description =
  "Panduan lengkap skincare untuk pemula: urutan pakai yang benar (cleanser, toner, serum, moisturizer, sunscreen), cara mengenali jenis kulit, dan bahan yang tidak boleh dicampur. Jelas dan berbasis bukti.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "panduan skincare pemula",
    "urutan skincare yang benar",
    "cara pakai skincare",
    "langkah skincare",
    "skincare basic",
    "urutan pakai serum",
  ],
  alternates: { canonical: "https://jujurskin.com/panduan" },
  openGraph: { title, description, url: "https://jujurskin.com/panduan", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
