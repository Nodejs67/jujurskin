import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JujurSkin — Platform Skincare Jujur Indonesia",
  description: "Platform skincare pertama Indonesia yang jujur bilang apa yang tidak perlu kamu beli. Rekomendasi berbasis kondisi kulit & budget — bukan iklan.",
  keywords: ["skincare", "indonesia", "rekomendasi kulit", "ingredien skincare", "skincare jujur", "analisis kulit"],
  openGraph: {
    title: "JujurSkin — Platform Skincare Jujur Indonesia",
    description: "Rekomendasi skincare berbasis kondisi kulit & budget, bukan iklan. 100% gratis.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
