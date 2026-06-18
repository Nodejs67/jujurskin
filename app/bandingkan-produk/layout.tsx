import type { Metadata } from "next";

const title = "Bandingkan Produk Skincare — Side by Side Jujur | JujurSkin";
const description =
  "Bandingkan produk skincare Indonesia berdampingan: harga, bahan utama, jenis kulit, dan kecocokan. Tanpa endorse, tanpa komisi — perbandingan jujur untuk bantu kamu pilih yang tepat.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "bandingkan produk skincare",
    "perbandingan skincare indonesia",
    "skincare mana lebih bagus",
    "harga skincare dibanding",
    "review jujur skincare",
    "skincare indonesia",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.com/bandingkan-produk",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/bandingkan-produk" },
};

export default function BandingkanProdukLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
