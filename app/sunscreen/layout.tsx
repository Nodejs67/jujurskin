import type { Metadata } from "next";

const title = "Sunscreen Tanpa Whitecast untuk Kulit Indonesia | JujurSkin";
const description =
  "Kulit sawo matang sering kena whitecast (wajah abu-abu/pucat) setelah pakai sunscreen. Cek apakah sunscreen-mu menyatu di kulitmu, pahami filter kimia vs mineral, dan cara memilih yang tepat. Gratis & jujur.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "sunscreen no whitecast",
    "sunscreen tanpa whitecast",
    "sunscreen kulit sawo matang",
    "sunscreen tidak putih",
    "sunscreen kulit gelap indonesia",
    "filter kimia vs mineral sunscreen",
  ],
  openGraph: { title, description, url: "https://jujurskin.com/sunscreen", type: "website" },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://jujurskin.com/sunscreen" },
};

export default function SunscreenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
