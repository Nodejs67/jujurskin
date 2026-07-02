import type { Product } from "@/lib/products";

export interface SafetyParam {
  label: string;
  detail: string;
  good: boolean;
}

export interface SafetyResult {
  score: number;
  level: "Tinggi" | "Cukup" | "Perhatian";
  params: SafetyParam[];
}

// Kelompok bahan aktif "kuat". Sinonim dari molekul yang SAMA dikelompokkan
// agar tidak dihitung dua kali (mis. "Vitamin C" + "Ascorbic Acid" = 1 aktif).
const POTENT_GROUPS: string[][] = [
  ["retinol"], ["retinoid"], ["tretinoin"], ["adapalene"],
  ["salicylic"], ["glycolic"], ["lactic"], ["mandelic"],
  ["aha"], ["bha"], ["benzoyl"], ["azelaic"],
  ["vitamin c", "ascorbic acid"],
  ["alpha arbutin"],
];
const IRRITANTS = ["fragrance", "parfum", "alcohol denat", "essential oil", "menthol", "citrus", "peppermint"];

/**
 * Cocokkan istilah dengan BATAS KATA (\b), bukan substring. Ini mencegah
 * "benzoyl" salah cocok di "methoxydibenzoylmethane" (avobenzone, filter UV yang
 * aman) dan "aha"/"bha" salah cocok di tengah kata lain.
 */
function mentions(text: string, term: string): boolean {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${esc}\\b`, "i").test(text);
}

/**
 * Skor keamanan produk berbasis heuristik dari data yang tersedia
 * (BPOM, transparansi ingredient, perkiraan risiko iritasi, kejelasan kandungan aktif).
 * BUKAN penilaian medis/laboratorium — sebagai panduan awal saja.
 */
export function productSafety(p: Product): SafetyResult {
  const ing = p.key_ingredients.map((i) => i.toLowerCase());
  const joined = ing.join(" ");

  // 1. Transparansi ingredient (kandungan dipublikasikan)
  const transparency = p.key_ingredients.length >= 3 ? 25 : p.key_ingredients.length >= 1 ? 18 : 8;

  // 2. Legalitas (BPOM)
  const legality = p.bpom_registered ? 30 : 8;

  // 3. Risiko iritasi (semakin sedikit aktif keras/iritan, semakin tinggi skornya)
  const potentCount = POTENT_GROUPS.filter((group) => group.some((term) => mentions(joined, term))).length;
  const irritantCount = IRRITANTS.filter((a) => mentions(joined, a)).length;
  const irritationScore = Math.max(8, 30 - potentCount * 6 - irritantCount * 8);
  const irritationLevel = irritationScore >= 24 ? "rendah" : irritationScore >= 16 ? "sedang" : "tinggi";

  // 4. Kejelasan kandungan aktif (ada persentase konsentrasi yang dicantumkan)
  const hasPercent = /\d+(\.\d+)?\s*%/.test(joined);
  const clarity = hasPercent ? 15 : 10;

  const score = Math.min(100, transparency + legality + irritationScore + clarity);
  const level = score >= 80 ? "Tinggi" : score >= 60 ? "Cukup" : "Perhatian";

  const params: SafetyParam[] = [
    {
      label: "Legalitas (BPOM)",
      detail: p.bpom_registered ? "Terdaftar BPOM" : "Belum terverifikasi terdaftar BPOM",
      good: p.bpom_registered,
    },
    {
      label: "Transparansi ingredient",
      detail: `${p.key_ingredients.length} kandungan utama dicantumkan`,
      good: p.key_ingredients.length >= 1,
    },
    {
      label: "Risiko iritasi",
      detail: `Perkiraan ${irritationLevel}${potentCount > 0 ? ` — mengandung ${potentCount} bahan aktif kuat` : ""}`,
      good: irritationLevel === "rendah",
    },
    {
      label: "Kejelasan kandungan aktif",
      detail: hasPercent ? "Konsentrasi aktif dicantumkan" : "Konsentrasi tidak selalu dicantumkan",
      good: hasPercent,
    },
  ];

  return { score, level, params };
}
