"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

const REGION: Record<string, string> = {
  A: "Asia (termasuk produk lokal Indonesia & impor Asia)",
  B: "Australia",
  C: "Eropa",
  D: "Afrika",
  E: "Amerika",
};

type Result =
  | { kind: "valid"; region: string; normalized: string }
  | { kind: "invalid"; reason: string };

function checkFormat(raw: string): Result {
  const s = raw.toUpperCase().replace(/[\s.-]/g, "");
  if (!s) return { kind: "invalid", reason: "Masukkan nomor notifikasi BPOM produk." };
  // Notifikasi kosmetik: N + [A-E] + 11 digit
  const m = s.match(/^N([A-E])(\d{11})$/);
  if (m) {
    return { kind: "valid", region: REGION[m[1]], normalized: `N${m[1]}${m[2]}` };
  }
  if (/^N[A-E]/.test(s)) {
    return { kind: "invalid", reason: "Format mendekati, tapi jumlah digit tidak pas. Nomor notifikasi kosmetik = 2 huruf (NA–NE) + 11 angka. Periksa lagi di kemasan." };
  }
  return { kind: "invalid", reason: "Ini bukan format nomor notifikasi kosmetik BPOM (harusnya diawali NA/NB/NC/ND/NE + 11 angka). Bisa jadi nomor obat/pangan, atau produk tidak mencantumkan notifikasi resmi." };
}

const RED_FLAGS = [
  "Menjanjikan hasil instan (putih/glowing dalam beberapa hari).",
  "Tidak mencantumkan nomor BPOM, komposisi, atau produsen di kemasan.",
  "Harga jauh lebih murah dari produk sejenis, dijual sembunyi-sembunyi.",
  "Efek 'cetar' cepat lalu kulit memerah/mengelupas saat dihentikan (ciri steroid).",
  "Kemasan polos / racikan tanpa label jelas (sering disebut 'cream dokter' tanpa resep).",
];

export default function CekBpomPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handleCheck() {
    setResult(checkFormat(input));
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Cek BPOM</h1>
            <p className="text-muted-foreground leading-relaxed">
              Skincare ilegal bermerkuri masih beredar di Indonesia. Pastikan produkmu terdaftar resmi sebelum dipakai.
            </p>
          </div>

          {/* Input */}
          <div className="rounded-2xl border border-border bg-card p-5 mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Nomor notifikasi BPOM (di kemasan)</label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="Contoh: NA11231200123"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
              <Button onClick={handleCheck} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                <Search className="w-4 h-4" /> Cek
              </Button>
            </div>

            {result && (
              <div className="mt-4">
                {result.kind === "valid" ? (
                  <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                    <p className="text-sm font-semibold text-green-800 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4" /> Format nomor valid ({result.normalized})
                    </p>
                    <p className="text-xs text-green-800/90 leading-relaxed">
                      Format sesuai notifikasi kosmetik BPOM. Asal produk: <strong>{result.region}</strong>.
                      <br />Format benar belum berarti terdaftar — <strong>verifikasi nomor & nama produknya di situs resmi BPOM</strong> di bawah ini.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
                    <p className="text-sm font-semibold text-amber-800 flex items-center gap-1.5 mb-1">
                      <XCircle className="w-4 h-4" /> Format belum cocok
                    </p>
                    <p className="text-xs text-amber-800/90 leading-relaxed">{result.reason}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a href="https://cekbpom.pom.go.id/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium px-4 py-2.5 hover:bg-primary/20 transition-colors">
                <ExternalLink className="w-4 h-4" /> Verifikasi di cekbpom.pom.go.id (resmi)
              </a>
              <a href={`https://cekbpom.pom.go.id/`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-foreground text-sm px-4 py-2.5 hover:bg-secondary/40 transition-colors">
                Cari berdasarkan nama produk
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Catatan jujur: kami tidak terhubung langsung ke database BPOM, jadi verifikasi final tetap di situs resmi BPOM. Alat ini membantu memeriksa format & mengenali ciri produk berbahaya.
            </p>
          </div>

          {/* Red flags */}
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <p className="text-sm font-semibold text-rose-800">Ciri-ciri produk berbahaya / ilegal</p>
            </div>
            <ul className="space-y-2">
              {RED_FLAGS.map((f, i) => (
                <li key={i} className="text-sm text-rose-800/90 flex gap-2">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Skincare yang menjanjikan putih instan hampir selalu mengandung merkuri/hidrokuinon/steroid berbahaya.
              Pelajari kenapa di artikel{" "}
              <Link href="/artikel/kulit-sehat-bukan-putih" className="text-primary hover:underline">Kulit Sehat Lebih Penting daripada Kulit Putih</Link>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
