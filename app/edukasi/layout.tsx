import type { Metadata } from "next";

const title = "Edukasi Ingredient Skincare — 100+ Bahan Dijelaskan Berbasis Bukti";
const description =
  "Pahami kandungan skincare dengan bahasa sederhana: niacinamide, retinol, salicylic acid, vitamin C, hyaluronic acid, dan 95+ bahan lain. Manfaat, cara pakai, level bukti ilmiah, dan bahan yang tidak boleh dicampur.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "ingredient skincare",
    "kandungan skincare",
    "niacinamide untuk apa",
    "retinol untuk apa",
    "salicylic acid",
    "vitamin c skincare",
    "bahan skincare yang tidak boleh dicampur",
  ],
  alternates: { canonical: "https://jujurskin.com/edukasi" },
  openGraph: { title, description, url: "https://jujurskin.com/edukasi", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
