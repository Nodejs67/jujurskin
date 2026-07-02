import type { Metadata } from "next";

const title = "Cek Konflik Skincare — Bahan yang Tidak Boleh Dicampur";
const description =
  "Cek apakah kandungan skincare-mu aman dipakai bersamaan. Ketahui kombinasi yang bisa bikin iritasi (misalnya retinol + AHA/BHA, vitamin C + niacinamide) dan cara memakainya dengan benar.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "skincare tidak boleh dicampur",
    "konflik kandungan skincare",
    "retinol dan AHA BHA",
    "vitamin c dan niacinamide",
    "kombinasi skincare aman",
  ],
  alternates: { canonical: "https://jujurskin.com/cek-konflik" },
  openGraph: { title, description, url: "https://jujurskin.com/cek-konflik", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
