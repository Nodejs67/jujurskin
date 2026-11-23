// ── Mencocokkan teks bebas yang diketik user ke data JujurSkin.
//
// KENYATAAN YANG HARUS DITERIMA: kami punya 220 produk. Skincare Indonesia punya ribuan.
// Jadi TIDAK dikenali adalah jalur NORMAL, bukan error. Kalau user mentok di langkah ini,
// tidak ada yang akan dibagikan — jadi produk asing tetap harus menghasilkan analisis
// (dari kandungan/klaim yang tersirat di namanya), bukan jalan buntu.

import { PRODUCTS, type Product } from "@/lib/products";
import { groupsFromClaims, groupsFromText } from "@/lib/roast/groups";
import type { DetectedGroup, MatchedProduct, RoastProductInput } from "@/lib/roast/types";

/** Kata umum yang tidak membedakan produk apa pun. */
const STOPWORDS = new Set([
  "the", "and", "dan", "untuk", "with", "dengan", "by", "de", "of",
  "ml", "gr", "gram", "pcs", "new", "original", "ori",
]);

/**
 * Kata jenis-produk. Muncul di ratusan produk sekaligus, jadi TIDAK boleh dipakai
 * sebagai bukti bahwa user memaksudkan produk tertentu. Tanpa pagar ini,
 * "Serum Retinal 0.1%" nyantol ke "Beauty of Joseon Revive Eye Serum" hanya karena
 * sama-sama punya kata "serum" + "retinal" — lalu kami mengarang kandungan
 * (niacinamide, HA, ceramide) yang tidak pernah dimiliki produk user.
 */
