import type { Metadata } from "next";

const title = "Rutinitas Skincare — Susun Urutan Pagi & Malam yang Tepat";
const description =
  "Susun rutinitas skincare pagi (AM) dan malam (PM) yang benar sesuai jenis kulit dan produk yang kamu punya. Tahu urutan pakai, mana yang wajib, dan mana yang sebenarnya tidak perlu.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "rutinitas skincare",
    "skincare pagi dan malam",
    "urutan skincare AM PM",
    "basic skincare routine",
  ],
  alternates: { canonical: "https://jujurskin.com/rutinitas" },
  openGraph: { title, description, url: "https://jujurskin.com/rutinitas", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
