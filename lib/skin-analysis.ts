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
  // warna kulit (Individual Typology Angle) — informatif, bukan baik/buruk
  skinTone: { ita: number; label: string };
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

// CATATAN: white-balance gray-world SENGAJA TIDAK dipakai untuk warna kulit.
// Gray-world dihitung dari piksel kulit akan menetralkan rata-rata warna kulit
// jadi abu-abu → justru MENGHAPUS kemerahan yang ingin diukur (terverifikasi:
// a* jatuh ke ~0 padahal kulit asli ~16). Maka a*/chroma diukur dari nilai mentah.

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const m = values.reduce((a, c) => a + c, 0) / values.length;
  const v = values.reduce((a, c) => a + (c - m) * (c - m), 0) / values.length;
  return Math.sqrt(v);
}

function clamp01to100(x: number): number {
  return Math.round(Math.min(100, Math.max(0, x)));
}

// Rata-rata & deviasi setelah membuang outlier (mis. piksel rambut/bayangan/kilau)
// → pengukuran jauh lebih stabil & akurat.
function trimmedStats(values: number[], trim = 0.1): { mean: number; std: number } {
  if (values.length === 0) return { mean: 0, std: 0 };
  const s = [...values].sort((a, b) => a - b);
  const k = Math.floor(s.length * trim);
  const c = k > 0 && s.length - 2 * k > 1 ? s.slice(k, s.length - k) : s;
  const m = c.reduce((a, x) => a + x, 0) / c.length;
  const v = c.reduce((a, x) => a + (x - m) * (x - m), 0) / c.length;
  return { mean: m, std: Math.sqrt(v) };
}

// ---------- Analisis utama ----------
export function analyzeSkin(input: SkinInput): SkinResult {
  const warnings: string[] = [];

  // --- Kemerahan (erythema) via a* CIELAB pada pipi (nilai MENTAH + trimmed) ---
  const cheekA = input.cheek.map(([r, g, b]) => labFromRgb(r, g, b).a);
  const meanA = trimmedStats(cheekA).mean;
  const rednessLevel: Level = meanA > 20 ? "tinggi" : meanA > 14 ? "sedang" : "rendah";
  const rednessScore = clamp01to100(((meanA - 8) / 20) * 100); // a* ~8..28 → 0..100

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

  // --- Warna kulit seluruh area (Lab mentah, trimmed) → kerataan + tone ITA° ---
  const allL: number[] = [], allA: number[] = [], allB: number[] = [];
  for (const [r, g, b] of input.all) {
    const lab = labFromRgb(r, g, b);
    allL.push(lab.L); allA.push(lab.a); allB.push(lab.bb);
  }
  const sa = trimmedStats(allA), sb = trimmedStats(allB), sl = trimmedStats(allL);
  const chromaSpread = Math.sqrt(sa.std ** 2 + sb.std ** 2);
  const evenLevel: Level = chromaSpread > 8 ? "tinggi" : chromaSpread > 5 ? "sedang" : "rendah";
  const evenScore = clamp01to100(((chromaSpread - 2) / 9) * 100); // makin tinggi = makin tidak rata

  // --- Warna kulit via ITA° (Individual Typology Angle) — standar dermatologi ---
  const ita = (Math.atan2(sl.mean - 50, sb.mean || 0.0001) * 180) / Math.PI;
  const toneLabel =
    ita > 55 ? "Sangat terang" : ita > 41 ? "Terang" : ita > 28 ? "Sedang" :
    ita > 10 ? "Sawo matang" : ita > -30 ? "Cokelat" : "Gelap";

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
    skinTone: { ita: Math.round(ita), label: toneLabel },
    scores: { redness: rednessScore, oiliness: oilScore, evenness: evenScore },
  };
}
