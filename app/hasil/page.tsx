"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, Share2, MapPin, Sparkles, MessageSquare, BookOpen, ShoppingBag, Repeat, Baby, Info, Copy, Check, Clock, AlertTriangle, ListChecks, Wallet, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { AnalysisResult } from "@/lib/recommendations";
import { PRODUCTS, type ProductCategory } from "@/lib/products";

const CATEGORY_MAP: Record<string, ProductCategory> = {
  "Sun Protection": "sunscreen",
  "Cleansing": "cleanser",
  "Moisturizing": "moisturizer",
  "Acne Treatment": "treatment_jerawat",
  "Brightening & Repair": "serum_niacinamide",
  "Brightening": "serum_vitamin_c",
  "Anti-Aging": "serum_retinol",
  // product name fallbacks
  "Sunscreen": "sunscreen",
  "Cleanser": "cleanser",
  "Moisturizer": "moisturizer",
  "Niacinamide": "serum_niacinamide",
  "Vitamin C": "serum_vitamin_c",
  "Retinol": "serum_retinol",
  "AHA/BHA": "serum_aha_bha",
};

function getProductSuggestions(category: string, budget: number) {
  const productCategory = CATEGORY_MAP[category];
  if (!productCategory) return [];
  return PRODUCTS.filter(
    (p) => p.category === productCategory && (budget === 0 || p.price_min <= budget)
  ).slice(0, 2);
}

type Analysis = {
  id: string;
  nama: string | null;
  usia: number;
  kota: string;
  tipe_kulit: string;
  masalah: string[];
  budget: number;
  hasil: AnalysisResult;
};

const scoreColors: Record<string, string> = {
  uv_protection: "bg-yellow-400",
  barrier: "bg-green-400",
  hydration: "bg-blue-400",
  acne_control: "bg-purple-400",
};
const scoreTextColors: Record<string, string> = {
  uv_protection: "text-yellow-700",
  barrier: "text-green-700",
  hydration: "text-blue-700",
  acne_control: "text-purple-700",
};
const scoreLabels: Record<string, string> = {
  uv_protection: "UV Protection",
  barrier: "Barrier Health",
  hydration: "Hydration",
  acne_control: "Acne Control",
};

function HasilContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedRec, setExpandedRec] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      // Coba ambil dari localStorage (fallback)
      const cached = localStorage.getItem("jujurskin_hasil");
      if (cached) {
        setData({ id: "local", nama: null, usia: 0, kota: "", tipe_kulit: "", masalah: [], budget: 0, hasil: JSON.parse(cached) });
      } else {
        setNotFound(true);
      }
      setLoading(false);
      return;
    }

    supabase.from("skin_analyses").select("*").eq("id", id).single().then(({ data: row, error }) => {
      if (error || !row) { setNotFound(true); }
      else { setData(row as Analysis); }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Menganalisis kondisi kulitmu...</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">😕</p>
          <h2 className="text-xl font-bold text-foreground">Hasil tidak ditemukan</h2>
          <p className="text-sm text-muted-foreground">Coba lakukan analisis lagi dari awal.</p>
          <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground">Mulai Analisis</Button>
        </div>
      </div>
    );
  }

  const h = data.hasil;
  const nama = data.nama || "Kamu";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs border-border gap-1.5" onClick={() => {
            if (navigator.share) navigator.share({ title: "Hasil Analisis JujurSkin", url: window.location.href });
          }}>
            <Share2 className="w-3.5 h-3.5" /> Bagikan
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
          <p className="text-xs text-primary uppercase tracking-widest mb-2">Hasil Analisis</p>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {nama}, ini rekomendasimu 🌿
          </h1>
          {data.kota && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5" /> {data.kota}
              {data.usia > 0 && <> · {data.usia} tahun</>}
              {data.tipe_kulit && <> · Kulit {data.tipe_kulit}</>}
            </div>
          )}
        </motion.div>

        {/* Skin Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Healthy Skin Score</p>
              <p className="text-xs text-muted-foreground">Potensi setelah ikuti rekomendasi ini</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-foreground">{h.score.total}</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="space-y-3">
            {(["uv_protection", "barrier", "hydration", "acne_control"] as const).map((key) => {
              const score = h.score[key];
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{scoreLabels[key]}</span>
                    <span className={`text-xs font-semibold ${scoreTextColors[key]}`}>{score}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div className={`h-full ${scoreColors[key]} rounded-full`}
                      initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <p className="text-sm text-foreground leading-relaxed">{h.summary}</p>
        </motion.div>

        {/* Disclaimer non-medis */}
        {h.disclaimer && (
          <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{h.disclaimer}</p>
          </div>
        )}

        {/* Fokus Utama (Prioritas masalah) */}
        {h.problem_priorities && h.problem_priorities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Fokus utama kulitmu (urut prioritas)</p>
            </div>
            <div className="space-y-2">
              {h.problem_priorities.map((p) => (
                <div key={p.rank} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    #{p.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">💡 Selesaikan bertahap dari #1 — tidak perlu beli semua sekaligus.</p>
          </motion.div>
        )}

        {/* Rekomendasi */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-sm font-semibold text-foreground mb-3">Rekomendasi untuk kamu:</p>
          <div className="space-y-3">
            {h.recs.map((rec, i) => {
              const productSuggs = getProductSuggestions(rec.category || rec.product, data.budget);
              const isOpen = expandedRec === i;
              return (
                <div key={i} className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {rec.priority}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{rec.product}</p>
                    </div>
                    <span className="text-xs text-accent font-medium shrink-0 whitespace-nowrap">
                      Rp {rec.price_min.toLocaleString("id")} – {rec.price_max.toLocaleString("id")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{rec.reason}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">{rec.frequency}</Badge>
                    {rec.examples.map((ex, j) => (
                      <Badge key={j} variant="outline" className="text-xs border-border text-muted-foreground">{ex}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-0">
                    <button
                      onClick={() => setExpandedRec(isOpen ? null : i)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {isOpen ? "Sembunyikan produk" : `Lihat produk${productSuggs.length > 0 ? ` (${productSuggs.length})` : ""} →`}
                    </button>
                    <span className="text-muted-foreground/30">·</span>
                    <button
                      onClick={() => router.push("/edukasi")}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary transition-colors"
                    >
                      <BookOpen className="w-3 h-3" /> Pelajari ingredient →
                    </button>
                  </div>

                  {/* Inline product suggestions */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" as const }}
                      className="mt-3 space-y-2"
                    >
                      {productSuggs.length > 0 ? (
                        <>
                          {productSuggs.map((prod) => (
                            <div key={prod.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-background/60 border border-border/50">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                                  {prod.bpom_registered && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-400/40 text-green-700 shrink-0">BPOM</Badge>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground">{prod.brand}</p>
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{prod.tagline}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-accent">Rp {prod.price_min.toLocaleString("id")}</p>
                                <p className="text-[10px] text-muted-foreground">– {prod.price_max.toLocaleString("id")}</p>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => router.push(`/produk`)}
                            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                          >
                            Lihat semua produk →
                          </button>
                        </>
                      ) : (
                        <div className="p-3 rounded-lg bg-background/60 border border-border/50 text-center">
                          <p className="text-xs text-muted-foreground">Belum ada produk spesifik di database untuk kategori ini.</p>
                          <button onClick={() => router.push("/produk")} className="text-xs text-primary hover:underline mt-1">
                            Cari di halaman produk →
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Estimasi waktu hasil */}
        {h.result_timeline && h.result_timeline.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Estimasi kapan hasil terlihat</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Skincare butuh konsistensi. Ekspektasi realistis = tidak mudah menyerah.</p>
            <div className="space-y-2.5">
              {h.result_timeline.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t.item}</p>
                    <p className="text-xs text-muted-foreground">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Peringatan over-treatment */}
        {h.overtreatment_warning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
            className="rounded-xl border border-yellow-500/40 bg-yellow-400/10 p-4"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-yellow-800" />
              <p className="text-xs font-semibold text-yellow-800">Waspada over-treatment</p>
            </div>
            <p className="text-xs text-yellow-900 leading-relaxed">{h.overtreatment_warning}</p>
          </motion.div>
        )}

        {/* Skip items */}
        {h.skips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-sm font-semibold text-foreground mb-3">Yang tidak perlu kamu beli:</p>
            <div className="space-y-2">
              {h.skips.map((skip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-destructive/15 bg-destructive/5">
                  <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-foreground">Skip: {skip.product}</p>
                      <span className="text-xs font-semibold text-accent shrink-0">Hemat ~Rp {skip.saving_estimate.toLocaleString("id")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{skip.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Budget summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="text-sm font-semibold text-foreground mb-4">Ringkasan Budget</p>
          <div className="space-y-2.5">
            {data.budget > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget bulanan</span>
                <span className="font-medium text-foreground">Rp {data.budget.toLocaleString("id")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimasi pengeluaran</span>
              <span className="font-medium text-foreground">Rp {h.budget_used.toLocaleString("id")}</span>
            </div>
            {h.skips.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Potensi hemat dari skip</span>
                <span className="font-medium text-accent">Rp {h.skips.reduce((acc, s) => acc + s.saving_estimate, 0).toLocaleString("id")}</span>
              </div>
            )}
            {data.budget > 0 && (
              <>
                <div className="border-t border-border pt-2.5 flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Sisa budget</span>
                  <span className="font-bold text-primary">Rp {h.budget_left.toLocaleString("id")}</span>
                </div>
              </>
            )}
          </div>

          {/* Budget Efficiency Score */}
          {typeof h.budget_efficiency === "number" && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Skor Efisiensi Budget</span>
                </div>
                <span className="text-sm font-bold text-primary">{h.budget_efficiency}/100</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${h.budget_efficiency}%` }} transition={{ duration: 1, delay: 0.4 }} />
              </div>
              {!!h.potential_saving && h.potential_saving > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Potensi hemat ~<span className="text-accent font-medium">Rp {h.potential_saving.toLocaleString("id")}</span> dengan tidak membeli produk yang tidak perlu.
                </p>
              )}
            </div>
          )}

          {/* Budget tiers */}
          {h.budget_tiers && h.budget_tiers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-2.5">Pilihan sesuai kantong (total estimasi/bulan)</p>
              <div className="space-y-2">
                {h.budget_tiers.map((t) => (
                  <div key={t.tier} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{t.tier}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{t.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-accent shrink-0 whitespace-nowrap">Rp {t.total.toLocaleString("id")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Climate tip */}
        {h.climate_tip && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-xl border border-accent/20 bg-accent/5 p-4"
          >
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-accent mb-1">Tips untuk {data.kota || "kotamu"}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{h.climate_tip}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lifestyle Notes */}
        {h.lifestyle_notes && h.lifestyle_notes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Info className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-primary">Catatan Personal</p>
            </div>
            <ul className="space-y-1.5">
              {h.lifestyle_notes.map((note, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Rekomendasi Edukatif */}
        {h.education && h.education.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.43 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Bukan cuma produk — ini yang membantu dari dalam</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Saran edukatif & umum, bukan diagnosis medis.</p>
            <div className="space-y-4">
              {h.education.map((sec, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-foreground mb-1.5">{sec.title}</p>
                  <ul className="space-y-1">
                    {sec.items.map((it, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                        <span className="leading-relaxed">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pregnancy Warnings */}
        {h.pregnancy_warnings && h.pregnancy_warnings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.43 }}
            className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Baby className="w-4 h-4 text-rose-700" />
              <p className="text-xs font-semibold text-rose-700">Perhatian Kehamilan / Menyusui</p>
            </div>
            <ul className="space-y-1.5">
              {h.pregnancy_warnings.map((w, i) => (
                <li key={i} className="text-xs text-rose-800 flex gap-2">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Eksplorasi lebih lanjut</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push("/produk")}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
            >
              <ShoppingBag className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Produk Indonesia</p>
                <p className="text-xs text-muted-foreground">25+ produk terkurasi</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/rutinitas")}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
            >
              <Repeat className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Rutinitas AM/PM</p>
                <p className="text-xs text-muted-foreground">Urutan produk optimal</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/edukasi")}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Edukasi Ingredient</p>
                <p className="text-xs text-muted-foreground">100+ ingredient dijelaskan</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }} className="space-y-3 pb-6">
          <Button onClick={() => router.push("/rutinitas")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Repeat className="w-4 h-4" /> Lihat Rutinitas AM/PM Saya
          </Button>
          <Button variant="outline" onClick={() => router.push("/analisis")} className="w-full border-border gap-2">
            <Sparkles className="w-4 h-4" /> Analisis Ulang
          </Button>
          <Button variant="outline" onClick={() => router.push("/feedback")} className="w-full border-border gap-2">
            <MessageSquare className="w-4 h-4" /> Beri Feedback
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-1">
            <CheckCircle className="w-3.5 h-3.5 text-primary/40" />
            Tidak ada iklan · Tidak terafiliasi brand apapun
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-5 pb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Bagikan ke teman</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Bantu teman kamu temukan skincare yang tepat — gratis dan jujur.</p>
          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hei! Aku baru analisis kondisi kulit di JujurSkin — platform skincare Indonesia yang jujur (bukan iklan).\n\nKulit ${data.tipe_kulit || "normal"} dengan skor kesehatan ${h.score.total}/100 setelah pakai rutinitas yang direkomendasikan.\n\nCoba sendiri gratis → https://jujurskin.vercel.app/analisis`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              <span className="text-lg">💬</span>
              <span className="text-xs font-medium text-green-700">WhatsApp</span>
            </a>
            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Baru analisis kondisi kulit di @JujurSkin — platform skincare Indonesia yang jujur, bukan iklan.\n\nSkor kulit ${data.tipe_kulit || ""}: ${h.score.total}/100 💚\n\nGratis → https://jujurskin.vercel.app/analisis`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
            >
              <span className="text-lg">🐦</span>
              <span className="text-xs font-medium text-sky-700">Twitter / X</span>
            </a>
            {/* Copy link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://jujurskin.vercel.app/analisis`).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              <span className={`text-xs font-medium ${copied ? "text-primary" : "text-muted-foreground"}`}>
                {copied ? "Tersalin!" : "Salin Link"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function HasilPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HasilContent />
    </Suspense>
  );
}
