"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, AlertTriangle, ArrowRight, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkinPhotoCapture } from "@/components/skin-photo-capture";
import type { SkinResult, Level } from "@/lib/skin-analysis";

function levelColor(level: Level) {
  return level === "tinggi"
    ? "text-rose-700 bg-rose-400/10 border-rose-400/20"
    : level === "sedang"
    ? "text-amber-700 bg-amber-400/10 border-amber-400/20"
    : "text-green-700 bg-green-400/10 border-green-400/20";
}

export default function AnalisisFotoPage() {
  const [result, setResult] = useState<SkinResult | null>(null);
  const [sides, setSides] = useState(0);
  const [saran, setSaran] = useState<string | null>(null);
  const [saranLoading, setSaranLoading] = useState(false);

  async function fetchSaran(res: SkinResult) {
    setSaran(null); setSaranLoading(true);
    try {
      const r = await fetch("/api/saran-kulit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores: res.scores,
          levels: {
            redness: res.metrics.find((m) => m.key === "redness")?.level,
            oiliness: res.metrics.find((m) => m.key === "oil")?.level,
            evenness: res.metrics.find((m) => m.key === "even")?.level,
          },
          meta: { tone: res.skinTone.label },
        }),
      });
      const d = await r.json();
      setSaran(d?.saran ?? null);
    } catch { setSaran(null); } finally { setSaranLoading(false); }
  }

  function handleResult(res: SkinResult, n: number) {
    setResult(res);
    setSides(n);
    if (res.confidence >= 40) fetchSaran(res);
  }

  function reset() {
    setResult(null); setSides(0); setSaran(null);
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Analisis Foto Kulit</h1>
            <p className="text-muted-foreground leading-relaxed">
              Ambil 3 sisi wajah (depan, kiri, kanan) dengan panduan cahaya & jarak — hasil lebih lengkap.
              Semua diproses di perangkatmu.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              <strong>Privasi penuh:</strong> kamera & analisis berjalan sepenuhnya di browsermu. Foto/video kamu
              <strong> tidak pernah diunggah</strong>, tidak disimpan, dan tidak dikirim ke server atau AI mana pun.
            </p>
          </div>

          {!result ? (
            <SkinPhotoCapture onResult={handleResult} />
          ) : (
            <div className="space-y-4 mt-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Keyakinan hasil · {sides} sisi</p>
                  <span className="text-sm font-bold text-foreground">{result.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div className={`h-full rounded-full ${result.confidence >= 70 ? "bg-green-600" : result.confidence >= 45 ? "bg-amber-500" : "bg-rose-600"}`} style={{ width: `${result.confidence}%` }} />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                  <QualityChip label="Cahaya" value={result.quality.exposure} good={result.quality.exposure === "baik"} />
                  <QualityChip label="Ketajaman" value={result.quality.blur} good={result.quality.blur === "tajam"} />
                  <QualityChip label="Posisi" value={result.quality.pose} good={result.quality.pose === "lurus"} />
                </div>
              </div>

              {result.warnings.length > 0 && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <ul className="text-xs text-amber-800 space-y-1 list-disc pl-4">
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Warna kulit (ITA°)</p>
                  <p className="text-xs text-muted-foreground">Estimasi tone — informatif, bukan baik/buruk. Kulit sehat tak harus putih.</p>
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary shrink-0">{result.skinTone.label}</span>
              </div>

              <div className="grid gap-3">
                {result.metrics.map((m) => (
                  <div key={m.key} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${levelColor(m.level)}`}>{m.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed"><strong className="text-foreground/80">Saran:</strong> {m.tip}</p>
                  </div>
                ))}
              </div>

              {(saranLoading || saran) && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">AI</span> Saran personal
                  </p>
                  {saranLoading ? (
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Menyusun saran dari angka hasil ukur…</p>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{saran}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">Saran dibuat AI hanya dari <strong>angka hasil ukur</strong> — foto/video kamu tidak ikut dikirim.</p>
                </div>
              )}

              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Penting:</strong> ini pengukuran visual berbasis warna & cahaya —
                  <strong> bukan diagnosis medis</strong>. Untuk memantau progress, ambil foto dengan cahaya & posisi mirip tiap kali.
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:underline">
                    <RotateCcw className="w-4 h-4" /> Ulangi
                  </button>
                  <Link href="/analisis" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                    Lanjut ke Analisis Lengkap <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function QualityChip({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border capitalize ${good ? "text-green-700 bg-green-400/10 border-green-400/20" : "text-amber-700 bg-amber-400/10 border-amber-400/20"}`}>
      {good ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {label}: {value}
    </span>
  );
}
