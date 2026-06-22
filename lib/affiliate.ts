import type { Product } from "@/lib/products";

/**
 * MONETISASI JUJUR — Affiliate Shopee.
 *
 * Prinsip: konsumen bayar harga yang SAMA (komisi dari Shopee/penjual, bukan
 * ditambahkan ke pembeli). Komisi TIDAK boleh memengaruhi urutan rekomendasi —
 * pemeringkatan tetap berbasis kandungan & keamanan (lib/product-matcher.ts).
 */

/** Kalimat keterbukaan yang ditampilkan di dekat tombol beli. */
export const AFFILIATE_DISCLOSURE =
  "Kami dapat komisi kecil dari Shopee kalau kamu beli lewat sini — TANPA nambah harga buatmu. Ini yang bikin JujurSkin tetap gratis & jujur.";

/** Apakah produk punya link affiliate Shopee yang sudah diisi. */
export function hasShopeeAffiliate(product: Product): boolean {
  return typeof product.affiliate_url === "string" && product.affiliate_url.trim().length > 0;
}

/**
 * URL tujuan tombol Shopee:
 * - Pakai link affiliate produk bila tersedia (menghasilkan komisi).
 * - Bila belum diisi, jatuh ke link PENCARIAN Shopee biasa (tanpa komisi),
 *   supaya pengguna tetap bisa menemukan produknya.
 */
export function shopeeUrl(product: Product): string {
  if (hasShopeeAffiliate(product)) return product.affiliate_url!.trim();
  return `https://shopee.co.id/search?keyword=${encodeURIComponent(`${product.brand} ${product.name}`)}`;
}

/** Label tombol Shopee menyesuaikan apakah link langsung produk atau pencarian. */
export function shopeeButtonLabel(product: Product): string {
  return hasShopeeAffiliate(product) ? "Beli di Shopee" : "Cari di Shopee";
}
