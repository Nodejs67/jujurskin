"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Camera, ShieldCheck, Upload, AlertTriangle, ArrowRight, Loader2, CheckCircle2, RotateCcw, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { analyzeSkin, type Sample, type SkinInput, type SkinResult, type Level } from "@/lib/skin-analysis";

// titik landmark MediaPipe (FaceMesh 468) per zona wajah
const REGION = {
  cheekL: [50, 101, 118, 117, 119],
  cheekR: [280, 330, 347, 346, 348],
  forehead: [10, 151, 9, 108, 337, 67, 297],
  nose: [4, 195, 5, 1, 19],
  chin: [152, 175, 199, 18, 200],
};
const EDGE_L = 234, EDGE_R = 454, EYE_L = 33, EYE_R = 263, NOSE_TIP = 1, MOUTH = 13;

type Pt = { x: number; y: number };
type Capture = { label: string; thumb: string; input: SkinInput };
type LiveStatus = { face: boolean; light: "gelap" | "baik" | "silau"; dist: "jauh" | "pas" | "dekat"; yaw: number };

const ANGLES = [
  { key: "depan", label: "Depan", instruksi: "Hadap lurus ke kamera" },
  { key: "samping1", label: "Samping kiri", instruksi: "Putar wajah perlahan ke satu sisi" },
  { key: "samping2", label: "Samping kanan", instruksi: "Putar wajah ke sisi sebaliknya" },
] as const;

function levelColor(level: Level) {
  return level === "tinggi"
    ? "text-rose-700 bg-rose-400/10 border-rose-400/20"
    : level === "sedang"
    ? "text-amber-700 bg-amber-400/10 border-amber-400/20"
    : "text-green-700 bg-green-400/10 border-green-400/20";
}

