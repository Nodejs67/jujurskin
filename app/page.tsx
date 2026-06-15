"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState as useNavState } from "react";
import {
  Shield, TrendingDown, BookOpen, MapPin, AlertTriangle, Sparkles,
  ArrowRight, CheckCircle, XCircle, ChevronDown, Camera,
  FlaskConical, Brain, User, ShoppingBag, Menu, X, DollarSign, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── DATA ───────────────────────────────────────────────
const features = [
  { icon: TrendingDown, title: "Skincare Priority Engine", desc: "Dengan budget Rp 100.000, kami tunjukkan beli produk apa dulu — berdasarkan kondisi kulitmu.", color: "text-green-400", bg: "bg-green-400/10" },
  { icon: XCircle, title: "Produk Tidak Perlu Checker", desc: "Kami berani bilang jujur: 'Toner ini percuma karena serummu sudah punya fungsi yang sama.'", color: "text-amber-400", bg: "bg-amber-400/10" },
  { icon: Shield, title: "Safety Checker & BPOM", desc: "Cek keamanan produk dan status BPOM. Deteksi kandungan berbahaya seperti merkuri secara otomatis.", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: BookOpen, title: "Edukasi Ingredient", desc: "Pahami apa yang kamu oleskan ke kulit — penjelasan sederhana tanpa jargon medis.", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: MapPin, title: "Rekomendasi Berbasis Lokasi", desc: "Skincare di Kupang (UV 11) berbeda dengan di Bandung. Rekomendasiku menyesuaikan iklim kotamu.", color: "text-rose-400", bg: "bg-rose-400/10" },
  { icon: AlertTriangle, title: "Fake Claim Analyzer", desc: "'Memutihkan dalam 3 hari' — bohong. Kami analisis klaim marketing dan tunjukkan faktanya.", color: "text-orange-400", bg: "bg-orange-400/10" },
];

const compare = [
  { label: "Rekomendasikan produk terbanyak", us: false, them: true },
  { label: "Bilang 'produk ini tidak kamu butuhkan'", us: true, them: false },
  { label: "Berbasis data & ilmu pengetahuan", us: true, them: false },
  { label: "Iklan & endorsement berbayar", us: false, them: true },
  { label: "Menyesuaikan budget user", us: true, them: false },
  { label: "Cek keamanan produk (BPOM)", us: true, them: false },
  { label: "Mendorong standar kulit putih", us: false, them: true },
];

const steps = [
  { num: "01", title: "Ceritakan Kondisi Kulitmu", desc: "Isi questionnaire singkat — tipe kulit, masalah utama, budget, dan lokasi kamu." },
  { num: "02", title: "Dapat Rekomendasi Jujur", desc: "Kami analisis dan tunjukkan produk apa yang benar-benar kamu butuhkan, dalam urutan prioritas." },
  { num: "03", title: "Hemat & Konsisten", desc: "Track progres kulitmu, cek keamanan produk, dan bangun rutinitas yang benar-benar bekerja." },
];

const skinScoreBreakdown = [
  { label: "Barrier Health", score: 82, color: "bg-green-400", text: "text-green-400" },
  { label: "Hydration", score: 71, color: "bg-blue-400", text: "text-blue-400" },
  { label: "UV Protection", score: 55, color: "bg-yellow-400", text: "text-yellow-400" },
  { label: "Acne Control", score: 80, color: "bg-purple-400", text: "text-purple-400" },
];

const cities = [
  {
    name: "Medan", province: "Sumatera Utara", emoji: "☀️",
    humidity: 82, uv: 10, temp: 32,
    tips: ["Lightweight gel moisturizer", "Sunscreen SPF 50+ wajib", "Oil-control gentle cleanser"],
    warn: "UV Ekstrem", warnColor: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  {
    name: "Bandung", province: "Jawa Barat", emoji: "⛅",
    humidity: 60, uv: 8, temp: 22,
    tips: ["Moisturizer rich boleh dipakai", "SPF 30+ sudah cukup", "Hydrating toner sangat dianjurkan"],
    warn: "Fokus Hidrasi", warnColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    name: "Surabaya", province: "Jawa Timur", emoji: "🌤️",
    humidity: 70, uv: 9, temp: 30,
    tips: ["Water-based moisturizer", "Sunscreen SPF 40+ reapply siang", "Niacinamide untuk oil control"],
    warn: "UV Tinggi", warnColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
];

const conflictProducts = [
  { name: "Vitacid (Tretinoin 0.025%)", type: "Retinoid" },
  { name: "Retinol 0.5%", type: "Retinoid" },
  { name: "Exfoliating Toner (AHA 10%)", type: "Exfoliant" },
];

const vsGPT = [
  "Menyimpan riwayat kondisi kulitmu",
  "Tracking progress foto mingguan",
  "Mencatat budget & pengeluaran skincaremu",
  "Data iklim & UV real-time kotamu",
  "Riwayat produk yang pernah kamu gunakan",
  "Rekomendasi berubah sesuai perkembangan kulitmu",
  "Menghitung potensi penghematan bulananmu",
];

const NAV_LINKS = [
  { href: "#demo", label: "Demo" },
  { href: "/panduan", label: "Panduan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/produk", label: "Produk" },
  { href: "/cek-konflik", label: "Cek Konflik" },
];

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useNavState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">

      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">JujurSkin</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium">
              Mulai Gratis
            </Button>
            <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" as const }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
          {[...Array(14)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/25"
              style={{ top: `${8 + i * 6.5}%`, left: `${4 + i * 7}%` }}
              animate={{ opacity: [0.1, 0.7, 0.1], scale: [1, 1.6, 1] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 max-w-4xl mx-auto text-center" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 text-xs px-4 py-1.5 gap-1.5">
              <Sparkles className="w-3 h-3" /> Platform Kecantikan Jujur Indonesia
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
            Kulit Sehat,{" "}<span className="gradient-text">Bukan Kulit Putih</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Platform skincare pertama Indonesia yang{" "}
            <span className="text-foreground font-medium">jujur bilang apa yang tidak kamu butuhkan.</span>{" "}
            Rekomendasi berbasis kondisi kulit & budget — bukan iklan.
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground/60 mb-10">
            Untuk pria & wanita · Seluruh Indonesia · 100% Gratis
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-2 px-8">
              Analisis Kulit Saya <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary gap-2 px-8" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
              Lihat Demo <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: "29+", label: "Ingredient terdokumentasi" },
              { value: "30+", label: "Produk terkurasi" },
              { value: "3 dtk", label: "Waktu analisis" },
              { value: "100%", label: "Gratis selamanya" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-border/50 bg-card/50">
                <p className="text-2xl font-bold text-primary mb-0.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground/70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground/55">
            {["Tidak ada iklan berbayar", "Tidak terafiliasi brand apapun", "Data pribadimu aman", "Bahasa Indonesia"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary/50" /> {t}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground/30" />
        </motion.div>
      </section>

      {/* ── 1. DEMO HASIL ANALISIS ────────────────────── */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Contoh Nyata</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ini yang kamu dapat dari JujurSkin</h2>
            <p className="text-muted-foreground">Bukan sekedar tips umum — ini analisis spesifik untuk kondisi kulitmu.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Header profil */}
            <div className="bg-secondary/40 border-b border-border px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Sarah, 24 tahun</p>
                  <p className="text-xs text-muted-foreground">Surabaya · Kulit Kombinasi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-semibold text-accent">Rp 150.000</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Masalah</p>
                  <p className="font-semibold text-foreground">Jerawat + Bekas</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Hasil analisis */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Hasil Analisis</p>

                {[
                  { type: "ok", num: 1, product: "Sunscreen SPF 50+", price: "Rp 35.000", reason: "UV protection adalah fondasi. Tanpa ini, bekas jerawatmu tidak akan memudar." },
                  { type: "ok", num: 2, product: "Azelaic Acid 10%", price: "Rp 45.000", reason: "Efektif untuk jerawat ringan sekaligus memudakan bekas. Dua masalah, satu produk." },
                  { type: "ok", num: 3, product: "Gentle Cleanser", price: "Rp 25.000", reason: "Fondasi routine. Pilih yang tidak mengandung SLS untuk kulit kombinasimu." },
                  { type: "skip", product: "Brightening Toner baru", reason: "Niacinamide di moisturizermu sudah cukup. Fungsinya sama persis." },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${item.type === "ok" ? "bg-primary/5 border-primary/15" : "bg-destructive/5 border-destructive/15"}`}
                  >
                    {item.type === "ok"
                      ? <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      : <XCircle className="w-4 h-4 text-destructive/70 mt-0.5 shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-medium text-foreground">
                          {item.type === "ok" ? `Prioritas #${item.num} — ${item.product}` : `❌ Skip: ${item.product}`}
                        </p>
                        {item.type === "ok" && <span className="text-xs text-accent font-medium shrink-0">{item.price}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary card */}
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Ringkasan</p>

                <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total rekomendasi</span>
                    <span className="font-semibold text-foreground">3 produk</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimasi biaya</span>
                    <span className="font-semibold text-foreground">Rp 105.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sisa budget</span>
                    <span className="font-semibold text-primary">Rp 45.000 ✓</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">💰 Potensi penghematan</span>
                      <span className="font-bold text-accent text-lg">Rp 85.000</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Dari 1 produk yang tidak kamu butuhkan</p>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs text-primary font-medium mb-1">💡 Insight JujurSkin</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dengan 3 produk ini saja, kamu sudah mengatasi 90% masalah kulitmu. Tambahkan treatment lain setelah konsisten 1 bulan.
                  </p>
                </div>

                <Button onClick={() => router.push("/analisis")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Analisis Kulit Saya <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. HEALTHY SKIN SCORE ─────────────────────── */}
      <section id="score" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Healthy Skin Score</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Satu angka untuk kesehatan kulitmu</h2>
            <p className="text-muted-foreground">Bukan sekedar "kulitmu bagus/jelek" — tapi breakdown detail yang bisa kamu perbaiki.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Score ring */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-8 text-center"
            >
              <div className="relative w-44 h-44 mx-auto mb-6">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                  <motion.circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeLinecap="round" className="text-primary"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 76 / 100) }}
                    viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-5xl font-bold text-foreground"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                  >76</motion.span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Healthy Skin Score</h3>
              <p className="text-xs text-muted-foreground mb-4">Sarah · Update minggu lalu</p>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-xs">
                ↑ +8 dari bulan lalu
              </Badge>
            </motion.div>

            {/* Breakdown */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {skinScoreBreakdown.map((item, i) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className={`text-sm font-bold ${item.text}`}>{item.score}/100</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                    />
                  </div>
                  {item.score < 60 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ⚠️ Perlu perhatian — {item.label === "UV Protection" ? "rutin pakai sunscreen SPF 50+" : "tingkatkan rutinitas"}
                    </p>
                  )}
                </div>
              ))}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs text-primary font-medium mb-1">🎯 Tips untuk naik ke 85</p>
                <p className="text-xs text-muted-foreground">UV Protection kamu rendah (55). Mulai pakai sunscreen setiap pagi — ini akan langsung menaikkan score-mu.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. COST SAVING COUNTER ───────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Hemat Lebih Banyak</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Skincare yang lebih murah, hasil yang lebih baik</h2>
            <p className="text-muted-foreground">Rata-rata user JujurSkin menghemat ratusan ribu rupiah per bulan — tanpa mengorbankan kualitas.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: DollarSign, label: "Potensi penghematan bulan ini", value: "Rp 235.000", sub: "Dari 3 produk tidak perlu", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
              { icon: XCircle, label: "Produk yang tidak kamu butuhkan", value: "3 produk", sub: "Fungsinya sudah ada di produkmu", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
              { icon: Star, label: "Efisiensi routine", value: "89%", sub: "Setiap produk punya fungsi jelas", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`rounded-2xl border ${stat.border} bg-card p-6 text-center`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground/60">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Breakdown produk tidak perlu */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm font-medium text-foreground mb-4">Produk yang tidak kamu butuhkan bulan ini:</p>
            <div className="space-y-3">
              {[
                { name: "Brightening Toner Ms. Glow", reason: "Niacinamide-nya sama persis dengan moisturizermu", hemat: "Rp 75.000" },
                { name: "Eye Cream Wardah", reason: "Kulitmu 24 tahun, belum perlu eye cream. Moisturizer biasa sudah cukup", hemat: "Rp 95.000" },
                { name: "Vitamin C Serum (kedua)", reason: "Kamu sudah punya vitamin C di pagi hari. Dua serum vitamin C tidak perlu", hemat: "Rp 65.000" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-accent shrink-0">{item.hemat}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total bisa dihemat bulan ini</span>
              <span className="text-xl font-bold text-accent">Rp 235.000</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. PROGRESS TRACKING + BEFORE/AFTER ──────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Progress Tracking</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Lihat perubahan kulitmu setiap minggu</h2>
            <p className="text-muted-foreground">Fitur yang tidak bisa diberikan TikTok, influencer, atau ChatGPT.</p>
          </motion.div>

          {/* 3 foto progress */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { week: "Minggu 1", status: "Awal Perjalanan", detail: "Jerawat aktif 8 titik", gradient: "from-rose-950 via-red-900/40 to-amber-900/30", score: 52 },
              { week: "Minggu 4", status: "Mulai Membaik", detail: "Jerawat berkurang 50%", gradient: "from-amber-950 via-amber-800/30 to-yellow-900/20", score: 64 },
              { week: "Minggu 8", status: "Jauh Lebih Baik", detail: "Kulit merata & bersih", gradient: "from-green-950 via-emerald-900/30 to-teal-900/20", score: 76 },
            ].map((week, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border overflow-hidden bg-card"
              >
                <div className={`h-44 bg-gradient-to-br ${week.gradient} flex items-center justify-center relative`}>
                  <Camera className="w-10 h-10 text-white/20" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="text-xs border-white/20 text-white/60 bg-black/30">{week.week}</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/40 rounded-lg px-2 py-1">
                    <span className="text-xs font-bold text-white">{week.score}/100</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-foreground">{week.status}</p>
                  <p className="text-xs text-muted-foreground">{week.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Before vs After */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Before vs After — Minggu 1 vs Minggu 8</p>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">2 Bulan</Badge>
            </div>
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="h-52 bg-gradient-to-br from-rose-950 via-red-900/50 to-amber-900/40 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/15" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">Minggu 1</p>
                  <p className="text-white/60 text-xs">Jerawat aktif · Bekas hitam</p>
                </div>
              </div>
              <div className="relative border-l border-border">
                <div className="h-52 bg-gradient-to-br from-green-950 via-emerald-900/40 to-teal-900/30 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/15" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">Minggu 8</p>
                  <p className="text-white/60 text-xs">Jauh lebih merata & bersih</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/20 flex flex-wrap gap-4 justify-center">
              {[
                { label: "Acne visibility", value: "−34%", color: "text-primary" },
                { label: "Skin tone evenness", value: "+28%", color: "text-primary" },
                { label: "Healthy Skin Score", value: "52 → 76", color: "text-accent" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. CLIMATE INTELLIGENCE ──────────────────── */}
      <section id="iklim" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Climate Intelligence</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Skincare yang cocok di sana, belum tentu cocok di sini</h2>
            <p className="text-muted-foreground">Indonesia punya 17.000+ pulau dengan iklim yang sangat beragam. Rekomendasimu disesuaikan.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {cities.map((city, i) => (
              <motion.div key={city.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="glow-card rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{city.emoji}</span>
                      <h3 className="font-semibold text-foreground">{city.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{city.province}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${city.warnColor}`}>{city.warn}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Humidity", value: `${city.humidity}%` },
                    { label: "UV Index", value: city.uv },
                    { label: "Suhu", value: `${city.temp}°C` },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-secondary/50 p-2 text-center">
                      <p className="text-xs font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground/60">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Rekomendasi khusus:</p>
                  {city.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRODUCT CONFLICT CHECKER ──────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Conflict Checker</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Apakah produkmu aman dipakai bersamaan?</h2>
            <p className="text-muted-foreground">Banyak yang pakai produk bertentangan tanpa sadar — dan kulit mereka makin rusak karenanya.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Contoh Analisis:</p>
              <button onClick={() => router.push("/cek-konflik")} className="text-xs text-primary hover:underline">Coba sendiri →</button>
            </div>
            <div className="p-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Produk yang diinput:</p>
              <div className="flex flex-wrap gap-2">
                {conflictProducts.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-sm">
                    <FlaskConical className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-foreground font-medium text-xs">{p.name}</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-muted-foreground/20 text-muted-foreground">{p.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">Hasil Analisis:</p>

              {[
                { level: "danger", icon: "🚨", title: "Risiko Iritasi Tinggi", msg: "Vitacid + Retinol bersamaan = over-retinoid. Keduanya punya fungsi yang sama. Pilih salah satu saja — Vitacid lebih kuat.", color: "border-destructive/25 bg-destructive/8" },
                { level: "warning", icon: "⚠️", title: "Jangan Pakai Malam yang Sama", msg: "Retinoid + AHA (Exfoliating Toner) di malam yang sama meningkatkan risiko iritasi dan kerusakan skin barrier.", color: "border-yellow-400/25 bg-yellow-400/5" },
                { level: "info", icon: "💡", title: "Saran Jadwal Aman", msg: "Vitacid: Senin, Rabu, Jumat malam. AHA Toner: Selasa, Kamis malam. Hari lain: skip semua aktif, fokus moisturizer.", color: "border-primary/25 bg-primary/5" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${item.color}`}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.msg}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 7. KENAPA BUKAN CHATGPT? ─────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Kenapa Bukan AI Umum?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Kenapa tidak langsung pakai ChatGPT?</h2>
            <p className="text-muted-foreground">ChatGPT pintar, tapi tidak mengenalmu. JujurSkin dibangun khusus untuk kulitmu — dan mengingat semuanya.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ChatGPT */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Brain className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ChatGPT / AI Umum</p>
                  <p className="text-xs text-muted-foreground">Tiap sesi dimulai dari nol</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {vsGPT.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 text-destructive/50 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* JujurSkin */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-primary/25 bg-primary/5 p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">JujurSkin</p>
                  <p className="text-xs text-primary/70">Dibangun khusus untuk kulitmu</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {vsGPT.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-5 text-center"
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold text-accent">Intinya:</span>{" "}
              ChatGPT akan memberi saran skincare umum yang sama untuk semua orang.
              JujurSkin mengenal kondisi kulitmu, budgetmu, kotamu, dan perkembangan kulitmu dari waktu ke waktu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── EDUKASI + PRODUK ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Lebih dari Sekadar Rekomendasi</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Belajar, cari produk, analisis — semua di sini</h2>
            <p className="text-muted-foreground">Ekosistem lengkap untuk kamu yang ingin benar-benar paham skincare.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Edukasi Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glow-card rounded-2xl border border-border bg-card p-8 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Edukasi Ingredient</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Pahami 29+ ingredient skincare yang paling penting — cara kerja, cara pakai, apa yang bisa dikombinasikan, dan mitos yang harus dihapus. Dalam bahasa Indonesia yang sederhana.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Niacinamide", "Retinol", "BHA/AHA", "Vitamin C", "Ceramide"].map((i) => (
                  <Badge key={i} variant="outline" className="text-xs border-purple-400/20 text-purple-400/80 bg-purple-400/5">{i}</Badge>
                ))}
              </div>
              <Button variant="outline" onClick={() => router.push("/edukasi")} className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 gap-2">
                <BookOpen className="w-4 h-4" /> Buka Edukasi
              </Button>
            </motion.div>

            {/* Produk Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glow-card rounded-2xl border border-border bg-card p-8 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Produk Indonesia</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                30+ produk skincare lokal terkurasi berdasarkan ingredient — bukan popularitas. Semua sudah BPOM, ada info harga, dan penjelasan kenapa produk itu efektif.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Sunscreen", "Cleanser", "Moisturizer", "Serum", "Treatment"].map((c) => (
                  <Badge key={c} variant="outline" className="text-xs border-accent/20 text-accent/80 bg-accent/5">{c}</Badge>
                ))}
              </div>
              <Button variant="outline" onClick={() => router.push("/produk")} className="border-accent/30 text-accent hover:bg-accent/10 gap-2">
                <ShoppingBag className="w-4 h-4" /> Lihat Produk
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MASALAH ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 md:p-10"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Kenyataan yang sering terjadi</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-7">Kenapa kita beli skincare yang tidak kita butuhkan?</h2>
            <div className="grid md:grid-cols-2 gap-2.5">
              {["Beli karena influencer, bukan karena butuh", "Tidak paham kandungan produk yang dipakai", "Takut dianggap kurang cantik jika tidak ikut tren", "Menghabiskan uang untuk produk yang redundan", "Mengejar kulit putih, bukan kulit sehat", "Pakai produk berisiko tanpa sadar"].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                >
                  <XCircle className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-7 pt-7 border-t border-border">
              <p className="text-foreground font-medium">JujurSkin hadir untuk mengubah ini. <span className="text-primary">Dengan pendekatan yang sama sekali berbeda.</span></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FITUR ─────────────────────────────────────── */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Semua Fitur</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Semua yang kamu butuhkan, <span className="gradient-text">tidak lebih</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Setiap fitur dirancang untuk membantu kulitmu sehat dengan cara yang paling efisien.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="glow-card rounded-2xl border border-border bg-card p-6">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CARA KERJA ───────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Cara Kerja</p>
            <h2 className="text-3xl md:text-4xl font-bold">Sederhana dan langsung</h2>
          </motion.div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex gap-5 p-6 rounded-2xl border border-border bg-card"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERBANDINGAN ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Perbedaan Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Tidak seperti platform lain</h2>
            <p className="text-muted-foreground">Semua platform lain punya kepentingan komersial. Kami tidak.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-secondary/50 px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Fitur</span>
              <span className="text-center text-primary">JujurSkin</span>
              <span className="text-center">Platform Lain</span>
            </div>
            {compare.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="grid grid-cols-3 px-6 py-4 border-t border-border items-center hover:bg-secondary/20 transition-colors"
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <div className="flex justify-center">
                  {row.us ? <CheckCircle className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-muted-foreground/25" />}
                </div>
                <div className="flex justify-center">
                  {row.them ? <CheckCircle className="w-5 h-5 text-muted-foreground/35" /> : <XCircle className="w-5 h-5 text-destructive/45" />}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold">Pertanyaan yang sering ditanya</h2>
          </motion.div>
          <div className="space-y-3">
            {[
              {
                q: "Apakah JujurSkin benar-benar gratis?",
                a: "Ya, 100% gratis. Tidak ada biaya berlangganan, tidak ada fitur premium tersembunyi. Kami tidak punya model bisnis berbasis iklan atau komisi produk — kami dibuat untuk jujur.",
              },
              {
                q: "Data kulitku aman? Apakah disimpan?",
                a: "Data tersimpan secara anonim di database kami untuk meningkatkan akurasi rekomendasi. Kami tidak menjual atau berbagi data dengan pihak ketiga apapun.",
              },
              {
                q: "Mengapa rekomendasinya bisa berbeda dengan yang di marketplace?",
                a: "Karena rekomendasimu berdasarkan kondisi kulitmu yang spesifik — bukan yang paling laris atau yang bayar iklan terbesar. Kami justru akan bilang jika kamu tidak butuh produk tertentu.",
              },
              {
                q: "Apakah cocok untuk pria juga?",
                a: "Ya! Skin barrier, masalah jerawat, dan kebutuhan hidrasi tidak mengenal gender. Formulir analisis kami menyesuaikan rekomendasi untuk pria dan wanita.",
              },
              {
                q: "Seberapa akurat rekomendasinya?",
                a: "Akurasi bergantung pada seberapa lengkap data yang kamu isi. Rekomendasi kami berbasis literatur dermatologi dan tidak menggantikan konsultasi dokter kulit untuk kondisi medis serius.",
              },
              {
                q: "Ingredient conflict checker bekerja bagaimana?",
                a: "Kami mencocokkan nama ingredient yang kamu input dengan database 29+ ingredient dan mengecek konflik yang terdokumentasi secara ilmiah — seperti Retinol + AHA atau Benzoyl Peroxide + Retinol.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm font-semibold text-foreground mb-2">❓ {item.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-primary/20 bg-card p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-[60px]" />
            <div className="relative z-10">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 text-xs">Gratis Selamanya</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mulai rawat kulitmu <span className="gradient-text">dengan jujur</span></h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Tidak perlu kartu kredit. Tidak ada biaya tersembunyi. Tidak ada agenda untuk menyuruhmu beli lebih banyak.
              </p>
              <Button size="lg" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-2 px-10 h-12">
                Analisis Kulit Saya Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="mt-4 text-xs text-muted-foreground/60">Untuk pria & wanita · Seluruh Indonesia</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-semibold">JujurSkin</span>
              </div>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                Platform skincare pertama Indonesia yang jujur bilang apa yang tidak kamu butuhkan.
              </p>
            </div>

            {/* Fitur */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Fitur</p>
              <div className="space-y-2">
                {[
                  { label: "Analisis Kulit", href: "/analisis" },
                  { label: "Cek Konflik Ingredient", href: "/cek-konflik" },
                  { label: "Beri Feedback", href: "/feedback" },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="block text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Belajar */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Belajar</p>
              <div className="space-y-2">
                {[
                  { label: "Edukasi Ingredient", href: "/edukasi" },
                  { label: "Panduan Pemula", href: "/panduan" },
                  { label: "Produk Indonesia", href: "/produk" },
                  { label: "Budget Planner", href: "/kalkulator" },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="block text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Tentang */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Tentang</p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground/60">Tidak ada iklan</p>
                <p className="text-xs text-muted-foreground/60">Tidak terafiliasi brand</p>
                <p className="text-xs text-muted-foreground/60">Berbasis data & sains</p>
                <p className="text-xs text-muted-foreground/60">100% Gratis</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/40">© 2026 JujurSkin Indonesia</p>
            <p className="text-xs text-muted-foreground/40 text-center">Rekomendasi berbasis data & ilmu pengetahuan, bukan endorsement berbayar</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
