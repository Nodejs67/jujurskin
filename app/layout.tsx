import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jujurskin.vercel.app"),
  title: {
    default: "JujurSkin — Platform Skincare Jujur Indonesia",
    template: "%s | JujurSkin",
  },
  description: "Platform skincare pertama Indonesia yang jujur bilang apa yang tidak perlu kamu beli. Rekomendasi berbasis kondisi kulit & budget — bukan iklan.",
  keywords: ["skincare indonesia", "rekomendasi skincare", "ingredient skincare", "analisis kulit", "skincare jujur", "produk skincare lokal", "skincare pemula", "niacinamide", "retinol", "vitamin c skincare"],
  authors: [{ name: "JujurSkin" }],
  creator: "JujurSkin",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "JujurSkin — Platform Skincare Jujur Indonesia",
    description: "Rekomendasi skincare berbasis kondisi kulit & budget, bukan iklan. 100% gratis.",
    url: "https://jujurskin.vercel.app",
    siteName: "JujurSkin",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JujurSkin — Platform Skincare Jujur Indonesia",
    description: "Rekomendasi skincare berbasis kondisi kulit & budget, bukan iklan. 100% gratis.",
  },
  alternates: {
    canonical: "https://jujurskin.vercel.app",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#4f7a5b",
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
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
