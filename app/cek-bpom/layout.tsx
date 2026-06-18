import type { Metadata } from "next";

const title = "Cek BPOM — Pastikan Skincare-mu Terdaftar & Aman | JujurSkin";
const description =
  "Cek apakah produk skincare-mu terdaftar BPOM: validasi format nomor notifikasi (NA/NB/NC/ND/NE), tautan resmi cekbpom, dan ciri-ciri produk ilegal berbahaya (merkuri, hidrokuinon). Gratis & jujur.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "cek bpom",
    "cek bpom skincare",
    "nomor bpom kosmetik",
    "skincare terdaftar bpom",
    "produk skincare ilegal",
    "skincare merkuri bahaya",
  ],
  openGraph: { title, description, url: "https://jujurskin.com/cek-bpom", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/cek-bpom" },
};

export default function CekBpomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
