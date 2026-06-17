"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, LogOut, Mail, Calendar, Loader2, Repeat, TrendingUp, FlaskConical,
  Heart, Wallet, ShieldCheck, ListChecks, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import type { AnalysisResult } from "@/lib/recommendations";

const QUICK_LINKS = [
  { href: "/analisis", icon: Sparkles, label: "Analisis Kulit", desc: "Mulai atau ulangi analisis" },
  { href: "/rutinitas", icon: Repeat, label: "Rutinitas", desc: "Lihat rutinitas AM/PM kamu" },
  { href: "/progress", icon: TrendingUp, label: "Progress", desc: "Jurnal & foto perkembangan kulit" },
  { href: "/tidak-perlu", icon: FlaskConical, label: "Cek Produk Tidak Perlu", desc: "Hemat dari produk mubazir" },
];

type ProgressEntry = {
  kondisi_jerawat: number;
  kelembapan: number;
  kecerahan: number;
  iritasi: number;
};

function progressScore(e: ProgressEntry) {
  return Math.round(((e.kondisi_jerawat + e.kelembapan + e.kecerahan + e.iritasi) / 4) * 10);
}

export default function AkunPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [hasil, setHasil] = useState<AnalysisResult | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/masuk?next=/akun");
  }, [loading, user, router]);

  useEffect(() => {
    try {
      const h = localStorage.getItem("jujurskin_hasil");
      if (h) setHasil(JSON.parse(h));
      const p = localStorage.getItem("jujurskin_progress");
      if (p) setEntries(JSON.parse(p));
    } catch {
      /* abaikan data rusak */
    }
  }, []);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  const nama = (user.user_metadata?.full_name as string)?.trim() || "Pengguna JujurSkin";
  const initial = nama.charAt(0).toUpperCase();
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const skinScore = hasil?.score?.total ?? null;
  const budgetScore = typeof hasil?.budget_efficiency === "number" ? hasil.budget_efficiency : null;
  const progScore = latestEntry ? progressScore(latestEntry) : null;

  const scoreCards = [
    { label: "Healthy Skin", value: skinScore, icon: Heart, suffix: "/100", href: "/analisis", cta: "Analisis dulu" },
    { label: "Efisiensi Budget", value: budgetScore, icon: Wallet, suffix: "/100", href: "/analisis", cta: "Analisis dulu" },
    { label: "Progress Kulit", value: progScore, icon: TrendingUp, suffix: "/100", href: "/progress", cta: "Catat dulu" },
    { label: "Keamanan Produk", value: null, icon: ShieldCheck, suffix: "/100", href: "/produk", cta: "Segera (Phase 4)" },
  ];

  const timeline = [
    { week: "Minggu 0", title: "Analisis awal", done: !!hasil },
    { week: "Minggu 4", title: "Catat progres + foto", done: entries.length >= 1 },
    { week: "Minggu 8", title: "Evaluasi perubahan", done: entries.length >= 2 },
    { week: "Minggu 12", title: "Bandingkan before/after", done: entries.length >= 3 },
  ];

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
        {/* Profil */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{nama}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" /> Bergabung {joined}
            </p>
          </div>
        </motion.div>

        {/* Dashboard Skor */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Dashboard kamu</h2>
          <div className="grid grid-cols-2 gap-3">
            {scoreCards.map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <c.icon className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
                {c.value !== null ? (
                  <p className="text-2xl font-bold text-foreground">
                    {c.value}
                    <span className="text-sm text-muted-foreground font-normal">{c.suffix}</span>
                  </p>
                ) : (
                  <Link href={c.href} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    {c.cta} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan analisis terakhir */}
        {hasil?.problem_priorities && hasil.problem_priorities.length > 0 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Fokus utama dari analisis terakhir</p>
            </div>
            <div className="space-y-2">
              {hasil.problem_priorities.map((p) => (
                <div key={p.rank} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                    {p.rank}
                  </span>
                  <span className="text-sm text-foreground">{p.title}</span>
                </div>
              ))}
            </div>
            <Link href="/hasil" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-3">
              Lihat hasil lengkap <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Skin Health Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Skin Health Timeline</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Perubahan kulit butuh waktu. Ikuti milestone ini agar progresmu terukur.</p>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.done ? "bg-primary text-primary-foreground" : "bg-secondary border border-border"}`}>
                  {t.done && <span className="text-[10px]">✓</span>}
                </div>
                <div>
                  <p className={`text-sm font-medium ${t.done ? "text-foreground" : "text-muted-foreground"}`}>{t.week}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Akses cepat */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <l.icon className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Catatan sinkron */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-sm text-foreground font-medium mb-1">Tentang data dashboard</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Skor di atas dibaca dari analisis & progress yang tersimpan di perangkat ini. Sinkronisasi otomatis lintas
            perangkat (HP ↔ laptop) sedang kami siapkan.
          </p>
        </div>

        <Button variant="outline" onClick={handleSignOut} className="w-full gap-2">
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </div>
    </main>
  );
}
