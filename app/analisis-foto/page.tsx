"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, Upload, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

type Level = "rendah" | "sedang" | "tinggi";
type Metric = { key: string; label: string; level: Level; value: number; desc: string; tip: string };
type Analysis = {
  metrics: Metric[];
  confidence: "rendah" | "cukup";
  note: string;
};

function levelColor(level: Level) {
  // untuk kemerahan/kilap: tinggi = perlu perhatian; untuk kerataan dibalik saat dipakai
  return level === "tinggi"
    ? "text-rose-700 bg-rose-400/10 border-rose-400/20"
    : level === "sedang"
    ? "text-amber-700 bg-amber-400/10 border-amber-400/20"
    : "text-green-700 bg-green-400/10 border-green-400/20";
}

function analyzeImageData(d: Uint8ClampedArray, n: number): Analysis {
  let skin = 0, redness = 0, lumSum = 0, lumSq = 0, shine = 0, allLum = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    allLum += lum;
    const isSkin = r > 50 && r >= g && g >= b && r - b > 10 && r < 250;
    if (isSkin) {
      skin++;
      redness += r - (g + b) / 2;
      lumSum += lum;
      lumSq += lum * lum;
      if (lum > 225) shine++;
    }
  }
  const meanAllLum = allLum / n;
  const lowLight = meanAllLum < 60 || meanAllLum > 215;
  const faceOk = skin > n * 0.05;

  const rednessAvg = skin ? redness / skin : 0;
  const shineFrac = skin ? shine / skin : 0;
  const lumMean = skin ? lumSum / skin : 0;
  const lumStd = skin ? Math.sqrt(Math.max(0, lumSq / skin - lumMean * lumMean)) : 0;

  const rednessLevel: Level = rednessAvg > 22 ? "tinggi" : rednessAvg > 12 ? "sedang" : "rendah";
  const shineLevel: Level = shineFrac > 0.06 ? "tinggi" : shineFrac > 0.02 ? "sedang" : "rendah";
  const evenLevel: Level = lumStd > 34 ? "tinggi" : lumStd > 22 ? "sedang" : "rendah";

  const metrics: Metric[] = [
    {
      key: "redness", label: "Kemerahan", level: rednessLevel, value: Math.round(rednessAvg),
      desc: rednessLevel === "tinggi" ? "Tampak cukup banyak area kemerahan." : rednessLevel === "sedang" ? "Ada sedikit kemerahan." : "Kemerahan minim.",
      tip: "Kemerahan bisa karena iritasi/barrier lemah. Hindari over-exfoliating, perkuat dengan pelembap & niacinamide.",
    },
    {
      key: "shine", label: "Kilap / Minyak", level: shineLevel, value: Math.round(shineFrac * 100),
      desc: shineLevel === "tinggi" ? "Banyak area mengilap (kemungkinan berminyak)." : shineLevel === "sedang" ? "Kilap sedang." : "Kilap minim / cenderung kering.",
      tip: "Kilap tinggi → gel moisturizer ringan & sunscreen non-greasy. (Catatan: flash/keringat bisa bikin tampak lebih mengilap.)",
    },
    {
      key: "even", label: "Kerataan Tekstur", level: evenLevel, value: Math.round(lumStd),
      desc: evenLevel === "tinggi" ? "Tekstur/warna tampak kurang merata." : evenLevel === "sedang" ? "Cukup merata." : "Tampak merata.",
      tip: "Ketidakrataan bisa dari bekas jerawat/bayangan. Konsisten sunscreen + bahan pencerah bertahap membantu.",
    },
  ];

  let note = "Estimasi visual sederhana berdasarkan warna & kecerahan piksel.";
  let confidence: "rendah" | "cukup" = "cukup";
  if (!faceOk) { confidence = "rendah"; note = "Wajah kurang terdeteksi. Gunakan foto close-up wajah menghadap kamera."; }
  else if (lowLight) { confidence = "rendah"; note = "Pencahayaan kurang ideal (terlalu gelap/terang) — hasil bisa meleset. Coba cahaya alami merata, tanpa filter."; }

  return { metrics, confidence, note };
}

export default function AnalisisFotoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [result, setResult] = useState<Analysis | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("analyzing");
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new window.Image();
    img.onload = () => {
      try {
        const W = 256;
        const H = Math.max(1, Math.round((img.height / img.width) * W));
        const canvas = canvasRef.current!;
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, W, H);
        const { data } = ctx.getImageData(0, 0, W, H);
        setResult(analyzeImageData(data, W * H));
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };
    img.onerror = () => setStatus("error");
    img.src = url;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-3">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Analisis Foto Kulit</h1>
            <p className="text-muted-foreground leading-relaxed">
              Estimasi visual sederhana dari fotomu — kemerahan, kilap, dan kerataan kulit.
            </p>
          </div>

          {/* Privacy banner — Data & Privacy Doctrine */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              <strong>Privasi penuh:</strong> foto dianalisis sepenuhnya di perangkatmu (browser). Foto kamu
              <strong> tidak diunggah</strong>, tidak disimpan, dan tidak dikirim ke server mana pun.
            </p>
          </div>

          {/* Upload */}
          <label className="block rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors mb-6">
            <input type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Foto kamu" className="mx-auto max-h-56 rounded-xl object-contain" />
            ) : (
              <div className="py-6">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Pilih atau ambil foto wajah</p>
                <p className="text-xs text-muted-foreground mt-1">Close-up, cahaya merata, tanpa filter/makeup tebal.</p>
              </div>
            )}
          </label>
          <canvas ref={canvasRef} className="hidden" />

          {status === "analyzing" && (
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis di perangkatmu…
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-rose-700 text-center">Gagal membaca foto. Coba foto lain (JPG/PNG).</p>
          )}

          {status === "done" && result && (
            <div className="space-y-4">
              {result.confidence === "rendah" && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{result.note}</p>
                </div>
              )}
              <div className="grid gap-3">
                {result.metrics.map((m) => (
                  <div key={m.key} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${levelColor(m.level)}`}>{m.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    <p className="text-xs text-muted-foreground/90 mt-1.5 leading-relaxed"><strong className="text-foreground/80">Saran:</strong> {m.tip}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Penting:</strong> ini estimasi visual kasar dari piksel foto, sangat
                  dipengaruhi cahaya & kamera — <strong>bukan diagnosis medis</strong>. Untuk rekomendasi produk yang
                  dipersonalisasi, lengkapi kuesioner kulitmu.
                </p>
                <Link href="/analisis" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-3">
                  Lanjut ke Analisis Lengkap <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Alat ini sengaja jujur soal keterbatasannya: foto selfie biasa hanya bisa memberi <em>estimasi kasar</em>.
                Kami tidak mengklaim mendeteksi penyakit kulit. Untuk hasil terbaik, gunakan cahaya alami & foto close-up.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
