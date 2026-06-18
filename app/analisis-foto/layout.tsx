import type { Metadata } from "next";

const title = "Analisis Foto Kulit (di Perangkatmu) — Privat & Gratis | JujurSkin";
const description =
  "Unggah foto wajah dan dapatkan estimasi visual sederhana: kemerahan, kilap/minyak, dan kerataan kulit. Diproses sepenuhnya di perangkatmu — foto TIDAK diunggah ke server. Bukan diagnosis medis.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "analisis kulit dari foto",
    "cek kondisi kulit online",
    "analisis wajah gratis",
    "deteksi kemerahan kulit",
    "kulit berminyak cek",
    "skin analysis indonesia",
  ],
  openGraph: { title, description, url: "https://jujurskin.com/analisis-foto", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/analisis-foto" },
};

export default function AnalisisFotoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
