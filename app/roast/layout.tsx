import type { Metadata } from "next";

const title = "Jujur Check — Berani Skincare Kamu Dijujurin?";
const description =
  "Upload rutinitas skincare-mu, kami cek fungsi yang dobel, bahan yang bentrok, dan uang yang bisa kamu hemat. Gratis, tanpa daftar, bukan diagnosis medis.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "cek skincare",
    "skincare overlap",
    "roast skincare",
    "ingredient conflict skincare",
    "skincare boros",
    "hemat skincare",
  ],
  alternates: { canonical: "https://jujurskin.com/roast" },
  openGraph: { title, description, url: "https://jujurskin.com/roast", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
