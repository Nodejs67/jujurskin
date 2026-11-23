// ── Bank kalimat untuk /roast.
//
// ATURAN NADA (jangan dilanggar):
//   1. Menggoda rutinitasnya, BUKAN orangnya. "Rutinitasmu boros" ✅ — "Kamu bodoh" ❌.
//   2. Tidak pernah menyuruh buang sunscreen/pelembap/pembersih.
//   3. Bukan diagnosis medis. Tidak ada klaim "menyembuhkan"/"memutihkan" (aturan BPOM,
//      selaras knowledge/regulations/forbidden-claims.md).
//   4. Selalu ada jalan keluar yang membangun — orang harus merasa terbantu, bukan dihina.
//
// Kalimat DIPILIH SECARA DETERMINISTIK (berdasarkan skor/temuan), bukan diacak, supaya
// user yang sama selalu dapat hasil yang sama dan hasilnya bisa dites.

export const DISCLAIMER =
  "Ini bukan diagnosis medis. Analisis dibuat dari kandungan produk, bukan dari kondisi kulitmu. Ada keluhan serius? Temui dokter kulit.";

/** Band label skor. Urut dari tertinggi. */
export const SCORE_BANDS: { min: number; label: string }[] = [
  { min: 90, label: "Rutinitas ramping 🌿" },
  { min: 75, label: "Udah rapi, tinggal poles ✨" },
  { min: 60, label: "Ada yang tumpang tindih 😅" },
  { min: 40, label: "Dompetmu butuh istirahat 💸" },
  { min: 0, label: "Bestie, kita perlu ngobrol 😭" },
];

export function scoreLabel(score: number): string {
  return SCORE_BANDS.find((b) => score >= b.min)?.label ?? SCORE_BANDS[SCORE_BANDS.length - 1].label;
}

/** Penutup. Dipilih dari kondisi, bukan diacak. */
export function verdictFor(opts: {
  score: number;
  wastefulGroups: number;
  potentialSaving: number;
  missingSunscreen: boolean;
}): string {
  const { score, wastefulGroups, potentialSaving, missingSunscreen } = opts;

  if (missingSunscreen) {
    return "Kamu rajin beli serum, tapi belum pakai sunscreen. Itu kayak ngepel rumah sambil biarin genteng bocor. Sunscreen dulu, sisanya nyusul. ☀️";
  }
  if (wastefulGroups === 0 && score >= 90) {
    return "Jujur? Nggak ada yang perlu kami roast. Rutinitasmu ramping dan masuk akal. Lanjutkan dan konsisten — itu udah 90% dari hasil. 👏";
  }
  if (wastefulGroups === 0) {
    return "Nggak ada yang mubazir di sini. Tinggal rapikan urutan pakainya, dan kamu udah selesai. Simpan uangmu. 🌿";
  }
  if (potentialSaving >= 300_000) {
    return `Bestie... kulitmu bukan kurang skincare. Dompetmu yang butuh istirahat. Rp ${formatRupiah(potentialSaving)} bisa kamu simpan tanpa hasil kulit yang berubah. 😭`;
  }
  if (potentialSaving > 0) {
    return `Produkmu bagus-bagus kok — cuma beberapa kerjanya sama persis. Rp ${formatRupiah(potentialSaving)} bisa balik ke dompetmu. 💸`;
  }
  return "Ada beberapa yang tumpang tindih, tapi nggak sampai bikin rugi. Rapikan pelan-pelan aja. ✨";
}

/** "210000" → "210.000" (format Indonesia, tanpa prefix "Rp"). */
export function formatRupiah(n: number): string {
  return Math.round(n).toLocaleString("id-ID");
}

export function overlapTitle(groupLabel: string, count: number): string {
  return `${count} produk kamu sama-sama ${groupLabel}`;
}

export function overlapDetail(groupLabel: string, count: number, keepName: string, saving: number): string {
  const base = `Punya ${count} sekaligus nggak bikin hasilnya ${count}× lipat — kulit cuma menyerap sebanyak yang ia butuh.`;
  const keep = ` Cukup pakai satu. Kami sarankan lanjut pakai ${keepName} (paling murah — di JujurSkin, mahal ≠ lebih efektif).`;
  const money = saving > 0 ? ` Sisanya = Rp ${formatRupiah(saving)} yang bisa kamu simpan.` : "";
  return `${groupLabel} muncul di ${count} produk sekaligus. ${base}${keep}${money}`;
}
