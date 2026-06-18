import type { Metadata } from "next";

const title = "Masalah Kulit Iklim Tropis Indonesia — Biang Keringat, Bacne, Panu | JujurSkin";
const description =
  "Panas + lembap khas Indonesia memicu masalah kulit yang jarang dibahas brand global: biang keringat, jerawat punggung (bacne), panu/jamur, iritasi lembap, dan kilap berlebih. Ini penyebab & cara menanganinya — jujur, termasuk kapan harus ke dokter.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "biang keringat",
    "jerawat punggung",
    "bacne",
    "panu",
    "kulit lembap berkeringat",
    "masalah kulit cuaca panas indonesia",
  ],
  openGraph: { title, description, url: "https://jujurskin.vercel.app/kulit-tropis", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.vercel.app/kulit-tropis" },
};

export default function KulitTropisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
