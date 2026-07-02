import type { Metadata } from "next";

const title = "Artikel Skincare — Tips & Edukasi Kulit Berbasis Sains";
const description =
  "Kumpulan artikel skincare berbahasa Indonesia: cara memperbaiki skin barrier, memakai retinol & niacinamide dengan aman, skincare saat puasa & berhijab, dan mitos kulit sehat. Ditulis hati-hati, berbasis bukti.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "artikel skincare",
    "tips skincare",
    "skin barrier rusak",
    "cara pakai retinol",
    "skincare hijab",
    "skincare puasa",
  ],
  alternates: { canonical: "https://jujurskin.com/artikel" },
  openGraph: { title, description, url: "https://jujurskin.com/artikel", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
