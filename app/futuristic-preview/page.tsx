"use client";

/**
 * /futuristic-preview — HALAMAN PROTOTIPE TERPISAH (futuristik).
 * Demo arah UI baru pakai komponen 21st.dev (Aurora + Glass + Bento)
 * yang sudah diselaraskan ke brand JujurSkin (pink-peach beauty-tech).
 * TIDAK mengubah halaman / komponen aplikasi utama.
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  FlaskConical,
  Ban,
  Sparkles,
  Star,
  ArrowRight,
  Search,
} from "lucide-react";

import { PRODUCTS } from "@/lib/products";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

const PINK = "#FB4E78";

const rupiah = (n: number) =>
  "Rp" + n.toLocaleString("id-ID");

const FEATURED = PRODUCTS.filter((p) => p.image).slice(0, 6);

const FEATURES = [
  {
    icon: Shield,
    title: "Terverifikasi BPOM",
    desc: "Tiap produk dicek nomor registrasi resminya — bukan klaim sepihak.",
    span: "md:col-span-2",
  },
  {
    icon: FlaskConical,
    title: "INCI Asli",
    desc: "Komposisi dari kemasan & sumber resmi, bukan tebakan.",
    span: "",
  },
  {
    icon: Ban,
    title: "Tanpa Endorse",
    desc: "Tidak ada produk titipan. Yang jelek kami bilang jelek.",
    span: "",
  },
  {
    icon: Sparkles,
    title: "Analisis Kulit AI",
    desc: "Rekomendasi yang dihitung dari kondisi & iklim kulitmu.",
    span: "md:col-span-2",
  },
];

export default function FuturisticPreview() {
  return (
    <main className="min-h-screen bg-[#FFF7F9] text-slate-900">
      {/* ── HERO + AURORA ───────────────────────────── */}
      <AuroraBackground className="min-h-[88vh]">
        <div className="mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-sm font-medium text-[#FB4E78] backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" /> Skincare yang jujur, didukung data
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            Kebenaran kulitmu,
            <br />
            <span
              className="bg-gradient-to-r from-[#FB4E78] via-[#FF8FB1] to-[#A855F7] bg-clip-text text-transparent"
            >
              tanpa drama marketing.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg text-slate-600"
          >
            {PRODUCTS.length}+ produk diverifikasi BPOM &amp; INCI, dianalisis AI,
            tanpa endorse. JujurSkin bantu kamu pilih skincare berdasarkan fakta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              href="/analisis"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-200 transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: PINK }}
            >
              Analisis Kulitku
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur-md transition-colors hover:bg-white"
            >
              <Search className="h-5 w-5" /> Jelajahi Produk
            </Link>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* ── BENTO "KENAPA JUJUR" ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kenapa <span style={{ color: PINK }}>JujurSkin</span>?
          </h2>
          <p className="mt-3 text-slate-500">
            Empat prinsip yang bikin kami beda dari review skincare biasa.
          </p>
        </div>

        <BentoGrid>
          {FEATURES.map((f) => (
            <BentoCard key={f.title} className={f.span}>
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(251,78,120,0.1)", color: PINK }}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </BentoCard>
          ))}
        </BentoGrid>
      </section>

      {/* ── GLASS PRODUCT CARDS ──────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(255,176,138,0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Produk pilihan, <span style={{ color: PINK }}>terverifikasi</span>
            </h2>
            <p className="mt-3 text-slate-500">
              Foto resmi, harga nyata, rating komunitas — tanpa filter marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link href={`/produk/${p.id}`}>
                  <GlassCard className="group flex h-full flex-col overflow-hidden p-0 transition-transform hover:-translate-y-1">
                    <div className="relative aspect-[4/3] w-full bg-white/50">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#FB4E78] backdrop-blur-md">
                        {p.brand}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                        {p.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {p.tagline}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-sm font-bold text-slate-900">
                          {rupiah(p.price_min)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {p.rating_community.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-7 py-3.5 font-semibold text-slate-700 backdrop-blur-md transition-colors hover:bg-white"
            >
              Lihat semua {PRODUCTS.length} produk
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-pink-100 py-10 text-center text-sm text-slate-400">
        Prototipe UI futuristik · /futuristic-preview · komponen 21st.dev ×
        JujurSkin
      </footer>
    </main>
  );
}
