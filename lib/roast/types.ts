// ── Tipe untuk "Jujur Check" (/roast) — mesin roast rutinitas skincare.
// SEMUA logika di paket ini DETERMINISTIK (nol panggilan LLM, nol biaya per user).
// Alasan: fitur ini dirancang untuk viral. Kalau tiap roast memanggil LLM,
// kesuksesan fitur = tagihan yang membengkak. Overlap kandungan adalah pencarian
// data, bukan tugas penalaran — dan LLM tidak boleh mengarang konflik yang tak ada.

/** Satu produk yang diketik user. Harga opsional (banyak orang lupa). */
export interface RoastProductInput {
  /** Teks bebas persis seperti diketik user, mis. "Somethinc Niacinamide". */
  name: string;
  /** Harga dalam Rupiah. undefined = user tidak mengisi. */
  price?: number;
}

export interface RoastInput {
  skinType?: string;
  concerns?: string[];
  products: RoastProductInput[];
}

/** Dari mana sebuah kandungan terdeteksi — dipakai untuk jujur soal keyakinan kami. */
export type DetectionSource =
  /** Cocok dengan produk di database JujurSkin (220 produk) → paling andal. */
  | "db"
  /** Nama kandungan disebut langsung di teks yang diketik user. */
  | "name"
  /** Ditebak dari klaim di nama produk (mis. "brightening toner") → paling lemah. */
  | "claim";

/** Satu kandungan/fungsi yang terdeteksi pada satu produk. */
export interface DetectedGroup {
  groupId: string;
  source: DetectionSource;
}

/** Hasil pencocokan satu baris input user ke data kami. */
export interface MatchedProduct {
  /** Input asli, tidak diubah. */
  input: RoastProductInput;
  /** Nama produk di DB kalau cocok, kalau tidak: teks user. */
  displayName: string;
  /** id produk DB kalau cocok. */
  productId?: string;
  /** Kategori fungsi (cleanser/moisturizer/sunscreen/serum/toner/…). */
  category?: string;
  /** Kandungan/fungsi yang terdeteksi di produk ini. */
  groups: DetectedGroup[];
  /** true kalau kami sama sekali tidak mengenali produk ini. */
  unknown: boolean;
}

export type FindingKind =
  /** 2+ produk mengerjakan pekerjaan yang sama. */
  | "overlap"
  /** Dua kandungan sebaiknya tidak dipakai bersamaan (saran WAKTU, bukan buang). */
  | "conflict"
  /** Langkah esensial yang belum dimiliki. */
  | "missing"
  /** Terlalu banyak aktif sekaligus → risiko iritasi. */
  | "overload";

export interface RoastFinding {
  kind: FindingKind;
  /** Judul pendek, siap tampil. */
  title: string;
  /** Penjelasan jujur, nada ramah. */
  detail: string;
  /** Produk (displayName) yang terlibat. */
  products: string[];
  /** Rupiah yang bisa dihemat kalau saran ini diikuti. 0 = bukan soal uang. */
  saving: number;
  /** Seberapa yakin kami — menurunkan nada kalau cuma tebakan dari nama. */
  confidence: "tinggi" | "sedang" | "rendah";
}

export interface RoastResult {
  /** 5–100. Sengaja tidak pernah 0 — kami mengoreksi, bukan mempermalukan. */
  score: number;
  scoreLabel: string;
  totalSpend: number;
  potentialSaving: number;
  productsAnalyzed: number;
  unknownProducts: string[];
  findings: RoastFinding[];
  /** Temuan paling berdampak — jadi headline kartu share. */
  headline: RoastFinding | null;
  /** Kalimat penutup, nada Gen Z Indonesia, jujur tapi tidak menghina. */
  verdict: string;
  /** Wajib tampil di UI & kartu share. Ini bukan diagnosis medis. */
  disclaimer: string;
}
