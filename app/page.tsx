"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Menu, X, ArrowRight, Check, ChevronRight, ChevronLeft,
  Shield, FlaskConical, Ban, Sparkles, Heart, Star, Upload,
  Droplet, Sun, Activity, Layers, ShieldCheck, Smile,
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

/** animasi reveal saat section masuk viewport (dipakai berulang) */
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/* ─────────────────────────────────────────────────────────────
   JujurSkin — Homepage redesign (pink-peach beauty-tech)
   Self-contained styling (tidak mengubah tema halaman lain).
   Foto digenerate lokal via ComfyUI (RTX 5080) -> /public/redesign
   Responsif: mobile-first, breakpoint sm/md/lg.
   ───────────────────────────────────────────────────────────── */

const PINK = "#FB4E78";

const NAV = [
  { label: "Analisis Kulit", href: "/analisis" },
  { label: "Produk", href: "/produk" },
  { label: "Edukasi", href: "/edukasi" },
  { label: "Komunitas", href: "/feedback" },
  { label: "Cek Produk", href: "/cek-bpom" },
  { label: "Simulasi", href: "/simulasi" },
];
const MORE = [
  { label: "Cek Konflik", href: "/cek-konflik" },
  { label: "Produk Tidak Perlu", href: "/tidak-perlu" },
  { label: "Bandingkan Produk", href: "/bandingkan-produk" },
  { label: "Kalkulator Budget", href: "/kalkulator" },
  { label: "Mitos vs Fakta", href: "/mitos-fakta" },
  { label: "Kamus Skincare", href: "/kamus" },
  { label: "Iklim & UV", href: "/iklim" },
  { label: "Rutinitas AM/PM", href: "/rutinitas" },
  { label: "Progress Kulit", href: "/progress" },
];

const TRUST = [
  { icon: ShieldCheck, title: "100% Gratis", sub: "Tanpa kartu kredit" },
  { icon: Shield, title: "Privasi Terjaga", sub: "Foto tak dikirim ke server" },
  { icon: FlaskConical, title: "Berdasarkan Evidence", sub: "Research-based" },
  { icon: Ban, title: "Tidak Ada Iklan", sub: "Bukan endorsement" },
];

const METRICS = [
  { label: "Skin Barrier", val: 85, icon: ShieldCheck, color: "#3b82f6" },
  { label: "Hydration", val: 78, icon: Droplet, color: "#06b6d4" },
  { label: "Acne Control", val: 65, icon: Activity, color: "#f43f5e" },
  { label: "UV Protection", val: 72, icon: Sun, color: "#f59e0b" },
  { label: "Anti-aging", val: 80, icon: Layers, color: "#a855f7" },
  { label: "Sensitivitas", val: 70, icon: Smile, color: "#ec4899" },
];

const STORIES = [
  { id: "dina", name: "Dina", age: 23, city: "Bekasi", from: 52, to: 84, weeks: 6 },
  { id: "rika", name: "Rika", age: 26, city: "Bandung", from: 48, to: 79, weeks: 8 },
  { id: "salsa", name: "Salsa", age: 21, city: "Surabaya", from: 60, to: 86, weeks: 10 },
  { id: "alya", name: "Alya", age: 24, city: "Jakarta", from: 55, to: 82, weeks: 7 },
];

const PRODUCTS = [
  { name: "CeraVe Foaming Cleanser", rating: 4.8, reviews: "2.1k", price: "89.000", cocok: "Acne, Berminyak", tidak: "Kulit Kering", tone: "from-sky-50 to-blue-50", best: true },
  { name: "The Ordinary Niacinamide 10%", rating: 4.7, reviews: "1.8k", price: "129.000", cocok: "Berminyak, Acne", tidak: "Sensitif", tone: "from-amber-50 to-orange-50" },
  { name: "Azarine Hydrasoothe SS", rating: 4.8, reviews: "1.3k", price: "75.000", cocok: "Semua Jenis Kulit", tidak: "—", tone: "from-rose-50 to-pink-50" },
  { name: "Skintific Ceramide Moist.", rating: 4.7, reviews: "980", price: "139.000", cocok: "Barrier Rusak", tidak: "Berminyak berat", tone: "from-teal-50 to-emerald-50" },
  { name: "Somethinc Niacinamide", rating: 4.6, reviews: "1.3k", price: "98.000", cocok: "Pori, Berminyak", tidak: "Sensitif", tone: "from-violet-50 to-purple-50" },
];

