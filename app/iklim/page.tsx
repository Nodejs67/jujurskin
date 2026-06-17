"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ClimateWidget } from "@/components/climate-widget";

export default function IklimPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Iklim & Skincare Kotamu</h1>
          <p className="text-sm text-muted-foreground">
            Skincare yang cocok di Bandung belum tentu cocok di Medan. Cek UV & kelembapan asli kotamu hari ini — lalu sesuaikan sunscreen & pelembapmu.
          </p>
        </div>

        <ClimateWidget />

        <div className="flex flex-wrap gap-3">
          <Link href="/analisis" className="text-xs text-primary hover:underline">Analisis kulit lengkap →</Link>
          <Link href="/produk?kategori=sunscreen" className="text-xs text-primary hover:underline">Lihat rekomendasi sunscreen →</Link>
        </div>
      </div>
    </main>
  );
}
