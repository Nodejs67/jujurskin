"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, AlertTriangle, CheckCircle, Clock, ArrowLeft,
  Repeat, Wallet, Heart, Sparkles, ChevronDown, ChevronUp,
  Baby, Zap, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { AnalysisResult, RoutineStep } from "@/lib/recommendations";
import { ReminderSetup } from "@/components/reminder-setup";

type RoutineMode = "pagi" | "malam";

function RoutineStepCard({ step, index }: { step: RoutineStep; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="relative"
    >
      {/* Connector line */}
      <div className="absolute left-5 top-12 bottom-0 w-px bg-border/60 pointer-events-none" />

      <div className="flex gap-3">
        {/* Step number bubble */}
        <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{step.order}</span>
        </div>

        {/* Card */}
        <div className="flex-1 mb-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full text-left p-3.5 flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{step.product}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.category}</p>
              {step.warning && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-400 font-medium">{step.warning}</p>
                </div>
              )}
            </div>
            {open ? <ChevronUp className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                   : <ChevronDown className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3.5 pb-3.5 pt-0 border-t border-border/40 mt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">{step.why}</p>
                  {step.wait_before_next && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-primary/80">
                      <Clock className="w-3 h-3" />
                      <span>{step.wait_before_next} sebelum langkah berikutnya</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function RutinitasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasil, setHasil] = useState<AnalysisResult | null>(null);
  const [mode, setMode] = useState<RoutineMode>("pagi");
  const [loading, setLoading] = useState(true);
  const [namaUser, setNamaUser] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      const id = searchParams.get("id");
      if (id && supabase) {
        try {
          const { data } = await supabase.from("analyses").select("hasil, nama").eq("id", id).single();
          if (data?.hasil) {
            setHasil(data.hasil as AnalysisResult);
            setNamaUser(data.nama ?? "");
            setLoading(false);
            return;
          }
        } catch { /* fallback */ }
      }
      const local = localStorage.getItem("jujurskin_hasil");
      if (local) {
        try { setHasil(JSON.parse(local) as AnalysisResult); } catch { /* invalid */ }
      }
      setLoading(false);
    }
    loadData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat rutinitas...</p>
        </div>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Repeat className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold mb-2">Belum Ada Analisis</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Lakukan analisis kulit terlebih dahulu untuk mendapatkan rutinitas perawatan yang dipersonalisasi.
          </p>
          <Button onClick={() => router.push("/analisis")} className="w-full">
            Mulai Analisis Kulit
          </Button>
        </div>
      </div>
    );
  }

  const currentRoutine = mode === "pagi" ? hasil.morning_routine : hasil.night_routine;
  const hasWarnings = hasil.pregnancy_warnings && hasil.pregnancy_warnings.length > 0;
  const hasLifestyleNotes = hasil.lifestyle_notes && hasil.lifestyle_notes.length > 0;

  // Budget breakdown
  const totalBudget = hasil.budget_used + hasil.budget_left;
  const budgetPct = totalBudget > 0 ? Math.round((hasil.budget_used / totalBudget) * 100) : 0;

  // Conflicts detection from skips
  const conflicts = hasil.skips.filter(s => s.reason.toLowerCase().includes("konflik") || s.reason.toLowerCase().includes("tumpang"));
  const unnecessary = hasil.skips.filter(s => !conflicts.includes(s));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Rutinitas{namaUser ? ` ${namaUser}` : ""}</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6 w-full space-y-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Repeat className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-base">Rutinitas Perawatan Kulit</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dibuat berdasarkan analisis kulit{namaUser ? ` ${namaUser}` : ""} — urutan yang benar agar setiap produk bekerja optimal.
          </p>
        </motion.div>

        {/* Pregnancy Warning */}
        {hasWarnings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-rose-500/40 bg-rose-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Baby className="w-4 h-4 text-rose-400" />
              <p className="text-sm font-semibold text-rose-400">Perhatian Kehamilan/Menyusui</p>
            </div>
            <ul className="space-y-1">
              {hasil.pregnancy_warnings.map((w, i) => (
                <li key={i} className="text-xs text-rose-300 flex gap-2">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* AM / PM Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("pagi")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
              mode === "pagi"
                ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                : "border-border/60 text-muted-foreground hover:border-amber-500/30"
            }`}
          >
            <Sun className="w-4 h-4" />
            Pagi (AM)
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {hasil.morning_routine.length} langkah
            </Badge>
          </button>
          <button
            onClick={() => setMode("malam")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
              mode === "malam"
                ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                : "border-border/60 text-muted-foreground hover:border-indigo-500/30"
            }`}
          >
            <Moon className="w-4 h-4" />
            Malam (PM)
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {hasil.night_routine.length} langkah
            </Badge>
          </button>
        </div>

        {/* Routine Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`rounded-xl border p-4 mb-4 ${
              mode === "pagi"
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-indigo-500/20 bg-indigo-500/5"
            }`}>
              <div className="flex items-center gap-2">
                {mode === "pagi"
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-indigo-400" />}
                <p className={`text-sm font-semibold ${mode === "pagi" ? "text-amber-400" : "text-indigo-400"}`}>
                  {mode === "pagi" ? "Rutinitas Pagi — Setelah Bangun Tidur" : "Rutinitas Malam — Sebelum Tidur"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {mode === "pagi"
                  ? "Fokus perlindungan dari lingkungan dan UV"
                  : "Fokus repair, regenerasi, dan anti-aging"}
              </p>
            </div>

            {currentRoutine.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada langkah khusus untuk sesi ini.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {currentRoutine.map((step, i) => (
                  <RoutineStepCard key={`${mode}-${i}`} step={step} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <p className="font-semibold text-sm">Alokasi Budget</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Digunakan</span>
              <span>Sisa</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetPct}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-primary">
                Rp {hasil.budget_used.toLocaleString("id-ID")}
              </span>
              <span className="text-emerald-400 font-semibold">
                +Rp {hasil.budget_left.toLocaleString("id-ID")} hemat
              </span>
            </div>
          </div>
        </motion.div>

        {/* Unnecessary / Skip */}
        {unnecessary.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-semibold text-amber-400">Produk yang Bisa Dilewati</p>
            </div>
            <div className="space-y-2.5">
              {unnecessary.map((skip, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{skip.product}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{skip.reason}</p>
                    {skip.saving_estimate > 0 && (
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        Hemat ±Rp {skip.saving_estimate.toLocaleString("id-ID")}/bulan
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lifestyle Notes */}
        {hasLifestyleNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border/60 bg-card/80 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Catatan Gaya Hidup</p>
            </div>
            <ul className="space-y-2">
              {hasil.lifestyle_notes.map((note, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Tips Membangun Rutinitas</p>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span>Mulai dengan <strong className="text-foreground">3 produk dasar</strong> (cleanser, moisturizer, SPF) dan tambahkan aktif satu per satu setiap 2 minggu.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span>Urutkan produk dari yang paling tipis ke paling tebal — toner → serum → gel → krim → oil.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span>Jika ada beberapa produk baru, <strong className="text-foreground">tunggu 2 minggu</strong> sebelum menambah produk lain agar bisa identify reaksi.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span>SPF harus jadi <strong className="text-foreground">langkah terakhir</strong> di pagi hari, SETELAH semua skincare meresap.</span>
            </li>
          </ul>
        </motion.div>

        {/* Climate Note */}
        {hasil.climate_tip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="rounded-xl border border-border/60 bg-card/50 p-4"
          >
            <div className="flex gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-rose-400 mb-1">Tip Khusus Iklim & Kota Kamu</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{hasil.climate_tip}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reminder */}
        <ReminderSetup />

        {/* CTA */}
        <div className="flex gap-3 pb-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/hasil")}
          >
            Lihat Rekomendasi
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push("/analisis")}
          >
            Analisis Ulang
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function RutinitasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <RutinitasContent />
    </Suspense>
  );
}
