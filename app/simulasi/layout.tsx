import type { Metadata } from "next";

const title = "Simulasi What-If Bahan Aktif — Coba Sebelum Beli | JujurSkin";
const description =
  "Penasaran efek Retinol, Niacinamide, AHA/BHA, atau Vitamin C ke kulitmu? Simulasikan 9 bahan aktif populer: manfaat, risiko, dan apa yang terjadi kalau dipakai bareng — tanpa beli dulu.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "simulasi skincare",
    "efek retinol",
    "niacinamide vs vitamin c",
    "what if skincare",
    "bahan aktif skincare",
    "kombinasi bahan aktif",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.vercel.app/simulasi",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.vercel.app/simulasi" },
};

export default function SimulasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
