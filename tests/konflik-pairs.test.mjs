import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { KONFLIK_PAIRS, getKonflikPair, pairsFor } from "@/lib/konflik-pairs";

describe("pasangan konflik bahan (halaman SEO)", () => {
  it("memuat pasangan klasik yang ada di data", () => {
    for (const slug of [
      "retinol-dan-vitamin-c",
      "benzoyl-peroxide-dan-retinol",
      "glycolic-acid-dan-retinol",
      "niacinamide-dan-vitamin-c",
    ]) {
      assert.ok(getKonflikPair(slug), `harus ada: ${slug}`);
    }
  });

  it("Bakuchiol & Retinyl Palmitate TIDAK dianggap bentrok dengan Retinol", () => {
    const bad = KONFLIK_PAIRS.filter(
      (p) =>
        (p.a.id.includes("bakuchiol") || p.b.id.includes("bakuchiol") || p.a.id.includes("retinyl") || p.b.id.includes("retinyl")) &&
        (p.a.id === "retinol" || p.b.id === "retinol")
    );
    assert.deepEqual(bad.map((p) => p.slug), []);
  });

  it("slug unik, urutan id stabil, dan tiap pasangan punya alasan", () => {
    const slugs = KONFLIK_PAIRS.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const p of KONFLIK_PAIRS) {
      assert.ok(p.a.id < p.b.id, `urutan ${p.slug}`);
      assert.equal(p.slug, `${p.a.id}-dan-${p.b.id}`);
      assert.ok(p.reasons.length > 0, `alasan ${p.slug}`);
      assert.notEqual(p.a.id, p.b.id);
    }
  });

  it("konflik non-bahan (UV, alkohol) tidak jadi halaman", () => {
    assert.equal(KONFLIK_PAIRS.some((p) => p.a.id === "hydroquinone" || p.b.id === "hydroquinone"), false);
    assert.equal(KONFLIK_PAIRS.some((p) => p.a.id === "witch-hazel" || p.b.id === "witch-hazel"), false);
  });

  it("pairsFor mengembalikan pasangan lain dari bahan yang sama", () => {
    const lain = pairsFor("retinol", "retinol-dan-vitamin-c");
    assert.ok(lain.length > 0);
    assert.ok(lain.every((p) => p.slug !== "retinol-dan-vitamin-c"));
  });
});

describe("konflikAntara (alat /cek-konflik)", async () => {
  const { konflikAntara } = await import("@/lib/konflik-pairs");
  const { getIngredientById } = await import("@/lib/ingredients");
  const ing = (...ids) => ids.map((i) => getIngredientById(i));

  it("Retinol + Vitamin C terdeteksi", () => {
    assert.equal(konflikAntara(ing("retinol", "vitamin-c")).length, 1);
  });
  it("Bakuchiol + Retinol TIDAK terdeteksi sebagai konflik", () => {
    const b = ing("bakuchiol", "retinol");
    assert.ok(b.every(Boolean), "bahan harus ada");
    assert.equal(konflikAntara(b).length, 0);
  });
  it("tanpa bahan bentrok, hasilnya kosong", () => {
    assert.equal(konflikAntara(ing("niacinamide", "retinol")).length, 0);
  });
});
