"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, Upload, AlertTriangle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { analyzeSkin, type Sample, type SkinInput, type SkinResult, type Level } from "@/lib/skin-analysis";

// ---- titik landmark MediaPipe (FaceMesh 468) per zona wajah ----
const REGION = {
  cheekL: [50, 101, 118, 117, 119],
  cheekR: [280, 330, 347, 346, 348],
  forehead: [10, 151, 9, 108, 337, 67, 297],
  nose: [4, 195, 5, 1, 19],
  chin: [152, 175, 199, 18, 200],
};
const EDGE_L = 234, EDGE_R = 454, EYE_L = 33, EYE_R = 263, NOSE_TIP = 1, MOUTH = 13;

function levelColor(level: Level) {
  return level === "tinggi"
    ? "text-rose-700 bg-rose-400/10 border-rose-400/20"
    : level === "sedang"
    ? "text-amber-700 bg-amber-400/10 border-amber-400/20"
    : "text-green-700 bg-green-400/10 border-green-400/20";
}

type Pt = { x: number; y: number };

export default function AnalisisFotoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // model MediaPipe di-cache antar-analisis
  const landmarkerRef = useRef<unknown>(null);
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading-model" | "analyzing" | "done" | "error">("idle");
  const [result, setResult] = useState<SkinResult | null>(null);

  async function getLandmarker() {
    if (landmarkerRef.current) return landmarkerRef.current;
    setStatus("loading-model");
    const vision = await import("@mediapipe/tasks-vision");
    const fileset = await vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
    );
    const lm = await vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
    landmarkerRef.current = lm;
    return lm;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreview(url);

    try {
      const landmarker = (await getLandmarker()) as {
        detect: (img: HTMLCanvasElement) => { faceLandmarks: Pt[][] };
      };
      setStatus("analyzing");

      const img = await loadImage(url);
      const W = Math.min(480, img.width);
      const H = Math.max(1, Math.round((img.height / img.width) * W));
      const canvas = canvasRef.current!;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, W, H);
      const imgData = ctx.getImageData(0, 0, W, H);

      const det = landmarker.detect(canvas);
      const faces = det.faceLandmarks;
      if (!faces || faces.length === 0) {
        // tetap beri hasil "confidence rendah" yang jujur, bukan error
        setResult(
          analyzeSkin({
            cheek: [], tzone: [], all: [], faceLum: [], faceLumW: 0, faceLumH: 0,
            pose: { yaw: 0, pitch: 0, roll: 0 }, faceFound: false,
          })
        );
        setStatus("done");
        return;
      }

      const lms = faces[0].map((p) => ({ x: p.x * W, y: p.y * H })); // ke piksel
      const input = buildInput(lms, imgData, W, H);
      setResult(analyzeSkin(input));
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
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
              Deteksi wajah + ukur kemerahan, kilap, dan kerataan kulit per area —
              dengan koreksi cahaya. Semua diproses di perangkatmu.
            </p>
          </div>

          {/* Privacy banner — Data & Privacy Doctrine */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              <strong>Privasi penuh:</strong> deteksi wajah & analisis berjalan sepenuhnya di browsermu. Foto kamu
              <strong> tidak pernah diunggah</strong>, tidak disimpan, dan tidak dikirim ke server atau AI mana pun.
              (Yang diunduh hanya model deteksi ringan dari Google — sekali, lalu tersimpan di cache.)
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
                <p className="text-xs text-muted-foreground mt-1">Close-up, hadap kamera, cahaya merata, tanpa filter/makeup tebal.</p>
              </div>
            )}
          </label>
          <canvas ref={canvasRef} className="hidden" />

          {status === "loading-model" && (
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan model deteksi wajah (sekali saja)…
            </p>
          )}
          {status === "analyzing" && (
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis di perangkatmu…
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-rose-700 text-center">Gagal memproses foto. Coba foto lain (JPG/PNG), atau cek koneksi saat memuat model.</p>
          )}

          {status === "done" && result && (
            <div className="space-y-4">
              {/* Confidence + kualitas foto */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Keyakinan hasil</p>
                  <span className="text-sm font-bold text-foreground">{result.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${result.confidence >= 70 ? "bg-green-600" : result.confidence >= 45 ? "bg-amber-500" : "bg-rose-600"}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                  <QualityChip label="Cahaya" value={result.quality.exposure} good={result.quality.exposure === "baik"} />
                  <QualityChip label="Ketajaman" value={result.quality.blur} good={result.quality.blur === "tajam"} />
                  <QualityChip label="Posisi" value={result.quality.pose} good={result.quality.pose === "lurus"} />
                </div>
              </div>

              {result.warnings.length > 0 && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <ul className="text-xs text-amber-800 space-y-1 list-disc pl-4">
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
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
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed"><strong className="text-foreground/80">Saran:</strong> {m.tip}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Penting:</strong> ini pengukuran visual berbasis warna & cahaya foto —
                  jauh lebih konsisten dari sekadar tebakan, tapi <strong>bukan diagnosis medis</strong>. Untuk hasil
                  paling adil saat memantau progress, ambil foto dengan cahaya & posisi yang mirip tiap kali.
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
                Alat ini jujur soal batasnya: foto selfie biasa tetap dipengaruhi cahaya & kamera. Karena itu kami
                deteksi wajah dulu, ukur hanya di area kulit (pipi, dahi, hidung), koreksi warna cahaya, dan kasih
                tahu kalau fotonya kurang ideal — supaya angkanya bisa dipercaya untuk memantau perubahan.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function QualityChip({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border capitalize ${good ? "text-green-700 bg-green-400/10 border-green-400/20" : "text-amber-700 bg-amber-400/10 border-amber-400/20"}`}>
      {good ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {label}: {value}
    </span>
  );
}

// ---------- helper di luar komponen ----------
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function avgPts(lms: Pt[], idx: number[]): Pt {
  let x = 0, y = 0;
  for (const i of idx) { x += lms[i].x; y += lms[i].y; }
  return { x: x / idx.length, y: y / idx.length };
}

// ambil piksel dalam patch lingkaran di sekitar pusat zona
function samplePatch(center: Pt, radius: number, data: Uint8ClampedArray, W: number, H: number): Sample[] {
  const out: Sample[] = [];
  const r = Math.max(2, Math.round(radius));
  const cx = Math.round(center.x), cy = Math.round(center.y);
  for (let y = cy - r; y <= cy + r; y++) {
    if (y < 0 || y >= H) continue;
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || x >= W) continue;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > r * r) continue;
      const i = (y * W + x) * 4;
      const rr = data[i], gg = data[i + 1], bb = data[i + 2];
      if (Math.max(rr, gg, bb) < 25) continue; // buang lubang hidung/bayangan pekat
      out.push([rr, gg, bb]);
    }
  }
  return out;
}

function buildInput(lms: Pt[], imgData: ImageData, W: number, H: number): SkinInput {
  const data = imgData.data;
  const faceW = Math.abs(lms[EDGE_R].x - lms[EDGE_L].x) || W * 0.5;
  const rad = faceW * 0.05;

  const cheek = [
    ...samplePatch(avgPts(lms, REGION.cheekL), rad, data, W, H),
    ...samplePatch(avgPts(lms, REGION.cheekR), rad, data, W, H),
  ];
  const tzone = [
    ...samplePatch(avgPts(lms, REGION.forehead), rad, data, W, H),
    ...samplePatch(avgPts(lms, REGION.nose), rad, data, W, H),
  ];
  const all = [...cheek, ...tzone, ...samplePatch(avgPts(lms, REGION.chin), rad, data, W, H)];

  // grid luminance wajah (fixed) untuk blur + exposure
  const minX = Math.max(0, Math.floor(lms[EDGE_L].x));
  const maxX = Math.min(W, Math.ceil(lms[EDGE_R].x));
  const minY = Math.max(0, Math.floor(avgPts(lms, REGION.forehead).y));
  const maxY = Math.min(H, Math.ceil(lms[152].y));
  const gw = 140;
  const gh = Math.max(2, Math.round((gw * (maxY - minY)) / Math.max(1, maxX - minX)));
  const faceLum: number[] = [];
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const sx = Math.min(W - 1, minX + Math.round((gx / gw) * (maxX - minX)));
      const sy = Math.min(H - 1, minY + Math.round((gy / gh) * (maxY - minY)));
      const i = (sy * W + sx) * 4;
      faceLum.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
  }

  // pose (kasar)
  const centerX = (lms[EDGE_L].x + lms[EDGE_R].x) / 2;
  const yaw = ((lms[NOSE_TIP].x - centerX) / (faceW / 2)) * 55;
  const eyesY = (lms[EYE_L].y + lms[EYE_R].y) / 2;
  const mouthY = lms[MOUTH].y;
  const ratio = (lms[NOSE_TIP].y - eyesY) / Math.max(1, mouthY - eyesY);
  const pitch = (ratio - 0.62) * 90;
  const roll = (Math.atan2(lms[EYE_R].y - lms[EYE_L].y, lms[EYE_R].x - lms[EYE_L].x) * 180) / Math.PI;

  return { cheek, tzone, all, faceLum, faceLumW: gw, faceLumH: gh, pose: { yaw, pitch, roll }, faceFound: true };
}