const DISCUSSIONS = [
  { name: "Naya", when: "2 jam lalu", q: "Kulit berjerawat cocok pakai apa ya?", tags: ["Jerawat", "Pemula"], ans: 24 },
  { name: "Ricky", when: "5 jam lalu", q: "Review jujur Azelaic Acid 10% dari pengalaman", tags: ["Review", "Azelaic Acid"], ans: 18 },
  { name: "Putri", when: "8 jam lalu", q: "Niacinamide bikin purging? Ini pengalaman aku", tags: ["Niacinamide", "Purging"], ans: 31 },
];

const EDU = [
  { t: "Cara Memperbaiki Skin Barrier", m: "5 menit baca", href: "/edukasi" },
  { t: "Kenali Urutan Skincare yang Benar", m: "7 menit baca", href: "/panduan" },
  { t: "Benarkah Pori Bisa Mengecil?", m: "6 menit baca", href: "/mitos-fakta" },
];

function ScoreRing({ value, size = 64, stroke = 6, color = PINK }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1E4E7" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* ── NAV ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-6 h-6" style={{ color: PINK }} fill={PINK} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">JujurSkin</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-slate-900 transition-colors">{l.label}</Link>
            ))}
            <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                Lainnya <ChevronRight className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-90" : ""}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full pt-3">
                  <div className="w-56 rounded-2xl border border-slate-100 bg-white shadow-xl p-2">
                    {MORE.map((m) => (
                      <Link key={m.href} href={m.href} className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-rose-50 hover:text-slate-900 transition-colors">{m.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button aria-label="Cari" className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            <Link href="/masuk" className="hidden sm:inline-flex items-center px-4 h-9 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors">Masuk</Link>
            <button onClick={() => router.push("/analisis")} className="inline-flex items-center px-4 sm:px-5 h-9 rounded-full text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: PINK }}>Mulai Gratis</button>
            <button aria-label="Menu" onClick={() => setMenu(!menu)} className="lg:hidden grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700">
              {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {menu && (
          <div className="lg:hidden border-t border-slate-100 bg-white max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3 grid grid-cols-2 gap-1">
              {[...NAV, ...MORE].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-rose-50">{l.label}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <AuroraBackground className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-bold tracking-wide shadow-sm" style={{ color: PINK }}>
              <Sparkles className="w-3.5 h-3.5" /> AI SKIN ANALYZER
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] tracking-tight text-slate-900">
              Berhenti beli skincare yang{" "}
              <span className="bg-gradient-to-r from-[#FB4E78] via-[#FF8FB1] to-[#A855F7] bg-clip-text text-transparent">tidak kamu butuhkan.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              AI menganalisis kondisi kulitmu dan memberi rekomendasi jujur, bukan rekomendasi yang dibayar brand.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => router.push("/analisis")} className="inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-semibold shadow-lg shadow-rose-200 transition-transform hover:scale-105" style={{ backgroundColor: PINK }}>
                Analisis Kulit Gratis <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.push("/analisis-foto")} className="inline-flex items-center px-6 h-12 rounded-full bg-white border border-slate-200 font-semibold text-slate-700 hover:border-slate-300 transition-colors">
                Lihat Demo
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["dina", "rika", "salsa", "alya"].map((p) => (
                  <span key={p} className="relative w-8 h-8 rounded-full ring-2 ring-white overflow-hidden bg-rose-100">
                    <Image src={`/redesign/${p}-after.jpg`} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">Ribuan</span> analisis kulit sudah dibuat</p>
            </div>
          </div>

          {/* Middle: photo */}
          <div className="lg:col-span-4 order-first lg:order-none">
            <div className="relative mx-auto max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-200/60 ring-1 ring-white/60">
              <Image src="/redesign/hero.jpg" alt="Analisis kulit JujurSkin" fill priority sizes="(max-width:1024px) 80vw, 360px" className="object-cover" />
            </div>
          </div>

          {/* Right: floating cards */}
          <div className="lg:col-span-3 space-y-3">
            <div className="rounded-2xl bg-white/55 backdrop-blur-md shadow-xl shadow-rose-200/40 border border-white/70 p-4 flex items-center gap-3">
              <div>
                <p className="text-xs text-slate-500">Healthy Skin Score</p>
                <p className="text-3xl font-extrabold text-slate-900 leading-none">82<span className="text-sm text-slate-400 font-semibold">/100</span></p>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">Kulitmu sehat</p>
              </div>
              <div className="ml-auto"><ScoreRing value={82} /></div>
            </div>
            <div className="rounded-2xl bg-white/55 backdrop-blur-md shadow-xl shadow-rose-200/40 border border-white/70 p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Masalah Utama</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {["Produksi minyak berlebih", "Bekas jerawat kemerahan", "Pori-pori terlihat"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PINK }} />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/55 backdrop-blur-md shadow-xl shadow-rose-200/40 border border-white/70 p-4">
              <p className="text-xs text-slate-500 mb-1">Rekomendasi Utama</p>
              <p className="text-sm font-semibold text-slate-800 leading-snug">Fokus perbaikan skin barrier dan kontrol minyak berlebih</p>
              <button onClick={() => router.push("/analisis")} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: PINK }}>Lihat detail <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-2xl bg-white/70 backdrop-blur border border-white shadow-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-rose-50">
            {TRUST.map((t) => (
              <div key={t.title} className="flex items-center gap-3 p-4">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-rose-50 shrink-0" style={{ color: PINK }}><t.icon className="w-4.5 h-4.5" /></span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{t.title}</p>
                  <p className="text-xs text-slate-500 truncate">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuroraBackground>

      {/* ── AI ANALYSIS SHOWCASE ────────────────────── */}
      <motion.section {...reveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* info */}
          <div className="lg:col-span-4">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: PINK }}>Analisis AI</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">Analisis kulit dalam <span style={{ color: PINK }}>30 detik</span></h2>
            <p className="mt-4 text-slate-600 leading-relaxed">Foto wajahmu dianalisis langsung di HP-mu, lalu AI memberi insight yang akurat — tanpa diagnosis berlebihan.</p>
            <ul className="mt-5 space-y-3">
              {["Deteksi 6 dimensi kulit", "Rekomendasi personal", "Tips & produk yang cocok"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-slate-700"><span className="grid place-items-center w-5 h-5 rounded-full text-white shrink-0" style={{ backgroundColor: PINK }}><Check className="w-3 h-3" /></span>{t}</li>
              ))}
            </ul>
            <button onClick={() => router.push("/analisis-foto")} className="mt-7 inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-semibold shadow-lg shadow-rose-200 hover:scale-105 transition-transform" style={{ backgroundColor: PINK }}>Coba Sekarang Gratis <ArrowRight className="w-4 h-4" /></button>
          </div>

          {/* upload demo */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-white p-4 shadow-sm">
              <p className="text-center text-xs font-bold mb-3" style={{ color: PINK }}>Upload foto wajah</p>
              <div className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-rose-100">
                <Image src="/redesign/ai-face.jpg" alt="Contoh analisis wajah" fill sizes="(max-width:1024px) 90vw, 340px" className="object-cover" />
                {/* mesh overlay */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(251,78,120,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(251,78,120,.4) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
              </div>
              <p className="text-center text-[11px] text-slate-400 mt-2">Dianalisis 100% di HP-mu — foto tidak pernah dikirim ke server</p>
              <button onClick={() => router.push("/analisis-foto")} className="mt-3 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full text-white font-semibold" style={{ backgroundColor: PINK }}><Upload className="w-4 h-4" /> Upload Foto</button>
            </div>
          </div>

          {/* results */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900 mb-3">Hasil Analisis</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-slate-500">Healthy Skin Score</span>
                <span className="ml-auto text-2xl font-extrabold text-slate-900">82<span className="text-xs text-slate-400 font-semibold">/100</span></span>
                <span className="text-xs font-semibold text-emerald-600">Bagus</span>
              </div>
              <div className="space-y-3">
                {METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center gap-2 mb-1">
                      <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                      <span className="text-xs text-slate-600">{m.label}</span>
                      <span className="ml-auto text-xs font-bold text-slate-800">{m.val}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-rose-50/70 p-3">
                <p className="text-xs font-bold mb-1" style={{ color: PINK }}>AI Insight</p>
                <p className="text-xs text-slate-600 leading-relaxed">Kulitmu tidak membutuhkan toner baru. Fokus pada perbaikan skin barrier dan kontrol minyak berlebih.</p>
                <button onClick={() => router.push("/hasil")} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: PINK }}>Lihat Rekomendasi <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── BEFORE / AFTER ──────────────────────────── */}
      <motion.section {...reveal} className="bg-gradient-to-b from-white to-rose-50/40 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: PINK }}>Hasil Nyata dari Pengguna</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">Perubahan yang bisa kamu lihat</h2>
              <p className="mt-2 text-slate-600 max-w-xl">Pengguna kami merasakan hasilnya dengan rekomendasi yang tepat — bukan dengan beli lebih banyak produk.</p>
            </div>
            <Link href="/progress" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: PINK }}>Lihat Semua Cerita <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {STORIES.map((s) => (
              <div key={s.id} className="snap-start shrink-0 w-[78%] sm:w-auto rounded-2xl bg-white border border-rose-50 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1 transition-all">
                <div className="grid grid-cols-2">
                  {(["before", "after"] as const).map((k) => (
                    <div key={k} className="relative aspect-[3/4]">
                      <Image src={`/redesign/${s.id}-${k}.jpg`} alt={`${s.name} ${k}`} fill sizes="(max-width:640px) 40vw, 160px" className="object-cover" />
                      <span className={`absolute top-2 ${k === "before" ? "left-2 bg-slate-900/60" : "right-2"} text-[10px] font-bold text-white px-1.5 py-0.5 rounded`} style={k === "after" ? { backgroundColor: PINK } : {}}>{k === "before" ? "Before" : "After"}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{s.name} · {s.age} th</p>
                    <p className="text-sm font-extrabold" style={{ color: PINK }}>{s.from} → {s.to}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.city} · {s.weeks} minggu</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PRODUCT RECOMMENDATIONS ─────────────────── */}
      <motion.section {...reveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: PINK }}>Produk yang Benar-benar Kamu Butuhkan</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">Rekomendasi produk untukmu</h2>
          </div>
          <Link href="/produk" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: PINK }}>Lihat Semua Produk <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="snap-start shrink-0 w-[62%] sm:w-auto rounded-2xl bg-white/80 backdrop-blur-sm border border-rose-100/70 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1 transition-all flex flex-col">
              <div className={`relative aspect-square bg-gradient-to-br ${p.tone} grid place-items-center`}>
                {p.best && <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: PINK }}>BEST MATCH</span>}
                <Droplet className="w-10 h-10 text-slate-300" />
                <Heart className="absolute top-2 right-2 w-4 h-4 text-slate-300" />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{p.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-700">{p.rating}</span>
                  <span className="text-xs text-slate-400">({p.reviews})</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 mt-1">Rp {p.price}</p>
                <div className="mt-2 space-y-1 text-[11px]">
                  <p className="text-emerald-700"><Check className="w-3 h-3 inline -mt-0.5" /> Cocok: {p.cocok}</p>
                  <p className="text-rose-600"><X className="w-3 h-3 inline -mt-0.5" /> Tidak cocok: {p.tidak}</p>
                </div>
                <button onClick={() => router.push("/produk")} className="mt-3 h-9 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── COMMUNITY + EDUKASI ─────────────────────── */}
      <motion.section {...reveal} className="bg-gradient-to-b from-rose-50/40 to-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: PINK }}>Komunitas JujurSkin</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Tempat berbagi, bertanya, dan belajar bersama.</h2>
            <button onClick={() => router.push("/feedback")} className="mt-5 inline-flex items-center gap-2 px-5 h-11 rounded-full text-white font-semibold" style={{ backgroundColor: PINK }}>Gabung Komunitas</button>
          </div>

          <div className="lg:col-span-6 grid sm:grid-cols-3 gap-4">
            {DISCUSSIONS.map((d) => (
              <div key={d.name} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-rose-100 text-xs font-bold" style={{ color: PINK }}>{d.name[0]}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{d.name}</p>
                    <p className="text-[10px] text-slate-400">{d.when}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{d.q}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {d.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">{t}</span>)}
                </div>
                <p className="text-xs text-slate-400 mt-2">{d.ans} jawaban</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Edukasi Pilihan</p>
            <div className="space-y-2">
              {EDU.map((e) => (
                <Link key={e.t} href={e.href} className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 p-3 hover:border-rose-200 transition-colors">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-rose-50 shrink-0" style={{ color: PINK }}><Sparkles className="w-4 h-4" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{e.t}</p>
                    <p className="text-[11px] text-slate-400">{e.m}</p>
                  </div>
                </Link>
              ))}
              <Link href="/artikel" className="inline-flex items-center gap-1 text-sm font-semibold mt-1" style={{ color: PINK }}>Lihat Semua Artikel <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA BANNER ──────────────────────────────── */}
      <motion.section {...reveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFE5EC] via-[#FFEDEA] to-[#FFE0E8] p-8 lg:p-12 grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Mulai rawat kulitmu dengan jujur.</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["Gratis selamanya", "Analisis 30 detik", "Tanpa kartu kredit"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: PINK }} /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row lg:justify-end items-start sm:items-center gap-4">
            <button onClick={() => router.push("/analisis")} className="inline-flex items-center gap-2 px-7 h-13 py-3 rounded-full text-white font-semibold shadow-lg shadow-rose-200 hover:scale-105 transition-transform" style={{ backgroundColor: PINK }}>
              Analisis Kulit Saya Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" style={{ color: PINK }} fill={PINK} />
              <span className="text-lg font-extrabold text-slate-900">JujurSkin</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Platform skincare pertama Indonesia yang jujur bilang apa yang tidak perlu kamu beli.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-3">Fitur</p>
            <ul className="space-y-2 text-sm text-slate-500">
              {[["Analisis Kulit", "/analisis"], ["Rutinitas AM/PM", "/rutinitas"], ["Progress Kulit", "/progress"], ["Cek Konflik", "/cek-konflik"], ["Produk Tidak Perlu", "/tidak-perlu"], ["Beri Feedback", "/feedback"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-3">Belajar</p>
            <ul className="space-y-2 text-sm text-slate-500">
              {[["Edukasi Ingredient", "/edukasi"], ["Panduan Pemula", "/panduan"], ["Produk Indonesia", "/produk"], ["Budget Planner", "/kalkulator"], ["Kamus Skincare", "/kamus"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-3">Tentang</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Tidak ada iklan</li>
              <li>Tidak terafiliasi brand</li>
              <li>Berbasis data & sains</li>
              <li><Link href="/kebijakan" className="hover:text-slate-900 transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>© 2026 JujurSkin Indonesia</p>
            <p>Rekomendasi berbasis ilmu pengetahuan, bukan endorsement berbayar.</p>
          </div>
        </div>
      </footer>

      {/* ── Floating mascot ─────────────────────────── */}
      <button onClick={() => router.push("/analisis-foto")} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group" aria-label="JujurAI">
        <span className="hidden sm:block rounded-2xl bg-white shadow-lg border border-rose-50 px-3 py-2 text-xs text-slate-600">Hai! Aku <span className="font-bold" style={{ color: PINK }}>JujurAI</span></span>
        <span className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-white bg-rose-100 group-hover:scale-110 transition-transform">
          <Image src="/redesign/mascot.jpg" alt="JujurAI" fill sizes="56px" className="object-cover" />
        </span>
      </button>
    </main>
  );
}
