import type { Metadata } from "next";

const title = "Analisis Kulit Gratis — Rekomendasi Skincare Sesuai Jenis Kulitmu";
const description =
  "Analisis kulit gratis tanpa daftar akun. Jawab beberapa pertanyaan → dapat rekomendasi skincare yang cocok untuk jenis kulit, masalah, dan budget-mu. Berbasis kandungan, bukan iklan.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "analisis kulit gratis",
    "tes jenis kulit",
    "rekomendasi skincare sesuai kulit",
    "skincare untuk kulit berminyak",
    "skincare untuk kulit kering",
    "skincare pemula",
  ],
  alternates: { canonical: "https://jujurskin.com/analisis" },
  openGraph: { title, description, url: "https://jujurskin.com/analisis", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
