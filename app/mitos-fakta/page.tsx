"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, XCircle, CheckCircle, Search } from "lucide-react";

type Item = { mitos: string; fakta: string; tag: string };

const ITEMS: Item[] = [
  { tag: "Nilai", mitos: "Kulit putih lebih sehat.", fakta: "Kesehatan kulit tidak ditentukan warnanya. Kulit gelap yang lembap, terlindungi UV, dan barrier-nya kuat jauh lebih sehat daripada kulit putih yang rusak." },
  { tag: "Rutinitas", mitos: "Semakin banyak produk, semakin cepat hasilnya.", fakta: "Terlalu banyak produk (apalagi aktif) justru meningkatkan risiko iritasi & merusak barrier. Rutinitas minimal yang konsisten lebih efektif." },
  { tag: "Berminyak", mitos: "Kulit berminyak tidak perlu pelembap.", fakta: "Justru perlu. Melewatkan pelembap membuat kulit dehidrasi, lalu memproduksi minyak lebih banyak sebagai kompensasi. Pilih gel oil-free." },
  { tag: "Sunscreen", mitos: "Sunscreen hanya perlu saat panas atau ke luar.", fakta: "UVA menembus awan dan kaca jendela, dan merusak kulit sepanjang hari. Sunscreen tetap perlu meski mendung atau di dalam ruangan dekat jendela." },
  { tag: "Harga", mitos: "Produk mahal pasti lebih bagus.", fakta: "Efektivitas ditentukan ingredient & formulasi, bukan harga. Banyak produk lokal terjangkau sama efektifnya dengan yang mahal." },
  { tag: "Jerawat", mitos: "Jerawat muncul karena malas cuci muka.", fakta: "Jerawat multifaktor: hormon, genetik, barrier, stres. Cuci muka berlebihan (>2x) malah merusak barrier dan memperparah." },
  { tag: "Aktif", mitos: "Kalau kulit makin parah setelah pakai produk, itu purging — makin parah makin bagus.", fakta: "Purging wajar di 4–6 minggu pertama DI AREA yang memang sering berjerawat. Kalau iritasi terus, di area baru, atau perih hebat — itu reaksi buruk, hentikan." },
  { tag: "Bahan", mitos: "Bahan alami pasti aman.", fakta: "Banyak bahan alami justru iritan/alergen kuat (essential oil, citrus, lemon). Aman ditentukan formulasi & uji, bukan label 'alami'." },
  { tag: "Pori", mitos: "Pori bisa membuka dan menutup (mis. dengan air panas/es).", fakta: "Pori tidak punya otot, jadi tidak bisa buka-tutup. Pori bisa tampak lebih kecil bila bersih dari sumbatan, tapi ukurannya genetik." },
  { tag: "Eksfoliasi", mitos: "Eksfoliasi tiap hari bikin kulit cepat cerah.", fakta: "Over-exfoliation merusak barrier → kulit perih, merah, makin sensitif. Cukup 2–3x/minggu." },
  { tag: "Sunscreen", mitos: "SPF tinggi berarti tidak perlu reapply.", fakta: "SPF tinggi tetap luntur oleh keringat & waktu. Reapply tiap 2 jam saat aktif di luar ruangan, berapa pun SPF-nya." },
  { tag: "Pembersih", mitos: "Micellar water / air mawar cukup menggantikan cuci muka.", fakta: "Keduanya tidak mengangkat semua kotoran & sunscreen. Tetap lanjutkan dengan cleanser (double cleanse) agar bersih sempurna." },
];

export default function MitosFaktaPage() {
  const [q, setQ] = useState("");
  const filtered = ITEMS.filter(
    (i) => i.mitos.toLowerCase().includes(q.toLowerCase()) || i.fakta.toLowerCase().includes(q.toLowerCase()) || i.tag.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Mitos vs Fakta Skincare</h1>
          <p className="text-sm text-muted-foreground">
            Banyak mitos skincare beredar di Indonesia — sebagian malah merugikan kulit & dompet. Ini faktanya berbasis sains.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari mitos... (mis. sunscreen, pori, jerawat)"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.mitos}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-destructive/5">
                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-destructive font-semibold mb-0.5">Mitos · {item.tag}</p>
                    <p className="text-sm text-foreground">{item.mitos}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-primary font-semibold mb-0.5">Fakta</p>
                    <p className="text-sm text-foreground leading-relaxed">{item.fakta}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Tidak ada yang cocok dengan “{q}”.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/panduan" className="text-xs text-primary hover:underline">Panduan skincare dari nol →</Link>
          <Link href="/cek-klaim" className="text-xs text-primary hover:underline">Cek klaim iklan →</Link>
        </div>
      </div>
    </main>
  );
}
