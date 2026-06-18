// Mesin "Sunscreen tanpa whitecast untuk kulit Indonesia".
// Klasifikasi filter UV dari daftar bahan + heuristik risiko whitecast.
// Jujur: ini PERKIRAAN dari jenis filter — whitecast asli juga tergantung
// formula, jumlah olesan, dan warna kulit. Tetap dianjurkan tes di rahang.

export type FilterType = "kimia" | "mineral" | "hybrid" | "tidak diketahui";
export type WhitecastLevel = "rendah" | "sedang" | "tinggi" | "tidak diketahui";
export type SkinTone = "terang" | "sawo-matang" | "gelap";

// Filter mineral (physical) → pemantul; paling sering meninggalkan lapisan putih,
// makin terlihat di kulit sawo matang/gelap.
const MINERAL = ["zinc oxide", "titanium dioxide"];
// Filter kimia/modern → menyerap UV, umumnya bening & menyatu di kulit.
const CHEMICAL = [
  "methoxycinnamate", "methoxydibenzoylmethane", "avobenzone", "octinoxate",
  "tinosorb", "bemotrizinol", "bisoctrizole", "uvinul", "octocrylene",
  "homosalate", "octisalate", "octy", "ensulizole", "mexoryl", "drometrizole",
  "diethylamino", "ethylhexyl salicylate", "ethylhexyl triazone", "iscotrizinol",
];
// Penanda formula yang biasanya menekan whitecast.
const TINT_HINTS = ["iron oxide", "tinted", "tone up", "cc "];

function norm(s: string) {
  return s.toLowerCase();
}

export function classifyFilters(ingredients: string[]): FilterType {
  const text = ingredients.map(norm).join(" | ");
  const hasMineral = MINERAL.some((m) => text.includes(m));
  const hasChemical = CHEMICAL.some((c) => text.includes(c));
  if (hasMineral && hasChemical) return "hybrid";
  if (hasMineral) return "mineral";
  if (hasChemical) return "kimia";
  return "tidak diketahui";
}

export function whitecastRisk(
  ingredients: string[],
  tagline?: string
): { level: WhitecastLevel; filterType: FilterType; reason: string } {
  const filterType = classifyFilters(ingredients);
  const claimNoWhitecast = !!tagline && /no\s*white\s*cast|tanpa white\s*cast|nyatu|menyatu/i.test(tagline);

  let level: WhitecastLevel;
  let reason: string;

  switch (filterType) {
    case "kimia":
      level = "rendah";
      reason = "Filter kimia/modern menyerap UV dan umumnya bening — minim whitecast di semua warna kulit.";
      break;
    case "hybrid":
      level = claimNoWhitecast ? "rendah" : "sedang";
      reason = claimNoWhitecast
        ? "Campuran filter kimia + mineral, tapi diformulasikan menyatu (klaim no white cast)."
        : "Campuran filter kimia + mineral — biasanya sedikit lebih putih dari sunscreen kimia murni.";
      break;
    case "mineral":
      level = claimNoWhitecast ? "sedang" : "tinggi";
      reason = claimNoWhitecast
        ? "Filter mineral murni — diklaim minim whitecast, tapi tetap berisiko terlihat di kulit lebih gelap. Tes dulu."
        : "Filter mineral murni (zinc/titanium) — paling berpotensi meninggalkan lapisan putih, terutama di kulit sawo matang/gelap.";
      break;
    default:
      level = "tidak diketahui";
      reason = "Jenis filter tidak terdeteksi dari bahan yang tercantum — cek kemasan & tes di rahang.";
  }
  return { level, filterType, reason };
}

// Gabungkan jenis filter dengan warna kulit user → vonis personal.
export function personalVerdict(filterType: FilterType, tone: SkinTone): { verdict: string; emoji: string } {
  if (filterType === "kimia") {
    return { verdict: "Aman — filter kimia menyatu di semua warna kulit, termasuk kulitmu.", emoji: "✅" };
  }
  if (filterType === "tidak diketahui") {
    return { verdict: "Belum bisa dipastikan dari bahannya. Oleskan setebal pakai sehari-hari di rahang, lihat 5 menit.", emoji: "🔎" };
  }
  // mineral / hybrid → tergantung warna kulit
  if (tone === "terang") {
    return {
      verdict: filterType === "mineral"
        ? "Whitecast mungkin ringan dan biasanya bisa di-blend di kulit terang. Tetap tes dulu."
        : "Umumnya aman di kulit terang, whitecast minim.",
      emoji: "🟢",
    };
  }
  if (tone === "sawo-matang") {
    return {
      verdict: filterType === "mineral"
        ? "Berisiko terlihat abu-abu/pucat di kulit sawo matang. Cari yang berfilter kimia atau yang tinted (iron oxide)."
        : "Bisa sedikit memutih — pilih yang tinted atau ber-filter kimia kalau ingin benar-benar menyatu.",
      emoji: filterType === "mineral" ? "🟠" : "🟡",
    };
  }
  // gelap
  return {
    verdict: filterType === "mineral"
      ? "Kemungkinan besar terlihat abu-abu/keunguan di kulit gelap. Sangat disarankan pilih filter kimia atau sunscreen tinted."
      : "Bisa memberi lapisan pucat di kulit gelap — pilihan paling aman: filter kimia atau tinted.",
    emoji: "🔴",
  };
}

export function levelColor(level: WhitecastLevel): string {
  return level === "rendah"
    ? "text-green-700 bg-green-400/10 border-green-400/20"
    : level === "sedang"
    ? "text-amber-700 bg-amber-400/10 border-amber-400/20"
    : level === "tinggi"
    ? "text-rose-700 bg-rose-400/10 border-rose-400/20"
    : "text-muted-foreground bg-secondary/30 border-border";
}

// Checklist memilih sunscreen yang menyatu di kulit Indonesia.
export const PILIH_CHECKLIST: { judul: string; isi: string }[] = [
  { judul: "Cek jenis filternya", isi: "Filter kimia (mis. Tinosorb, Uvinul, avobenzone, octocrylene) cenderung bening. Mineral murni (zinc oxide + titanium dioxide) paling berpotensi whitecast." },
  { judul: "Cari kata 'tinted' / iron oxide", isi: "Sunscreen tinted mengandung iron oxide yang menetralkan putihnya filter mineral — sering jadi solusi paling cocok untuk kulit sawo matang." },
  { judul: "Tes di garis rahang, bukan tangan", isi: "Kulit tangan beda warna dari wajah. Oleskan setebal pemakaian normal (2 jari) di rahang, tunggu 5 menit, lihat di cahaya alami." },
  { judul: "Whitecast bukan ukuran kualitas", isi: "Sunscreen yang sedikit whitecast tetap melindungi. Jangan kurangi takaran demi mengurangi putih — perlindungan lebih penting." },
  { judul: "Reapply tetap wajib", isi: "Sebagus apa pun, sunscreen perlu diulang tiap 2–3 jam saat aktif di luar. Ini berlaku untuk semua warna kulit." },
];
