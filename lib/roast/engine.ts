// ── MESIN ROAST. Deterministik, murni, nol I/O, nol LLM.
// Input sama → output sama, selalu. Itu yang bikin fitur ini bisa dites & tidak bisa halusinasi.

import { GROUP_BY_ID, GROUP_CONFLICTS } from "@/lib/roast/groups";
import { matchAll } from "@/lib/roast/match";
import { DISCLAIMER, formatRupiah, overlapDetail, overlapTitle, scoreLabel, verdictFor } from "@/lib/roast/copy";
import type { MatchedProduct, RoastFinding, RoastInput, RoastResult } from "@/lib/roast/types";

/** Kategori yang TIDAK PERNAH kami sarankan dibuang. */
const ESSENTIAL_CATEGORIES = new Set(["cleanser", "moisturizer", "sunscreen"]);

/**
 * "Tema": beberapa grup berbeda yang mengejar HASIL yang sama.
 * Inilah temuan paling sering bikin orang kaget — mereka merasa punya 3 produk berbeda,
 * padahal ketiganya mengejar satu tujuan yang sama.
 */
const THEMES: { id: string; label: string; groups: string[] }[] = [
  {
    id: "brightening",
    label: "mencerahkan / meratakan warna kulit",
    groups: ["niacinamide", "vitamin_c", "brightening_other", "azelaic"],
  },
  {
    id: "exfoliation",
    label: "mengeksfoliasi",
    groups: ["exfoliant_aha", "exfoliant_bha", "exfoliant_pha"],
  },
];

/**
 * Apakah produk ini "mengandalkan" grup tsb sebagai pekerjaan utamanya?
 *
 * Pelembap yang kebetulan mengandung niacinamide TIDAK dihitung tumpang tindih dengan
 * serum niacinamide — pekerjaan utamanya melembapkan, dan kami tidak akan pernah
 * menyuruh orang membuang pelembapnya. Ini mencegah tuduhan "mubazir" yang salah.
 */
function contributesTo(p: MatchedProduct, groupId: string): boolean {
  if (!p.groups.some((g) => g.groupId === groupId)) return false;
  if (p.category && ESSENTIAL_CATEGORIES.has(p.category)) return false;
  return true;
}

function priceOf(p: MatchedProduct): number | undefined {
  const v = p.input.price;
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : undefined;
}

function confidenceFor(products: MatchedProduct[], groupId: string): RoastFinding["confidence"] {
  const sources = products
    .map((p) => p.groups.find((g) => g.groupId === groupId)?.source)
    .filter(Boolean) as string[];
  if (sources.includes("claim")) return "rendah";
  if (sources.every((s) => s === "db")) return "tinggi";
  return "sedang";
}

