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
  // Advanced lifestyle & history fields (optional)
  penggunaan_sunscreen?: "tidak_pernah" | "jarang" | "kadang" | "selalu";
  paparan_matahari?: "dalam_ruangan" | "sesekali" | "sering" | "sepanjang_hari";
  lingkungan?: "kering_ac" | "lembab" | "campuran";
  kualitas_tidur?: "buruk" | "cukup" | "baik";
  tingkat_stress?: "rendah" | "sedang" | "tinggi";
  riwayat_hormonal?: boolean;
  status_kehamilan?: "tidak" | "hamil" | "menyusui";
  riwayat_sensitif?: boolean;
  reaksi_produk?: string;
  pengalaman_retinoid?: "belum" | "pernah_gagal" | "toleran";
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
  pregnancy_safe?: boolean;
  warning?: string;
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

export interface RoutineStep {
  order: number;
  product: string;
  category: string;
  why: string;
  wait_before_next?: string;
  warning?: string;
}

export interface AnalysisResult {
  recs: Recommendation[];
  skips: SkipItem[];
  score: SkinScore;
  budget_used: number;
  budget_left: number;
  summary: string;
  climate_tip: string;
  morning_routine: RoutineStep[];
  night_routine: RoutineStep[];
  lifestyle_notes: string[];
  pregnancy_warnings: string[];
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

function buildMorningRoutine(recs: Recommendation[], input: AnalysisInput): RoutineStep[] {
  const steps: RoutineStep[] = [];
  let order = 1;

  steps.push({ order: order++, product: "Gentle Cleanser", category: "Cleansing", why: "Membersihkan minyak dan kotoran semalam tanpa merusak skin barrier." });

  if (recs.some(r => r.category === "Toner / Essence")) {
    steps.push({ order: order++, product: "Toner / Hydrating Essence", category: "Hydration", why: "Mengembalikan kelembapan awal dan mempersiapkan kulit menyerap serum.", wait_before_next: "30 detik" });
  }

  const vitC = recs.find(r => r.category === "Brightening" && r.product.includes("Vitamin C"));
  if (vitC) {
    steps.push({ order: order++, product: "Vitamin C Serum", category: "Brightening", why: "Antioksidan + perlindungan dari radikal bebas. Paling efektif di pagi hari.", wait_before_next: "1 menit" });
  }

  const niac = recs.find(r => r.product.includes("Niacinamide"));
  if (niac && !vitC) {
    steps.push({ order: order++, product: "Niacinamide Serum", category: "Treatment", why: "Memudarkan bekas jerawat, kontrol minyak, dan perkuat skin barrier.", wait_before_next: "30 detik" });
  }

  if (recs.some(r => r.category === "Moisturizing")) {
    steps.push({ order: order++, product: "Moisturizer", category: "Moisturizing", why: "Mengunci hidrasi dari serum sebelumnya dan menyiapkan kulit untuk sunscreen." });
  }

  steps.push({ order: order++, product: "Sunscreen SPF 50+", category: "Sun Protection", why: "Langkah TERAKHIR dan TERPENTING. Lindungi semua kerja keras produk lain dari UV.", wait_before_next: "15 menit sebelum keluar rumah" });

  return steps;
}

function buildNightRoutine(recs: Recommendation[], input: AnalysisInput): RoutineStep[] {
  const steps: RoutineStep[] = [];
  let order = 1;
  const isPregnant = input.status_kehamilan === "hamil" || input.status_kehamilan === "menyusui";

  if (input.produk_existing?.toLowerCase().includes("makeup") || input.produk_existing?.toLowerCase().includes("spf")) {
    steps.push({ order: order++, product: "Makeup Remover / Cleansing Oil", category: "Double Cleanse", why: "Angkat makeup dan sunscreen yang tidak larut air sebelum cleanser biasa." });
  }

  steps.push({ order: order++, product: "Gentle Cleanser", category: "Cleansing", why: "Bersihkan sisa produk hari ini tanpa merusak skin barrier untuk proses repair malam." });

  if (recs.some(r => r.category === "Toner / Essence")) {
    steps.push({ order: order++, product: "Toner / Essence", category: "Hydration", why: "Rehidrasi kulit setelah cleansing.", wait_before_next: "30 detik" });
  }

  const hasExfoliant = recs.some(r => r.category === "Exfoliant");
  if (hasExfoliant) {
    steps.push({ order: order++, product: "Chemical Exfoliant (AHA/BHA/PHA)", category: "Exfoliant", why: "Malam adalah waktu terbaik — exfoliant meningkatkan photosensitivity sehingga tidak ideal di pagi hari.", warning: "Hanya 2-3x/minggu, bukan setiap malam!" });
  }

  const niac = recs.find(r => r.product.includes("Niacinamide"));
  if (niac) {
    steps.push({ order: order++, product: "Niacinamide Serum", category: "Treatment", why: "Pagi dan malam. Memudarkan bekas, kontrol minyak, barrier repair." });
  }

  const hasRetinoid = recs.some(r => r.category === "Anti-Aging" && !isPregnant);
  if (hasRetinoid && !hasExfoliant) {
    steps.push({ order: order++, product: "Retinol Serum", category: "Anti-Aging", why: "Hanya malam hari. Pada malam yang sama, jangan pakai exfoliant.", wait_before_next: "Tunggu kulit benar-benar kering (5 menit)" });
  }

  const hasBakuchiol = recs.some(r => r.product.includes("Bakuchiol"));
  if (hasBakuchiol && !hasRetinoid) {
    steps.push({ order: order++, product: "Bakuchiol Serum", category: "Anti-Aging", why: "Alternatif retinol yang aman — bisa pagi atau malam." });
  }

  if (recs.some(r => r.category === "Moisturizing")) {
    steps.push({ order: order++, product: "Moisturizer (lebih rich dari pagi)", category: "Moisturizing", why: "Kulit melakukan repair terbesar saat tidur — berikan nutrisi yang cukup." });
  }

  return steps;
}

export function generateRecommendations(input: AnalysisInput): AnalysisResult {
  const recs: Recommendation[] = [];
  const skips: SkipItem[] = [];
  const lifestyleNotes: string[] = [];
  const pregnancyWarnings: string[] = [];
  let budgetLeft = input.budget;
  let priority = 1;

  // ── Derived flags from advanced fields
  const has = (p: Problem) => input.masalah.includes(p);
  const isSensitive = input.tipe_kulit === "sensitif" || input.riwayat_sensitif;
  const isOily = input.tipe_kulit === "berminyak" || input.tipe_kulit === "kombinasi";
  const isDry = input.tipe_kulit === "kering";
  const isPregnant = input.status_kehamilan === "hamil" || input.status_kehamilan === "menyusui";
  const isStressed = input.tingkat_stress === "tinggi";
  const poorSleep = input.kualitas_tidur === "buruk";
  const highUV = input.paparan_matahari === "sering" || input.paparan_matahari === "sepanjang_hari";
  const dryEnvironment = input.lingkungan === "kering_ac";
  const isHormonal = input.riwayat_hormonal;
  const retinoidNovice = !input.pengalaman_retinoid || input.pengalaman_retinoid === "belum";
  const retinoidFailed = input.pengalaman_retinoid === "pernah_gagal";
  const retinoidTolerant = input.pengalaman_retinoid === "toleran";
  const neverUsesSunscreen = input.penggunaan_sunscreen === "tidak_pernah" || input.penggunaan_sunscreen === "jarang";

  // ── Lifestyle notes
  if (isStressed || poorSleep) {
    lifestyleNotes.push("Stres tinggi dan kurang tidur memperlambat regenerasi kulit dan memperparah jerawat hormonal. Prioritas utama: barrier repair dan jangan over-exfoliate.");
  }
  if (dryEnvironment) {
    lifestyleNotes.push("Lingkungan ber-AC membuat kulit kehilangan air lebih cepat. Tambahkan hydrating toner atau essence sebelum serum.");
  }
  if (highUV) {
    lifestyleNotes.push("Paparan matahari tinggi: wajib reapply sunscreen tiap 90-120 menit, dan pertimbangkan sunscreen water-resistant. Vitamin C pagi sangat membantu.");
  }
  if (isHormonal) {
    lifestyleNotes.push("Jerawat hormonal butuh pendekatan berbeda: Zinc, Niacinamide, dan konsistensi lebih dari produk keras. Konsultasikan dengan dokter untuk kasus parah.");
  }
  if (isPregnant) {
    pregnancyWarnings.push("Status kehamilan/menyusui terdeteksi. Rekomendasi disesuaikan: retinol, BHA dosis tinggi, benzoyl peroxide, dan hydroquinone DIHILANGKAN dari daftar.");
  }

  // ── 1. SUNSCREEN — selalu prioritas 1
  const spfMin = 25000, spfMax = 75000;
  const spfExamples = isOily
    ? ["Azarine Hydrasoothe SPF 45 (±35k)", "Make Over UV Shield Photoprotection SPF 50+ (±55k)", "Wardah UV Shield (±50k)"]
    : isDry
    ? ["Skintific Aqua Air Sunscreen SPF 50 (±65k)", "Skin1004 Madagascar Centella Sun Serum (±95k)"]
    : ["Azarine Hydrasoothe SPF 45 (±35k)", "Somethinc Level Up SPF 50+ (±55k)", "Emina Sun Protection (±30k)"];

  recs.push({
    priority: priority++,
    product: "Sunscreen SPF 50+",
    category: "Sun Protection",
    reason: neverUsesSunscreen
      ? "⚠️ Kamu belum rutin pakai sunscreen — ini adalah perubahan terpenting yang bisa kamu lakukan sekarang. UV memperparah jerawat, bekas, dan mempercepat penuaan lebih dari faktor lain."
      : highUV
      ? "Paparan matahari tinggimu membuat sunscreen SANGAT KRITIS. Pilih SPF 50+ water-resistant dan reapply tiap 90 menit di luar."
      : "UV index Indonesia rata-rata 8–10 sepanjang tahun. Tanpa sunscreen, semua treatment lain sia-sia karena UV memperparah jerawat, bekas, dan penuaan.",
    price_min: spfMin,
    price_max: spfMax,
    examples: spfExamples,
    frequency: neverUsesSunscreen ? "Mulai SEKARANG, setiap pagi tanpa kecuali" : "Setiap pagi, reapply tiap 2 jam jika di luar",
    pregnancy_safe: true,
  });
  budgetLeft -= (spfMin + spfMax) / 2;

  // ── 2. GENTLE CLEANSER
  const cleanMin = 15000, cleanMax = 50000;
  recs.push({
    priority: priority++,
    product: isSensitive ? "Ultra-gentle Cleanser (pH rendah, fragrance-free)" : "Gentle Low-pH Cleanser",
    category: "Cleansing",
    reason: isSensitive
      ? "Riwayat kulit sensitif: butuh cleanser benar-benar lembut, tanpa SLS, tanpa wewangian. Salah cleanser memicu iritasi."
      : "Fondasi semua routine. Salah cleanser (terlalu keras) merusak skin barrier dan memperparah semua masalah.",
    price_min: cleanMin,
    price_max: cleanMax,
    examples: isSensitive
      ? ["Cetaphil Gentle Skin Cleanser (±60k)", "Avoskin Very Gentle Jelly Cleanser (±50k)", "La Roche-Posay Toleriane (±180k)"]
      : isOily
      ? ["Cosrx Low-pH Good Morning Gel Cleanser (±100k reseller)", "Somethinc Low pH Cleanser (±45k)", "NPURE Centella Cleanser (±35k)"]
      : ["Cetaphil (±55k)", "Neutrogena Ultra Gentle (±70k)", "Hada Labo Gokujyun Foam (±65k)"],
    frequency: "2x sehari — pagi dan malam",
    pregnancy_safe: true,
  });
  budgetLeft -= (cleanMin + cleanMax) / 2;

  // ── Hydration (for dry/AC environments or dehydrated skin)
  if ((isDry || dryEnvironment || has("kering")) && budgetLeft > 15000) {
    recs.push({
      priority: priority++,
      product: "Hyaluronic Acid Toner / Essence",
      category: "Toner / Essence",
      reason: dryEnvironment
        ? "Lingkungan AC menguras hidrasi kulit. HA Toner membantu mengembalikan kelembapan yang hilang sebelum serum dan moisturizer."
        : "Kulit kering perlu lapisan hidrasi ekstra sebelum serum. HA toner adalah langkah paling efisien.",
      price_min: 35000,
      price_max: 80000,
      examples: ["Hada Labo Gokujyun Toner (±65k)", "Somethinc Hyaluronic Acid Toner (±55k)", "Azarine Hydrasoothe Toner (±40k)"],
      frequency: "Pagi dan malam, setelah cleanser",
      pregnancy_safe: true,
    });
    budgetLeft -= 55000;
  }

  // ── TREATMENT berdasarkan masalah
  if (has("jerawat") && budgetLeft > 30000) {
    const useGentle = isSensitive || isPregnant || isStressed || poorSleep;
    if (isPregnant) {
      recs.push({
        priority: priority++,
        product: "Azelaic Acid 10%",
        category: "Acne Treatment",
        reason: "Aman untuk kehamilan dan menyusui. Efektif atasi jerawat, kemerahan, dan bekas — tanpa risiko seperti BHA.",
        price_min: 35000,
        price_max: 90000,
        examples: ["Azarine Azelaic Acid 10% (±55k)", "Somethinc Azelaic Acid (±75k)", "The Ordinary Azelaic Acid 10% (±150k reseller)"],
        frequency: "1-2x sehari",
        pregnancy_safe: true,
      });
    } else if (useGentle) {
      recs.push({
        priority: priority++,
        product: "Azelaic Acid 10%",
        category: "Acne Treatment",
        reason: "Riwayat kulit sensitif atau stres tinggi: Azelaic Acid lebih gentle dari BHA tapi sama efektifnya untuk jerawat. Tidak over-exfoliate kulit yang sedang stres.",
        price_min: 35000,
        price_max: 90000,
        examples: ["Azarine Azelaic Acid 10% (±55k)", "Somethinc Azelaic Acid (±75k)"],
        frequency: "1x malam, bisa pagi juga",
        pregnancy_safe: true,
      });
    } else {
      recs.push({
        priority: priority++,
        product: "Salicylic Acid 2% Serum/Toner",
        category: "Acne Treatment",
        reason: isHormonal
          ? "BHA masuk ke pori dan bersihkan sumbatan dari dalam. Untuk jerawat hormonal, kombinasikan dengan Niacinamide dan Zinc untuk kontrol sebum."
          : "BHA (Salicylic Acid) adalah exfoliant larut minyak yang menembus pori dan bersihkan sumbatan penyebab jerawat.",
        price_min: 35000,
        price_max: 90000,
        examples: ["Somethinc BHA+ Exfoliating Toner (±65k)", "Skintific BHA Acne Serum (±70k)", "The Ordinary Salicylic Acid 2% (±100k reseller)"],
        frequency: "Mulai 2-3x/minggu malam, naikkan bertahap",
        pregnancy_safe: false,
        warning: isPregnant ? "TIDAK AMAN untuk kehamilan — gunakan Azelaic Acid sebagai gantinya" : undefined,
      });
    }
    budgetLeft -= 60000;
  }

  if (has("bekas_jerawat") && budgetLeft > 25000) {
    recs.push({
      priority: priority++,
      product: isHormonal ? "Niacinamide 10% + Zinc Serum" : "Niacinamide 10% Serum",
      category: "Brightening & Repair",
      reason: isHormonal
        ? "Niacinamide + Zinc adalah kombinasi terbaik untuk jerawat hormonal: Niacinamide memudarkan bekas, Zinc mengontrol sebum yang dipicu hormon."
        : "Niacinamide memudarkan bekas jerawat secara bertahap, mengontrol minyak, dan memperkuat skin barrier. Aman untuk semua kondisi.",
      price_min: 30000,
      price_max: 80000,
      examples: isHormonal
        ? ["The Ordinary Niacinamide 10% + Zinc 1% (±130k reseller)", "Azarine Zinc Pore Serum (±45k)", "Somethinc Niacinamide + Moisture Beet (±60k)"]
        : ["Somethinc Niacinamide + Moisture Beet (±60k)", "Skintific 5X Ceramide + Niacinamide (±65k)", "Wardah Lightening Serum (±35k)"],
      frequency: "Pagi dan malam",
      pregnancy_safe: true,
    });
    budgetLeft -= 55000;
  }

  if (has("kering") || isDry || dryEnvironment) {
    if (budgetLeft > 20000 && !recs.some(r => r.category === "Moisturizing")) {
      recs.push({
        priority: priority++,
        product: "Ceramide Moisturizer",
        category: "Moisturizing",
        reason: dryEnvironment
          ? "AC menurunkan kelembapan udara drastis. Ceramide moisturizer memperkuat skin barrier agar kulit tidak terus kehilangan air ke udara kering."
          : "Kulit kering berarti skin barrier lemah. Ceramide adalah komponen alami barrier — memakai krim ceramide memperbaiki pagar pertahanan kulitmu.",
        price_min: 30000,
        price_max: 90000,
        examples: ["CeraVe Moisturizing Cream (±120k)", "Cetaphil Moisturizing Cream (±75k)", "Skintific 5X Ceramide Barrier (±65k)"],
        frequency: "Pagi dan malam setelah serum",
        pregnancy_safe: true,
      });
      budgetLeft -= 60000;
    }
  }

  if (has("kusam") || has("pigmentasi")) {
    if (budgetLeft > 35000) {
      if (isPregnant) {
        recs.push({
          priority: priority++,
          product: "Alpha Arbutin / Tranexamic Acid Serum (aman kehamilan)",
          category: "Brightening",
          reason: "Vitamin C aman kehamilan, tapi Alpha Arbutin dan Tranexamic Acid juga efektif dan lebih gentle. Keduanya aman untuk pencerah saat hamil.",
          price_min: 45000,
          price_max: 120000,
          examples: ["NPURE Alpha Arbutin Serum (±50k)", "Somethinc Alpha Arbutin (±70k)", "Skintific Tranexamic Acid (±85k)"],
          frequency: "Pagi atau malam",
          pregnancy_safe: true,
        });
      } else {
        recs.push({
          priority: priority++,
          product: "Vitamin C 10–15% Serum",
          category: "Brightening",
          reason: highUV
            ? "Vitamin C di pagi hari adalah duo terbaik dengan sunscreen: sunscreen blok UV, Vitamin C netralisir radikal bebas yang lolos. Sangat penting untuk paparan matahari tinggi."
            : "Vitamin C mencerahkan warna kulit tidak merata dan memudarkan hiperpigmentasi. Efeknya nyata dalam 4–8 minggu konsisten.",
          price_min: 45000,
          price_max: 130000,
          examples: ["Skintific Vitamin C Brightening Serum (±70k)", "Azarine Vitamin C 10% (±55k)", "Somethinc Vitamin C (±80k)"],
          frequency: "Pagi (sebelum sunscreen)",
          pregnancy_safe: true,
        });
      }
      budgetLeft -= 75000;
    }
  }

  if (has("anti_aging") && input.usia >= 25) {
    if (budgetLeft > 50000) {
      if (isPregnant) {
        recs.push({
          priority: priority++,
          product: "Bakuchiol Serum (alternatif retinol aman kehamilan)",
          category: "Anti-Aging",
          reason: "Retinol TIDAK AMAN saat hamil/menyusui. Bakuchiol adalah alternatif berbasis tanaman yang memiliki efek serupa retinol tapi aman untuk kehamilan.",
          price_min: 60000,
          price_max: 150000,
          examples: ["NPURE Bakuchiol Serum (±70k)", "Somethinc Bakuchiol (±85k)", "Skintific Bakuchiol Retinol Alternative (±80k)"],
          frequency: "Malam hari, bisa juga pagi",
          pregnancy_safe: true,
        });
      } else if (retinoidFailed) {
        recs.push({
          priority: priority++,
          product: "Bakuchiol atau Retinol 0.1% (formula gentle)",
          category: "Anti-Aging",
          reason: "Pengalaman sebelumnya gagal dengan retinoid. Coba Bakuchiol dulu (tanpa iritasi), atau Retinol dengan konsentrasi sangat rendah 0.1% dalam formula moisturizing.",
          price_min: 60000,
          price_max: 150000,
          examples: ["NPURE Bakuchiol Serum (±70k)", "Avoskin Your Skin Bae Retinol 0.1% (±130k)", "Somethinc Bakuchiol (±85k)"],
          frequency: "Malam hari, 1-2x/minggu dulu",
          pregnancy_safe: false,
          warning: "Mulai sangat perlahan — 1x/minggu selama 1 bulan sebelum menaikkan frekuensi",
        });
      } else if (retinoidTolerant) {
        recs.push({
          priority: priority++,
          product: "Retinol 0.3–0.5% atau Adapalene 0.1%",
          category: "Anti-Aging",
          reason: "Kamu sudah toleran retinoid. Bisa mulai dari konsentrasi lebih tinggi atau Adapalene yang lebih stabil dan efektif.",
          price_min: 60000,
          price_max: 180000,
          examples: ["Skintific Retinol 0.3% (±80k)", "Avoskin Your Skin Bae Retinol 0.5% (±150k)", "Differin Adapalene 0.1% (±100-150k via apotek)"],
          frequency: "Malam, 4-5x/minggu (sesuai toleransi)",
          pregnancy_safe: false,
        });
      } else {
        recs.push({
          priority: priority++,
          product: "Retinol 0.1–0.25% (mulai rendah)",
          category: "Anti-Aging",
          reason: "Retinol adalah bahan anti-aging paling terbukti. Mulai dari konsentrasi sangat rendah dan naikkan bertahap untuk menghindari iritasi.",
          price_min: 60000,
          price_max: 150000,
          examples: ["Somethinc Bakuchiol + Retinol 0.3% (±85k)", "Skintific Retinol 0.3% (±80k)", "The Ordinary Retinol 0.2% in Squalane (±90k reseller)"],
          frequency: "1x/minggu → bertahap naik selama 1-3 bulan",
          pregnancy_safe: false,
          warning: "Mulai 1x/minggu, tunggu 2 minggu sebelum menaikkan frekuensi. Beli sunscreen SPF 50+ dulu.",
        });
      }
      budgetLeft -= 90000;
    }
  }

  // ── Moisturizer untuk kulit berminyak
  if (isOily && !recs.find(r => r.category === "Moisturizing") && budgetLeft > 20000) {
    recs.push({
      priority: priority++,
      product: "Lightweight Gel Moisturizer (oil-free)",
      category: "Moisturizing",
      reason: "Banyak yang skip moisturizer karena takut makin berminyak — ini justru salah. Kulit berminyak sering dehidrasi dan justru produksi minyak lebih banyak sebagai kompensasi.",
      price_min: 25000,
      price_max: 70000,
      examples: ["Hada Labo Gokujyun (±65k)", "Neutrogena Hydro Boost Gel (±80k)", "Wardah Aloe Vera Gel (±25k)"],
      frequency: "Pagi dan malam",
      pregnancy_safe: true,
    });
    budgetLeft -= 45000;
  }

  // ── Barrier Repair (untuk stress/poor sleep)
  if ((isStressed || poorSleep) && budgetLeft > 25000 && !recs.some(r => r.product.includes("Ceramide") || r.product.includes("Centella"))) {
    recs.push({
      priority: priority++,
      product: "Centella Asiatica / Ceramide Barrier Serum",
      category: "Repair & Soothing",
      reason: "Stres dan kurang tidur menurunkan fungsi skin barrier. Centella atau Ceramide membantu menstabilkan kulit agar tidak reaktif dan mudah iritasi.",
      price_min: 35000,
      price_max: 90000,
      examples: ["NPURE Centella Asiatica Serum (±45k)", "Skintific 5X Ceramide Barrier Serum (±75k)", "Somethinc Cica Moisture Gel (±65k)"],
      frequency: "Setiap hari, pagi dan malam",
      pregnancy_safe: true,
    });
    budgetLeft -= 60000;
  }

  // ── SKIP ITEMS
  const existing = input.produk_existing?.toLowerCase() || "";

  if (existing.includes("toner") && recs.find(r => r.product.includes("Niacinamide"))) {
    skips.push({
      product: "Brightening/Hydrating Toner tambahan",
      reason: "Niacinamide serum yang direkomendasikan sudah punya fungsi serupa toner brightening. Dua produk ini redundan.",
      saving_estimate: 65000,
    });
  }

  if (input.usia < 30 && !has("anti_aging")) {
    skips.push({
      product: "Eye Cream",
      reason: `Di usia ${input.usia} tahun tanpa tanda penuaan khusus di area mata, moisturizer biasa sudah cukup. Eye cream baru signifikan di atas 30 tahun.`,
      saving_estimate: 95000,
    });
  }

  if (existing.includes("micellar") && existing.includes("cleanser")) {
    skips.push({
      product: "Micellar Water",
      reason: "Kamu sudah punya cleanser — micellar water adalah alternatif cleanser, bukan pelengkap. Tidak perlu keduanya.",
      saving_estimate: 50000,
    });
  }

  if (existing.includes("essence") && existing.includes("serum")) {
    skips.push({
      product: "Essence (jika sudah ada serum aktif)",
      reason: "Essence dan serum punya fungsi sangat mirip. Pilih serum dengan konsentrasi lebih tinggi — lebih efisien.",
      saving_estimate: 80000,
    });
  }

  if (!has("anti_aging") && !retinoidTolerant) {
    skips.push({
      product: "Tretinoin / Retinoid kuat tanpa saran dokter",
      reason: "Tretinoin dan retinoid kuat membutuhkan adaptasi panjang dan sering butuh resep. Mulai dari retinol OTC dulu untuk membangun toleransi.",
      saving_estimate: 50000,
    });
  }

  if (isPregnant) {
    skips.push({
      product: "Retinol, Retinoid, Tretinoin, Adapalene",
      reason: "TIDAK AMAN untuk kehamilan dan menyusui. Gunakan Bakuchiol sebagai alternatif aman.",
      saving_estimate: 90000,
    });
    skips.push({
      product: "Salicylic Acid dosis tinggi (>2%) dan Benzoyl Peroxide",
      reason: "Sebaiknya hindari saat hamil/menyusui. Azelaic Acid adalah pilihan lebih aman dengan efek serupa.",
      saving_estimate: 70000,
    });
  }

  // ── SCORE
  let uvScore = recs.some(r => r.category === "Sun Protection") ? (neverUsesSunscreen ? 45 : 78) : 20;
  let barrierScore = recs.some(r => r.category === "Cleansing") ? 72 : 50;
  if (recs.some(r => r.category === "Moisturizing")) barrierScore += 10;
  if (isSensitive) barrierScore -= 5;
  if (isStressed || poorSleep) barrierScore -= 8;
  if (recs.some(r => r.category === "Repair & Soothing")) barrierScore += 8;

  let hydrationScore = isDry ? 58 : isOily ? 65 : 72;
  if (recs.some(r => r.category === "Moisturizing")) hydrationScore += 12;
  if (dryEnvironment) hydrationScore -= 10;
  if (recs.some(r => r.category === "Toner / Essence")) hydrationScore += 8;

  let acneScore = 75;
  if (has("jerawat")) acneScore = recs.some(r => r.category === "Acne Treatment") ? 70 : 45;
  if (has("bekas_jerawat") && recs.some(r => r.product.includes("Niacinamide"))) acneScore += 5;
  if (isHormonal) acneScore -= 5;

  const total = Math.round((uvScore + barrierScore + hydrationScore + acneScore) / 4);

  const mainMasalah = input.masalah.length > 0
    ? `masalah utamamu (${input.masalah.slice(0, 2).map(m => m.replace("_", " ")).join(" & ")})`
    : "kondisi kulitmu";
  const summary = `Dengan budget Rp ${input.budget.toLocaleString("id")}, kamu bisa mengatasi ${mainMasalah} hanya dengan ${recs.length} produk yang tepat. Total estimasi biaya: Rp ${Math.max(0, input.budget - budgetLeft).toLocaleString("id")}.`;

  const budgetUsed = Math.min(input.budget, Math.max(0, input.budget - budgetLeft));

  const morningRoutine = buildMorningRoutine(recs, input);
  const nightRoutine = buildNightRoutine(recs, input);

  return {
    recs,
    skips,
    score: {
      total,
      barrier: Math.min(100, barrierScore),
      hydration: Math.min(100, hydrationScore),
      uv_protection: Math.min(100, uvScore),
      acne_control: Math.min(100, acneScore),
    },
    budget_used: budgetUsed,
    budget_left: Math.max(0, input.budget - budgetUsed),
    summary,
    climate_tip: climateTip(input.kota),
    morning_routine: morningRoutine,
    night_routine: nightRoutine,
    lifestyle_notes: lifestyleNotes,
    pregnancy_warnings: pregnancyWarnings,
  };
}
