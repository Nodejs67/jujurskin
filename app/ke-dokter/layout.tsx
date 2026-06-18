import type { Metadata } from "next";

const title = "Kapan & Cara ke Dokter Kulit (SpKK) + Jalur BPJS | JujurSkin";
const description =
  "Kapan masalah kulit harus ditangani dokter, bukan skincare. Bedanya dokter spesialis kulit (Sp.KK/Sp.D.V.E), dokter umum, dan klinik kecantikan — plus cara berobat lewat BPJS langkah demi langkah. Jujur & berbasis tanggung jawab.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "kapan ke dokter kulit",
    "dokter spesialis kulit",
    "sp.kk",
    "berobat kulit bpjs",
    "rujukan poli kulit bpjs",
    "klinik kecantikan vs dokter kulit",
  ],
  openGraph: { title, description, url: "https://jujurskin.vercel.app/ke-dokter", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.vercel.app/ke-dokter" },
};

export default function KeDokterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
