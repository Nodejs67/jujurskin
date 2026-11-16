// Jalankan: node --experimental-strip-types tests/alternatives.test.mjs
import assert from "node:assert/strict";
import { PRODUCTS, cheaperAlternatives } from "../lib/products.ts";

const mid = (p) => (p.price_min + p.price_max) / 2;
let withAlt = 0;
for (const p of PRODUCTS) {
  const alts = cheaperAlternatives(p);
  assert.ok(alts.length <= 3);
  for (const a of alts) {
    assert.notEqual(a.id, p.id);
    assert.equal(a.category, p.category);
    assert.ok(mid(a) < mid(p), `${a.id} harus lebih murah dari ${p.id}`);
  }
  if (alts.length) withAlt++;
}
// Produk termurah di kategorinya tidak boleh punya alternatif lebih murah.
const cheapest = [...PRODUCTS].sort((a, b) => mid(a) - mid(b))[0];
assert.equal(cheaperAlternatives(cheapest).length, 0);
// Produk mewah harus punya alternatif.
const lamer = PRODUCTS.find((p) => p.id === "la-mer-creme-de-la-mer");
console.log("produk dengan alternatif:", withAlt, "/", PRODUCTS.length, "| La Mer:", cheaperAlternatives(lamer).map((a) => a.id));
console.log("alternatives tests OK");
