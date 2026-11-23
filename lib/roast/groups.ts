// ── KELOMPOK FUNGSI ("apa pekerjaan kandungan ini?")
//
// KENAPA BUKAN id kandungan dari lib/ingredients.ts?
// Karena 100 kandungan di sana memuat banyak MOLEKUL BERBEDA dengan PEKERJAAN SAMA:
//   • vitamin-c, sodium-ascorbyl-phosphate, magnesium-ascorbyl-phosphate, ascorbyl-glucoside
//   • hyaluronic-acid, sodium-hyaluronate
//   • retinol, retinal, tretinoin, adapalene, hydroxypinacolone-retinoate, retinyl-palmitate
// Kalau kami mencocokkan per-id, orang yang punya 3 produk Vitamin C (masing-masing
// pakai derivat berbeda) TIDAK akan terdeteksi tumpang tindih — padahal itu justru
// temuan paling berharga. Jadi kami menyamakan berdasarkan PEKERJAAN, bukan nama molekul.

export type GroupKind =
  /** Bahan aktif "kerja keras". Punya 2+ = uang terbuang. */
  | "active"
  /** Pendukung (hidrasi/barrier/soothing). Tumpang tindih wajar & sering tidak apa-apa. */
  | "support"
  /** Langkah wajib. TIDAK PERNAH kami suruh buang. */
  | "essential";

export type OverlapPolicy =
  /** Duplikat = mubazir, hitung penghematan. */
  | "wasteful"
  /** Duplikat lumrah (mis. HA di serum & di pelembap). Sebut, jangan hukum. */
  | "mild"
  /** Jangan pernah tandai sebagai bisa dibuang. */
  | "never";

export interface FunctionGroup {
  id: string;
  label: string;
  emoji: string;
  kind: GroupKind;
  overlap: OverlapPolicy;
  /** Istilah yang dicocokkan dengan BATAS KATA (\b) pada teks user & data produk. */
  aliases: string[];
  /**
   * Klaim pemasaran di NAMA produk yang menyiratkan grup ini, mis. "brightening toner".
   * Keyakinan rendah — kami akan bilang terus terang bahwa ini tebakan dari nama.
   */
  claimTerms?: string[];
}

export const GROUPS: FunctionGroup[] = [
  {
    id: "niacinamide",
    label: "Niacinamide",
    emoji: "✨",
    kind: "active",
    overlap: "wasteful",
    aliases: ["niacinamide", "nicotinamide", "vitamin b3", "niacin amide"],
  },
  {
    id: "vitamin_c",
    label: "Vitamin C",
    emoji: "🍊",
    kind: "active",
    overlap: "wasteful",
    aliases: [
      "vitamin c",
      "vit c",
      "ascorbic acid",
      "l-ascorbic acid",
      "asam askorbat",
      "sodium ascorbyl phosphate",
      "magnesium ascorbyl phosphate",
      "ascorbyl glucoside",
      "ethyl ascorbic acid",
      "ascorbyl tetraisopalmitate",
    ],
  },
  {
    id: "retinoid",
    label: "Retinoid",
    emoji: "🌙",
    kind: "active",
    overlap: "wasteful",
    aliases: [
      "retinol",
      "retinal",
      "retinaldehyde",
      "retinoid",
      "tretinoin",
      "adapalene",
      "retinyl palmitate",
      "hydroxypinacolone retinoate",
      "granactive retinoid",
    ],
    claimTerms: ["anti aging", "anti-aging", "antiaging"],
  },
  {
    id: "exfoliant_bha",
    label: "BHA (Salicylic Acid)",
    emoji: "🧫",
    kind: "active",
    overlap: "wasteful",
    aliases: ["salicylic acid", "salicylic", "bha", "willow bark", "betaine salicylate"],
  },
  {
    id: "exfoliant_aha",
    label: "AHA",
    emoji: "🧪",
    kind: "active",
    overlap: "wasteful",
    aliases: ["glycolic acid", "lactic acid", "mandelic acid", "malic acid", "aha", "glycolic", "mandelic"],
  },
  {
    id: "exfoliant_pha",
    label: "PHA",
    emoji: "🫧",
    kind: "active",
    overlap: "wasteful",
    aliases: ["pha", "gluconolactone", "lactobionic acid"],
  },
  {
    id: "azelaic",
    label: "Azelaic Acid",
    emoji: "🌾",
    kind: "active",
    overlap: "wasteful",
    aliases: ["azelaic acid", "azelaic"],
  },
  {
    id: "benzoyl_peroxide",
    label: "Benzoyl Peroxide",
    emoji: "💊",
    kind: "active",
    overlap: "wasteful",
    aliases: ["benzoyl peroxide", "benzoyl"],
  },
  {
    id: "brightening_other",
    label: "Pencerah lain",
    emoji: "🔆",
    kind: "active",
    overlap: "wasteful",
    aliases: [
      "alpha arbutin",
      "arbutin",
      "kojic acid",
      "kojic dipalmitate",
      "tranexamic acid",
      "licorice",
      "licorice root",
      "hexylresorcinol",
      "glutathione",
    ],
    // "Brightening toner" tanpa keterangan kandungan → kami tebak dari klaimnya.
    claimTerms: ["brightening", "brightner", "brightener", "whitening", "pencerah", "glow"],
  },
  {
    id: "hydrator_ha",
    label: "Hyaluronic Acid",
    emoji: "💧",
    kind: "support",
    overlap: "mild",
    aliases: ["hyaluronic acid", "sodium hyaluronate", "hyaluronate", "natrium hialuronat", "polyglutamic acid"],
  },
  {
    id: "barrier_ceramide",
    label: "Ceramide / Barrier",
    emoji: "🧱",
    kind: "support",
    overlap: "mild",
    aliases: ["ceramide", "ceramides", "phytosphingosine", "cholesterol"],
  },
  {
    id: "soothing_centella",
    label: "Centella / Soothing",
    emoji: "🌿",
    kind: "support",
    overlap: "mild",
    aliases: ["centella", "centella asiatica", "cica", "madecassoside", "asiaticoside", "mugwort", "artemisia"],
  },
  {
    id: "sunscreen",
    label: "Sunscreen",
    emoji: "☀️",
    kind: "essential",
    overlap: "never",
    aliases: [
      "spf",
      "sunscreen",
      "sunblock",
      "tabir surya",
      "avobenzone",
      "tinosorb",
      "uvinul",
      "zinc oxide",
      "titanium dioxide",
    ],
  },
];