export function analyzeRoast(input: RoastInput): RoastResult {
  const matched = matchAll(input.products.filter((p) => p.name.trim().length > 0));
  const findings: RoastFinding[] = [];

  const totalSpend = matched.reduce((sum, p) => sum + (priceOf(p) ?? 0), 0);

  // ── 1. Tumpang tindih per-grup (uang terbuang)
  let potentialSaving = 0;
  let wastefulGroups = 0;

  for (const group of Object.values(GROUP_BY_ID)) {
    if (group.overlap !== "wasteful") continue;

    const contributors = matched.filter((p) => contributesTo(p, group.id));
    if (contributors.length < 2) continue;

    wastefulGroups += 1;

    // Simpan yang PALING MURAH. Ini bukan basa-basi: inti brand JujurSkin adalah
    // mahal ≠ lebih efektif. Produk tanpa harga tidak pernah dianggap "yang dibuang".
    const priced = contributors.filter((p) => priceOf(p) !== undefined);
    let saving = 0;
    let keepName = contributors[0].displayName;

    if (priced.length >= 2) {
      const sorted = [...priced].sort((a, b) => (priceOf(a) as number) - (priceOf(b) as number));
      keepName = sorted[0].displayName;
      saving = sorted.slice(1).reduce((sum, p) => sum + (priceOf(p) as number), 0);
    }

    potentialSaving += saving;

    findings.push({
      kind: "overlap",
      title: overlapTitle(group.label, contributors.length),
      detail: overlapDetail(group.label, contributors.length, keepName, saving),
      products: contributors.map((p) => p.displayName),
      saving,
      confidence: confidenceFor(contributors, group.id),
    });
  }

  // ── 2. Tumpang tindih TEMA (tidak menambah penghematan — supaya tidak dihitung dobel)
  for (const theme of THEMES) {
    const contributors = matched.filter((p) => theme.groups.some((g) => contributesTo(p, g)));
    if (contributors.length < 3) continue;

    // Kalau semua penyumbang tema sudah tertangkap satu temuan overlap grup, lewati.
    const alreadyFlagged = findings.some(
      (f) => f.kind === "overlap" && contributors.every((c) => f.products.includes(c.displayName))
    );
    if (alreadyFlagged) continue;

    findings.push({
      kind: "overlap",
      title: `${contributors.length} produk kamu semua kerjanya ${theme.label}`,
      detail: `Namanya beda-beda, tapi tujuannya satu: ${theme.label}. Kulit nggak jadi ${contributors.length}× lebih cerah cuma karena kamu numpuk ${contributors.length} produk. Pilih 1–2 yang paling cocok, sisanya istirahatkan dulu.`,
      products: contributors.map((p) => p.displayName),
      saving: 0,
      confidence: contributors.some((p) =>
        p.groups.some((g) => theme.groups.includes(g.groupId) && g.source === "claim")
      )
        ? "rendah"
        : "sedang",
    });
  }

  // ── 3. Konflik = saran WAKTU PAKAI, bukan perintah membuang.
  //
  // WAJIB di PRODUK BERBEDA. Kalau dua kandungan ada di dalam SATU formula (mis.
  // Skintific Vitamin C yang juga memuat niacinamide), itu keputusan formulator yang
  // disengaja dan sudah diuji stabil — menyuruh user "pakai di waktu berbeda" mustahil
  // dijalankan (isinya satu botol) sekaligus menakut-nakuti tanpa alasan.
  const groupsPresent = new Set(matched.flatMap((p) => p.groups.map((g) => g.groupId)));
  const productsWith = (groupId: string) => matched.filter((p) => p.groups.some((g) => g.groupId === groupId));

  for (const c of GROUP_CONFLICTS) {
    const withA = productsWith(c.a);
    const withB = productsWith(c.b);
    if (withA.length === 0 || withB.length === 0) continue;

    // Ada minimal satu pasang produk BERBEDA yang masing-masing membawa satu sisi konflik?
    const crossProduct = withA.some((pa) => withB.some((pb) => pa !== pb));
    if (!crossProduct) continue;

    const involved = [...new Set([...withA, ...withB])];
    findings.push({
      kind: "conflict",
      title: `${GROUP_BY_ID[c.a].label} + ${GROUP_BY_ID[c.b].label} sebaiknya nggak barengan`,
      detail: c.reason,
      products: involved.map((p) => p.displayName),
      saving: 0,
      confidence: "sedang",
    });
  }

  // ── 4. Terlalu banyak aktif sekaligus
  const activeGroups = [...groupsPresent].filter(
    (id) => GROUP_BY_ID[id]?.kind === "active" && matched.some((p) => contributesTo(p, id))
  );
  if (activeGroups.length >= 3) {
    findings.push({
      kind: "overload",
      title: `${activeGroups.length} bahan aktif jalan bareng`,
      detail:
        "Kalau semua aktif dipakai bersamaan, kulit gampang iritasi DAN kamu nggak akan tahu mana yang sebenarnya bekerja. Jalankan satu-satu dulu, kasih jeda 2–4 minggu.",
      products: activeGroups.map((id) => GROUP_BY_ID[id].label),
      saving: 0,
      confidence: "sedang",
    });
  }

  // ── 5. Esensial yang belum ada
  const hasCategory = (c: string) => matched.some((p) => p.category === c);
  const hasSunscreen = hasCategory("sunscreen") || groupsPresent.has("sunscreen");
  const missingSunscreen = !hasSunscreen;

  if (missingSunscreen) {
    findings.push({
      kind: "missing",
      title: "Belum ada sunscreen",
      detail:
        "Ini langkah paling berdampak dari semua yang kamu punya. Tanpa sunscreen, kerja serum-serum tadi dikejar lebih cepat oleh sinar UV daripada bisa diperbaiki.",
      products: [],
      saving: 0,
      confidence: "tinggi",
    });
  }
  if (!hasCategory("moisturizer")) {
    findings.push({
      kind: "missing",
      title: "Belum ada pelembap",
      detail:
        "Wajib walau kulitmu berminyak. Barrier yang kering justru bikin kulit memproduksi minyak lebih banyak.",
      products: [],
      saving: 0,
      confidence: "sedang",
    });
  }
  if (!hasCategory("cleanser")) {
    findings.push({
      kind: "missing",
      title: "Belum ada pembersih wajah",
      detail: "Fondasi semua rutinitas. Tanpa ini, produk setelahnya bekerja di atas kulit yang belum bersih.",
      products: [],
      saving: 0,
      confidence: "sedang",
    });
  }

  // ── 6. Skor. Mulai 100, kurangi. Lantai 5 — kami mengoreksi, bukan mempermalukan.
  let score = 100;
  score -= Math.min(24, wastefulGroups * 8);
  score -= findings.filter((f) => f.kind === "overlap").length > wastefulGroups ? 6 : 0; // tema
  score -= missingSunscreen ? 15 : 0;
  score -= hasCategory("moisturizer") ? 0 : 8;
  score -= hasCategory("cleanser") ? 0 : 6;
  score -= activeGroups.length >= 4 ? 10 : activeGroups.length >= 3 ? 6 : 0;
  score -= Math.min(12, findings.filter((f) => f.kind === "conflict").length * 4);
  score = Math.max(5, Math.min(100, Math.round(score)));

  // ── 7. Headline kartu share: yang paling berdampak.
  const byImpact = [...findings].sort((a, b) => {
    if (b.saving !== a.saving) return b.saving - a.saving;
    const rank: Record<string, number> = { overlap: 3, missing: 2, overload: 1, conflict: 0 };
    return rank[b.kind] - rank[a.kind];
  });

  return {
    score,
    scoreLabel: scoreLabel(score),
    totalSpend,
    potentialSaving,
    productsAnalyzed: matched.length,
    unknownProducts: matched.filter((p) => p.unknown).map((p) => p.displayName),
    findings,
    headline: byImpact[0] ?? null,
    verdict: verdictFor({ score, wastefulGroups, potentialSaving, missingSunscreen }),
    disclaimer: DISCLAIMER,
  };
}

export { formatRupiah };
