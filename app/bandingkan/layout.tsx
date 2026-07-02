import type { Metadata } from "next";

const title = "Bandingkan Ingredient Skincare — Cek Kandungan Berdampingan";
const description =
  "Bandingkan dua atau lebih kandungan skincare berdampingan: manfaat, level bukti ilmiah, cocok untuk siapa, dan mana yang tidak boleh dipakai bersamaan. Bantu kamu memilih tanpa terjebak marketing.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "bandingkan ingredient skincare",
    "niacinamide vs vitamin c",
    "retinol vs bakuchiol",
    "kandungan skincare",
  ],
  alternates: { canonical: "https://jujurskin.com/bandingkan" },
  openGraph: { title, description, url: "https://jujurskin.com/bandingkan", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
