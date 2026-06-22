import { PRODUCTS, type Product, type ProductCategory } from "@/lib/products";
import { productSafety } from "@/lib/safety";

/**
 * MESIN PENCOCOK PRODUK (DB-driven, jujur, 3-tier).
 *
 * Mengganti daftar "examples" hardcoded dengan pencocokan nyata dari 220+
 * produk di database. Untuk setiap langkah rekomendasi (hasil mesin kuesioner
 * di lib/recommendations.ts), mesin ini:
 *   1. Memetakan kategori rekomendasi → kategori produk DB.
 *   2. Mengekstrak kandungan aktif yang dibutuhkan dari nama rekomendasi.
 *   3. Menyaring & menyekor produk berdasarkan: kecocokan kandungan, tipe kulit,
 *      concern, skor keamanan (lib/safety.ts), BPOM, dan rating komunitas.
 *   4. Menyusun 3 tier transparan: Pilihan Jujur / Premium / Luxury.
 *
 * FILOSOFI (inti brand "JujurSkin"): mahal ≠ lebih efektif. Tier premium/luxury
 * SELALU ditampilkan bersama opsi jujur, dengan catatan jujur soal apa yang
 * sebenarnya kamu bayar lebih (tekstur/pengalaman/brand), BUKAN khasiat aktif.
 */

// ── Pemetaan kategori rekomendasi (recommendations.ts) → kategori produk DB
const CATEGORY_MAP: Record<string, ProductCategory> = {
  "Sun Protection": "sunscreen",
  "Cleansing": "cleanser",
  "Moisturizing": "moisturizer",
  "Toner / Essence": "toner",
  "Acne Treatment": "treatment_jerawat",
  "Brightening & Repair": "serum_niacinamide",
  "Brightening": "serum_vitamin_c",
  "Anti-Aging": "serum_retinol",
  "Repair & Soothing": "serum_niacinamide",
  "Exfoliant": "serum_aha_bha",
  // fallback dari nama produk
  "Sunscreen": "sunscreen",
  "Cleanser": "cleanser",
  "Moisturizer": "moisturizer",
  "Niacinamide": "serum_niacinamide",
  "Vitamin C": "serum_vitamin_c",
  "Retinol": "serum_retinol",
  "AHA/BHA": "serum_aha_bha",
};

// ── Kata kunci kandungan aktif. Dipakai untuk (a) mendeteksi kandungan yang
//    diminta dari nama rekomendasi, dan (b) mencocokkannya ke kandungan produk.
const INGREDIENT_ALIASES: Record<string, string[]> = {
  niacinamide: ["niacinamide"],
  "vitamin c": ["vitamin c", "ascorbic", "ascorbyl", "ethyl ascorbic"],
  salicylic: ["salicylic", "bha"],
  retinol: ["retinol", "retinal", "retinoid", "adapalene", "retinyl"],
  bakuchiol: ["bakuchiol"],
  azelaic: ["azelaic"],
  arbutin: ["arbutin"],
  tranexamic: ["tranexamic"],
  hyaluronic: ["hyaluronic", "sodium hyaluronate"],
  ceramide: ["ceramide"],
  centella: ["centella", "cica", "asiatica", "madecassoside"],
  zinc: ["zinc"],
  aha: ["glycolic", "lactic", "mandelic", "aha"],
};

// Bahan yang dihindari saat hamil/menyusui (selaras lib/recommendations.ts).
const PREGNANCY_UNSAFE = ["retinol", "retinal", "retinoid", "tretinoin", "adapalene", "retinyl"];

export type RecTierLabel = "jujur" | "premium" | "luxury";

export interface TierMatch {
  tier: RecTierLabel;
  /** Label tampilan untuk tier ini. */
  tier_label: string;
  product: Product;
  /** Kenapa produk ini cocok dengan kebutuhanmu (jujur, berbasis data). */
  match_reason: string;
  /** Catatan jujur soal nilai/harga tier ini relatif ke Pilihan Jujur. */
  honest_note: string;
  /** Skor keamanan 0–100 dari lib/safety.ts. */
  safety_score: number;
  /** True bila harga produk jelas melebihi budget total pengguna (transparansi). */
  over_budget: boolean;
}

export interface ProductMatchResult {
  /** Tiga tier transparan (sebagian bisa kosong bila stok DB terbatas). */
  tiers: TierMatch[];
  /** Total produk yang lolos pencocokan (untuk "lihat semua"). */
  total_matched: number;
  /** Kandungan aktif yang dideteksi dari rekomendasi (untuk transparansi). */
  matched_ingredients: string[];
}

export interface MatchNeed {
  /** Kategori rekomendasi, mis. "Brightening & Repair". */
  recCategory: string;
  /** Nama produk rekomendasi, mis. "Niacinamide 10% Serum". */
  recProductName: string;
  /** Tipe kulit pengguna (dari kuesioner). */
  skinType?: string;
  /** Daftar masalah/concern pengguna (kode Problem dari recommendations.ts). */
  concerns?: string[];
  /** Budget total (Rp). 0/undefined = tak dibatasi. */
  budget?: number;
  /** Bila true, produk dengan retinoid disaring keluar (aman kehamilan). */
  pregnancySafe?: boolean;
}

