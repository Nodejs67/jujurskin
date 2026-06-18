import type { Metadata } from "next";

const title = "Cuaca & Kulit — UV, Kelembapan, Suhu Real-Time | JujurSkin";
const description =
  "Cek UV index, kelembapan, dan suhu real-time di kotamu, lalu sesuaikan skincare-mu. Data live dari Open-Meteo, gratis tanpa iklan. Skincare yang cocok di kota lain belum tentu cocok di sini.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "uv index indonesia hari ini",
    "kelembapan udara skincare",
    "cuaca dan kulit",
    "sunscreen uv index",
    "skincare sesuai iklim",
    "skincare indonesia",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.vercel.app/iklim",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.vercel.app/iklim" },
};

export default function IklimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
