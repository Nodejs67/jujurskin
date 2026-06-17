// ── "Produk Tidak Perlu" Checker — engine deteksi produk skincare redundan
// Misi JujurSkin: jujur bilang apa yang TIDAK perlu dibeli.
// Murni logika lokal, tanpa auth, tanpa Supabase.

export interface OwnedItem {
  id: string;
  label: string;
  emoji: string;
  group: string;
}

// Katalog produk yang umum dimiliki orang Indonesia, dikelompokkan per fungsi.
export const ITEM_GROUPS: { group: string; items: OwnedItem[] }[] = [
  {
    group: "Pembersih",
    items: [
      { id: "cleanser", label: "Facial Wash / Sabun Cuci Muka", emoji: "🧴", group: "Pembersih" },
      { id: "micellar", label: "Micellar Water", emoji: "💧", group: "Pembersih" },
      { id: "cleansing_oil", label: "Cleansing Oil / Balm", emoji: "🫧", group: "Pembersih" },
      { id: "makeup_remover", label: "Makeup Remover", emoji: "🧽", group: "Pembersih" },
    ],
  },
  {
    group: "Hidrasi",
    items: [
      { id: "toner_hydrating", label: "Hydrating Toner", emoji: "🌊", group: "Hidrasi" },
      { id: "essence", label: "Essence", emoji: "✨", group: "Hidrasi" },
      { id: "serum_ha", label: "Serum Hyaluronic Acid", emoji: "💦", group: "Hidrasi" },
      { id: "face_mist", label: "Face Mist", emoji: "🌫️", group: "Hidrasi" },
    ],
  },
  {
    group: "Treatment / Aktif",
    items: [
      { id: "serum_niacinamide", label: "Serum Niacinamide", emoji: "🧪", group: "Treatment / Aktif" },
      { id: "serum_vitc", label: "Serum Vitamin C", emoji: "🍊", group: "Treatment / Aktif" },
      { id: "serum_retinol", label: "Serum Retinol / Anti-aging", emoji: "🌙", group: "Treatment / Aktif" },
      { id: "exfo_toner", label: "Exfoliating Toner (AHA/BHA)", emoji: "🧫", group: "Treatment / Aktif" },
      { id: "scrub", label: "Scrub / Exfoliator Butiran", emoji: "🪨", group: "Treatment / Aktif" },
    ],
  },
  {
    group: "Penutup",
    items: [
      { id: "moisturizer", label: "Moisturizer / Pelembap", emoji: "🥛", group: "Penutup" },
      { id: "sunscreen", label: "Sunscreen", emoji: "☀️", group: "Penutup" },
    ],
  },
  {
    group: "Ekstra",
    items: [
      { id: "eye_cream", label: "Eye Cream", emoji: "👁️", group: "Ekstra" },
      { id: "sheet_mask", label: "Sheet Mask (dipakai harian)", emoji: "🎭", group: "Ekstra" },
      { id: "toner_pad", label: "Toner Pad", emoji: "⭕", group: "Ekstra" },
      { id: "pore_strip", label: "Pore Pack / Strip Komedo", emoji: "🩹", group: "Ekstra" },
    ],
  },
];

export const ALL_ITEMS: OwnedItem[] = ITEM_GROUPS.flatMap((g) => g.items);

export function itemLabel(id: string): string {
  return ALL_ITEMS.find((i) => i.id === id)?.label ?? id;
}
export function itemEmoji(id: string): string {
  return ALL_ITEMS.find((i) => i.id === id)?.emoji ?? "•";
}

export interface SkipVerdict {
  itemId: string;
  reason: string;
  saving: number; // estimasi rupiah hemat
  severity: "skip" | "caution"; // skip = jelas tidak perlu, caution = tergantung kondisi
}

export interface RedundancyContext {
  usia?: number; // untuk aturan eye cream
  heavyMakeup?: boolean; // sering pakai makeup tebal / sunscreen → double cleanse jadi wajar
}

