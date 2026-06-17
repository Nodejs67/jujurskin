"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowLeft, Sparkles, BookOpen, CheckCircle, AlertTriangle,
  Sun, Droplets, Shield, ChevronDown, ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ROUTINE_PAGI = [
  { step: 1, name: "Cleanser", icon: "🫧", desc: "Bersihkan minyak tidur dan produk malam. Pakai yang gentle, tidak harus busa tebal.", optional: false },
  { step: 2, name: "Treatment/Serum", icon: "💧", desc: "Vitamin C pagi hari sangat dianjurkan — antioksidan + pencerah. Niacinamide juga bisa.", optional: true },
  { step: 3, name: "Moisturizer", icon: "🧴", desc: "Kunci kelembapan setelah serum. Pilih yang sesuai tipe kulit: gel untuk berminyak, cream untuk kering.", optional: false },
  { step: 4, name: "Sunscreen SPF 50+", icon: "☀️", desc: "WAJIB. Langkah ini tidak boleh dilewati. Oleskan 15 menit sebelum keluar.", optional: false },
];

const ROUTINE_MALAM = [
  { step: 1, name: "Double Cleanse (jika pakai sunscreen/makeup)", icon: "🫧", desc: "Pertama dengan cleansing oil/micellar water, lalu cleanser biasa. Kalau tidak pakai sunscreen, skip.", optional: true },
  { step: 2, name: "Cleanser", icon: "🫧", desc: "Bersihkan polusi, kotoran, dan keringat sepanjang hari.", optional: false },
  { step: 3, name: "Treatment Aktif (AHA/BHA/Retinol)", icon: "🔬", desc: "Malam adalah waktu terbaik untuk aktif: exfoliant atau retinol. Jangan campur keduanya.", optional: true },
  { step: 4, name: "Serum Terhidrasi", icon: "💧", desc: "Hyaluronic Acid atau Niacinamide — kalau tidak pakai aktif, serum bisa langsung setelah cleanser.", optional: true },
  { step: 5, name: "Moisturizer", icon: "🧴", desc: "Kunci semua yang sudah dipakai. Malam bisa pakai yang lebih rich dari siang.", optional: false },
];

const MYTHS = [
  {
    myth: "Produk mahal pasti lebih bagus",
    fact: "Harga tidak menentukan efektivitas. Bahan aktif seperti Niacinamide dan Salicylic Acid sama saja dari produk Rp 35k atau Rp 350k. Yang penting: ingredient dan konsentrasinya.",
    icon: "💸",
  },
  {
    myth: "Kulit berminyak tidak perlu moisturizer",
    fact: "Ini mitos paling berbahaya. Kulit berminyak yang skip moisturizer justru akan produksi lebih banyak minyak sebagai kompensasi. Pakai gel moisturizer yang water-based.",
    icon: "💧",
  },
  {
    myth: "Natural / organik pasti aman",
    fact: "Kata 'natural' tidak ada artinya secara regulasi. Banyak bahan alami yang bisa iritasi (essential oil, jeruk nipis). Keamanan ditentukan oleh formulasi dan konsentrasi, bukan asal usul bahan.",
    icon: "🌿",
  },
  {
    myth: "Semakin banyak produk, semakin baik kulitnya",
    fact: "Lebih sedikit produk dengan bahan yang tepat jauh lebih efektif. 3-4 produk yang konsisten mengalahkan 10 produk yang berganti-ganti.",
    icon: "📦",
  },
  {
    myth: "Kulit putih = kulit sehat",
    fact: "Putih bukan indikator kesehatan kulit. Kesehatan kulit ditentukan oleh: tidak ada iritasi, skin barrier kuat, terhidrasi baik, tidak ada infeksi aktif. Warna alami kulitmu adalah milikmu.",
    icon: "✨",
  },
  {
    myth: "Sunscreen hanya untuk hari cerah",
    fact: "UVA (penyebab penuaan) menembus awan 95% dan kaca jendela. Mau mendung atau di dalam ruangan pun, paparan UVA tetap ada. Pakai sunscreen setiap hari.",
    icon: "⛅",
  },
  {
    myth: "Eksfoliasi setiap hari membuat kulit lebih bersih",
    fact: "Eksfoliasi berlebihan merusak skin barrier — hasilnya kulit merah, iritasi, dan lebih mudah berjerawat. Cukup 2-3x seminggu untuk AHA/BHA.",
    icon: "🔬",
  },
  {
    myth: "Jerawat karena kotor",
    fact: "Jerawat disebabkan oleh kombinasi: produksi sebum berlebih, sel kulit mati yang menyumbat pori, dan bakteri P. acnes. Mencuci wajah terlalu sering justru merusak barrier dan memperparah jerawat.",
    icon: "😤",
  },
];

