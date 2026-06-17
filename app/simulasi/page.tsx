"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, ShieldAlert, Lightbulb, Info } from "lucide-react";

type Sim = {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  manfaat: string[];
  risiko: string[];
  hindari: string[];
  tip: string;
  pregnancy_unsafe?: boolean;
};

const SIMS: Sim[] = [
  {
    id: "retinol", emoji: "🌙", name: "Retinol",
    desc: "Bahan anti-aging & jerawat paling terbukti secara ilmiah.",
    manfaat: ["Mengurangi bekas jerawat & garis halus", "Mempercepat regenerasi sel kulit", "Membantu tekstur lebih halus"],
    risiko: ["Kulit kering & mengelupas di awal (purging)", "Kemerahan/iritasi bila terlalu cepat", "Meningkatkan sensitivitas matahari"],
    hindari: ["Exfoliant (AHA/BHA) di malam yang sama", "Vitamin C dosis tinggi bersamaan", "Benzoyl peroxide (saling menonaktifkan)"],
    tip: "Mulai 1x/minggu malam, naikkan bertahap selama 1–3 bulan. WAJIB sunscreen pagi. Pakai 'sandwich method' (pelembap → retinol → pelembap) jika sensitif.",
    pregnancy_unsafe: true,
  },
  {
    id: "vitc", emoji: "🍊", name: "Vitamin C",
    desc: "Antioksidan pencerah untuk pagi hari.",
    manfaat: ["Mencerahkan & meratakan warna kulit", "Melindungi dari radikal bebas (duo dengan sunscreen)", "Membantu memudarkan noda"],
    risiko: ["Bisa menyengat pada kulit sensitif", "Mudah teroksidasi (warna menguning = kurang efektif)"],
    hindari: ["Retinol di waktu yang sama (pisahkan pagi/malam)", "Benzoyl peroxide bersamaan"],
    tip: "Pakai pagi sebelum sunscreen. Simpan di tempat sejuk & gelap. Mulai konsentrasi rendah (10%) bila kulit sensitif.",
  },
  {
    id: "niacinamide", emoji: "💧", name: "Niacinamide",
    desc: "Serbaguna & ramah hampir semua kulit.",
    manfaat: ["Mengontrol minyak & memperkecil tampilan pori", "Memudarkan bekas jerawat", "Memperkuat skin barrier"],
    risiko: ["Sangat jarang iritasi", "Dosis sangat tinggi (>10%) bisa bikin sebagian orang kemerahan"],
    hindari: ["Hampir tidak ada konflik — aman dikombinasikan"],
    tip: "Salah satu bahan paling aman untuk pemula. Bisa pagi & malam, cocok dilapis dengan hampir semua produk.",
  },
  {
    id: "bha", emoji: "🧪", name: "Salicylic Acid (BHA)",
    desc: "Exfoliant larut minyak untuk jerawat & komedo.",
    manfaat: ["Membersihkan sumbatan pori dari dalam", "Mengurangi komedo & jerawat", "Mengontrol minyak"],
    risiko: ["Over-exfoliation bila terlalu sering (kulit perih, makin berminyak)", "Kering bila dipakai berlebihan"],
    hindari: ["Retinol di malam yang sama", "AHA bersamaan (kecuali sudah toleran)", "Scrub fisik bersamaan"],
    tip: "Mulai 2–3x/minggu malam. Jangan digabung dengan exfoliant lain di hari yang sama. Selalu pelembap + sunscreen.",
    pregnancy_unsafe: true,
  },
  {
    id: "aha", emoji: "✨", name: "AHA (Glycolic/Lactic)",
    desc: "Exfoliant larut air untuk tekstur & kecerahan.",
    manfaat: ["Mengangkat sel kulit mati di permukaan", "Kulit lebih cerah & halus", "Membantu memudarkan noda"],
    risiko: ["Sangat meningkatkan sensitivitas matahari", "Iritasi/perih bila over-exfoliate"],
    hindari: ["Retinol & BHA di malam yang sama", "Vitamin C dosis tinggi bersamaan"],
    tip: "Malam, 1–2x/minggu dulu. Sunscreen keesokan harinya WAJIB. Mulai konsentrasi rendah.",
  },
  {
    id: "benzoyl", emoji: "🔴", name: "Benzoyl Peroxide",
    desc: "Pembunuh bakteri jerawat yang kuat.",
    manfaat: ["Efektif untuk jerawat meradang (papula/pustula)", "Mengurangi bakteri penyebab jerawat"],
    risiko: ["Sangat mengeringkan & bisa memutihkan kain/handuk", "Iritasi bila konsentrasi tinggi"],
    hindari: ["Retinol bersamaan (menonaktifkan)", "Vitamin C bersamaan"],
    tip: "Cukup konsentrasi 2,5% — sama efektif tapi lebih sedikit iritasi. Spot-treatment lebih aman daripada seluruh wajah.",
  },
  {
    id: "azelaic", emoji: "🌾", name: "Azelaic Acid",
    desc: "Lembut, multitasking, aman kehamilan.",
    manfaat: ["Mengatasi jerawat & kemerahan", "Memudarkan bekas/PIH", "Aman untuk ibu hamil & menyusui"],
    risiko: ["Sedikit menyengat/gatal di awal", "Hasil bertahap (butuh konsistensi)"],
    hindari: ["Relatif aman dikombinasikan dengan kebanyakan bahan"],
    tip: "Pilihan bagus bila retinol/BHA terlalu keras atau saat hamil. Pakai 1–2x sehari.",
  },
  {
    id: "ha", emoji: "🫧", name: "Hyaluronic Acid",
    desc: "Magnet kelembapan untuk semua kulit.",
    manfaat: ["Menarik & mengunci air ke kulit", "Kulit terasa lebih plump & lembap", "Cocok untuk semua tipe kulit"],
    risiko: ["Di udara kering bisa menarik air dari kulit bila tanpa pelembap penutup"],
    hindari: ["Tidak ada konflik berarti"],
    tip: "Aplikasikan di kulit sedikit lembap, lalu kunci dengan moisturizer. Aman dipakai pagi & malam.",
  },
  {
    id: "bakuchiol", emoji: "🌱", name: "Bakuchiol",
    desc: "Alternatif retinol berbasis tanaman.",
    manfaat: ["Efek mirip retinol (anti-aging) tanpa iritasi", "Aman untuk kehamilan", "Cocok kulit sensitif"],
    risiko: ["Hasil lebih lambat dari retinol", "Pilihan produk lebih terbatas"],
    hindari: ["Aman dikombinasikan, termasuk dengan niacinamide"],
    tip: "Pilihan tepat bila ingin manfaat retinol tapi kulit sensitif atau sedang hamil. Bisa pagi/malam.",
  },
];

