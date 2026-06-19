import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jujurskin.com"),
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
    url: "https://jujurskin.com",
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
    canonical: "https://jujurskin.com",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#FB4E78",
  width: "device-width",
  initialScale: 1,
  // jangan kunci zoom — biarkan user perbesar (aksesibilitas)
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
