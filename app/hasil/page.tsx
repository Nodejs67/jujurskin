"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, Share2, MapPin, Sparkles, MessageSquare, BookOpen, ShoppingBag, Repeat, Baby, Info, Copy, Check, Clock, AlertTriangle, ListChecks, Wallet, GraduationCap, Sun, Moon, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { saveAnalysis } from "@/lib/supabase/account";
import type { AnalysisResult } from "@/lib/recommendations";
import { matchProducts, type ProductMatchResult, type RecTierLabel } from "@/lib/product-matcher";
import { ClimateWidget } from "@/components/climate-widget";

// Pencocokan produk 3-tier (Pilihan Jujur / Premium / Luxury) dari database
// asli via lib/product-matcher.ts — menggantikan filter naif lama.
function getTierMatches(
  recCategory: string,
  recProductName: string,
  data: Analysis,
  isPregnant: boolean
): ProductMatchResult {
  return matchProducts({
    recCategory,
    recProductName,
    skinType: data.tipe_kulit || undefined,
    concerns: data.masalah,
    budget: data.budget,
    pregnancySafe: isPregnant,
  });
}

// Gaya per tier untuk kartu rekomendasi produk.
const TIER_STYLE: Record<RecTierLabel, { ring: string; badge: string; dot: string }> = {
  jujur: { ring: "border-green-400/50 bg-green-50/40", badge: "bg-green-100 text-green-700 border-green-300", dot: "🟢" },
  premium: { ring: "border-blue-400/40 bg-blue-50/30", badge: "bg-blue-100 text-blue-700 border-blue-300", dot: "🔵" },
  luxury: { ring: "border-purple-400/40 bg-purple-50/30", badge: "bg-purple-100 text-purple-700 border-purple-300", dot: "🟣" },
};

// ── Logo brand asli (SVG inline, bukan emoji) untuk tombol berbagi ───────────
function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="#25D366" d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5z" />
      <path fill="#fff" d="M23.4 19.3c-.4-.2-2.3-1.1-2.6-1.3-.3-.1-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.3-.8.1-2.1-1-3.4-1.9-4.8-4.3-.4-.6.4-.6 1-1.9.1-.2 0-.4 0-.6 0-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.5 3.8 6 5.3 2.3 1 3.1.9 3.7.8.6-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="jsk-ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset=".25" stopColor="#FA7E1E" />
          <stop offset=".5" stopColor="#D62976" />
          <stop offset=".75" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#jsk-ig)" />
      <rect x="7" y="7" width="18" height="18" rx="5.5" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="16" cy="16" r="4.6" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="21.6" cy="10.4" r="1.5" fill="#fff" />
    </svg>
  );
}