const BEGINNER_MISTAKES = [
  {
    title: "Terlalu banyak produk sekaligus",
    desc: "Mulai dengan 3 produk dasar: cleanser, moisturizer, sunscreen. Tambahkan satu per satu agar tahu produk mana yang cocok atau tidak.",
    color: "text-red-600 bg-red-400/10 border-red-400/20",
  },
  {
    title: "Gonta-ganti produk terlalu cepat",
    desc: "Skincare butuh waktu. Sebagian besar produk perlu 4-8 minggu untuk menunjukkan hasil. Jika tidak ada reaksi buruk, tetap konsisten.",
    color: "text-orange-600 bg-orange-400/10 border-orange-400/20",
  },
  {
    title: "Skip sunscreen karena berminyak",
    desc: "Ada sunscreen untuk semua tipe kulit. Cari yang 'lightweight', 'gel-based', atau 'non-comedogenic'. Sunscreen bukan pilihan — ini fondasi.",
    color: "text-yellow-600 bg-yellow-400/10 border-yellow-400/20",
  },
  {
    title: "Pakai aktif terlalu banyak sekaligus",
    desc: "AHA + BHA + Retinol di malam yang sama = kulit rusak. Pilih satu aktif per malam dan bergantian di hari berbeda.",
    color: "text-red-600 bg-red-400/10 border-red-400/20",
  },
  {
    title: "Tidak patch test produk baru",
    desc: "Selalu coba produk baru di belakang telinga atau rahang selama 24 jam sebelum pakai di seluruh wajah.",
    color: "text-yellow-600 bg-yellow-400/10 border-yellow-400/20",
  },
];

const SKIN_TYPE_GUIDE = [
  {
    type: "Berminyak",
    emoji: "💧",
    signs: ["Kilap di seluruh wajah", "Pori-pori terlihat besar", "Mudah berjerawat"],
    avoid: ["Moisturizer oil-based", "Produk dengan alkohol tinggi"],
    use: ["Gel cleanser low-pH", "Gel moisturizer water-based", "Niacinamide", "BHA (Salicylic Acid)"],
  },
  {
    type: "Kering",
    emoji: "🌵",
    signs: ["Terasa kencang setelah cuci muka", "Bersisik atau mengelupas", "Jarang berjerawat"],
    avoid: ["Foaming cleanser kuat", "AHA berlebihan", "Alkohol tinggi"],
    use: ["Cream cleanser gentle", "Ceramide moisturizer", "Hyaluronic Acid", "Squalane"],
  },
  {
    type: "Kombinasi",
    emoji: "⚡",
    signs: ["T-zone (dahi, hidung) berminyak", "Pipi normal atau sedikit kering"],
    avoid: ["Produk yang terlalu rich/tebal"],
    use: ["Gel-cream moisturizer", "Niacinamide (seimbangkan)", "BHA di T-zone saja"],
  },
  {
    type: "Sensitif",
    emoji: "🌸",
    signs: ["Mudah merah atau iritasi", "Bereaksi terhadap banyak produk", "Rasa terbakar atau gatal"],
    avoid: ["Wewangian (parfum)", "Essential oil kuat", "AHA/BHA terlalu sering"],
    use: ["Cleanser fragrance-free", "Centella Asiatica", "Azelaic Acid (lebih gentle dari BHA)", "Ceramide"],
  },
];

