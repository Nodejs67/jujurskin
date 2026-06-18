"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sun, ShieldCheck, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PRODUCTS } from "@/lib/products";
import {
  whitecastRisk, personalVerdict, levelColor, classifyFilters,
  PILIH_CHECKLIST, type SkinTone, type FilterType,
} from "@/lib/sunscreen";

const TONES: { id: SkinTone; label: string; sw: string }[] = [
  { id: "terang", label: "Kulit terang", sw: "#f1d9c2" },
  { id: "sawo-matang", label: "Sawo matang", sw: "#c79a73" },
  { id: "gelap", label: "Kulit gelap", sw: "#8a5a3c" },
];

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "kimia", label: "Filter kimia" },
  { id: "mineral", label: "Filter mineral" },
  { id: "hybrid", label: "Campuran (hybrid)" },
  { id: "tidak diketahui", label: "Tidak tahu" },
];

const SUNSCREENS = PRODUCTS.filter((p) => p.category === "sunscreen");

export default function SunscreenPage() {
  const [tone, setTone] = useState<SkinTone | null>(null);
  const [productId, setProductId] = useState<string>("");
  const [manualFilter, setManualFilter] = useState<FilterType | null>(null);

  const chosen = SUNSCREENS.find((p) => p.id === productId);
  const filterType: FilterType | null = chosen
    ? classifyFilters(chosen.key_ingredients)
    : manualFilter;

  const verdict = useMemo(() => {
    if (!tone || !filterType) return null;
    return personalVerdict(filterType, tone);
  }, [tone, filterType]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 border border-accent/30 mb-3">
              <Sun className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Sunscreen Tanpa Whitecast</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Kulit sawo matang Indonesia paling sering kena masalah <strong>whitecast</strong> — wajah jadi abu-abu/pucat
              setelah pakai sunscreen. Ini cara memilih yang benar-benar menyatu di kulitmu.
            </p>
          </div>

          {/* Apa itu whitecast */}
          <div className="rounded-2xl border border-border bg-card p-5 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Kenapa wajah jadi putih/abu-abu?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Penyebab utamanya <strong>filter mineral</strong> (Zinc Oxide & Titanium Dioxide) yang bekerja dengan
              memantulkan cahaya — meninggalkan lapisan putih yang makin terlihat di kulit lebih gelap. Sebaliknya,
              <strong> filter kimia/modern</strong> (Tinosorb, Uvinul, avobenzone) menyerap UV dan umumnya bening.
              Versi <strong>tinted</strong> (mengandung iron oxide) menetralkan putihnya filter mineral.
            </p>
          </div>

          {/* Cek interaktif */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-8">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Cek cocok di kulitmu
            </h2>

            {/* Step 1 */}
            <p className="text-sm font-medium text-foreground mb-2">1. Warna kulitmu</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {TONES.map((t) => (
                <button key={t.id} onClick={() => setTone(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${tone === t.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                  <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: t.sw }} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Step 2 */}
            <p className="text-sm font-medium text-foreground mb-2">2. Pilih sunscreen (dari daftar kami) atau jenis filternya</p>
            <select value={productId}
              onChange={(e) => { setProductId(e.target.value); setManualFilter(null); }}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground mb-3">
              <option value="">— pilih sunscreen —</option>
              {SUNSCREENS.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} · {p.name}</option>
              ))}
            </select>
            {!productId && (
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button key={f.id} onClick={() => setManualFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${manualFilter === f.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Verdict */}
            {verdict && tone && filterType && (
              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="text-lg mr-1">{verdict.emoji}</span>{verdict.verdict}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Filter terdeteksi: <strong className="capitalize">{filterType}</strong>.
                  {" "}Ingat: ini perkiraan — selalu tes setebal pemakaian di garis rahang.
                </p>
              </div>
            )}
            {(!tone || !filterType) && (
              <p className="text-xs text-muted-foreground mt-4">Lengkapi langkah 1 & 2 untuk melihat hasilnya.</p>
            )}
          </div>

          {/* Daftar sunscreen + badge whitecast */}
          <h2 className="text-xl font-bold text-foreground mb-1">Sunscreen di katalog kami</h2>
          <p className="text-sm text-muted-foreground mb-4">Perkiraan risiko whitecast dari jenis filternya — bukan penilaian mutu perlindungan.</p>
          <div className="grid gap-3 mb-10">
            {SUNSCREENS.map((p) => {
              const r = whitecastRisk(p.key_ingredients, p.tagline);
              return (
                <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand} · SPF {p.spf ?? "—"} · filter {r.filterType}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelColor(r.level)}`}>
                      whitecast {r.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
                  <Link href={`/produk/${p.id}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-2">
                    Lihat detail produk <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Checklist memilih */}
          <h2 className="text-xl font-bold text-foreground mb-4">Cara memilih yang menyatu di kulitmu</h2>
          <div className="grid gap-3 mb-8">
            {PILIH_CHECKLIST.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{c.judul}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.isi}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Jujur soal batasnya:</strong> whitecast bergantung pada formula, jumlah olesan, dan warna kulit
              masing-masing — perkiraan di sini berdasarkan jenis filter dari bahan yang tercantum, bukan uji pakai.
              Cara paling pasti tetap: <strong>tes langsung di garis rahang</strong>. Dan ingat, sedikit whitecast jauh
              lebih baik daripada tidak pakai sunscreen sama sekali.
            </p>
          </div>

          <Link href="/produk?kategori=sunscreen" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-6">
            Jelajah semua sunscreen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