export default function AnalisisFotoPage() {
  const [mode, setMode] = useState<"pilih" | "kamera" | "upload">("pilih");
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [status, setStatus] = useState<"idle" | "loading-model" | "analyzing" | "done" | "error">("idle");
  const [result, setResult] = useState<SkinResult | null>(null);
  const [saran, setSaran] = useState<string | null>(null);
  const [saranLoading, setSaranLoading] = useState(false);

  // model refs (lazy)
  const imgLmRef = useRef<unknown>(null);
  const vidLmRef = useRef<unknown>(null);

  async function loadVision() {
    return await import("@mediapipe/tasks-vision");
  }
  async function getImageLandmarker() {
    if (imgLmRef.current) return imgLmRef.current;
    setStatus("loading-model");
    const v = await loadVision();
    const fs = await v.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
    imgLmRef.current = await v.FaceLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
      runningMode: "IMAGE", numFaces: 1,
    });
    setStatus("idle");
    return imgLmRef.current;
  }
  async function getVideoLandmarker() {
    if (vidLmRef.current) return vidLmRef.current;
    const v = await loadVision();
    const fs = await v.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
    vidLmRef.current = await v.FaceLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
      runningMode: "VIDEO", numFaces: 1,
    });
    return vidLmRef.current;
  }

  async function fetchSaran(res: SkinResult) {
    setSaran(null); setSaranLoading(true);
    try {
      const r = await fetch("/api/saran-kulit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores: res.scores,
          levels: {
            redness: res.metrics.find((m) => m.key === "redness")?.level,
            oiliness: res.metrics.find((m) => m.key === "oil")?.level,
            evenness: res.metrics.find((m) => m.key === "even")?.level,
          },
          meta: { tone: res.skinTone.label },
        }),
      });
      const d = await r.json();
      setSaran(d?.saran ?? null);
    } catch { setSaran(null); } finally { setSaranLoading(false); }
  }

  // gabungkan beberapa sudut jadi satu input (sampel warna lebih kaya), kualitas dari foto depan
  function runAnalysis(list: Capture[]) {
    if (list.length === 0) return;
    const front = list[0].input;
    const merged: SkinInput = {
      cheek: list.flatMap((c) => c.input.cheek),
      tzone: list.flatMap((c) => c.input.tzone),
      all: list.flatMap((c) => c.input.all),
      faceLum: front.faceLum, faceLumW: front.faceLumW, faceLumH: front.faceLumH,
      pose: front.pose, faceFound: list.some((c) => c.input.faceFound),
    };
    setStatus("analyzing");
    const res = analyzeSkin(merged);
    setResult(res);
    setStatus("done");
    if (res.confidence >= 40) fetchSaran(res);
  }

  function reset() {
    setCaptures([]); setResult(null); setSaran(null); setStatus("idle"); setMode("pilih");
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
              Ambil 3 sisi wajah (depan, kiri, kanan) dengan panduan cahaya & jarak — hasil lebih lengkap.
              Semua diproses di perangkatmu.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              <strong>Privasi penuh:</strong> kamera & analisis berjalan sepenuhnya di browsermu. Foto/video kamu
              <strong> tidak pernah diunggah</strong>, tidak disimpan, dan tidak dikirim ke server atau AI mana pun.
            </p>
          </div>

          {/* PILIH MODE */}
          {mode === "pilih" && status !== "done" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => setMode("kamera")}
                className="rounded-2xl border-2 border-border bg-card p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Pakai Kamera</p>
                <p className="text-xs text-muted-foreground mt-1">Dipandu langsung: posisi, cahaya, jarak. Paling akurat.</p>
              </button>
              <button onClick={() => setMode("upload")}
                className="rounded-2xl border-2 border-border bg-card p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Upload Foto</p>
                <p className="text-xs text-muted-foreground mt-1">Punya foto depan/kiri/kanan? Unggah di sini.</p>
              </button>
            </div>
          )}

          {mode === "kamera" && status !== "done" && (
            <CameraCapture
              getVideoLandmarker={getVideoLandmarker}
              captures={captures} setCaptures={setCaptures}
              onDone={(list) => runAnalysis(list)}
              onCancel={reset}
            />
          )}

          {mode === "upload" && status !== "done" && (
            <UploadCapture
              getImageLandmarker={getImageLandmarker}
              captures={captures} setCaptures={setCaptures}
              loadingModel={status === "loading-model"}
              onDone={(list) => runAnalysis(list)}
              onCancel={reset}
            />
          )}

          {status === "analyzing" && (
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center mt-6">
              <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis {captures.length} sisi di perangkatmu…
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-rose-700 text-center mt-6">Gagal memproses. Coba lagi atau pakai foto lain.</p>
          )}

          {status === "done" && result && (
            <div className="space-y-4 mt-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Keyakinan hasil · {captures.length} sisi</p>
                  <span className="text-sm font-bold text-foreground">{result.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div className={`h-full rounded-full ${result.confidence >= 70 ? "bg-green-600" : result.confidence >= 45 ? "bg-amber-500" : "bg-rose-600"}`} style={{ width: `${result.confidence}%` }} />
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

              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Warna kulit (ITA°)</p>
                  <p className="text-xs text-muted-foreground">Estimasi tone — informatif, bukan baik/buruk. Kulit sehat tak harus putih.</p>
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">{result.skinTone.label}</span>
              </div>

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

              {(saranLoading || saran) && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">AI</span> Saran personal
                  </p>
                  {saranLoading ? (
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Menyusun saran dari angka hasil ukur…</p>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{saran}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">Saran dibuat AI hanya dari <strong>angka hasil ukur</strong> — foto/video kamu tidak ikut dikirim.</p>
                </div>
              )}

              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Penting:</strong> ini pengukuran visual berbasis warna & cahaya —
                  <strong> bukan diagnosis medis</strong>. Untuk memantau progress, ambil foto dengan cahaya & posisi mirip tiap kali.
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:underline">
                    <RotateCcw className="w-4 h-4" /> Ulangi
                  </button>
                  <Link href="/analisis" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                    Lanjut ke Analisis Lengkap <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
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

// ───────────────── KAMERA ─────────────────
function CameraCapture({ getVideoLandmarker, captures, setCaptures, onDone, onCancel }: {
  getVideoLandmarker: () => Promise<unknown>;
  captures: Capture[]; setCaptures: React.Dispatch<React.SetStateAction<Capture[]>>;
  onDone: (list: Capture[]) => void; onCancel: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const workRef = useRef<HTMLCanvasElement>(null);
  const lastLmsRef = useRef<Pt[] | null>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState<LiveStatus>({ face: false, light: "gelap", dist: "jauh", yaw: 0 });
  const [camErr, setCamErr] = useState("");
  const [loading, setLoading] = useState(true);
  const step = captures.length; // 0,1,2
  const signsRef = useRef<number[]>([]); // tanda arah samping yang sudah diambil

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const lm = (await getVideoLandmarker()) as { detectForVideo: (v: HTMLVideoElement, t: number) => { faceLandmarks: Pt[][] } };
        if (!alive) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
        if (!alive) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setLoading(false);
        const work = workRef.current!;
        const loop = () => {
          if (!alive || !video.videoWidth) { rafRef.current = requestAnimationFrame(loop); return; }
          const res = lm.detectForVideo(video, performance.now());
          const faces = res.faceLandmarks;
          if (faces && faces.length) {
            const lms = faces[0];
            lastLmsRef.current = lms;
            const faceW = Math.abs(lms[EDGE_R].x - lms[EDGE_L].x);
            const centerX = (lms[EDGE_L].x + lms[EDGE_R].x) / 2;
            const yaw = ((lms[NOSE_TIP].x - centerX) / (faceW / 2)) * 55;
            // brightness dari frame kecil
            const gw = 64, gh = 48;
            work.width = gw; work.height = gh;
            const ctx = work.getContext("2d", { willReadFrequently: true })!;
            ctx.drawImage(video, 0, 0, gw, gh);
            const d = ctx.getImageData(0, 0, gw, gh).data;
            let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            const meanL = s / (gw * gh);
            setLive({
              face: true,
              light: meanL < 70 ? "gelap" : meanL > 205 ? "silau" : "baik",
              dist: faceW < 0.30 ? "jauh" : faceW > 0.62 ? "dekat" : "pas",
              yaw,
            });
          } else {
            lastLmsRef.current = null;
            setLive((p) => ({ ...p, face: false }));
          }
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (e) {
        console.error(e);
        setCamErr("Tidak bisa mengakses kamera. Izinkan akses kamera di browser, atau pakai mode Upload.");
        setLoading(false);
      }
    })();
    return () => { alive = false; stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // syarat siap ambil untuk step ini
  const target = ANGLES[step];
  let ready = live.face && live.light === "baik" && live.dist === "pas";
  let poseHint = "";
  if (step === 0) { ready = ready && Math.abs(live.yaw) < 14; if (Math.abs(live.yaw) >= 14) poseHint = "Hadap lurus ke depan"; }
  else {
    const turned = Math.abs(live.yaw) > 20;
    const sign = Math.sign(live.yaw);
    const opp = signsRef.current.length === 0 || signsRef.current[0] !== sign;
    ready = ready && turned && opp;
    if (!turned) poseHint = "Putar wajah lebih ke samping";
    else if (!opp) poseHint = "Putar ke sisi sebaliknya";
  }

  function capture() {
    const lms = lastLmsRef.current; const video = videoRef.current;
    if (!lms || !video) return;
    const W = Math.min(480, video.videoWidth);
    const H = Math.round((video.videoHeight / video.videoWidth) * W);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(video, 0, 0, W, H);
    const imgData = ctx.getImageData(0, 0, W, H);
    const px = lms.map((p) => ({ x: p.x * W, y: p.y * H }));
    const input = buildInput(px, imgData, W, H);
    const thumb = c.toDataURL("image/jpeg", 0.6);
    if (step > 0) signsRef.current.push(Math.sign(live.yaw));
    const next = [...captures, { label: target.label, thumb, input }];
    setCaptures(next);
    if (next.length >= 3) { stop(); onDone(next); }
  }

  if (camErr) {
    return (
      <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-center">
        <p className="text-sm text-rose-700 mb-3">{camErr}</p>
        <button onClick={onCancel} className="text-sm text-primary font-medium hover:underline">← Kembali pilih mode</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">Sisi {step + 1}/3 · {target.label}</p>
        <button onClick={() => { stop(); onCancel(); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><X className="w-3.5 h-3.5" /> Batal</button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border bg-black aspect-[3/4] max-w-sm mx-auto">
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
        {/* oval panduan jarak */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] h-[72%] rounded-[50%] border-4 ${ready ? "border-green-400" : "border-white/60"}`} />
        {loading && <div className="absolute inset-0 flex items-center justify-center text-white text-sm"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Menyiapkan kamera…</div>}
        {/* thumbnails captured */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {captures.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={c.thumb} alt={c.label} className="w-9 h-12 object-cover rounded border-2 border-green-400" />
          ))}
        </div>
      </div>

      {/* status chips */}
      <div className="flex flex-wrap gap-2 justify-center mt-3 text-[11px]">
        <LiveChip ok={live.face} label={live.face ? "Wajah terdeteksi" : "Wajah tak terlihat"} />
        <LiveChip ok={live.light === "baik"} label={`Cahaya: ${live.light}`} />
        <LiveChip ok={live.dist === "pas"} label={`Jarak: ${live.dist}`} />
      </div>
      <p className="text-center text-sm text-foreground mt-3 font-medium">{target.instruksi}</p>
      {poseHint && <p className="text-center text-xs text-amber-700 mt-1">{poseHint}</p>}

      <button onClick={capture} disabled={!ready}
        className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${ready ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary/50 text-muted-foreground cursor-not-allowed"}`}>
        {ready ? `Ambil foto ${target.label}` : "Sesuaikan posisi, cahaya & jarak dulu"}
      </button>
      {captures.length > 0 && captures.length < 3 && (
        <button onClick={() => { streamRef.current?.getTracks().forEach((t) => t.stop()); cancelAnimationFrame(rafRef.current); onDone(captures); }}
          className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground">
          Cukup, analisis {captures.length} sisi yang sudah diambil →
        </button>
      )}
      <canvas ref={workRef} className="hidden" />
    </div>
  );
}

function LiveChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${ok ? "text-green-700 bg-green-400/10 border-green-400/20" : "text-amber-700 bg-amber-400/10 border-amber-400/20"}`}>
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {label}
    </span>
  );
}

// ───────────────── UPLOAD ─────────────────
function UploadCapture({ getImageLandmarker, captures, setCaptures, loadingModel, onDone, onCancel }: {
  getImageLandmarker: () => Promise<unknown>;
  captures: Capture[]; setCaptures: React.Dispatch<React.SetStateAction<Capture[]>>;
  loadingModel: boolean; onDone: (list: Capture[]) => void; onCancel: () => void;
}) {
  const [busy, setBusy] = useState<string>("");
  const [err, setErr] = useState("");

  async function handleFile(angle: typeof ANGLES[number], file: File) {
    setErr(""); setBusy(angle.key);
    try {
      const lm = (await getImageLandmarker()) as { detect: (c: HTMLCanvasElement) => { faceLandmarks: Pt[][] } };
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      const W = Math.min(480, img.width);
      const H = Math.max(1, Math.round((img.height / img.width) * W));
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, W, H);
      const imgData = ctx.getImageData(0, 0, W, H);
      const det = lm.detect(c);
      const faces = det.faceLandmarks;
      const input: SkinInput = faces && faces.length
        ? buildInput(faces[0].map((p) => ({ x: p.x * W, y: p.y * H })), imgData, W, H)
        : { cheek: [], tzone: [], all: [], faceLum: [], faceLumW: 0, faceLumH: 0, pose: { yaw: 0, pitch: 0, roll: 0 }, faceFound: false };
      const thumb = c.toDataURL("image/jpeg", 0.6);
      setCaptures((prev) => {
        const without = prev.filter((p) => p.label !== angle.label);
        // jaga urutan depan dulu
        const list = [...without, { label: angle.label, thumb, input }];
        return list.sort((a, b) => ANGLES.findIndex((x) => x.label === a.label) - ANGLES.findIndex((x) => x.label === b.label));
      });
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); setErr("Gagal membaca foto. Coba JPG/PNG lain."); }
    finally { setBusy(""); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">Upload foto (depan wajib, samping opsional)</p>
        <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><X className="w-3.5 h-3.5" /> Batal</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {ANGLES.map((a) => {
          const got = captures.find((c) => c.label === a.label);
          return (
            <label key={a.key} className="rounded-xl border-2 border-dashed border-border bg-card p-2 text-center cursor-pointer hover:border-primary/40 transition-colors aspect-[3/4] flex flex-col items-center justify-center overflow-hidden">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(a, f); }} />
              {busy === a.key ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : got ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={got.thumb} alt={a.label} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-[11px] font-medium text-foreground">{a.label}</span>
                  <span className="text-[10px] text-muted-foreground">{a.key === "depan" ? "wajib" : "opsional"}</span>
                </>
              )}
            </label>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">Tips: cahaya alami merata, wajah close-up, tanpa filter/makeup tebal.</p>
      {loadingModel && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan model (sekali saja)…</p>}
      {err && <p className="text-xs text-rose-700 mt-2">{err}</p>}

      <button onClick={() => onDone(captures)} disabled={captures.length === 0 || !!busy}
        className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${captures.length > 0 && !busy ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary/50 text-muted-foreground cursor-not-allowed"}`}>
        {captures.length > 0 ? `Analisis ${captures.length} foto` : "Unggah minimal 1 foto"}
      </button>
    </div>
  );
}

// ───────────────── helper analisis ─────────────────
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
function avgPts(lms: Pt[], idx: number[]): Pt {
  let x = 0, y = 0; for (const i of idx) { x += lms[i].x; y += lms[i].y; } return { x: x / idx.length, y: y / idx.length };
}
function samplePatch(center: Pt, radius: number, data: Uint8ClampedArray, W: number, H: number): Sample[] {
  const out: Sample[] = [];
  const r = Math.max(2, Math.round(radius));
  const cx = Math.round(center.x), cy = Math.round(center.y);
  for (let y = cy - r; y <= cy + r; y++) {
    if (y < 0 || y >= H) continue;
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || x >= W) continue;
      const dx = x - cx, dy = y - cy; if (dx * dx + dy * dy > r * r) continue;
      const i = (y * W + x) * 4; const rr = data[i], gg = data[i + 1], bb = data[i + 2];
      if (Math.max(rr, gg, bb) < 25) continue;
      out.push([rr, gg, bb]);
    }
  }
  return out;
}
function buildInput(lms: Pt[], imgData: ImageData, W: number, H: number): SkinInput {
  const data = imgData.data;
  const faceW = Math.abs(lms[EDGE_R].x - lms[EDGE_L].x) || W * 0.5;
  const rad = faceW * 0.05;
  const cheek = [...samplePatch(avgPts(lms, REGION.cheekL), rad, data, W, H), ...samplePatch(avgPts(lms, REGION.cheekR), rad, data, W, H)];
  const tzone = [...samplePatch(avgPts(lms, REGION.forehead), rad, data, W, H), ...samplePatch(avgPts(lms, REGION.nose), rad, data, W, H)];
  const all = [...cheek, ...tzone, ...samplePatch(avgPts(lms, REGION.chin), rad, data, W, H)];
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
  const centerX = (lms[EDGE_L].x + lms[EDGE_R].x) / 2;
  const yaw = ((lms[NOSE_TIP].x - centerX) / (faceW / 2)) * 55;
  const eyesY = (lms[EYE_L].y + lms[EYE_R].y) / 2;
  const mouthY = lms[MOUTH].y;
  const ratio = (lms[NOSE_TIP].y - eyesY) / Math.max(1, mouthY - eyesY);
  const pitch = (ratio - 0.62) * 90;
  const roll = (Math.atan2(lms[EYE_R].y - lms[EYE_L].y, lms[EYE_R].x - lms[EYE_L].x) * 180) / Math.PI;
  return { cheek, tzone, all, faceLum, faceLumW: gw, faceLumH: gh, pose: { yaw, pitch, roll }, faceFound: true };
}
