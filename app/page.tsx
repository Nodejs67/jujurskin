"use client";

import { motion, type Variants } from "framer-motion";
import { Shield, TrendingDown, BookOpen, MapPin, AlertTriangle, Sparkles, ArrowRight, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: TrendingDown,
    title: "Skincare Priority Engine",
    desc: "Dengan budget Rp 100.000, kami tunjukkan beli produk apa dulu — berdasarkan kondisi kulitmu, bukan iklan.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: XCircle,
    title: "Produk Tidak Perlu Checker",
    desc: "Kami berani bilang jujur: 'Toner ini percuma karena serummu sudah punya fungsi yang sama. Hemat Rp 80.000.'",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Shield,
    title: "Safety Checker & BPOM",
    desc: "Cek keamanan produk dan status BPOM sebelum kamu pakai. Termasuk deteksi kandungan berbahaya seperti merkuri.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: BookOpen,
    title: "Edukasi Ingredient",
    desc: "Pahami apa yang kamu oleskan ke kulit. Penjelasan sederhana tanpa jargon — untuk semua level pemahaman.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: MapPin,
    title: "Rekomendasi Berbasis Lokasi",
    desc: "Skincare di Kupang (UV 11) berbeda dengan di Bandung. Rekomendasiku menyesuaikan cuaca & iklim kotamu.",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    icon: AlertTriangle,
    title: "Fake Claim Analyzer",
    desc: "'Memutihkan dalam 3 hari' — bohong. Kami analisis klaim marketing dan tunjukkan mana yang menyesatkan.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
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

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">JujurSkin</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-foreground transition-colors">Cara Kerja</a>
            <a href="#perbedaan" className="hover:text-foreground transition-colors">Perbedaan Kami</a>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium">
            Mulai Gratis
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{ top: `${10 + i * 7.5}%`, left: `${5 + i * 8}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 max-w-4xl mx-auto text-center" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 text-xs font-medium px-4 py-1.5 gap-1.5">
              <Sparkles className="w-3 h-3" />
              Platform Kecantikan Jujur Indonesia
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            Kulit Sehat,{" "}
            <span className="gradient-text">Bukan Kulit Putih</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Platform skincare pertama Indonesia yang{" "}
            <span className="text-foreground font-medium">jujur bilang apa yang tidak kamu butuhkan.</span>{" "}
            Rekomendasi berbasis kondisi kulitmu dan budgetmu — bukan iklan.
          </motion.p>

          <motion.p variants={fadeUp} className="text-sm text-muted-foreground/70 mb-10">
            Untuk pria & wanita · Seluruh Indonesia · 100% Gratis
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-2 px-8">
              Analisis Kulit Saya
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-2 px-8">
              Lihat Cara Kerja
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/60">
            {["Tidak ada iklan berbayar", "Tidak terafiliasi brand apapun", "Data pribadimu aman", "Bahasa Indonesia"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary/60" />
                {t}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
        </motion.div>
      </section>

      {/* MASALAH */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border bg-card p-8 md:p-12"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Kenyataan yang sering terjadi</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Kenapa kita beli skincare yang sebenarnya tidak kita butuhkan?
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Beli karena influencer, bukan karena butuh",
                "Tidak paham kandungan produk yang dipakai",
                "Takut dianggap kurang cantik jika tidak ikut tren",
                "Menghabiskan uang untuk produk yang redundan",
                "Mengejar kulit putih, bukan kulit sehat",
                "Pakai produk berisiko tanpa sadar",
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                >
                  <XCircle className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-foreground font-medium text-lg">
                JujurSkin hadir untuk mengubah ini.{" "}
                <span className="text-primary">Dengan pendekatan yang sama sekali berbeda.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Fitur Utama</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Semua yang kamu butuhkan,{" "}
              <span className="gradient-text">tidak lebih</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Setiap fitur dirancang dengan satu tujuan: membantu kulitmu sehat dengan cara yang paling efisien.
            </p>
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

      {/* CARA KERJA */}
      <section id="cara-kerja" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Cara Kerja</p>
            <h2 className="text-3xl md:text-4xl font-bold">Sederhana dan langsung</h2>
          </motion.div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex gap-6 p-6 rounded-2xl border border-border bg-card"
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

      {/* PERBANDINGAN */}
      <section id="perbedaan" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs text-primary uppercase tracking-widest mb-3">Perbedaan Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tidak seperti platform lain</h2>
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
                  {row.us ? <CheckCircle className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-muted-foreground/30" />}
                </div>
                <div className="flex justify-center">
                  {row.them ? <CheckCircle className="w-5 h-5 text-muted-foreground/40" /> : <XCircle className="w-5 h-5 text-destructive/50" />}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-primary/20 bg-card p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-[60px]" />
            <div className="relative z-10">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 text-xs">Gratis Selamanya</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Mulai rawat kulitmu{" "}
                <span className="gradient-text">dengan jujur</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Tidak perlu kartu kredit. Tidak ada biaya tersembunyi. Tidak ada agenda untuk menyuruhmu beli lebih banyak.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-2 px-10 h-12">
                Analisis Kulit Saya Sekarang
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="mt-4 text-xs text-muted-foreground/60">Untuk pria & wanita · Seluruh Indonesia</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">JujurSkin</span>
          </div>
          <p className="text-xs text-muted-foreground/50 text-center">
            Tidak terafiliasi dengan brand skincare manapun · Rekomendasi berbasis data & ilmu pengetahuan
          </p>
          <p className="text-xs text-muted-foreground/40">© 2026 JujurSkin Indonesia</p>
        </div>
      </footer>

    </main>
  );
}