// ── Pemetaan kode Problem (kuesioner) → kata kunci concern produk (DB).
const CONCERN_KEYWORDS: Record<string, string[]> = {
  jerawat: ["jerawat", "acne", "breakout"],
  bekas_jerawat: ["bekas", "pih", "noda"],
  kusam: ["kusam", "cerah", "glow", "brightening"],
  pori_besar: ["pori", "pore"],
  kering: ["kering", "kelembapan", "hidrasi", "dry"],
  berminyak: ["minyak", "oil", "sebum", "berminyak"],
  pigmentasi: ["hiperpigmentasi", "pigmentasi", "flek", "dark spot", "cerah"],
  anti_aging: ["penuaan", "aging", "garis", "keriput", "anti-aging"],
};

function detectIngredients(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [key, aliases] of Object.entries(INGREDIENT_ALIASES)) {
    if (aliases.some((a) => lower.includes(a))) found.push(key);
  }
  return found;
}

function productContainsIngredient(p: Product, key: string): boolean {
  const aliases = INGREDIENT_ALIASES[key] ?? [key];
  const haystack = [...p.key_ingredients, ...(p.full_ingredients ?? [])]
    .join(" ")
    .toLowerCase();
  return aliases.some((a) => haystack.includes(a));
}

function skinTypeMatches(p: Product, skinType?: string): boolean {
  if (!skinType) return true;
  const types = p.skin_types.map((t) => t.toLowerCase());
  if (types.includes("semua tipe")) return true;
  if (types.includes(skinType.toLowerCase())) return true;
  // kombinasi sering cocok dengan rekomendasi berminyak & sebaliknya
  if (skinType === "kombinasi" && types.includes("berminyak")) return true;
  return false;
}

function concernOverlap(p: Product, concerns?: string[]): number {
  if (!concerns || concerns.length === 0) return 0;
  const productConcerns = p.concerns.join(" ").toLowerCase();
  let overlap = 0;
  for (const c of concerns) {
    const keys = CONCERN_KEYWORDS[c] ?? [c];
    if (keys.some((k) => productConcerns.includes(k))) overlap++;
  }
  return overlap;
}

interface Scored {
  product: Product;
  score: number;
  safety: number;
  ingredientHit: boolean;
}

/**
 * Mencocokkan produk DB untuk satu langkah rekomendasi, lalu menyusun 3 tier.
 */
