// Mesin analisis kulit ON-DEVICE (Tingkat 1–4).
// Murni matematika warna — tidak ada jaringan, tidak ada upload.
// Foto user TIDAK PERNAH meninggalkan perangkat. File ini hanya menerima
// kumpulan piksel (angka RGB) yang sudah diambil dari <canvas> di browser.

export type Sample = [number, number, number]; // r,g,b (0–255)

export type SkinInput = {
  cheek: Sample[]; // piksel pipi kiri+kanan (untuk kemerahan)
  tzone: Sample[]; // piksel dahi+hidung (untuk kilap/minyak)
  all: Sample[]; // semua piksel kulit (untuk kerataan & white-balance)
  faceLum: number[]; // luminance grid wajah (untuk blur & exposure)
  faceLumW: number;
  faceLumH: number;
  pose: { yaw: number; pitch: number; roll: number }; // derajat (kasar)
  faceFound: boolean;
};

export type Level = "rendah" | "sedang" | "tinggi";

export type SkinMetric = {
  key: string;
  label: string;
  level: Level;
  value: number; // angka mentah (untuk progress)
  unit: string;
  desc: string;
  tip: string;
};

export type SkinResult = {
  metrics: SkinMetric[];
  confidence: number; // 0–100
  quality: {
    exposure: "gelap" | "baik" | "terang";
    blur: "tajam" | "agak buram" | "buram";
    pose: "lurus" | "miring";
    clipping: number; // fraksi piksel mentok 0/255
  };
  warnings: string[];
  // skor 0–100 ternormalisasi — dipakai untuk membandingkan antar-waktu (progress)
  scores: { redness: number; oiliness: number; evenness: number };
};

// ---------- Konversi warna: sRGB → CIELAB (D65) ----------
function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function labFromRgb(r: number, g: number, b: number): { L: number; a: number; bb: number } {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);
  // linear RGB → XYZ (D65)
  const X = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
  const Y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
  const Z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
  // normalisasi white point D65
  const xr = X / 0.95047;
  const yr = Y / 1.0;
  const zr = Z / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), bb: 200 * (fy - fz) };
}

// ---------- White-balance: gray-world ----------
// Buang cast lampu (kuning/biru) sebelum mengukur warna → kemerahan jadi
// jauh lebih tahan terhadap perbedaan pencahayaan.
function grayWorldGains(samples: Sample[]): [number, number, number] {
  if (!samples.length) return [1, 1, 1];
  let sr = 0, sg = 0, sb = 0;
  for (const [r, g, b] of samples) { sr += r; sg += g; sb += b; }
  const mr = sr / samples.length, mg = sg / samples.length, mb = sb / samples.length;
  const gray = (mr + mg + mb) / 3;
  const clamp = (x: number) => Math.min(1.4, Math.max(0.7, x)); // jangan overkoreksi
  return [clamp(gray / (mr || 1)), clamp(gray / (mg || 1)), clamp(gray / (mb || 1))];
}

function applyGain([r, g, b]: Sample, [gr, gg, gb]: [number, number, number]): Sample {
  return [Math.min(255, r * gr), Math.min(255, g * gg), Math.min(255, b * gb)];
}

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const m = values.reduce((a, c) => a + c, 0) / values.length;
  const v = values.reduce((a, c) => a + (c - m) * (c - m), 0) / values.length;
  return Math.sqrt(v);
}

function clamp01to100(x: number): number {
  return Math.round(Math.min(100, Math.max(0, x)));
}