export interface RedundancyResult {
  skips: SkipVerdict[];
  totalSaving: number;
  // "Minimum Effective Routine" — apa yang JUSTRU wajib tapi belum dimiliki
  essentialsMissing: { id: string; label: string; why: string }[];
  essentialsOwned: string[];
  verdict: string; // ringkasan jujur
}

const ESSENTIALS: { id: string; label: string; why: string }[] = [
  { id: "cleanser", label: "Facial Wash", why: "Fondasi semua routine — membersihkan tanpa merusak skin barrier." },
  { id: "moisturizer", label: "Moisturizer", why: "Mengunci hidrasi & menjaga barrier. Wajib bahkan untuk kulit berminyak." },
  { id: "sunscreen", label: "Sunscreen", why: "Langkah paling penting. Tanpa ini, semua produk lain sia-sia karena UV merusak lebih cepat dari yang bisa diperbaiki." },
];

export function analyzeRedundancy(ownedIds: string[], ctx: RedundancyContext = {}): RedundancyResult {
  const has = (id: string) => ownedIds.includes(id);
  const skips: SkipVerdict[] = [];
  const add = (itemId: string, reason: string, saving: number, severity: "skip" | "caution") => {
    if (skips.some((s) => s.itemId === itemId)) return; // jangan dobel verdict utk item yang sama
    skips.push({ itemId, reason, saving, severity });
  };

  const activeSerums = ["serum_niacinamide", "serum_vitc", "serum_retinol"].filter(has);

  // ── Pembersih: makeup remover vs micellar vs cleansing oil tumpang tindih
  if (has("cleansing_oil") && has("makeup_remover")) {
    add("makeup_remover", "Cleansing oil sudah mengangkat makeup & sunscreen dengan baik. Makeup remover terpisah jadi dobel fungsi — pilih salah satu.", 60000, "skip");
  }
  if (has("micellar") && has("cleansing_oil")) {
    add("micellar", "Untuk angkat makeup, cleansing oil lebih efektif daripada micellar water. Punya keduanya = mubazir.", 50000, "skip");
  }
  if (has("micellar") && has("cleanser") && !has("cleansing_oil")) {
    if (ctx.heavyMakeup) {
      add("micellar", "Karena kamu sering pakai makeup/sunscreen tebal, micellar boleh sebagai pembersih pertama. Tapi cleansing balm/oil biasanya lebih hemat per pakai untuk jangka panjang.", 0, "caution");
    } else {
      add("micellar", "Kamu sudah punya facial wash. Micellar water itu ALTERNATIF pembersih, bukan pelengkap — kecuali kamu rutin pakai makeup tebal.", 50000, "skip");
    }
  }

  // ── Hidrasi bertumpuk: toner + essence + serum HA = 3 lapis hidrasi yang tumpang tindih
  const hydrationLayers = ["toner_hydrating", "essence", "serum_ha"].filter(has);
  if (has("essence") && activeSerums.length > 0) {
    add("essence", "Essence dan serum aktif punya fungsi sangat mirip (penghantar hidrasi & bahan aktif). Pilih serum dengan konsentrasi lebih tinggi — lebih efisien.", 80000, "caution");
  }
  if (hydrationLayers.length >= 3) {
    // kalau essence belum ke-skip di atas, skip essence sebagai lapisan hidrasi yg paling redundan
    add("essence", "Toner + essence + serum HA = tiga lapisan hidrasi yang fungsinya tumpang tindih. Cukup 1–2 lapis; sisanya tidak menambah hasil signifikan.", 80000, "caution");
  }

  // ── Face mist: kosmetik, efek sesaat
  if (has("face_mist")) {
    add("face_mist", "Face mist terasa menyegarkan tapi efek hidrasinya sementara — airnya justru bisa menguap dan membawa kelembapan kulit ikut menguap kalau tanpa moisturizer. Bukan langkah esensial.", 55000, "caution");
  }

  // ── Eye cream: belum perlu di usia muda tanpa keluhan area mata
  if (has("eye_cream")) {
    if (ctx.usia !== undefined && ctx.usia < 30 && !has("serum_retinol")) {
      add("eye_cream", `Di usia ${ctx.usia} tahun tanpa keluhan penuaan khusus di area mata, moisturizer biasa yang dioles tipis sudah cukup. Eye cream baru terasa bedanya di atas ~30 tahun.`, 95000, "skip");
    } else if (ctx.usia === undefined) {
      add("eye_cream", "Eye cream sering overrated: kebanyakan formulanya mirip moisturizer biasa dengan harga lebih mahal. Baru worth di atas ~30 tahun atau ada keluhan spesifik area mata.", 95000, "caution");
    }
  }

  // ── Eksfoliasi ganda: scrub fisik + exfoliating toner kimia = over-exfoliation
  if (has("scrub") && has("exfo_toner")) {
    add("scrub", "Kamu sudah punya exfoliating toner (AHA/BHA). Tambah scrub butiran = eksfoliasi ganda yang merusak skin barrier. Chemical exfoliant lebih lembut & merata — drop scrub-nya.", 45000, "skip");
  } else if (has("scrub")) {
    add("scrub", "Scrub butiran kasar gampang bikin micro-tear di kulit. Chemical exfoliant (AHA/BHA/PHA) jauh lebih lembut & terkontrol. Boleh sesekali, tapi bukan keharusan.", 45000, "caution");
  }

  // ── Toner pad vs toner cair: fungsi sama
  if (has("toner_pad") && has("toner_hydrating")) {
    add("toner_pad", "Toner pad dan toner cair fungsinya sama. Toner pad biasanya lebih mahal per pakai (boros kapas + cairan). Cukup salah satu.", 60000, "skip");
  }

  // ── Pore strip: hampir selalu tidak disarankan
  if (has("pore_strip")) {
    add("pore_strip", "Pore pack/strip cuma menarik bagian atas komedo, tidak membersihkan pori, dan bisa melebarkan pori + merusak skin barrier. Lebih baik pakai BHA. Skip sepenuhnya.", 30000, "skip");
  }

  // ── Sheet mask harian: mahal per pakai, efek sesaat
  if (has("sheet_mask")) {
    add("sheet_mask", "Sheet mask harian mahal per pakai & efeknya cuma sesaat (sebagian besar hanya hidrasi sementara). Cukup sesekali sebagai treatment, bukan rutinitas wajib.", 70000, "caution");
  }

  // ── Terlalu banyak aktif untuk pemula
  if (activeSerums.length >= 3) {
    add("serum_retinol", "Tiga serum aktif sekaligus (Niacinamide + Vitamin C + Retinol) berisiko iritasi & sulit tahu mana yang bekerja. Jalankan satu-satu dulu. Retinol bisa ditunda sampai barrier stabil.", 0, "caution");
  }

  const totalSaving = skips.filter((s) => s.severity === "skip").reduce((sum, s) => sum + s.saving, 0);

  // ── Minimum Effective Routine: apa yang JUSTRU wajib
  const essentialsMissing = ESSENTIALS.filter((e) => !has(e.id));
  const essentialsOwned = ESSENTIALS.filter((e) => has(e.id)).map((e) => e.id);

  const skipCount = skips.filter((s) => s.severity === "skip").length;
  let verdict: string;
  if (skipCount === 0 && skips.length === 0 && essentialsMissing.length === 0) {
    verdict = "Routine-mu sudah ramping dan lengkap. Tidak ada yang perlu kamu beli lagi — lanjutkan & konsisten. 👏";
  } else if (skipCount > 0) {
    verdict = `Kami menemukan ${skipCount} produk yang bisa kamu skip. Lebih sedikit produk yang tepat > banyak produk yang tumpang tindih.`;
  } else if (skips.length > 0) {
    verdict = "Tidak ada yang benar-benar mubazir, tapi ada beberapa yang sifatnya opsional — keputusan ada di tanganmu.";
  } else {
    verdict = "Produk yang kamu punya sudah relevan. Fokus lengkapi yang esensial dulu sebelum nambah aktif baru.";
  }

  return { skips, totalSaving, essentialsMissing, essentialsOwned, verdict };
}
