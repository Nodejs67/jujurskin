"use client";

import { useState, useMemo } from "react";
import { BookA, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KAMUS, type Istilah } from "@/lib/kamus";

const KATEGORI: (Istilah["kategori"] | "Semua")[] = ["Semua", "Gejala/Kondisi", "Bahan", "Teknik", "Istilah Umum"];

export default function KamusPage() {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState<(typeof KATEGORI)[number]>("Semua");

  const hasil = useMemo(() => {
    const s = q.trim().toLowerCase();
    return KAMUS
      .filter((i) => kat === "Semua" || i.kategori === kat)
      .filter((i) => !s || i.term.toLowerCase().includes(s) || i.arti.toLowerCase().includes(s))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [q, kat]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <BookA className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kamus Istilah Skincare</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Bingung beda <em>purging</em> vs <em>breakout</em>, atau apa itu <em>bruntusan</em> & <em>fungal acne</em>?
              Cari di sini — dijelaskan pakai bahasa sehari-hari.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari istilah… (mis. purging, bruntusan)"
              className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {KATEGORI.map((k) => (
              <button key={k} onClick={() => setKat(k)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${kat === k ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                {k}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-3">{hasil.length} istilah</p>
          <div className="grid gap-3">
            {hasil.map((i) => (
              <div key={i.term} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-sm font-semibold text-foreground">{i.term}</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-secondary/30 text-muted-foreground">{i.kategori}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{i.arti}</p>
                {i.lihat && <p className="text-[11px] text-primary mt-1.5">↪ lihat juga: {i.lihat}</p>}
              </div>
            ))}
            {hasil.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Tidak ada istilah yang cocok. Coba kata kunci lain.</p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
