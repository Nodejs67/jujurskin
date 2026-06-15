export type Problem =
  | "jerawat"
  | "bekas_jerawat"
  | "kusam"
  | "pori_besar"
  | "kering"
  | "berminyak"
  | "pigmentasi"
  | "anti_aging";

export type SkinType = "normal" | "berminyak" | "kering" | "kombinasi" | "sensitif";

export interface AnalysisInput {
  nama: string;
  usia: number;
  kota: string;
  jenis_kelamin: "pria" | "wanita";
  tipe_kulit: SkinType;
  masalah: Problem[];
  budget: number;
  produk_existing: string;
}

export interface Recommendation {
  priority: number;
  product: string;
  category: string;
  reason: string;
  price_min: number;
  price_max: number;
  examples: string[];
  frequency: string;
}

export interface SkipItem {
  product: string;
  reason: string;
  saving_estimate: number;
}

export interface SkinScore {
  total: number;
  barrier: number;
  hydration: number;
  uv_protection: number;
  acne_control: number;
}

export interface AnalysisResult {
  recs: Recommendation[];
  skips: SkipItem[];
  score: SkinScore;
  budget_used: number;
  budget_left: number;
  summary: string;
  climate_tip: string;
}

// ── Kota dengan iklim ekstrem di Indonesia
const HIGH_UV_CITIES = ["medan", "makassar", "surabaya", "pekanbaru", "palembang", "batam", "pontianak", "kupang", "manado", "jayapura"];
const COOL_CITIES = ["bandung", "malang", "batu", "salatiga", "bukittinggi", "berastagi", "tomohon"];

function climateTip(kota: string): string {
  const k = kota.toLowerCase();
  if (HIGH_UV_CITIES.some((c) => k.includes(c)))
    return `${kota} punya UV index sangat tinggi (rata-rata 9–11). Wajib reapply sunscreen setiap 90–120 menit saat di luar. Pilih sunscreen water-resistant.`;
  if (COOL_CITIES.some((c) => k.includes(c)))
    return `${kota} punya cuaca lebih sejuk dan kelembapan lebih rendah. Kamu bisa pakai moisturizer yang lebih rich, dan sunscreen tetap wajib meski mendung.`;
  return `Indonesia rata-rata punya UV index 8–10. Sunscreen adalah investasi terbaik untuk kulitmu — pakai setiap pagi, hujan maupun cerah.`;
}

