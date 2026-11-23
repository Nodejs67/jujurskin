import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { analyzeRoast } from "@/lib/roast/engine";
import { matchProduct } from "@/lib/roast/match";

const find = (r, kind) => r.findings.filter((f) => f.kind === kind);
const overlapFor = (r, needle) =>
  find(r, "overlap").find((f) => f.title.toLowerCase().includes(needle.toLowerCase()));

describe("roast engine — contoh dari adviser", () => {
  // Persis input yang ditulis adviser.
  const input = {
    skinType: "berminyak",
    concerns: ["jerawat"],
    products: [
      { name: "Skintific Ceramide", price: 150_000 },
      { name: "Somethinc Niacinamide", price: 120_000 },
      { name: "The Ordinary Niacinamide", price: 180_000 },
      { name: "Brightening toner", price: 90_000 },
    ],
  };

  it("menghitung total belanja apa adanya", () => {
    assert.equal(analyzeRoast(input).totalSpend, 540_000);
  });

  it("menemukan tumpang tindih niacinamide", () => {
    const r = analyzeRoast(input);
    const f = overlapFor(r, "niacinamide");
    assert.ok(f, "harus ada temuan overlap niacinamide");
    // displayName memakai nama lengkap dari DB, bukan teks mentah user.
    assert.ok(f.products.some((p) => p.startsWith("Somethinc")), f.products.join(" | "));
    assert.ok(f.products.some((p) => p.startsWith("The Ordinary")), f.products.join(" | "));
  });

  it("MEMPERTAHANKAN yang termurah, bukan yang termahal", () => {
    const r = analyzeRoast(input);
    const f = overlapFor(r, "niacinamide");
    // Somethinc 120k dipertahankan → hemat = 180k (The Ordinary).
    assert.match(f.detail, /Somethinc Niacinamide/);
    assert.equal(f.saving, 180_000);
  });

  it("tidak pernah menyuruh membuang pelembap yang kebetulan mengandung niacinamide", () => {
    const r = analyzeRoast(input);
    const f = overlapFor(r, "niacinamide");
    // Skintific 5X Ceramide = kategori moisturizer di DB, meski key_ingredients-nya
    // memuat Niacinamide. Ia TIDAK boleh masuk daftar produk mubazir.
    assert.ok(
      !f.products.some((p) => p.toLowerCase().includes("ceramide")),
      `pelembap ikut dituduh mubazir: ${f.products.join(", ")}`
    );
  });

  it("skor turun tapi tidak pernah nol", () => {
    const r = analyzeRoast(input);
    assert.ok(r.score >= 5 && r.score < 100, `skor di luar rentang: ${r.score}`);
  });

  it("selalu menyertakan disclaimer bukan-diagnosis", () => {
    assert.match(analyzeRoast(input).disclaimer, /bukan diagnosis medis/i);
  });
});

describe("roast engine — jebakan data", () => {
  it("mengenali derivat Vitamin C yang namanya beda sebagai pekerjaan yang sama", () => {
    // Ini yang gagal ditangkap kalau mencocokkan per-id kandungan.
    const r = analyzeRoast({
      products: [
        { name: "Serum A Ascorbyl Glucoside", price: 200_000 },
        { name: "Serum B Sodium Ascorbyl Phosphate", price: 150_000 },
      ],
    });
    const f = overlapFor(r, "vitamin c");
    assert.ok(f, "derivat Vitamin C berbeda harus dihitung satu pekerjaan");
    assert.equal(f.saving, 200_000); // simpan yang 150k
  });

  it("mengenali retinoid lintas-molekul (retinal vs adapalene)", () => {
    const r = analyzeRoast({
      products: [
        { name: "Serum Retinal 0.1%", price: 300_000 },
        { name: "Gel Adapalene", price: 50_000 },
      ],
    });
    assert.ok(overlapFor(r, "retinoid"), "retinal + adapalene = satu pekerjaan");
  });

  it("tidak salah cocok: avobenzone bukan benzoyl peroxide", () => {
    const m = matchProduct({ name: "Sunscreen Avobenzone Tinosorb" });
    const ids = m.groups.map((g) => g.groupId);
    assert.ok(ids.includes("sunscreen"));
    assert.ok(!ids.includes("benzoyl_peroxide"), "avobenzone salah dihukum sebagai benzoyl");
  });
});

