"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

// Tautan utama yang tampil di desktop
const NAV_LINKS = [
  { href: "/panduan", label: "Panduan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/produk", label: "Produk" },
  { href: "/tidak-perlu", label: "Tidak Perlu" },
];

// Semua fitur — dipakai di menu mobile (dikelompokkan agar mudah ditemukan)
const MENU_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Mulai",
    links: [
      { href: "/analisis", label: "Analisis Kulit" },
      { href: "/analisis-foto", label: "Analisis Foto" },
      { href: "/hasil", label: "Hasil Analisis" },
      { href: "/rutinitas", label: "Rutinitas AM/PM" },
      { href: "/progress", label: "Progress Tracker" },
    ],
  },
  {
    title: "Alat Jujur",
    links: [
      { href: "/tidak-perlu", label: "Produk Tidak Perlu" },
      { href: "/cek-bpom", label: "Cek BPOM" },
      { href: "/cek-klaim", label: "Cek Klaim Iklan" },
      { href: "/cek-konflik", label: "Cek Konflik Bahan" },
      { href: "/sunscreen", label: "Sunscreen No-Whitecast" },
      { href: "/ke-dokter", label: "Kapan ke Dokter" },
      { href: "/simulasi", label: "Simulasi What-If" },
      { href: "/kalkulator", label: "Kalkulator Budget" },
    ],
  },
  {
    title: "Jelajah",
    links: [
      { href: "/produk", label: "Produk Indonesia" },
      { href: "/bandingkan-produk", label: "Bandingkan Produk" },
      { href: "/edukasi", label: "Edukasi Bahan" },
      { href: "/mitos-fakta", label: "Mitos vs Fakta" },
      { href: "/iklim", label: "Cuaca & Kulit" },
      { href: "/kulit-tropis", label: "Kulit Iklim Tropis" },
      { href: "/kamus", label: "Kamus Istilah" },
      { href: "/panduan", label: "Panduan Pemula" },
      { href: "/artikel", label: "Artikel" },
    ],
  },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const nama = (user?.user_metadata?.full_name as string)?.trim() || user?.email || "";
  const initial = nama.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold tracking-tight">JujurSkin</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-foreground transition-colors ${pathname === link.href ? "text-primary font-medium" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <Link
              href="/akun"
              aria-label="Akun saya"
              title={nama}
              className="w-8 h-8 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-sm font-bold text-primary hover:bg-primary/25 transition-colors"
            >
              {initial}
            </Link>
          ) : (
            <>
              <Link
                href="/masuk"
                className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-1"
              >
                Masuk
              </Link>
              <Button
                size="sm"
                onClick={() => router.push("/analisis")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium"
              >
                Analisis Gratis
              </Button>
            </>
          )}

          {/* Tombol menu — tampil di semua ukuran agar fitur mudah ditemukan */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Panel menu lengkap */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-foreground/10 backdrop-blur-sm cursor-default"
          />
          <div className="absolute top-16 left-0 right-0 z-50 border-b border-border bg-background shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
              {MENU_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2.5">
                    {group.title}
                  </p>
                  <ul className="space-y-1.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`block text-sm py-0.5 hover:text-primary transition-colors ${pathname === link.href ? "text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