function MythCard({ myth, fact, icon, defaultOpen = false }: { myth: string; fact: string; icon: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/20 transition-colors"
      >
        <span className="text-xl shrink-0">{icon}</span>
        <div className="flex-1">
          <p className="text-xs text-destructive/60 font-medium mb-0.5">MITOS</p>
          <p className="text-sm text-foreground leading-tight">&ldquo;{myth}&rdquo;</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4 pt-0 border-t border-border bg-green-400/5">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-green-600 font-medium mb-1">FAKTA</p>
                <p className="text-sm text-foreground leading-relaxed">{fact}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PanduanPage() {
  const router = useRouter();
  const [activeSkinType, setActiveSkinType] = useState(0);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Panduan Pemula</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10 text-xs px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1.5" /> Untuk yang Baru Mulai
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Panduan Skincare{" "}
            <span className="gradient-text">dari Nol</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Kamu tidak perlu 10 produk untuk punya kulit sehat. Ikuti panduan ini untuk mulai dengan benar — sederhana, efektif, dan tidak buang uang.
          </p>
        </motion.div>

        {/* Apa itu skincare sebenarnya */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <p className="text-xs text-primary uppercase tracking-widest mb-4">Konsep Dasar</p>
              <h2 className="text-xl font-bold text-foreground mb-4">Skincare itu sederhana — industrinya yang membuatnya rumit</h2>
              <div className="space-y-3 text-sm text-foreground leading-relaxed">
                <p>Kulit punya 3 fungsi utama yang perlu kita dukung:</p>
                <div className="grid gap-3 mt-2">
                  {[
                    { icon: Shield, title: "Perlindungan (Barrier)", desc: "Lapisan terluar kulit melindungi dari bakteri, polusi, dan kehilangan air. Jaga barrier ini dengan moisturizer dan hindari produk yang terlalu keras." },
                    { icon: Sun, title: "Perlindungan UV", desc: "Sinar UV merusak DNA sel kulit, menyebabkan penuaan dan kanker kulit. Sunscreen setiap hari adalah investasi terbaik." },
                    { icon: Droplets, title: "Hidrasi", desc: "Kulit yang terhidrasi lebih elastis, lebih kencang, dan lebih sehat. Ini bukan soal minyak, tapi soal air." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                      <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Routine Pagi */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="text-xs text-primary uppercase tracking-widest mb-2">Routine Pagi</p>
            <h2 className="text-2xl font-bold text-foreground">Langkah routine pagi</h2>
            <p className="text-sm text-muted-foreground mt-1">Fokus: proteksi dari lingkungan dan UV</p>
          </motion.div>
          <div className="space-y-3">
            {ROUTINE_PAGI.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${step.optional ? "bg-secondary text-muted-foreground" : "bg-primary/20 text-primary border border-primary/30"}`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{step.icon}</span>
                    <p className="text-sm font-semibold text-foreground">{step.name}</p>
                    {step.optional && <Badge variant="outline" className="text-xs border-border text-muted-foreground px-1.5 py-0">Opsional</Badge>}
                    {!step.optional && <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10 px-1.5 py-0">Wajib</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Routine Malam */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="text-xs text-primary uppercase tracking-widest mb-2">Routine Malam</p>
            <h2 className="text-2xl font-bold text-foreground">Langkah routine malam</h2>
            <p className="text-sm text-muted-foreground mt-1">Fokus: repair dan treatment — tidak ada sunscreen</p>
          </motion.div>
          <div className="space-y-3">
            {ROUTINE_MALAM.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${step.optional ? "bg-secondary text-muted-foreground" : "bg-primary/20 text-primary border border-primary/30"}`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{step.icon}</span>
                    <p className="text-sm font-semibold text-foreground">{step.name}</p>
                    {step.optional && <Badge variant="outline" className="text-xs border-border text-muted-foreground px-1.5 py-0">Opsional</Badge>}
                    {!step.optional && <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10 px-1.5 py-0">Wajib</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4"
          >
            <p className="text-xs text-amber-600 font-medium mb-1">⚠️ Aturan Aktif di Malam Hari</p>
            <p className="text-xs text-muted-foreground">AHA di Senin, Rabu, Jumat. Retinol di Selasa, Kamis. Jangan pernah di malam yang sama. Hari lain: cukup cleanser + moisturizer untuk kulit istirahat.</p>
          </motion.div>
        </section>

        {/* Tipe Kulit */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="text-xs text-primary uppercase tracking-widest mb-2">Kenali Kulitmu</p>
            <h2 className="text-2xl font-bold text-foreground">Panduan per tipe kulit</h2>
          </motion.div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {SKIN_TYPE_GUIDE.map((s, i) => (
              <button key={i} onClick={() => setActiveSkinType(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${activeSkinType === i ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}>
                <span>{s.emoji}</span> {s.type}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {SKIN_TYPE_GUIDE.map((skin, i) =>
              activeSkinType === i ? (
                <motion.div key={skin.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skin.emoji}</span>
                    <h3 className="font-bold text-foreground">Kulit {skin.type}</h3>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Ciri-ciri</p>
                    <div className="space-y-1">
                      {skin.signs.map((s, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-xs text-foreground">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-3">
                      <p className="text-xs text-green-600 font-semibold mb-2">✅ Dianjurkan</p>
                      {skin.use.map((u, j) => <p key={j} className="text-xs text-foreground mb-1">• {u}</p>)}
                    </div>
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-xs text-destructive/60 font-semibold mb-2">❌ Hindari</p>
                      {skin.avoid.map((a, j) => <p key={j} className="text-xs text-foreground mb-1">• {a}</p>)}
                    </div>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </section>

        {/* Kesalahan Pemula */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="text-xs text-primary uppercase tracking-widest mb-2">Hindari Ini</p>
            <h2 className="text-2xl font-bold text-foreground">5 kesalahan paling umum pemula</h2>
          </motion.div>
          <div className="space-y-3">
            {BEGINNER_MISTAKES.map((mistake, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${mistake.color}`}
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{mistake.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mistake.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mitos vs Fakta */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="text-xs text-primary uppercase tracking-widest mb-2">Luruskan Mitos</p>
            <h2 className="text-2xl font-bold text-foreground">Mitos skincare yang harus kamu hapus</h2>
            <p className="text-sm text-muted-foreground mt-1">Klik untuk lihat fakta sebenarnya.</p>
          </motion.div>
          <motion.div className="space-y-2" variants={{ show: { transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {MYTHS.map((m, i) => (
              <MythCard key={i} myth={m.myth} fact={m.fact} icon={m.icon} defaultOpen={i === 0} />
            ))}
          </motion.div>
        </section>

        {/* Quick Tools */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-semibold text-foreground mb-3">Tools yang berguna setelah membaca panduan ini:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: "⚗️",
                title: "Cek Konflik Ingredient",
                desc: "Pastikan produk yang kamu pakai aman dikombinasikan",
                href: "/cek-konflik",
                color: "border-yellow-400/20 bg-yellow-400/5",
              },
              {
                icon: "💰",
                title: "Budget Planner",
                desc: "Starter kit terbaik sesuai budgetmu",
                href: "/kalkulator",
                color: "border-accent/20 bg-accent/5",
              },
              {
                icon: "📚",
                title: "Edukasi Ingredient",
                desc: "Pahami 29+ bahan skincare yang paling penting",
                href: "/edukasi",
                color: "border-purple-400/20 bg-purple-400/5",
              },
              {
                icon: "🛍️",
                title: "Produk Indonesia",
                desc: "30+ produk lokal terkurasi berdasarkan ingredient",
                href: "/produk",
                color: "border-primary/20 bg-primary/5",
              },
            ].map((tool) => (
              <button key={tool.href} onClick={() => router.push(tool.href)}
                className={`text-left p-4 rounded-xl border ${tool.color} hover:opacity-90 transition-opacity`}>
                <p className="text-lg mb-1">{tool.icon}</p>
                <p className="text-sm font-semibold text-foreground mb-0.5">{tool.title}</p>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <p className="text-xs text-primary uppercase tracking-widest mb-3">Siap Mulai?</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">Dapatkan routine personal untuk kulitmu</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Panduan umum sudah bagus, tapi rekomendasi spesifik untuk kondisi kulitmu akan jauh lebih efektif. Analisis gratis, 5 menit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Sparkles className="w-4 h-4" /> Analisis Kulit Saya
            </Button>
            <Button variant="outline" onClick={() => router.push("/edukasi")} className="border-border gap-2">
              <BookOpen className="w-4 h-4" /> Pelajari Ingredient
            </Button>
          </div>
        </motion.div>

      </div>
      <SiteFooter />
    </main>
  );
}
