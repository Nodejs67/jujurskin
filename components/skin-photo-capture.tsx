"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Upload, AlertTriangle, Loader2, CheckCircle2, X } from "lucide-react";
import { analyzeSkin, type Sample, type SkinInput, type SkinResult } from "@/lib/skin-analysis";

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

/**
 * Komponen tangkap + analisis kulit dari foto, 100% on-device.
 * Memanggil `onResult(result, jumlahSisi)` saat selesai mengukur.
 * Dipakai di halaman /analisis-foto maupun sebagai langkah opsional di /analisis.
 */
export function SkinPhotoCapture({
  onResult,
  onCancel,
}: {
  onResult: (result: SkinResult, sides: number) => void;
  onCancel?: () => void;
}) {
  const [mode, setMode] = useState<"pilih" | "kamera" | "upload">("pilih");
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [status, setStatus] = useState<"idle" | "loading-model" | "analyzing" | "error">("idle");

  // model refs (lazy — MediaPipe baru diunduh saat dibutuhkan)
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
    onResult(res, list.length);
    setStatus("idle");
  }

  function backToPilih() {
    setCaptures([]);
    setStatus("idle");
    setMode("pilih");
    onCancel?.();
  }

  return (
    <div>
      {mode === "pilih" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => setMode("upload")}
            className="relative rounded-2xl border-2 border-primary/40 bg-primary/5 p-6 text-center hover:border-primary/60 transition-colors">
            <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">Disarankan</span>
            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Upload Foto</p>
            <p className="text-xs text-muted-foreground mt-1">Pakai foto yang sudah ada di galeri (JPG/PNG). Paling cepat & gampang — tanpa kamera live.</p>
          </button>
          <button onClick={() => setMode("kamera")}
            className="rounded-2xl border-2 border-border bg-card p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors">
            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Pakai Kamera</p>
            <p className="text-xs text-muted-foreground mt-1">Dipandu langsung & paling akurat. Butuh izin kamera dan sedikit waktu memuat.</p>
          </button>
        </div>
      )}

      {mode === "kamera" && (
        <CameraCapture
          getVideoLandmarker={getVideoLandmarker}
          captures={captures} setCaptures={setCaptures}
          onDone={(list) => runAnalysis(list)}
          onCancel={backToPilih}
        />
      )}

      {mode === "upload" && (
        <UploadCapture
          getImageLandmarker={getImageLandmarker}
          captures={captures} setCaptures={setCaptures}
          loadingModel={status === "loading-model"}
          onDone={(list) => runAnalysis(list)}
          onCancel={backToPilih}
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
    </div>
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