// ---------- Analisis utama ----------
export function analyzeSkin(input: SkinInput): SkinResult {
  const warnings: string[] = [];
  const gains = grayWorldGains(input.all);

  // --- Kemerahan (erythema) via a* CIELAB pada pipi, sudah white-balanced ---
  const cheekA: number[] = [];
  for (const s of input.cheek) {
    const [r, g, b] = applyGain(s, gains);
    cheekA.push(labFromRgb(r, g, b).a);
  }
  const meanA = cheekA.length ? cheekA.reduce((a, c) => a + c, 0) / cheekA.length : 0;
  const rednessLevel: Level = meanA > 18 ? "tinggi" : meanA > 13 ? "sedang" : "rendah";
  const rednessScore = clamp01to100(((meanA - 6) / 22) * 100); // a* ~6..28 → 0..100

  // --- Kilap/minyak via specular (HSV: terang + tak jenuh) pada T-zone ---
  let shineTz = 0;
  for (const [r, g, b] of input.tzone) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max / 255;
    const s = max ? (max - min) / max : 0;
    if (v > 0.82 && s < 0.18) shineTz++;
  }
  const shineFrac = input.tzone.length ? shineTz / input.tzone.length : 0;
  const shineLevel: Level = shineFrac > 0.05 ? "tinggi" : shineFrac > 0.015 ? "sedang" : "rendah";
  const oilScore = clamp01to100(shineFrac * 1200);

  // --- Kerataan warna via sebaran chroma (a*,b*) seluruh kulit ---
  const allA: number[] = [];
  const allB: number[] = [];
  for (const s of input.all) {
    const [r, g, b] = applyGain(s, gains);
    const lab = labFromRgb(r, g, b);
    allA.push(lab.a);
    allB.push(lab.bb);
  }
  const chromaSpread = Math.sqrt(std(allA) ** 2 + std(allB) ** 2);
  const evenLevel: Level = chromaSpread > 9 ? "tinggi" : chromaSpread > 6 ? "sedang" : "rendah";
  const evenScore = clamp01to100(((chromaSpread - 3) / 10) * 100); // makin tinggi = makin tidak rata

  // --- Kualitas foto: exposure, clipping, blur ---
  const lum = input.faceLum;
  const meanLum = lum.length ? lum.reduce((a, c) => a + c, 0) / lum.length : 0;
  let clipped = 0;
  for (const l of lum) if (l < 4 || l > 250) clipped++;
  const clipping = lum.length ? clipped / lum.length : 0;
  const exposure: "gelap" | "baik" | "terang" = meanLum < 65 ? "gelap" : meanLum > 205 ? "terang" : "baik";

  // Blur via variansi Laplacian (4-tetangga) pada grid luminance wajah
  let lapVar = 0;
  const W = input.faceLumW, H = input.faceLumH;
  if (W > 2 && H > 2 && lum.length === W * H) {
    const lap: number[] = [];
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        lap.push(lum[i - 1] + lum[i + 1] + lum[i - W] + lum[i + W] - 4 * lum[i]);
      }
    }
    lapVar = std(lap) ** 2;
  }
  const blur: "tajam" | "agak buram" | "buram" = lapVar < 60 ? "buram" : lapVar < 200 ? "agak buram" : "tajam";

  // --- Pose ---
  const frontal = Math.abs(input.pose.yaw) < 16 && Math.abs(input.pose.pitch) < 16 && Math.abs(input.pose.roll) < 14;
  const pose: "lurus" | "miring" = frontal ? "lurus" : "miring";

  // --- Confidence gabungan ---
  let confidence = 98;
  if (!input.faceFound) { confidence = 18; warnings.push("Wajah tidak terdeteksi. Pakai foto close-up wajah menghadap kamera."); }
  else {
    if (exposure !== "baik") { confidence -= 26; warnings.push(`Pencahayaan ${exposure === "gelap" ? "terlalu gelap" : "terlalu terang"} — hasil bisa meleset. Coba cahaya alami merata.`); }
    if (blur === "buram") { confidence -= 28; warnings.push("Foto buram. Pegang HP stabil & pastikan fokus ke wajah."); }
    else if (blur === "agak buram") { confidence -= 12; }
    if (pose === "miring") { confidence -= 20; warnings.push("Wajah agak miring. Hadap lurus ke kamera agar perbandingan antar-waktu adil."); }
    if (clipping > 0.06) { confidence -= 10; warnings.push("Ada area kelebihan cahaya (flash/silau). Matikan flash, hindari sumber cahaya langsung."); }
  }
  confidence = Math.round(Math.min(98, Math.max(10, confidence)));

  const metrics: SkinMetric[] = [
    {
      key: "redness", label: "Kemerahan", level: rednessLevel, value: Math.round(meanA * 10) / 10, unit: "a*",
      desc:
        rednessLevel === "tinggi" ? "Kemerahan di pipi tampak cukup menonjol." :
        rednessLevel === "sedang" ? "Ada kemerahan ringan di pipi." :
        "Kemerahan minim — warna pipi cenderung tenang.",
      tip: "Kemerahan sering tanda iritasi / skin barrier lemah. Kurangi over-exfoliating, perkuat dengan pelembap & niacinamide, jangan lupa sunscreen.",
    },
    {
      key: "oil", label: "Kilap / Minyak (T-zone)", level: shineLevel, value: Math.round(shineFrac * 1000) / 10, unit: "%",
      desc:
        shineLevel === "tinggi" ? "T-zone (dahi & hidung) tampak banyak kilap." :
        shineLevel === "sedang" ? "Kilap T-zone sedang." :
        "T-zone tampak relatif matte / cenderung kering.",
      tip: "Kilap tinggi → gel moisturizer ringan & sunscreen non-greasy. Catatan jujur: keringat/flash bisa bikin tampak lebih mengilap dari aslinya.",
    },
    {
      key: "even", label: "Kerataan Warna", level: evenLevel, value: Math.round(chromaSpread * 10) / 10, unit: "Δ",
      desc:
        evenLevel === "tinggi" ? "Warna kulit tampak kurang merata (mungkin bekas jerawat / pigmentasi)." :
        evenLevel === "sedang" ? "Warna kulit cukup merata." :
        "Warna kulit tampak merata.",
      tip: "Ketidakrataan butuh waktu memudar. Konsisten sunscreen tiap hari + bahan pencerah bertahap (niacinamide, vitamin C) lebih efektif daripada produk mahal sesaat.",
    },
  ];

  return {
    metrics,
    confidence,
    quality: { exposure, blur, pose, clipping: Math.round(clipping * 1000) / 1000 },
    warnings,
    scores: { redness: rednessScore, oiliness: oilScore, evenness: evenScore },
  };
}
