import type { Metadata } from "next";

const title = "Katalog Produk Skincare — 220 Produk Terkurasi Berdasarkan Kandungan";
const description =
  "Jelajahi 220 produk skincare lokal & impor yang terkurasi. Filter berdasarkan kandungan aktif, jenis kulit, dan budget. Lengkap dengan info BPOM, harga, dan siapa yang sebaiknya skip.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "produk skincare",
    "katalog skincare indonesia",
    "skincare lokal",
    "rekomendasi produk skincare",
    "skincare BPOM",
    "harga skincare",
  ],
  alternates: { canonical: "https://jujurskin.com/produk" },
  openGraph: { title, description, url: "https://jujurskin.com/produk", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