export function generateRecommendations(input: AnalysisInput): AnalysisResult {
  const recs: Recommendation[] = [];
  const skips: SkipItem[] = [];
  let budgetLeft = input.budget;
  let priority = 1;

  const has = (p: Problem) => input.masalah.includes(p);
  const isSensitive = input.tipe_kulit === "sensitif";
  const isOily = input.tipe_kulit === "berminyak" || input.tipe_kulit === "kombinasi";
  const isDry = input.tipe_kulit === "kering";

  // ── 1. SUNSCREEN — selalu prioritas 1 di Indonesia
  const spfMin = 25000, spfMax = 75000;
  recs.push({
    priority: priority++,
    product: "Sunscreen SPF 50+",
    category: "Sun Protection",
    reason:
      "UV index Indonesia rata-rata 8–10 sepanjang tahun. Tanpa sunscreen, semua treatment lain sia-sia karena UV memperparah jerawat, bekas, dan penuaan.",
    price_min: spfMin,
    price_max: spfMax,
    examples: isOily
      ? ["Azarine Hydrasoothe SPF 45 (±35k)", "Make Over UV Shield SPF 50+ (±55k)", "Wardah UV Shield (±50k)"]
      : isDry
      ? ["Skintific Aqua Air Sunscreen SPF 50 (±65k)", "Skin1004 Madagascar Centella Sun Serum (±95k)"]
      : ["Azarine Hydrasoothe SPF 45 (±35k)", "Somethinc Level Up (±55k)", "Emina Sun Protection (±30k)"],
    frequency: "Setiap pagi, reapply tiap 2 jam jika di luar",
  });
  budgetLeft -= (spfMin + spfMax) / 2;

  // ── 2. GENTLE CLEANSER — selalu prioritas 2
  const cleanMin = 15000, cleanMax = 50000;
  recs.push({
    priority: priority++,
    product: isSensitive ? "Ultra-gentle Cleanser (pH rendah, fragrance-free)" : "Gentle Low-pH Cleanser",
    category: "Cleansing",
    reason:
      isSensitive
        ? "Kulit sensitifmu butuh cleanser yang benar-benar lembut, tanpa SLS, tanpa wewangian. Salah cleanser bisa memicu iritasi."
        : "Fondasi semua routine. Salah cleanser (terlalu keras) bisa merusak skin barrier dan memperparah semua masalah kulitmu.",
    price_min: cleanMin,
    price_max: cleanMax,
    examples: isSensitive
      ? ["Cetaphil Gentle Skin Cleanser (±60k)", "Avoskin Very Gentle Jelly Cleanser (±50k)", "La Roche-Posay Toleriane (±180k)"]
      : isOily
      ? ["Cosrx Low-pH Good Morning Gel Cleanser (±100k via reseller)", "Somethinc Low pH Cleanser (±45k)", "NPURE Centella Cleanser (±35k)"]
      : ["Cetaphil (±55k)", "Neutrogena Ultra Gentle (±70k)", "Hada Labo Gokujyun (±65k)"],
    frequency: "2x sehari — pagi dan malam",
  });
  budgetLeft -= (cleanMin + cleanMax) / 2;

  // ── TREATMENT berdasarkan masalah utama
  if (has("jerawat") && budgetLeft > 30000) {
    recs.push({
      priority: priority++,
      product: isSensitive ? "Azelaic Acid 10%" : "Salicylic Acid 2% Serum/Toner",
      category: "Acne Treatment",
      reason: isSensitive
        ? "Azelaic Acid lebih lembut dari BHA tapi sama efektifnya untuk jerawat. Cocok untuk kulit sensitif."
        : "BHA (Salicylic Acid) masuk ke dalam pori dan membersihkan sumbatan penyebab jerawat dari dalam.",
      price_min: 35000,
      price_max: 90000,
      examples: isSensitive
        ? ["Azarine Azelaic Acid 10% (±55k)", "Somethinc Azelaic Acid (±75k)"]
        : ["Somethinc BHA+ (±65k)", "The Ordinary Salicylic Acid 2% (±100k reseller)", "Skintific BHA (±70k)"],
      frequency: "1x sehari malam, mulai 2-3x/minggu dulu",
    });
    budgetLeft -= 60000;
  }

  if (has("bekas_jerawat") && budgetLeft > 25000) {
    recs.push({
      priority: priority++,
      product: "Niacinamide 10% Serum",
      category: "Brightening & Repair",
      reason:
        "Niacinamide efektif memudarkan bekas jerawat sekaligus mengontrol minyak. Bisa dipakai pagi dan malam, aman untuk semua tipe kulit.",
      price_min: 30000,
      price_max: 80000,
      examples: ["Somethinc Niacinamide + Moisture Beet (±60k)", "Skintific 5X Ceramide + Niacinamide (±65k)", "Wardah Lightening (±35k)"],
      frequency: "Pagi dan malam",
    });
    budgetLeft -= 55000;
  }

  if (has("kering") || isDry) {
    if (budgetLeft > 20000) {
      recs.push({
        priority: priority++,
        product: "Ceramide Moisturizer",
        category: "Moisturizing",
        reason:
          "Kulit kering berarti skin barrier lemah. Ceramide adalah komponen alami barrier kulitmu — memakai krim ceramide = memperbaiki pagar pertahanan kulit dari luar.",
        price_min: 30000,
        price_max: 90000,
        examples: ["CeraVe Moisturizing Cream (±120k)", "Cetaphil Moisturizing Cream (±75k)", "Skintific Ceramide Barrier (±65k)"],
        frequency: "Pagi dan malam setelah serum",
      });
      budgetLeft -= 60000;
    }
  }

  if (has("kusam") || has("pigmentasi")) {
    if (budgetLeft > 35000) {
      recs.push({
        priority: priority++,
        product: "Vitamin C 10–15% Serum",
        category: "Brightening",
        reason:
          "Vitamin C mencerahkan warna kulit tidak merata dan memudarkan hiperpigmentasi. Efeknya bertahap (4–8 minggu) tapi nyata jika konsisten.",
        price_min: 45000,
        price_max: 130000,
        examples: ["Skintific Vitamin C (±70k)", "Azarine Vitamin C Brightening (±55k)", "Somethinc Vitamin C (±80k)"],
        frequency: "Pagi (sebelum sunscreen)",
      });
      budgetLeft -= 75000;
    }
  }

  if (has("anti_aging") && input.usia >= 25) {
    if (budgetLeft > 50000) {
      recs.push({
        priority: priority++,
        product: "Retinol 0.1% (mulai rendah)",
        category: "Anti-Aging",
        reason:
          "Retinol adalah bahan anti-aging paling terbukti. Tapi mulai dari konsentrasi rendah (0.1%) dan pakai hanya 2x/minggu dulu untuk adaptasi.",
        price_min: 60000,
        price_max: 150000,
        examples: ["Somethinc Bakuchiol + Retinol (±85k)", "Skintific Retinol 0.3% (±80k)", "The Ordinary Retinol 0.2% (±90k reseller)"],
        frequency: "2–3x seminggu, malam saja",
      });
      budgetLeft -= 90000;
    }
  }

  // ── Moisturizer ringan jika kulit berminyak dan belum ada
  if (isOily && !recs.find((r) => r.category === "Moisturizing") && budgetLeft > 20000) {
    recs.push({
      priority: priority++,
      product: "Lightweight Gel Moisturizer (oil-free)",
      category: "Moisturizing",
      reason:
        "Banyak yang skip moisturizer karena takut makin berminyak — ini justru salah. Kulit berminyak butuh hidrasi, tapi dalam bentuk gel water-based.",
      price_min: 25000,
      price_max: 70000,
      examples: ["Hada Labo Gokujyun (±65k)", "Neutrogena Hydro Boost Gel (±80k)", "Wardah Aloe Vera Gel (±25k)"],
      frequency: "Pagi dan malam",
    });
    budgetLeft -= 45000;
  }

  // ── SKIP ITEMS berdasarkan produk existing
  const existing = input.produk_existing.toLowerCase();

  if (existing.includes("toner") && recs.find((r) => r.product.includes("Niacinamide"))) {
    skips.push({
      product: "Brightening/Hydrating Toner",
      reason: "Niacinamide serum yang kita rekomendasikan sudah punya fungsi yang sama dengan toner brightening. Dua produk ini redundan.",
      saving_estimate: 65000,
    });
  }

  if (input.usia < 30 && !has("anti_aging")) {
    skips.push({
      product: "Eye Cream",
      reason: `Di usia ${input.usia} tahun tanpa tanda penuaan khusus di area mata, moisturizer biasa sudah cukup untuk area mata. Eye cream baru signifikan manfaatnya di atas 30 tahun.`,
      saving_estimate: 95000,
    });
  }

  if (existing.includes("micellar") && existing.includes("cleanser")) {
    skips.push({
      product: "Micellar Water",
      reason: "Kamu sudah punya cleanser — micellar water tidak perlu dipakai bersamaan. Micellar water adalah alternatif cleanser, bukan pelengkap.",
      saving_estimate: 50000,
    });
  }

  if (existing.includes("essence") && existing.includes("serum")) {
    skips.push({
      product: "Essence (jika sudah ada serum)",
      reason: "Essence dan serum punya fungsi yang sangat mirip. Kamu tidak perlu keduanya — pilih serum yang konsentrasinya lebih tinggi.",
      saving_estimate: 80000,
    });
  }

  // ── SCORE ESTIMATION (potensi setelah ikuti rekomendasi)
  let uvScore = recs.some((r) => r.category === "Sun Protection") ? 78 : 20;
  let barrierScore = recs.some((r) => r.category === "Cleansing") ? 72 : 50;
  if (recs.some((r) => r.category === "Moisturizing")) barrierScore += 10;
  if (isSensitive) barrierScore -= 5;

  let hydrationScore = isDry ? 58 : isOily ? 65 : 72;
  if (recs.some((r) => r.category === "Moisturizing")) hydrationScore += 12;

  let acneScore = 75;
  if (has("jerawat")) acneScore = recs.some((r) => r.category === "Acne Treatment") ? 70 : 45;
  if (has("bekas_jerawat") && recs.some((r) => r.product.includes("Niacinamide"))) acneScore += 5;

  const total = Math.round((uvScore + barrierScore + hydrationScore + acneScore) / 4);

  // ── SUMMARY
  const mainMasalah = input.masalah.length > 0
    ? `masalah utamamu (${input.masalah.slice(0, 2).map((m) => m.replace("_", " ")).join(" & ")})`
    : "kondisi kulitmu";
  const summary = `Dengan budget Rp ${input.budget.toLocaleString("id")}, kamu bisa mengatasi ${mainMasalah} hanya dengan ${recs.length} produk yang tepat. Total estimasi biaya: Rp ${Math.max(0, input.budget - budgetLeft).toLocaleString("id")}.`;

  const budgetUsed = Math.min(input.budget, Math.max(0, input.budget - budgetLeft));

  return {
    recs,
    skips,
    score: {
      total,
      barrier: Math.min(100, barrierScore),
      hydration: Math.min(100, hydrationScore),
      uv_protection: uvScore,
      acne_control: Math.min(100, acneScore),
    },
    budget_used: budgetUsed,
    budget_left: Math.max(0, input.budget - budgetUsed),
    summary,
    climate_tip: climateTip(input.kota),
  };
}
