export type ProductCategory =
  | "sunscreen"
  | "cleanser"
  | "moisturizer"
  | "serum_niacinamide"
  | "serum_vitamin_c"
  | "serum_aha_bha"
  | "serum_retinol"
  | "serum_brightening"
  | "toner"
  | "treatment_jerawat";

export type SkinTypeMatch = "normal" | "berminyak" | "kering" | "kombinasi" | "sensitif" | "semua tipe" | "berjerawat";
export type PriceRange = "budget" | "mid" | "premium";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  emoji: string;

  tagline: string;
  key_ingredients: string[];
  skin_types: SkinTypeMatch[];
  concerns: string[];

  price_min: number;
  price_max: number;
  price_range: PriceRange;

  where_to_buy: string[];
  spf?: number;
  bpom_registered: boolean;

  why_good: string;
  who_should_skip?: string;

  rating_community: number;
}

export const PRODUCTS: Product[] = [
  // ── SUNSCREEN ──────────────────────────────────────
  {
    id: "azarine-hydrasoothe-spf45",
    name: "Hydrasoothe Sunscreen SPF 45 PA+++",
    brand: "Azarine",
    category: "sunscreen",
    emoji: "☀️",
    tagline: "Sunscreen terjangkau terbaik Indonesia — tekstur ringan, no white cast",
    key_ingredients: ["Ethylhexyl Methoxycinnamate", "Butyl Methoxydibenzoylmethane", "Niacinamide"],
    skin_types: ["normal", "berminyak", "kombinasi"],
    concerns: ["UV protection", "Penuaan dini", "Hiperpigmentasi"],
    price_min: 30000,
    price_max: 40000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Indomaret", "Alfamart"],
    spf: 45,
    bpom_registered: true,
    why_good: "Value terbaik di Indonesia. Teksturnya ringan, cepat meresap, tidak meninggalkan white cast, dan ada niacinamide bonus untuk kontrol minyak.",
    rating_community: 4.6,
  },
  {
    id: "wardah-uv-shield-spf50",
    name: "UV Shield Essential Sunscreen SPF 50 PA+++",
    brand: "Wardah",
    category: "sunscreen",
    emoji: "☀️",
    tagline: "Sunscreen everyday yang mudah didapat dan terjangkau",
    key_ingredients: ["Zinc Oxide", "Titanium Dioxide", "Centella Asiatica"],
    skin_types: ["normal", "kering", "sensitif"],
    concerns: ["UV protection", "Kulit sensitif"],
    price_min: 45000,
    price_max: 60000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Indomaret", "Alfamart", "Guardian"],
    spf: 50,
    bpom_registered: true,
    why_good: "Mineral sunscreen yang lebih cocok untuk kulit sensitif. Mudah ditemukan di minimarket seluruh Indonesia.",
    rating_community: 4.3,
  },
  {
    id: "skintific-aqua-air-spf50",
    name: "Aqua Air Sunscreen SPF 50 PA++++",
    brand: "Skintific",
    category: "sunscreen",
    emoji: "☀️",
    tagline: "Seringan air, perlindungan maksimal",
    key_ingredients: ["Tinosorb S", "Tinosorb M", "Hyaluronic Acid"],
    skin_types: ["berminyak", "kombinasi", "normal"],
    concerns: ["UV protection", "Kulit berminyak", "Pori besar"],
    price_min: 55000,
    price_max: 75000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Official Store"],
    spf: 50,
    bpom_registered: true,
    why_good: "Menggunakan UV filter generasi terbaru (Tinosorb) yang lebih stabil dari chemical filter biasa. Tekstur sangat ringan.",
    rating_community: 4.7,
  },

  // ── CLEANSER ──────────────────────────────────────
  {
    id: "cetaphil-gentle-cleanser",
    name: "Gentle Skin Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    emoji: "🫧",
    tagline: "Pembersih paling gentle — direkomendasikan dermatologis sejak 1947",
    key_ingredients: ["Glycerin", "Panthenol", "Niacinamide"],
    skin_types: ["kering", "sensitif", "normal"],
    concerns: ["Kulit sensitif", "Skin barrier lemah", "Kulit kering"],
    price_min: 50000,
    price_max: 70000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Guardian", "Watsons", "Apotek"],
    bpom_registered: true,
    why_good: "Tidak ada SLS, tidak ada wewangian, pH rendah. Bisa dipakai untuk wajah dan badan. Standar emas untuk kulit sensitif dan kulit yang sedang dalam recovery.",
    rating_community: 4.8,
  },
  {
    id: "somethinc-low-ph-cleanser",
    name: "Low pH Hello Gentle Cleanser",
    brand: "Somethinc",
    category: "cleanser",
    emoji: "🫧",
    tagline: "Low pH, bebas SLS — sempurna untuk routine exfoliant",
    key_ingredients: ["Centella Asiatica", "Aloe Vera", "PHA"],
    skin_types: ["berminyak", "kombinasi", "normal"],
    concerns: ["Jerawat", "Komedo", "Kulit berminyak"],
    price_min: 40000,
    price_max: 55000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Somethinc Store"],
    bpom_registered: true,
    why_good: "pH rendah penting kalau kamu pakai AHA/BHA — cleanser pH tinggi bisa menonaktifkan exfoliant. Ini solusinya.",
    rating_community: 4.5,
  },
  {
    id: "npure-centella-cleanser",
    name: "Centella Asiatica Cleansing Gel",
    brand: "NPURE",
    category: "cleanser",
    emoji: "🫧",
    tagline: "Cleanser Cica yang bersihkan dan tenangkan sekaligus",
    key_ingredients: ["Centella Asiatica", "Aloe Vera", "Green Tea"],
    skin_types: ["sensitif", "normal", "kombinasi"],
    concerns: ["Kemerahan", "Kulit sensitif", "Jerawat ringan"],
    price_min: 30000,
    price_max: 45000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Indomaret"],
    bpom_registered: true,
    why_good: "Centella Asiatica membantu menenangkan kulit setiap kali cuci muka. Budget-friendly dan efektif.",
    rating_community: 4.4,
  },

  // ── MOISTURIZER ──────────────────────────────────────
  {
    id: "cerave-moisturizing-cream",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "moisturizer",
    emoji: "🧴",
    tagline: "Moisturizer dengan 3 ceramide esensial — memperbaiki skin barrier",
    key_ingredients: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Hyaluronic Acid", "Niacinamide"],
    skin_types: ["kering", "sensitif", "normal"],
    concerns: ["Skin barrier rusak", "Kulit kering", "Eksim", "Sensitif"],
    price_min: 100000,
    price_max: 150000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Guardian", "Watsons"],
    bpom_registered: true,
    why_good: "Kombinasi 3 ceramide + HA + niacinamide dalam satu produk. Dikembangkan bersama dermatologis. Best in class untuk memperbaiki skin barrier.",
    who_should_skip: "Kulit sangat berminyak (tekstur cream bisa terasa berat)",
    rating_community: 4.9,
  },
  {
    id: "hada-labo-gokujyun",
    name: "Gokujyun Premium Hyaluronic Lotion",
    brand: "Hada Labo",
    category: "moisturizer",
    emoji: "🧴",
    tagline: "5 jenis Hyaluronic Acid — hidrasi terdalam",
    key_ingredients: ["Super Hyaluronic Acid", "Hyaluronic Acid", "Collagen"],
    skin_types: ["kering", "normal", "kombinasi", "berminyak"],
    concerns: ["Dehidrasi", "Kulit kering", "Kulit kusam"],
    price_min: 65000,
    price_max: 90000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Guardian", "Watsons", "Minimarket"],
    bpom_registered: true,
    why_good: "Mengandung 5 ukuran molekul HA yang meresap ke lapisan kulit berbeda. Hasil hidrasi maksimal tanpa rasa berminyak.",
    rating_community: 4.7,
  },
  {
    id: "skintific-5x-ceramide",
    name: "5X Ceramide Barrier Serum",
    brand: "Skintific",
    category: "moisturizer",
    emoji: "🧴",
    tagline: "5 jenis ceramide + niacinamide — repair dan brighten sekaligus",
    key_ingredients: ["Ceramide 5 Complex", "Niacinamide", "Panthenol"],
    skin_types: ["kering", "sensitif", "normal", "kombinasi"],
    concerns: ["Skin barrier lemah", "Bekas jerawat", "Kulit kering sensitif"],
    price_min: 60000,
    price_max: 80000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Skintific Store"],
    bpom_registered: true,
    why_good: "Versi lokal CeraVe dengan harga lebih terjangkau dan formulasi yang sangat solid. Sangat cocok untuk pemula.",
    rating_community: 4.6,
  },

  // ── SERUM NIACINAMIDE ──────────────────────────────────────
  {
    id: "somethinc-niacinamide",
    name: "Niacinamide + Moisture Beet Serum",
    brand: "Somethinc",
    category: "serum_niacinamide",
    emoji: "✨",
    tagline: "Niacinamide 10% + hidrasi tahan lama — kontrol minyak dan cerahkan",
    key_ingredients: ["Niacinamide 10%", "Moisture Beet", "Hyaluronic Acid"],
    skin_types: ["berminyak", "kombinasi", "normal"],
    concerns: ["Bekas jerawat", "Minyak berlebih", "Pori besar", "Kulit kusam"],
    price_min: 55000,
    price_max: 70000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Somethinc Store"],
    bpom_registered: true,
    why_good: "Konsentrasi niacinamide 10% yang optimal + Moisture Beet (betaine) untuk hidrasi yang tahan lama. Best seller yang teruji.",
    rating_community: 4.7,
  },
  {
    id: "wardah-lightening-serum",
    name: "Lightening Serum",
    brand: "Wardah",
    category: "serum_niacinamide",
    emoji: "✨",
    tagline: "Serum pencerah budget — niacinamide + vitamin C",
    key_ingredients: ["Niacinamide", "Vitamin C Derivative", "Aloe Vera"],
    skin_types: ["normal", "berminyak", "kombinasi"],
    concerns: ["Bekas jerawat", "Kulit kusam", "Hiperpigmentasi ringan"],
    price_min: 30000,
    price_max: 45000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia", "Indomaret", "Alfamart", "Guardian"],
    bpom_registered: true,
    why_good: "Pilihan paling terjangkau yang mudah didapat. Cocok untuk yang baru mulai skincare atau yang butuh serum sederhana.",
    rating_community: 4.2,
  },

  // ── SERUM VITAMIN C ──────────────────────────────────────
  {
    id: "skintific-vitamin-c",
    name: "Vitamin C Brightening Serum",
    brand: "Skintific",
    category: "serum_vitamin_c",
    emoji: "🍊",
    tagline: "Vitamin C stabil + niacinamide — cerah tanpa iritasi",
    key_ingredients: ["Ascorbyl Glucoside 3%", "Niacinamide", "Hyaluronic Acid"],
    skin_types: ["semua tipe"],
    concerns: ["Kulit kusam", "Hiperpigmentasi", "Antioksidan pagi"],
    price_min: 60000,
    price_max: 80000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Skintific Store"],
    bpom_registered: true,
    why_good: "Menggunakan Ascorbyl Glucoside (turunan Vitamin C stabil) yang tidak mudah teroksidasi dan lebih gentle dari L-Ascorbic Acid.",
    rating_community: 4.5,
  },
  {
    id: "azarine-vitamin-c",
    name: "Vitamin C 10% Brightening Serum",
    brand: "Azarine",
    category: "serum_vitamin_c",
    emoji: "🍊",
    tagline: "Vitamin C 10% affordable — pencerah efektif",
    key_ingredients: ["Ascorbic Acid 10%", "Niacinamide", "Hyaluronic Acid"],
    skin_types: ["normal", "berminyak", "kombinasi"],
    concerns: ["Kulit kusam", "Hiperpigmentasi", "Bekas jerawat"],
    price_min: 45000,
    price_max: 60000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia"],
    bpom_registered: true,
    why_good: "Budget-friendly dengan konsentrasi Vitamin C 10% yang efektif. Harus disimpan di tempat gelap dan dingin supaya tidak cepat teroksidasi.",
    rating_community: 4.3,
  },

  // ── SERUM AHA/BHA ──────────────────────────────────────
  {
    id: "somethinc-bha-exfoliant",
    name: "BHA+ Blemish & Blackhead Liquid Exfoliant",
    brand: "Somethinc",
    category: "serum_aha_bha",
    emoji: "🔬",
    tagline: "BHA terbaik lokal — bersihkan pori dan atasi jerawat",
    key_ingredients: ["Salicylic Acid 2%", "Centella Asiatica", "Panthenol"],
    skin_types: ["berminyak", "kombinasi", "berjerawat"],
    concerns: ["Komedo", "Jerawat aktif", "Pori besar", "Kulit berminyak"],
    price_min: 60000,
    price_max: 75000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Somethinc Store"],
    bpom_registered: true,
    why_good: "Salicylic Acid 2% (konsentrasi optimal) dengan Centella untuk menenangkan setelah exfoliant. Tidak terlalu keras untuk pemakaian rutin.",
    who_should_skip: "Kulit sangat sensitif atau kering",
    rating_community: 4.6,
  },
  {
    id: "azarine-aha-toner",
    name: "AHA BHA Clarifying Toner",
    brand: "Azarine",
    category: "serum_aha_bha",
    emoji: "🔬",
    tagline: "Toner exfoliant budget — AHA + BHA untuk kulit bersinar",
    key_ingredients: ["Glycolic Acid", "Salicylic Acid", "Centella Asiatica"],
    skin_types: ["berminyak", "kombinasi", "normal"],
    concerns: ["Tekstur kasar", "Kulit kusam", "Jerawat", "Komedo"],
    price_min: 40000,
    price_max: 55000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia"],
    bpom_registered: true,
    why_good: "Kombinasi AHA + BHA dalam satu toner dengan harga sangat terjangkau. Cocok untuk pemula exfoliant.",
    rating_community: 4.4,
  },

  // ── SERUM RETINOL ──────────────────────────────────────
  {
    id: "somethinc-retinol-bakuchiol",
    name: "Bakuchiol + Retinol 0.3% Serum",
    brand: "Somethinc",
    category: "serum_retinol",
    emoji: "🌙",
    tagline: "Retinol 0.3% + Bakuchiol — anti-aging lokal terbaik",
    key_ingredients: ["Retinol 0.3%", "Bakuchiol", "Ceramide", "Peptide"],
    skin_types: ["normal", "kombinasi", "berminyak"],
    concerns: ["Anti-aging", "Tekstur kasar", "Jerawat membandel", "Tanda penuaan"],
    price_min: 80000,
    price_max: 100000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Somethinc Store"],
    bpom_registered: true,
    why_good: "Kombinasi Retinol + Bakuchiol memberikan efek anti-aging yang lebih kuat dari keduanya sendiri, dengan Ceramide untuk mengurangi iritasi.",
    who_should_skip: "Ibu hamil dan menyusui. Pemula skincare (mulai dari Bakuchiol saja dulu)",
    rating_community: 4.7,
  },
  {
    id: "skintific-retinol",
    name: "Retinol 0.3% Vitamin A Serum",
    brand: "Skintific",
    category: "serum_retinol",
    emoji: "🌙",
    tagline: "Retinol terjangkau dengan formulasi yang kind-to-skin",
    key_ingredients: ["Retinol 0.3%", "Ceramide", "Niacinamide"],
    skin_types: ["normal", "berminyak", "kombinasi"],
    concerns: ["Anti-aging", "Tekstur kulit", "Jerawat"],
    price_min: 70000,
    price_max: 90000,
    price_range: "mid",
    where_to_buy: ["Shopee", "Tokopedia", "Skintific Store"],
    bpom_registered: true,
    why_good: "Diimbangi ceramide dan niacinamide untuk mengurangi iritasi khas retinol. Pilihan lokal yang solid.",
    who_should_skip: "Ibu hamil dan menyusui",
    rating_community: 4.5,
  },

  // ── TREATMENT JERAWAT ──────────────────────────────────────
  {
    id: "azarine-azelaic-acid",
    name: "Azelaic Acid 10% Serum",
    brand: "Azarine",
    category: "treatment_jerawat",
    emoji: "⚗️",
    tagline: "Azelaic acid terjangkau — atasi jerawat dan bekas hitam",
    key_ingredients: ["Azelaic Acid 10%", "Niacinamide", "Centella Asiatica"],
    skin_types: ["sensitif", "berminyak", "kombinasi", "normal"],
    concerns: ["Jerawat aktif", "Bekas jerawat", "Rosacea", "Kemerahan"],
    price_min: 45000,
    price_max: 60000,
    price_range: "budget",
    where_to_buy: ["Shopee", "Tokopedia"],
    bpom_registered: true,
    why_good: "Pilihan terbaik untuk kulit sensitif yang tidak cocok dengan BHA. Aman kehamilan (konsultasi dokter dulu). Multi-fungsi.",
    rating_community: 4.5,
  },
  {
    id: "emina-sunscreen-spf30",
    name: "Sun Protection Moisturizer SPF 30 PA++",
    brand: "Emina",
    category: "sunscreen",
    emoji: "☀️",
    tagline: "Sunscreen termudah didapat dengan harga paling terjangkau",
    key_ingredients: ["Ethylhexyl Methoxycinnamate", "Titanium Dioxide"],
    skin_types: ["normal", "kombinasi"],
    concerns: ["UV protection dasar"],
    price_min: 25000,
    price_max: 35000,
    price_range: "budget",
    where_to_buy: ["Indomaret", "Alfamart", "Shopee", "Tokopedia"],
    spf: 30,
    bpom_registered: true,
    why_good: "Paling mudah ditemukan dan paling murah. Kalau belum punya sunscreen sama sekali, ini adalah titik mulai yang bagus.",
    who_should_skip: "Yang butuh SPF 50+ atau kulit sangat berminyak",
    rating_community: 4.1,
  },
];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsBySkinType(skinType: string): Product[] {
  return PRODUCTS.filter((p) =>
    p.skin_types.includes(skinType as SkinTypeMatch) || p.skin_types.includes("semua tipe")
  );
}

export function getProductsByBudget(maxPrice: number): Product[] {
  return PRODUCTS.filter((p) => p.price_min <= maxPrice);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.key_ingredients.some((i) => i.toLowerCase().includes(q)) ||
      p.concerns.some((c) => c.toLowerCase().includes(q))
  );
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  sunscreen: "Sunscreen",
  cleanser: "Cleanser",
  moisturizer: "Moisturizer",
  serum_niacinamide: "Serum Niacinamide",
  serum_vitamin_c: "Serum Vitamin C",
  serum_aha_bha: "Serum AHA/BHA",
  serum_retinol: "Serum Retinol",
  serum_brightening: "Serum Pencerah",
  toner: "Toner",
  treatment_jerawat: "Treatment Jerawat",
};
