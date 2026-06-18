import type { Metadata } from "next";

const title = "Mitos vs Fakta Skincare — 12 Mitos Populer Dibongkar | JujurSkin";
const description =
  "Pori-pori bisa mengecil? Sunscreen tak perlu di dalam ruangan? Kulit harus 'kesat' biar bersih? Bongkar 12 mitos skincare paling populer di Indonesia dengan fakta berbasis sains.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "mitos skincare",
    "fakta skincare",
    "mitos vs fakta skincare indonesia",
    "mitos sunscreen",
    "mitos pori-pori",
    "skincare berbasis sains",
  ],
  openGraph: {
    title,
    description,
    url: "https://jujurskin.com/mitos-fakta",
    type: "website",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/mitos-fakta" },
};

export default function MitosFaktaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