describe("roast engine — pagar keamanan", () => {
  it("konflik = saran waktu pakai, tidak menghasilkan penghematan", () => {
    const r = analyzeRoast({
      products: [
        { name: "Serum Vitamin C", price: 100_000 },
        { name: "Serum Niacinamide", price: 100_000 },
      ],
    });
    const c = find(r, "conflict");
    assert.ok(c.length >= 1, "vitamin C + niacinamide harus memicu konflik waktu");
    assert.ok(c.every((f) => f.saving === 0), "konflik tidak boleh menyuruh buang produk");
  });

  it("tidak melaporkan konflik kalau kedua kandungan ada di SATU produk", () => {
    // Skintific Vitamin C (DB) memuat vitamin C DAN niacinamide dalam satu formula.
    // Menyuruh "pakai di waktu berbeda" mustahil dijalankan — isinya satu botol.
    const r = analyzeRoast({ products: [{ name: "Skintific Vitamin C", price: 100_000 }] });
    assert.equal(find(r, "conflict").length, 0, "konflik dalam satu formula tidak boleh dilaporkan");
  });

  it("tetap melaporkan konflik kalau kandungannya di produk berbeda", () => {
    const r = analyzeRoast({
      products: [
        { name: "Serum Vitamin C", price: 100_000 },
        { name: "Serum Niacinamide", price: 90_000 },
      ],
    });
    assert.ok(find(r, "conflict").length >= 1);
  });

  it("sunscreen tidak pernah masuk daftar mubazir", () => {
    const r = analyzeRoast({
      products: [
        { name: "Azarine Hydrasoothe Sunscreen SPF45", price: 65_000 },
        { name: "Sunscreen Skin Aqua SPF50", price: 80_000 },
      ],
    });
    assert.equal(r.potentialSaving, 0, "sunscreen tidak boleh dihitung sebagai penghematan");
    assert.ok(!find(r, "overlap").some((f) => f.title.toLowerCase().includes("sunscreen")));
  });

  it("menandai sunscreen yang hilang sebagai temuan paling penting", () => {
    const r = analyzeRoast({ products: [{ name: "Somethinc Niacinamide", price: 120_000 }] });
    assert.ok(find(r, "missing").some((f) => f.title.toLowerCase().includes("sunscreen")));
    assert.match(r.verdict, /sunscreen/i);
  });

  it("produk tak dikenal tidak bikin buntu", () => {
    const r = analyzeRoast({ products: [{ name: "Serum abal-abal TikTok Shop", price: 25_000 }] });
    assert.equal(r.productsAnalyzed, 1);
    assert.ok(r.verdict.length > 0);
    assert.ok(r.score >= 5);
  });

  it("input kosong tidak melempar error", () => {
    const r = analyzeRoast({ products: [] });
    assert.equal(r.productsAnalyzed, 0);
    assert.ok(r.score >= 5);
  });

  it("tebakan dari klaim nama diberi label keyakinan rendah", () => {
    const r = analyzeRoast({
      products: [
        { name: "Brightening toner", price: 90_000 },
        { name: "Glow serum", price: 90_000 },
      ],
    });
    const f = overlapFor(r, "pencerah");
    assert.ok(f, "dua produk klaim mencerahkan harus terdeteksi");
    assert.equal(f.confidence, "rendah", "tebakan dari nama harus jujur soal keyakinannya");
  });

  it("deterministik: input sama → output sama persis", () => {
    const input = {
      products: [
        { name: "Somethinc Niacinamide", price: 120_000 },
        { name: "The Ordinary Niacinamide", price: 180_000 },
      ],
    };
    assert.deepEqual(analyzeRoast(input), analyzeRoast(input));
  });
});
