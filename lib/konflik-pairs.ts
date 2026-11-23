import { INGREDIENTS, getIngredientById, type Ingredient } from "@/lib/ingredients";

/**
 * Pasangan bahan yang bentrok, dibentuk dari `conflicts_with` di lib/ingredients.ts.
 *
 * Sengaja TIDAK memakai pencocokan substring seperti di /cek-konflik: pencocokan
 * itu menandai Bakuchiol sebagai "bentrok dengan Retinol" hanya karena aliasnya
 * memuat kata "retinol". Di sini setiap nama konflik dipetakan ke id bahan secara
 * eksplisit, jadi halaman yang terbit hanya memuat klaim yang ada di data.
 */

const AHA_BHA = ["glycolic-acid", "lactic-acid", "mandelic-acid", "malic-acid", "salicylic-acid"];

// Nama di conflicts_with -> id bahan. Entri yang tak ada di sini (mis. "Paparan UV",
// "Alkohol tinggi") bukan pasangan dua bahan, jadi tidak dibuat halamannya.
const TARGETS: Record<string, string[]> = {
  "Retinol": ["retinol"],
  "Vitamin C (L-Ascorbic Acid)": ["vitamin-c"],
  "Vitamin C": ["vitamin-c"],
  "Vitamin C murni tinggi": ["vitamin-c"],
  "Niacinamide": ["niacinamide"],
  "Benzoyl Peroxide": ["benzoyl-peroxide"],
  "Benzoyl Peroxide (langsung)": ["benzoyl-peroxide"],
  "AHA/BHA": AHA_BHA,
  "AHA/BHA dosis tinggi": AHA_BHA,
  "AHA/BHA bersamaan": AHA_BHA,
  "AHA (Glycolic/Lactic Acid)": ["glycolic-acid", "lactic-acid"],
  "BHA (Salicylic Acid)": ["salicylic-acid"],
};

// Bahan yang hampir tak pernah dicari orang sebagai pasangan, atau berupa paket
// produk. Halaman untuk mereka tipis dan mirip satu sama lain, bisa merugikan
// peringkat. Tetap muncul di /cek-konflik, hanya tak dibuatkan halaman sendiri.
const SKIP_IDS = new Set([
  "bakuchiol-boosted",
  "niacinamide-high",
  "lactobacillus",
  "argireline",
  "malic-acid",
  "mandelic-acid",
]);

export type KonflikPair = {
  slug: string;
  a: Ingredient;
  b: Ingredient;
  reasons: string[];
  severity: "high" | "medium";
};

const HIGH_WORDS = ["jangan", "rusak", "menonaktifkan", "nonaktifkan", "mengoksidasi"];

function build(withSkip: boolean): KonflikPair[] {
  const map = new Map<string, KonflikPair>();

  for (const src of INGREDIENTS) {
    for (const c of src.conflicts_with) {
      for (const targetId of TARGETS[c.name] ?? []) {
        if (targetId === src.id) continue;
        if (withSkip && (SKIP_IDS.has(src.id) || SKIP_IDS.has(targetId))) continue;
        const tgt = getIngredientById(targetId);
        if (!tgt) continue;

        const [a, b] = [src, tgt].sort((x, y) => x.id.localeCompare(y.id));
        const slug = `${a.id}-dan-${b.id}`;
        const high = HIGH_WORDS.some((w) => c.reason.toLowerCase().includes(w));

        const existing = map.get(slug);
        if (!existing) {
          map.set(slug, { slug, a, b, reasons: [c.reason], severity: high ? "high" : "medium" });
        } else {
          if (!existing.reasons.includes(c.reason)) existing.reasons.push(c.reason);
          if (high) existing.severity = "high";
        }
      }
    }
  }

  return [...map.values()].sort((x, y) => x.slug.localeCompare(y.slug));
}

/** Semua pasangan, dipakai alat /cek-konflik (tanpa penyaring halaman SEO). */
const SEMUA_PAIRS: KonflikPair[] = build(false);

/** Pasangan yang dibuatkan halaman sendiri di /bisa-dicampur. */
export const KONFLIK_PAIRS: KonflikPair[] = build(true);

export type KonflikHasil = {
  ingredient1: Ingredient;
  ingredient2: Ingredient;
  reason: string;
  severity: "high" | "medium";
};

/** Konflik di antara daftar bahan yang dimasukkan pengguna. */
export function konflikAntara(ingredients: Ingredient[]): KonflikHasil[] {
  const ids = new Set(ingredients.map((i) => i.id));
  return SEMUA_PAIRS.filter((p) => ids.has(p.a.id) && ids.has(p.b.id)).map((p) => ({
    ingredient1: p.a,
    ingredient2: p.b,
    reason: p.reasons[0],
    severity: p.severity,
  }));
}

export function getKonflikPair(slug: string): KonflikPair | undefined {
  return KONFLIK_PAIRS.find((p) => p.slug === slug);
}

/** Pasangan lain yang memuat bahan ini, untuk tautan internal. */
export function pairsFor(ingredientId: string, exceptSlug?: string): KonflikPair[] {
  return KONFLIK_PAIRS.filter(
    (p) => p.slug !== exceptSlug && (p.a.id === ingredientId || p.b.id === ingredientId)
  );
}