export default function SimulasiPage() {
  const [active, setActive] = useState<Sim | null>(null);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Apa yang terjadi jika aku menambahkan…?</h1>
          <p className="text-sm text-muted-foreground">
            Pilih bahan aktif yang sedang kamu pertimbangkan. Kami tunjukkan potensi manfaat, risiko, dan apa yang harus dihindari —
            agar kamu memutuskan <strong className="text-foreground">sebelum membeli</strong>.
          </p>
        </div>

        {/* Pilihan bahan */}
        <div className="flex flex-wrap gap-2">
          {SIMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                active?.id === s.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              <span>{s.emoji}</span> {s.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{active.emoji}</span>
                  <h2 className="text-lg font-bold text-foreground">Jika kamu menambahkan {active.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{active.desc}</p>
                {active.pregnancy_unsafe && (
                  <p className="text-xs text-rose-800 bg-rose-500/10 rounded-lg px-3 py-2 mt-3">
                    ⚠️ Tidak disarankan saat hamil/menyusui — pertimbangkan Azelaic Acid atau Bakuchiol.
                  </p>
                )}
              </div>

              {/* Manfaat */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-700" />
                  <p className="text-sm font-semibold text-foreground">Potensi manfaat</p>
                </div>
                <ul className="space-y-1.5">
                  {active.manfaat.map((m, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-green-700 mt-0.5">+</span><span>{m}</span></li>
                  ))}
                </ul>
              </div>

              {/* Risiko */}
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-400/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-800" />
                  <p className="text-sm font-semibold text-yellow-800">Potensi risiko</p>
                </div>
                <ul className="space-y-1.5">
                  {active.risiko.map((r, i) => (
                    <li key={i} className="text-xs text-yellow-900 flex gap-2"><span className="mt-0.5">!</span><span>{r}</span></li>
                  ))}
                </ul>
              </div>

              {/* Hindari kombinasi */}
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-destructive" />
                  <p className="text-sm font-semibold text-destructive">Jangan dikombinasikan dengan</p>
                </div>
                <ul className="space-y-1.5">
                  {active.hindari.map((h, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-destructive mt-0.5">✕</span><span>{h}</span></li>
                  ))}
                </ul>
              </div>

              {/* Tip */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Cara aman memulai</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{active.tip}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/cek-konflik" className="text-xs text-primary hover:underline">Cek konflik kombinasi lengkap →</Link>
                <Link href="/bandingkan" className="text-xs text-primary hover:underline">Bandingkan ingredient →</Link>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <span className="text-3xl">👆</span>
              <p className="text-sm text-muted-foreground mt-2">Pilih satu bahan di atas untuk melihat simulasinya.</p>
            </div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simulasi ini bersifat edukatif & umum — bukan diagnosis medis. Reaksi tiap kulit berbeda; lakukan patch test dan perkenalkan bahan baru satu per satu.
          </p>
        </div>
      </div>
    </main>
  );
}