export const GROUP_BY_ID: Record<string, FunctionGroup> = Object.fromEntries(
  GROUPS.map((g) => [g.id, g])
);

/**
 * Konflik antar-grup. PENTING (nada & isi): konflik = saran WAKTU PAKAI,
 * BUKAN perintah membuang produk. Kami tidak menyuruh orang membuang barang
 * yang sudah dibeli hanya karena urutan pakainya salah.
 *
 * Isi diselaraskan dengan `conflicts_with` di lib/ingredients.ts.
 */
export interface GroupConflict {
  a: string;
  b: string;
  reason: string;
}

export const GROUP_CONFLICTS: GroupConflict[] = [
  {
    a: "vitamin_c",
    b: "niacinamide",
    reason:
      "Dipakai bersamaan dalam satu waktu, keduanya bisa saling melemahkan. Gampang: Vitamin C pagi, Niacinamide malam. Nggak perlu buang apa pun.",
  },
  {
    a: "retinoid",
    b: "exfoliant_aha",
    reason:
      "Retinoid + AHA di malam yang sama = risiko iritasi & barrier rusak. Selang-seling malamnya.",
  },
  {
    a: "retinoid",
    b: "exfoliant_bha",
    reason:
      "Retinoid + BHA bareng bikin kulit gampang perih dan mengelupas. Pakai di malam berbeda.",
  },
  {
    a: "retinoid",
    b: "vitamin_c",
    reason: "Vitamin C paling enak pagi, retinoid malam. Dipisah waktunya, dua-duanya tetap bekerja.",
  },
  {
    a: "benzoyl_peroxide",
    b: "retinoid",
    reason:
      "Benzoyl peroxide bisa menonaktifkan sebagian retinoid kalau dilapis bersamaan. Pisahkan pagi/malam.",
  },
  {
    a: "exfoliant_aha",
    b: "exfoliant_bha",
    reason:
      "Dua eksfoliator sekaligus gampang bikin over-exfoliation (kulit merah, perih, malah lebih berjerawat). Cukup satu per sesi.",
  },
];

/** Cocokkan istilah dengan batas kata — mencegah "bha" cocok di tengah kata lain. */
export function mentionsTerm(text: string, term: string): boolean {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i").test(text);
}

/** Semua grup yang istilahnya muncul di `text` (pencocokan kandungan eksplisit). */
export function groupsFromText(text: string): string[] {
  const hits = new Set<string>();
  for (const g of GROUPS) {
    if (g.aliases.some((a) => mentionsTerm(text, a))) hits.add(g.id);
  }
  return [...hits];
}

/** Grup yang cuma DITEBAK dari klaim pemasaran di nama produk (keyakinan rendah). */
export function groupsFromClaims(text: string): string[] {
  const hits = new Set<string>();
  for (const g of GROUPS) {
    if (g.claimTerms?.some((c) => mentionsTerm(text, c))) hits.add(g.id);
  }
  return [...hits];
}
