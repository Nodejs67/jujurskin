// Jalankan: node --experimental-strip-types tests/recommendation.test.mjs
import assert from "node:assert/strict";
import { generateRecommendations } from "../lib/recommendations.ts";

const base = { nama: "", usia: 25, kota: "Medan", jenis_kelamin: "wanita", tipe_kulit: "berminyak",
  masalah: ["jerawat"], budget: 100000, produk_existing: "" };

// 1. Hamil + jerawat + budget kecil: tidak boleh klaim jerawat teratasi, wajib saran dokter.
const r = generateRecommendations({ ...base, status_kehamilan: "hamil" });
const hasAcne = r.recs.some((x) => x.category === "Acne Treatment");
if (!hasAcne) {
  assert.match(r.summary, /BELUM tertangani/);
  assert.doesNotMatch(r.summary, /mengatasi/);
}
assert.ok(r.lifestyle_notes.some((n) => /dokter/i.test(n)), "hamil+jerawat harus ada saran dokter");

// 2. Tanpa produk existing, tidak boleh ada klaim penghematan.
assert.equal(r.potential_saving, 0);

// 3. Budget cukup: obat jerawat masuk & ringkasan normal.
const ok = generateRecommendations({ ...base, budget: 300000, status_kehamilan: "tidak" });
assert.ok(ok.recs.some((x) => x.category === "Acne Treatment"));
assert.doesNotMatch(ok.summary, /BELUM tertangani/);

// 4. Hamil: tidak ada retinoid/BHA yang direkomendasikan.
const bad = generateRecommendations({ ...base, budget: 400000, masalah: ["jerawat", "anti_aging"], status_kehamilan: "hamil" });
assert.ok(!bad.recs.some((x) => /retinol|salicylic/i.test(x.product) && x.pregnancy_safe === false && !x.warning));

console.log("recommendation tests OK");
