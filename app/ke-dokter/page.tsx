"use client";

import { useState } from "react";
import Link from "next/link";
import { Stethoscope, AlertTriangle, CheckCircle2, ArrowRight, Building2, IdCard } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const TANDA = [
  { t: "Jerawat besar, nyeri, bernanah, atau berupa benjolan keras (kistik/nodul)", berat: true },
  { t: "Masalah kulit tidak membaik setelah 2–3 bulan perawatan rutin yang benar", berat: false },
  { t: "Tahi lalat berubah ukuran/warna/bentuk, atau ada luka yang tak kunjung sembuh", berat: true },
  { t: "Bercak/ruam menyebar cepat, melepuh, atau disertai demam", berat: true },
  { t: "Reaksi alergi: bengkak, gatal hebat, kemerahan luas setelah pakai produk/obat", berat: true },
  { t: "Bekas jerawat dalam (bopeng) atau hiperpigmentasi berat yang ingin ditangani serius", berat: false },
  { t: "Jamur (panu/kurap) yang luas atau kambuh terus walau sudah pakai antijamur apotek", berat: false },
  { t: "Kondisi kronis (eksim, psoriasis, rosacea, dermatitis) yang mengganggu sehari-hari", berat: false },
];

export default function KeDokterPage() {
  const [checked, setChecked] = useState<boolean[]>(Array(TANDA.length).fill(false));
  const adaBerat = TANDA.some((t, i) => t.berat && checked[i]);
  const jumlah = checked.filter(Boolean).length;
  const sudahPilih = jumlah > 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kapan & Cara ke Dokter Kulit</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Skincare bukan obat segalanya. Ada kondisi yang memang butuh dokter — ini cara mengenalinya,
              bedanya dengan klinik kecantikan, dan jalur lewat BPJS.
            </p>
          </div>

          {/* Checklist interaktif */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-8">
            <h2 className="text-base font-semibold text-foreground mb-3">Cek: perlukah kamu ke dokter?</h2>
            <p className="text-xs text-muted-foreground mb-4">Centang yang sesuai kondisimu.</p>
            <div className="space-y-2">
              {TANDA.map((t, i) => (
                <label key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/40 transition-colors">
                  <input type="checkbox" checked={checked[i]}
                    onChange={() => setChecked((p) => p.map((v, j) => (j === i ? !v : v)))}
                    className="mt-0.5 accent-[var(--primary)]" />
                  <span className="text-xs text-foreground leading-relaxed">{t.t}</span>
                </label>
              ))}
            </div>

            {sudahPilih && (
              <div className={`mt-4 rounded-xl border p-4 ${adaBerat ? "border-rose-400/30 bg-rose-400/10" : "border-amber-400/30 bg-amber-400/10"}`}>
                <p className={`text-sm font-semibold mb-1 ${adaBerat ? "text-rose-700" : "text-amber-800"}`}>
                  {adaBerat ? "Sebaiknya periksa ke dokter (jangan ditunda)" : "Pertimbangkan konsultasi ke dokter"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {adaBerat
                    ? "Beberapa tanda yang kamu centang sebaiknya dinilai langsung oleh dokter spesialis kulit — bukan dicoba-coba dengan skincare. Lihat jalur BPJS di bawah."
                    : "Kondisimu mungkin masih bisa dibantu rutinitas yang benar, tapi kalau mengganggu atau tak membaik, konsultasi dokter adalah langkah jujur yang tepat."}
                </p>
              </div>
            )}
          </div>

          {/* Beda dokter vs klinik */}
          <h2 className="text-xl font-bold text-foreground mb-3">Dokter kulit vs klinik kecantikan — jangan tertukar</h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {[
              { ic: "🩺", j: "Dokter Spesialis Kulit", d: "Sp.KK / Sp.D.V.E. Sudah sekolah spesialis. Bisa mendiagnosis penyakit kulit, meresepkan obat keras, tindakan medis. Ini rujukan utama untuk masalah serius." },
              { ic: "👩‍⚕️", j: "Dokter Umum", d: "Bisa menangani keluhan kulit ringan & memberi rujukan ke spesialis. Titik awal di Faskes 1 BPJS." },
              { ic: "💅", j: "Klinik Kecantikan / Beautician", d: "Fokus perawatan estetika (facial, treatment). Belum tentu ada dokter spesialis. Jujur: ini BUKAN pengganti dokter kulit untuk penyakit." },
            ].map((x) => (
              <div key={x.j} className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl mb-2">{x.ic}</div>
                <p className="text-sm font-semibold text-foreground mb-1">{x.j}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>

          {/* Jalur BPJS */}
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <IdCard className="w-5 h-5 text-primary" /> Cara berobat kulit lewat BPJS
          </h2>
          <div className="rounded-2xl border border-border bg-card p-5 mb-4">
            <ol className="space-y-3">
              {[
                ["Datang ke Faskes 1 dulu", "Puskesmas / klinik / dokter yang terdaftar di kartu BPJS-mu. Kecuali darurat, BPJS mengharuskan mulai dari sini."],
                ["Minta pemeriksaan & rujukan", "Kalau dokter umum menilai perlu spesialis, kamu diberi surat rujukan ke poli kulit (Sp.KK) di rumah sakit rekanan."],
                ["Datang ke poli kulit RS dengan rujukan", "Bawa kartu BPJS/KTP + surat rujukan. Rujukan biasanya berlaku untuk periode tertentu (sering 90 hari) & bisa diperpanjang bila perlu kontrol."],
                ["Obat dari apotek RS", "Obat yang masuk tanggungan diberikan sesuai resep. Sebagian tindakan estetika (mis. menghilangkan flek demi kecantikan) tidak ditanggung."],
              ].map(([judul, isi], i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{judul}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{isi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 mb-8 flex gap-3">
            <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Tanpa BPJS / ingin cepat:</strong> bisa langsung ke poli kulit RS atau
              praktik dokter Sp.KK (umumnya bayar mandiri, kisaran biaya konsultasi bervariasi per kota & RS). Pastikan
              dokternya benar <strong>Sp.KK / Sp.D.V.E</strong>, bukan sekadar "klinik kecantikan".
            </p>
          </div>

          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 flex gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Catatan jujur:</strong> JujurSkin bukan layanan medis dan tidak bisa mendiagnosis. Checklist di atas
              hanya bantu menimbang — keputusan akhir ada di tenaga kesehatan. Prosedur BPJS bisa berbeda sedikit tiap
              daerah; konfirmasi ke Faskes-mu.
            </p>
          </div>

          <Link href="/kulit-tropis" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            <CheckCircle2 className="w-4 h-4" /> Lihat masalah kulit iklim tropis & penanganannya
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
