import type { Metadata } from "next";

const title = "Produk Skincare yang Tidak Perlu Kamu Beli | JujurSkin";
const description =
  "Checker jujur: centang produk skincare yang kamu punya, kami beri tahu mana yang tumpang tindih, mubazir, atau belum kamu butuhkan — plus estimasi uang yang bisa kamu hemat. Tanpa iklan, tidak terafiliasi brand.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "produk skincare tidak perlu",
    "skincare mubazir",
    "minimum effective routine",
    "skincare hemat",
    "produk skincare redundan",
    "skincare basic",
    "berapa produk skincare yang cukup",
    "skincare indonesia",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.com/tidak-perlu",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/tidak-perlu" },
};

export default function TidakPerluLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