export function matchProducts(need: MatchNeed): ProductMatchResult {
  const category = CATEGORY_MAP[need.recCategory] ?? CATEGORY_MAP[need.recProductName];
  const wantedIngredients = detectIngredients(need.recProductName);

  if (!category) {
    return { tiers: [], total_matched: 0, matched_ingredients: wantedIngredients };
  }

  // 1) Filter dasar: kategori, BPOM (legalitas — sikap jujur), aman-kehamilan.
  let pool = PRODUCTS.filter((p) => p.category === category && p.bpom_registered);

  if (need.pregnancySafe) {
    pool = pool.filter((p) => {
      const ing = [...p.key_ingredients, ...(p.full_ingredients ?? [])]
        .join(" ")
        .toLowerCase();
      return !PREGNANCY_UNSAFE.some((u) => ing.includes(u));
    });
  }

  // 2) Skor tiap produk.
  const scored: Scored[] = pool.map((p) => {
    const safety = productSafety(p).score;
    let score = safety * 0.5; // dasar keamanan (0–50)

    // Kecocokan kandungan aktif yang diminta (sinyal terkuat).
    const ingredientHit = wantedIngredients.some((k) => productContainsIngredient(p, k));
    if (wantedIngredients.length > 0 && ingredientHit) score += 40;

    // Kecocokan tipe kulit.
    if (skinTypeMatches(p, need.skinType)) score += 15;

    // Tumpang tindih concern.
    score += Math.min(20, concernOverlap(p, need.concerns) * 10);

    // Rating komunitas sebagai pemecah seri (maks ~+10).
    score += Math.max(0, (p.rating_community - 4) * 10);

    return { product: p, score, safety, ingredientHit };
  });

  // Bila ada kandungan yang diminta, dahulukan yang benar-benar mengandungnya.
  const qualified = scored.sort((a, b) => {
    if (wantedIngredients.length > 0 && a.ingredientHit !== b.ingredientHit) {
      return a.ingredientHit ? -1 : 1;
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.product.price_max - b.product.price_max;
  });

  if (qualified.length === 0) {
    return { tiers: [], total_matched: 0, matched_ingredients: wantedIngredients };
  }

  // 3) Susun tier berdasarkan price_range, hindari duplikat.
  const used = new Set<string>();
  const pick = (predicate: (s: Scored) => boolean): Scored | undefined => {
    const found = qualified.find((s) => !used.has(s.product.id) && predicate(s));
    if (found) used.add(found.product.id);
    return found;
  };

  // Pilihan Jujur = skor terbaik di kelas budget/mid (value champion).
  const jujur =
    pick((s) => s.product.price_range === "budget" || s.product.price_range === "mid") ??
    pick(() => true); // fallback: apa pun yang tersisa

  // Premium = lebih mahal dari Jujur, kelas mid/premium.
  const jujurPrice = jujur?.product.price_max ?? 0;
  const premium = pick(
    (s) =>
      (s.product.price_range === "mid" || s.product.price_range === "premium") &&
      s.product.price_max > jujurPrice
  );

  // Luxury = kelas premium, harga tertinggi.
  const premiumPrice = premium?.product.price_max ?? jujurPrice;
  const luxuryCandidates = qualified
    .filter((s) => !used.has(s.product.id) && s.product.price_range === "premium" && s.product.price_max > premiumPrice)
    .sort((a, b) => b.product.price_max - a.product.price_max);
  const luxury = luxuryCandidates[0];
  if (luxury) used.add(luxury.product.id);

  const tiers: TierMatch[] = [];
  if (jujur) tiers.push(buildTier("jujur", jujur, jujur, wantedIngredients, need));
  if (premium) tiers.push(buildTier("premium", premium, jujur ?? premium, wantedIngredients, need));
  if (luxury) tiers.push(buildTier("luxury", luxury, jujur ?? luxury, wantedIngredients, need));

  return {
    tiers,
    total_matched: qualified.length,
    matched_ingredients: wantedIngredients,
  };
}

const TIER_LABELS: Record<RecTierLabel, string> = {
  jujur: "Pilihan Jujur",
  premium: "Premium",
  luxury: "Luxury",
};

function buildMatchReason(s: Scored, wanted: string[], need: MatchNeed): string {
  const bits: string[] = [];
  if (wanted.length > 0 && s.ingredientHit) {
    bits.push(`mengandung ${wanted.join(" / ")}`);
  }
  if (need.skinType && skinTypeMatches(s.product, need.skinType)) {
    bits.push(`cocok kulit ${need.skinType}`);
  }
  if (concernOverlap(s.product, need.concerns) > 0) {
    bits.push("sesuai masalah kulitmu");
  }
  bits.push(`skor keamanan ${s.safety}/100`);
  // Kapitalisasi awal kalimat.
  const joined = bits.join(", ");
  return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
}

function buildHonestNote(
  tier: RecTierLabel,
  s: Scored,
  jujur: Scored,
  need: MatchNeed
): string {
  if (tier === "jujur") {
    return "Kandungan inti sudah tepat dengan harga paling masuk akal — ini yang kami rekomendasikan. Kamu nggak perlu bayar lebih untuk hasil.";
  }

  const ratio = jujur.product.price_max > 0
    ? s.product.price_max / jujur.product.price_max
    : 1;
  const mult = ratio >= 1.3 ? `≈${ratio.toFixed(1)}× harga Pilihan Jujur. ` : "";

  // Alasan jujur kenapa worth (berbasis atribut, bukan klaim khasiat).
  // Pakai alasan "kulit sensitif" HANYA bila pengguna memang sensitif dan
  // produknya mendukung — supaya tidak terkesan mengada-ada.
  const supportsSensitive = s.product.skin_types.map((t) => t.toLowerCase()).includes("sensitif");
  const forSensitive = need.skinType === "sensitif" && supportsSensitive;

  if (tier === "premium") {
    const reason = forSensitive
      ? "Diformulasikan lebih lembut untuk kulit sensitif — lebih kecil risiko iritasi, lebih nyaman dipakai konsisten."
      : "Tekstur & pengalaman pakai lebih premium, jadi lebih enak dipakai setiap hari.";
    return `${mult}Kandungan aktifnya setara Pilihan Jujur. ${reason} Worth kalau kamu mau pengalaman lebih baik — bukan keharusan.`;
  }

  // luxury
  return `${mult}Kelas atas/impor. Secara kandungan aktif TIDAK wajib lebih unggul dari Pilihan Jujur — yang kamu bayar terutama formulasi premium, tekstur, dan brand. Pilih kalau kamu memang menginginkan tier ini.`;
}

function buildTier(
  tier: RecTierLabel,
  s: Scored,
  jujur: Scored,
  wanted: string[],
  need: MatchNeed
): TierMatch {
  return {
    tier,
    tier_label: TIER_LABELS[tier],
    product: s.product,
    match_reason: buildMatchReason(s, wanted, need),
    honest_note: buildHonestNote(tier, s, jujur, need),
    safety_score: s.safety,
    over_budget: !!(need.budget && need.budget > 0 && s.product.price_min > need.budget),
  };
}