function TikTokIcon({ className = "w-6 h-6" }: { className?: string }) {
  const note =
    "M21 4c.3 2.2 1.6 4 3.7 4.4v3.1c-1.3.1-2.6-.2-3.7-.8v6.4c0 3.6-2.9 6.5-6.5 6.5S8 20.7 8 17.1s2.9-6.5 6.5-6.5c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V4h3z";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d={note} fill="#25F4EE" transform="translate(-1,1)" />
      <path d={note} fill="#FE2C55" transform="translate(1,-1)" />
      <path d={note} fill="#000" />
    </svg>
  );
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
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [tierView, setTierView] = useState<"basic" | "sedang" | "lengkap">("lengkap");
  const { user } = useAuth();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSaveToAccount() {
    if (!data) return;
    if (!user) {
      router.push("/masuk?next=/hasil");
      return;
    }
    setSaveState("saving");
    const ok = await saveAnalysis(user.id, {
      hasil: data.hasil,
      tipe_kulit: data.tipe_kulit || undefined,
      usia: data.usia || undefined,
      kota: data.kota || undefined,
      budget: data.budget || undefined,
      masalah: data.masalah && data.masalah.length ? data.masalah : undefined,
    });
    setSaveState(ok ? "saved" : "error");
  }

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

    // Baca lewat server route (service role) — tabel skin_analyses dikunci RLS
    // sehingga tidak bisa di-dump massal oleh anon. Hanya baris dgn id ini.
    fetch(`/api/analisis?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not found"))))
      .then(({ row }) => {
        if (!row) throw new Error("empty");
        setData(row as Analysis);
        try { localStorage.setItem("jujurskin_hasil", JSON.stringify((row as Analysis).hasil)); } catch { /* abaikan */ }
      })
      .catch(() => {
        // Fallback ke localStorage agar hasil tidak hilang saat kembali dari halaman lain
        const cached = localStorage.getItem("jujurskin_hasil");
        if (cached) setData({ id: "local", nama: null, usia: 0, kota: "", tipe_kulit: "", masalah: [], budget: 0, hasil: JSON.parse(cached) });
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
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
  // Pengguna hamil/menyusui terdeteksi bila mesin menyertakan peringatan kehamilan.
  const isPregnant = (h.pregnancy_warnings?.length ?? 0) > 0;

  // Teks berbagi. WhatsApp menerima deep-link teks; Instagram & TikTok tidak
  // punya "share-link" web, jadi caption disalin lalu app dibuka untuk ditempel.
  const shareUrl = "https://jujurskin.com/analisis";
  const waText = `Hei! Aku baru analisis kondisi kulit di JujurSkin — platform skincare Indonesia yang jujur (bukan iklan).\n\nKulit ${data.tipe_kulit || "normal"} dengan skor kesehatan ${h.score.total}/100 setelah pakai rutinitas yang direkomendasikan.\n\nCoba sendiri gratis → ${shareUrl}`;
  const shareCaption = `Aku cek kondisi kulitku di JujurSkin — platform skincare Indonesia yang JUJUR, bukan iklan. Rekomendasinya based on kandungan & transparan (ada opsi murah sampai premium). Coba gratis → ${shareUrl}`;
  const shownRecs =
    tierView === "basic"
      ? h.recs.slice(0, Math.min(3, h.recs.length))
      : tierView === "sedang"
      ? h.recs.slice(0, Math.min(5, h.recs.length))
      : h.recs;

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

        {/* Simpan ke Akun */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-primary shrink-0" /> Simpan hasil ini ke akunmu
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user ? "Agar bisa dibuka lagi kapan saja dari perangkat mana pun." : "Masuk dulu untuk menyimpan & membuka kembali hasilmu lintas perangkat."}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSaveToAccount}
            disabled={saveState === "saving" || saveState === "saved"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 shrink-0"
          >
            {saveState === "saving" ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan</>)
              : saveState === "saved" ? (<><BookmarkCheck className="w-3.5 h-3.5" /> Tersimpan</>)
              : saveState === "error" ? (<>Coba lagi</>)
              : user ? (<><Bookmark className="w-3.5 h-3.5" /> Simpan</>)
              : (<>Masuk</>)}
          </Button>
        </div>

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
          <div className="flex items-center justify-between mb-5 gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Healthy Skin Score</p>
              <p className="text-xs text-muted-foreground">{h.score_current ? "Kondisi sekarang → potensi jika konsisten" : "Potensi setelah ikuti rekomendasi ini"}</p>
            </div>
            <div className="text-right shrink-0">
              {h.score_current ? (
                <div className="flex items-end gap-1.5">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-foreground">{h.score_current.total}</span>
                    <p className="text-[10px] text-muted-foreground -mt-0.5">sekarang</p>
                  </div>
                  <span className="text-muted-foreground text-lg pb-3">→</span>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{h.score.total}</span>
                    <p className="text-[10px] text-primary -mt-0.5">potensi</p>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-bold text-foreground">{h.score.total}</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {(["uv_protection", "barrier", "hydration", "acne_control"] as const).map((key) => {
              const pot = h.score[key];
              const curV = h.score_current ? h.score_current[key] : pot;
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{scoreLabels[key]}</span>
                    <span className={`text-xs font-semibold ${scoreTextColors[key]}`}>{h.score_current ? `${curV} → ${pot}` : pot}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden relative">
                    <motion.div className={`h-full ${scoreColors[key]} opacity-30 rounded-full absolute inset-y-0 left-0`}
                      initial={{ width: 0 }} animate={{ width: `${pot}%` }} transition={{ duration: 1, delay: 0.3 }} />
                    <motion.div className={`h-full ${scoreColors[key]} rounded-full absolute inset-y-0 left-0`}
                      initial={{ width: 0 }} animate={{ width: `${curV}%` }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
          {h.score_current && (
            <p className="text-[11px] text-muted-foreground mt-3">Bar terang = potensi; bar pekat = kondisi sekarang. Konsistensi 8–12 minggu mendekatkanmu ke potensi.</p>
          )}
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
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <p className="text-sm font-semibold text-foreground">Rekomendasi untuk kamu:</p>
            <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
              {([["basic", "Basic"], ["sedang", "Sedang"], ["lengkap", "Lengkap"]] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setTierView(v)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tierView === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {tierView === "basic"
              ? "Versi paling ringkas — esensial prioritas teratas saja."
              : tierView === "sedang"
              ? "Versi menengah — esensial + beberapa treatment penting."
              : "Versi lengkap — semua rekomendasi sesuai kondisimu."}{" "}
            Menampilkan {shownRecs.length} dari {h.recs.length} produk.
          </p>
          <div className="space-y-3">
            {shownRecs.map((rec, i) => {
              const match = getTierMatches(rec.category || rec.product, rec.product, data, isPregnant);
              const tiers = match.tiers;
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
                    {/* Daftar contoh teks hanya dipakai bila DB belum punya produk cocok */}
                    {tiers.length === 0 && rec.examples.map((ex, j) => (
                      <Badge key={j} variant="outline" className="text-xs border-border text-muted-foreground">{ex}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-0">
                    <button
                      onClick={() => setExpandedRec(isOpen ? null : i)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {isOpen ? "Sembunyikan produk" : `Lihat ${tiers.length > 0 ? `${tiers.length} pilihan` : "produk"} →`}
                    </button>
                    <span className="text-muted-foreground/30">·</span>
                    <a
                      href="/edukasi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary transition-colors"
                    >
                      <BookOpen className="w-3 h-3" /> Pelajari ingredient →
                    </a>
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
                      {tiers.length > 0 ? (
                        <>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-1">
                            Pilih sesuai kebutuhanmu — kandungan aktifnya setara. Yang lebih mahal kamu bayar untuk pengalaman, bukan hasil yang lebih baik.
                          </p>
                          {tiers.map((t) => {
                            const style = TIER_STYLE[t.tier];
                            const prod = t.product;
                            return (
                              <a key={prod.id} href={`/produk/${prod.id}`} target="_blank" rel="noopener noreferrer"
                                className={`block p-3 rounded-lg border ${style.ring} hover:brightness-[0.98] transition-all`}>
                                <div className="flex items-start gap-3 mb-1">
                                  <div className="w-14 h-14 rounded-lg bg-white border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                                    {prod.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={prod.image} alt={prod.name} loading="lazy" className="w-full h-full object-contain" />
                                    ) : (
                                      <span className="text-2xl">{prod.emoji}</span>
                                    )}
                                  </div>
                                  <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-semibold ${style.badge}`}>
                                        {style.dot} {t.tier_label}
                                      </Badge>
                                      {t.tier === "jujur" && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold bg-primary/10 text-primary border-primary/30">✓ Rekomendasi kami</Badge>
                                      )}
                                      {prod.bpom_registered && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-400/40 text-green-700 shrink-0">BPOM</Badge>
                                      )}
                                      {t.over_budget && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-400/50 text-amber-700 shrink-0">Di atas budget</Badge>
                                      )}
                                      <span className="text-[10px] text-muted-foreground">Aman {t.safety_score}/100</span>
                                    </div>
                                    <p className="text-xs font-semibold text-foreground">{prod.name}</p>
                                    <p className="text-[11px] text-muted-foreground">{prod.brand}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-accent">Rp {prod.price_min.toLocaleString("id")}</p>
                                    <p className="text-[10px] text-muted-foreground">– {prod.price_max.toLocaleString("id")}</p>
                                  </div>
                                  </div>
                                </div>
                                <p className="text-[11px] text-foreground/70 leading-relaxed mt-1.5">{t.honest_note}</p>
                              </a>
                            );
                          })}
                          <a
                            href="/produk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                          >
                            Lihat semua {match.total_matched} produk yang cocok →
                          </a>
                        </>
                      ) : (
                        <div className="p-3 rounded-lg bg-background/60 border border-border/50">
                          <p className="text-xs text-muted-foreground">
                            Belum ada produk yang cocok di database kami untuk langkah ini
                            {rec.examples.length > 0 ? `. Contoh yang bisa kamu cari: ${rec.examples.join(", ")}.` : "."}
                          </p>
                          <a href="/produk" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                            Cari di halaman produk →
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cara & urutan pemakaian (AM/PM) */}
        {((h.morning_routine && h.morning_routine.length > 0) || (h.night_routine && h.night_routine.length > 0)) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Repeat className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Cara & urutan pemakaian</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Urutan yang benar membuat tiap produk bekerja optimal. Perkenalkan produk aktif baru satu per satu (jeda 2–4 minggu).</p>

            {h.morning_routine && h.morning_routine.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sun className="w-4 h-4 text-yellow-700" />
                  <p className="text-sm font-semibold text-yellow-800">Pagi (AM)</p>
                </div>
                <div className="space-y-2.5">
                  {h.morning_routine.map((s) => (
                    <div key={s.order} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{s.order}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{s.product}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.why}</p>
                        {s.wait_before_next && <p className="text-[11px] text-primary mt-0.5">⏱ {s.wait_before_next}</p>}
                        {s.warning && <p className="text-[11px] text-yellow-800 mt-0.5">⚠️ {s.warning}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {h.night_routine && h.night_routine.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Moon className="w-4 h-4 text-indigo-700" />
                  <p className="text-sm font-semibold text-indigo-800">Malam (PM)</p>
                </div>
                <div className="space-y-2.5">
                  {h.night_routine.map((s) => (
                    <div key={s.order} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{s.order}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{s.product}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.why}</p>
                        {s.wait_before_next && <p className="text-[11px] text-primary mt-0.5">⏱ {s.wait_before_next}</p>}
                        {s.warning && <p className="text-[11px] text-yellow-800 mt-0.5">⚠️ {s.warning}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => router.push("/rutinitas")} className="text-xs text-primary hover:underline mt-4">
              Buka Routine Builder lengkap →
            </button>
          </motion.div>
        )}

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
              <p className="text-xs font-semibold text-foreground mb-1">Pilihan sesuai kantong (total estimasi/bulan)</p>
              <p className="text-[11px] text-muted-foreground mb-2.5">Harga lebih mahal ≠ lebih ampuh. Keampuhan dari bahan aktif & formulasi — yang mahal beda di tekstur, kenyamanan & brand. Pilih sesuai kantong & selera.</p>
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

        {/* Iklim real-time kotamu */}
        {data.kota && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
            <ClimateWidget defaultCity={data.kota} />
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

        {/* Treatment Opsional — saran upgrade, TIDAK wajib */}
        {h.optional_upgrades && h.optional_upgrades.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.435 }}
            className="rounded-2xl border border-accent/30 bg-accent/5 p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">Kalau ada budget lebih (opsional, tidak wajib)</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Rutinitas inti di atas sudah cukup. Ini cuma <strong>saran tambahan</strong> yang relevan dengan hasil analisis kamu — kami tidak menjual ini, dan kulitmu tetap sehat tanpanya.
            </p>
            <div className="space-y-3">
              {h.optional_upgrades.map((u, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3.5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-medium text-foreground">{u.title}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${u.type === "Klinik" ? "bg-blue-400/15 text-blue-700" : "bg-green-400/15 text-green-700"}`}>
                      {u.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{u.desc}</p>
                  <p className="text-xs font-medium text-accent">Estimasi: {u.est_cost}</p>
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
                <p className="text-xs text-muted-foreground">150+ produk terkurasi</p>
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
            {/* WhatsApp — share langsung lewat deep-link */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              <WhatsAppIcon />
              <span className="text-xs font-medium text-green-700">WhatsApp</span>
            </a>
            {/* Instagram — IG tak punya share-link web: salin caption + buka IG */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareCaption).then(() => {
                  setShareNote("Caption disalin! Buka Instagram → tempel di Stories/feed atau bio kamu.");
                  setTimeout(() => setShareNote(null), 5000);
                });
                window.open("https://www.instagram.com/", "_blank", "noopener");
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
            >
              <InstagramIcon />
              <span className="text-xs font-medium text-pink-700">Instagram</span>
            </button>
            {/* TikTok — sama: salin caption + buka TikTok */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareCaption).then(() => {
                  setShareNote("Caption disalin! Buka TikTok → tempel di caption atau bio kamu.");
                  setTimeout(() => setShareNote(null), 5000);
                });
                window.open("https://www.tiktok.com/", "_blank", "noopener");
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors"
            >
              <TikTokIcon />
              <span className="text-xs font-medium text-foreground">TikTok</span>
            </button>
          </div>
          {shareNote ? (
            <p className="text-[11px] text-primary mt-3 text-center leading-relaxed">{shareNote}</p>
          ) : (
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="flex items-center justify-center gap-1.5 mt-3 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Link tersalin!" : "Salin link"}
            </button>
          )}
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
