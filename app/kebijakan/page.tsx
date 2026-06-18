import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Kebijakan Privasi";
const description =
  "Bagaimana JujurSkin memperlakukan datamu: apa yang dikumpulkan, di mana disimpan, dan janji kami untuk tidak pernah menjualnya.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://jujurskin.vercel.app/kebijakan" },
};

export default function KebijakanPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-28 pb-20">
        <article className="max-w-2xl mx-auto">
          <p className="text-xs text-primary uppercase tracking-widest mb-3">
            Transparansi
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Kebijakan Privasi
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Kami brand yang mengaku jujur, jadi soal data pun kami terbuka apa
            adanya — tanpa bahasa hukum yang menutupi. Terakhir diperbarui: Juni 2026.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                1. Data yang kami kumpulkan
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    <strong className="text-foreground">Jawaban analisis kulit</strong> (jenis
                    kulit, masalah, budget, gaya hidup) — dipakai untuk menyusun
                    rekomendasimu saat itu juga.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    <strong className="text-foreground">Email & nama</strong> — hanya jika kamu
                    memilih membuat akun. Tanpa akun, kamu tetap bisa pakai hampir
                    semua fitur.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    <strong className="text-foreground">Riwayat & progress di perangkatmu</strong> —
                    rutinitas, jurnal progress, dan hasil analisis disimpan di{" "}
                    <em>localStorage</em> browser kamu, bukan di server kami.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                2. Di mana data disimpan
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Akun (email) dan ulasan produk disimpan di Supabase, penyedia
                database tepercaya. Data analisis & progress harianmu sebagian
                besar tinggal di browser kamu sendiri — kalau kamu hapus data
                browser, data itu ikut hilang dan tidak bisa kami pulihkan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                3. Yang TIDAK kami lakukan
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Kami <strong className="text-foreground">tidak menjual</strong> datamu ke siapa pun.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Kami <strong className="text-foreground">tidak memasang iklan</strong> dan tidak mengambil komisi dari brand mana pun.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Kami tidak membagikan data ke pihak ketiga untuk pemasaran.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                4. Hak kamu
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kamu bisa menghapus akun kapan saja, dan menghapus data lokal
                lewat pengaturan browser. Untuk permintaan terkait data,
                hubungi kami di{" "}
                <a
                  href="mailto:jerichomedion@gmail.com"
                  className="text-primary hover:underline"
                >
                  jerichomedion@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                5. Bukan nasihat medis
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rekomendasi JujurSkin berbasis kuesioner dan literatur perawatan
                kulit umum — bukan diagnosis medis. Untuk kondisi kulit yang
                parah, menetap, atau menyakitkan, konsultasikan ke dokter kulit.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