const GENERIC_TOKENS = new Set([
  "serum", "toner", "essence", "cleanser", "wash", "facewash", "foam", "sabun",
  "moisturizer", "moisturiser", "pelembap", "pelembab", "cream", "krim", "lotion", "gel",
  "sunscreen", "sunblock", "spf", "mist", "ampoule", "booster", "treatment", "acid",
  "facial", "face", "skin", "kulit", "wajah",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

/** Kategori sederhana yang dipakai mesin roast (lebih kasar dari ProductCategory). */
export type RoastCategory =
  | "cleanser"
  | "moisturizer"
  | "sunscreen"
  | "toner"
  | "serum"
  | "treatment"
  | "other";

/** Peta ProductCategory (lib/products.ts) → RoastCategory. */
const DB_CATEGORY_MAP: Record<string, RoastCategory> = {
  sunscreen: "sunscreen",
  cleanser: "cleanser",
  moisturizer: "moisturizer",
  toner: "toner",
  serum_niacinamide: "serum",
  serum_vitamin_c: "serum",
  serum_aha_bha: "serum",
  serum_retinol: "serum",
  serum_brightening: "serum",
  treatment_jerawat: "treatment",
};

/** Kata kunci kategori pada teks bebas. Diperiksa berurutan — yang lebih spesifik dulu. */
const CATEGORY_KEYWORDS: { category: RoastCategory; terms: string[] }[] = [
  { category: "sunscreen", terms: ["sunscreen", "sunblock", "spf", "tabir surya", "sun cream", "uv"] },
  {
    category: "cleanser",
    terms: [
      "cleanser", "facial wash", "face wash", "facewash", "sabun", "cuci muka",
      "cleansing", "micellar", "foam", "gentle wash", "pembersih",
    ],
  },
  { category: "toner", terms: ["toner", "essence", "mist"] },
  { category: "serum", terms: ["serum", "ampoule", "booster"] },
  { category: "treatment", terms: ["spot", "acne patch", "treatment", "obat jerawat"] },
  {
    category: "moisturizer",
    // "gel" sengaja TIDAK dimasukkan: terlalu ambigu ("gel adapalene", "gel cleanser").
    // Salah menandai sesuatu sebagai pelembap = produk itu jadi kebal analisis,
    // karena esensial tidak pernah kami tandai mubazir.
    terms: ["moisturizer", "moisturiser", "pelembap", "pelembab", "gel cream", "cream", "krim", "lotion"],
  },
];

function categoryFromText(text: string): RoastCategory | undefined {
  const n = ` ${normalize(text)} `;
  for (const { category, terms } of CATEGORY_KEYWORDS) {
    if (terms.some((t) => n.includes(` ${normalize(t)} `))) return category;
  }
  return undefined;
}

/**
 * Cari produk DB yang paling cocok dengan teks user.
 *
 * ATURAN: MEREK WAJIB DISEBUT. Merek adalah satu-satunya penanda yang benar-benar
 * mengidentifikasi produk; "serum retinal" bisa merujuk ratusan produk. Kalau merek
 * tidak disebut, kami TIDAK mengaku tahu produknya — kandungan tetap dibaca dari
 * teks yang user tulis. Lebih baik mengaku tidak tahu daripada mengarang isi produk.
 */
export function findDbProduct(text: string): Product | undefined {
  const userTokens = tokens(text);
  if (userTokens.length === 0) return undefined;

  let best: { product: Product; score: number } | undefined;

  for (const p of PRODUCTS) {
    const haystack = ` ${normalize(`${p.brand} ${p.name}`)} `;
    const brandTokens = tokens(p.brand);
    if (brandTokens.length === 0) continue;

    // Merek harus disebut lengkap ("beauty joseon", "the ordinary" → "ordinary").
    const brandHit = brandTokens.every((bt) => userTokens.includes(bt));
    if (!brandHit) continue;

    const matchedTokens = userTokens.filter((t) => haystack.includes(` ${t} `));

    // Selain merek, harus ada minimal 1 token khas (bukan kata jenis-produk),
    // supaya "Cetaphil" saja tidak asal nyantol ke salah satu Cetaphil acak.
    const distinctive = matchedTokens.filter((t) => !brandTokens.includes(t) && !GENERIC_TOKENS.has(t));
    if (distinctive.length === 0) continue;

    const score = matchedTokens.length / userTokens.length;
    if (!best || score > best.score) best = { product: p, score };
  }

  return best?.product;
}

/** Gabungkan grup dari beberapa sumber, sumber paling andal menang. */
function mergeGroups(entries: DetectedGroup[]): DetectedGroup[] {
  const rank: Record<string, number> = { db: 3, name: 2, claim: 1 };
  const bySource = new Map<string, DetectedGroup>();
  for (const e of entries) {
    const prev = bySource.get(e.groupId);
    if (!prev || rank[e.source] > rank[prev.source]) bySource.set(e.groupId, e);
  }
  return [...bySource.values()];
}

/** Cocokkan satu baris input user. Tidak pernah melempar error. */
export function matchProduct(input: RoastProductInput): MatchedProduct {
  const text = input.name.trim();
  const dbProduct = findDbProduct(text);

  const detected: DetectedGroup[] = [];

  // 1. Kandungan dari database (paling andal) — key_ingredients + INCI lengkap bila ada.
  if (dbProduct) {
    const dbText = [...dbProduct.key_ingredients, ...(dbProduct.full_ingredients ?? [])].join(" ");
    for (const groupId of groupsFromText(dbText)) {
      detected.push({ groupId, source: "db" });
    }
    // SPF adalah properti terstruktur, bukan cuma teks kandungan.
    if (dbProduct.category === "sunscreen" || typeof dbProduct.spf === "number") {
      detected.push({ groupId: "sunscreen", source: "db" });
    }
  }

  // 2. Kandungan yang user sebut langsung di teksnya ("Somethinc Niacinamide").
  for (const groupId of groupsFromText(text)) {
    detected.push({ groupId, source: "name" });
  }

  // 3. Klaim pemasaran ("Brightening toner") — tebakan, dan kami akui itu.
  for (const groupId of groupsFromClaims(text)) {
    detected.push({ groupId, source: "claim" });
  }

  const category: RoastCategory | undefined = dbProduct
    ? DB_CATEGORY_MAP[dbProduct.category] ?? categoryFromText(text)
    : categoryFromText(text);

  const groups = mergeGroups(detected);

  return {
    input,
    displayName: dbProduct ? `${dbProduct.brand} ${dbProduct.name}` : text,
    productId: dbProduct?.id,
    category,
    groups,
    // "Tidak dikenal" = tidak cocok DB DAN tidak ada satu pun petunjuk fungsi.
    unknown: !dbProduct && groups.length === 0 && !category,
  };
}

export function matchAll(inputs: RoastProductInput[]): MatchedProduct[] {
  return inputs.map(matchProduct);
}
