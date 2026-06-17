"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-8 px-6 mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
            </div>
            <span className="text-xs font-medium">JujurSkin</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            {[
              { href: "/analisis", label: "Analisis Kulit" },
              { href: "/panduan", label: "Panduan" },
              { href: "/edukasi", label: "Edukasi" },
              { href: "/produk", label: "Produk" },
              { href: "/cek-konflik", label: "Cek Konflik" },
              { href: "/tidak-perlu", label: "Produk Tidak Perlu" },
              { href: "/simulasi", label: "Simulasi What-If" },
              { href: "/cek-klaim", label: "Cek Klaim Iklan" },
              { href: "/bandingkan", label: "Bandingkan" },
              { href: "/rutinitas", label: "Rutinitas" },
              { href: "/progress", label: "Progress Kulit" },
              { href: "/artikel", label: "Artikel" },
              { href: "/kalkulator", label: "Budget Planner" },
              { href: "/feedback", label: "Feedback" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border/30 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© 2026 JujurSkin Indonesia</p>
          <p className="text-xs text-muted-foreground text-center">
            Tidak terafiliasi brand · Berbasis data & ilmu pengetahuan · 100% Gratis
          </p>
        </div>
      </div>
    </footer>
  );
}
