import type { Metadata } from "next";

const title = "Cek Klaim Skincare — Bongkar Iklan Menyesatkan | JujurSkin";
const description =
  "Tempel klaim iklan skincare (mis. 'mencerahkan dalam 7 hari', 'memutihkan permanen') dan lihat faktanya. JujurSkin mendeteksi 8 pola klaim menyesatkan berbasis sains, gratis & tanpa iklan.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "cek klaim skincare",
    "klaim iklan skincare",
    "skincare overclaim",
    "memutihkan permanen mitos",
    "mencerahkan 7 hari",
    "skincare jujur indonesia",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.vercel.app/cek-klaim",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.vercel.app/cek-klaim" },
};

export default function CekKlaimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
