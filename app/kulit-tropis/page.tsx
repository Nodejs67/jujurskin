"use client";

import Link from "next/link";
import { CloudSun, AlertTriangle, ArrowRight, Stethoscope, Droplets } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Kondisi = {
  emoji: string;
  nama: string;
  juga: string;
  ciri: string[];
  kenapaTropis: string;
  bantu: string[];
  medis: boolean;
  kapanDokter: string;
};

const KONDISI: Kondisi[] = [
  {
    emoji: "💦", nama: "Biang Keringat", juga: "miliaria / keringat buntet",
    ciri: ["Bintik merah kecil / lenting bening", "Gatal & perih, sering di leher, punggung, dahi", "Muncul setelah berkeringat banyak"],
    kenapaTropis: "Keringat terperangkap karena udara panas-lembap + pori tertutup (krim tebal, baju ketat). Sangat umum di Indonesia.",
    bantu: ["Dinginkan & keringkan kulit, ganti baju basah", "Pakai pelembap ringan (gel), hindari krim oklusif tebal saat berkeringat", "Baju katun longgar yang menyerap keringat", "Biasanya sembuh sendiri dalam beberapa hari"],
    medis: false,
    kapanDokter: "Kalau meluas, bernanah, atau tak membaik lebih dari seminggu.",
  },
  {
    emoji: "🔙", nama: "Jerawat Punggung & Dada", juga: "bacne / body acne",
    ciri: ["Jerawat di punggung, dada, bahu", "Sering muncul di area yang tertutup baju & berkeringat", "Kadang terasa nyeri / meradang"],
    kenapaTropis: "Keringat + minyak + gesekan baju menyumbat pori. Diperparah keramas/berkeringat lalu baju lembap dibiarkan lama.",
    bantu: ["Segera mandi & ganti baju setelah berkeringat", "Sabun badan ber-salicylic acid / benzoyl peroxide (pakai bertahap, bisa bikin kering)", "Baju katun, hindari bahan sintetis ketat saat olahraga", "Keramas dulu baru badan agar residu sampo tak menempel di punggung"],
    medis: false,
    kapanDokter: "Kalau jerawat besar, nyeri, bernanah (kistik/nodul) atau meninggalkan bekas — butuh resep dokter.",
  },
  {
    emoji: "🟤", nama: "Panu", juga: "tinea versicolor / jamur kulit",
    ciri: ["Bercak putih/cokelat/kemerahan, bersisik halus", "Sering di punggung, dada, leher, lengan", "Kadang gatal saat berkeringat"],
    kenapaTropis: "Pertumbuhan berlebih jamur Malassezia yang dipicu kulit lembap & berkeringat — khas iklim tropis.",
    bantu: ["Ini infeksi jamur — BUKAN sekadar masalah skincare", "Butuh antijamur (mis. ketoconazole/selenium sulfide) — tersedia di apotek", "Jaga kulit kering, ganti baju berkeringat", "Warna kulit bisa butuh berminggu-minggu untuk rata lagi walau jamur sudah mati"],
    medis: true,
    kapanDokter: "Kalau luas, sering kambuh, atau tidak membaik dengan antijamur apotek dalam 2–4 minggu.",
  },
  {
    emoji: "💍", nama: "Kurap", juga: "tinea / ringworm",
    ciri: ["Bercak gatal berbentuk cincin, tepi kemerahan & bersisik", "Menyebar dan menular (juga dari hewan/handuk)", "Sering di lipatan yang lembap"],
    kenapaTropis: "Jamur dermatofita tumbuh subur di area hangat-lembap (selangkangan, kaki, lipatan) — umum di cuaca tropis.",
    bantu: ["Infeksi jamur menular — perlu krim antijamur", "Jangan berbagi handuk/baju, cuci dengan air panas", "Jaga area tetap kering"],
    medis: true,
    kapanDokter: "Kalau menyebar luas, di kulit kepala/kuku, atau tak sembuh dengan antijamur biasa.",
  },
  {
    emoji: "✨", nama: "Kilap & Minyak Berlebih", juga: "oily skin tropis",
    ciri: ["Wajah cepat berminyak & mengilap, terutama T-zone", "Makeup/sunscreen cepat 'luntur'", "Pori tampak lebih besar"],
    kenapaTropis: "Suhu panas memicu kelenjar minyak lebih aktif. Wajar — bukan berarti kulit kotor.",
    bantu: ["Pelembap gel ringan (tetap perlu walau berminyak)", "Sunscreen non-greasy / berbahan dasar air", "Jangan over-cuci muka (>2x bikin kulit makin berminyak)", "Kertas minyak / blotting, bukan cuci muka berulang"],
    medis: false,
    kapanDokter: "Tidak perlu — kecuali disertai jerawat berat yang tak terkendali.",
  },
  {
    emoji: "😣", nama: "Iritasi & Kemerahan Lembap", juga: "heat rash / iritasi gesekan",
    ciri: ["Kemerahan & perih di lipatan (leher, paha, ketiak)", "Memburuk saat berkeringat & bergesekan", "Kadang terasa panas/lembap terus"],
    kenapaTropis: "Kombinasi keringat, gesekan, dan kelembapan terperangkap di lipatan kulit.",
    bantu: ["Jaga area kering & sejuk", "Pelembap penenang (centella, panthenol)", "Hindari produk wangi/beralkohol di area iritasi", "Baju longgar menyerap keringat"],
    medis: false,
    kapanDokter: "Kalau lecet, basah terus, bau, atau ada tanda infeksi (nanah).",
  },
];

export default function KulitTropisPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <CloudSun className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kulit di Iklim Tropis</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Panas + lembap khas Indonesia memicu masalah kulit yang jarang dibahas brand global. Ini penyebab &
              cara menanganinya — jujur, termasuk yang sebenarnya butuh dokter, bukan sekadar skincare.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 mb-8 flex gap-3">
            <Droplets className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Prinsip cuaca tropis:</strong> keringat & kelembapan yang terperangkap
              adalah pemicu utama. Produk ringan (gel/air), kulit yang dijaga kering & sejuk, dan baju menyerap keringat
              sering lebih ngefek daripada menumpuk banyak produk.
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {KONDISI.map((k) => (
              <div key={k.nama} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-secondary/40 flex items-center justify-center text-2xl">{k.emoji}</div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{k.nama}</h2>
                    <p className="text-xs text-muted-foreground">{k.juga}</p>
                  </div>
                  {k.medis && (
                    <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full border text-rose-700 bg-rose-400/10 border-rose-400/20 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> medis
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-foreground mt-3 mb-1">Ciri</p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4 mb-3">
                  {k.ciri.map((c, i) => <li key={i}>{c}</li>)}
                </ul>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground/80">Kenapa di iklim tropis:</strong> {k.kenapaTropis}
                </p>

                <p className="text-xs font-medium text-foreground mb-1">Yang membantu</p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4 mb-3">
                  {k.bantu.map((b, i) => <li key={i}>{b}</li>)}
                </ul>

                <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2">
                  <p className="text-xs text-amber-800"><strong>Kapan ke dokter:</strong> {k.kapanDokter}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 flex gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Jujur:</strong> panu & kurap adalah <strong>infeksi jamur</strong> — diobati dengan antijamur,
              bukan serum/skincare biasa. Kalau ragu atau tak membaik, jangan tunda ke tenaga medis.
            </p>
          </div>

          <Link href="/ke-dokter" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            Kapan & cara ke dokter kulit (termasuk BPJS) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
