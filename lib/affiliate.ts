import type { Product } from "@/lib/products";
import { SHOPEE_AFFILIATE_LINKS } from "@/lib/affiliate-links";

/**
 * MONETISASI JUJUR — Affiliate Shopee via Involve Asia.
 *
 * Prinsip: konsumen bayar harga yang SAMA (komisi dari Shopee/penjual, bukan
 * ditambahkan ke pembeli). Komisi TIDAK boleh memengaruhi urutan rekomendasi —
 * pemeringkatan tetap berbasis kandungan & keamanan (lib/product-matcher.ts).
 *
 * OTOMASI (Involve Asia): deeplink Involve Asia pada dasarnya adalah URL template
 * yang membungkus URL tujuan di domain shopee.co.id. Begitu `offer_id` (Shopee di
 * Involve Asia) dan `aff_id` (ID publisher) diketahui, SEMUA produk otomatis punya
 * link komisi tanpa perlu generate satu-satu. Format resmi:
 *   https://invol.co/aff_m?offer_id=<offer>&aff_id=<aff>&source=<subid>&url=<dest>
 * offer_id & aff_id BUKAN rahasia — keduanya muncul di setiap link affiliate publik.
 */

/** Kalimat keterbukaan yang ditampilkan di dekat tombol beli. */
export const AFFILIATE_DISCLOSURE =
  "Kami dapat komisi kecil dari Shopee kalau kamu beli lewat sini — TANPA nambah harga buatmu. Ini yang bikin JujurSkin tetap gratis & jujur.";

/**
 * Konfigurasi Involve Asia. Diambil sekali dari dashboard Involve Asia
 * (atau dari satu link manual mana pun) lalu diisi di .env.local & Vercel env:
 *   NEXT_PUBLIC_INVOLVE_OFFER_ID=...   (offer Shopee Indonesia di Involve Asia)
 *   NEXT_PUBLIC_INVOLVE_AFF_ID=...     (ID publisher kamu)
 *   NEXT_PUBLIC_INVOLVE_SOURCE=...     (opsional sub-id pelacakan, default "jujurskin")
 * Tanpa kedua ID ini, app jatuh ke link pencarian Shopee biasa (tanpa komisi),
 * jadi tidak ada tombol mati dan tidak ada klaim komisi palsu.
 */
const INVOLVE_OFFER_ID = process.env.NEXT_PUBLIC_INVOLVE_OFFER_ID?.trim();
const INVOLVE_AFF_ID = process.env.NEXT_PUBLIC_INVOLVE_AFF_ID?.trim();
const INVOLVE_SOURCE = process.env.NEXT_PUBLIC_INVOLVE_SOURCE?.trim() || "jujurskin";

/** Apakah otomasi Involve Asia aktif (kedua ID terisi). */
export function involveEnabled(): boolean {
  return !!INVOLVE_OFFER_ID && !!INVOLVE_AFF_ID;
}

/**
 * Bungkus URL tujuan (harus di domain shopee.co.id) menjadi deeplink affiliate
 * Involve Asia. Mengembalikan null bila otomasi belum dikonfigurasi.
 */
export function involDeeplink(destUrl: string): string | null {
  if (!involveEnabled()) return null;
  const params = new URLSearchParams({
    offer_id: INVOLVE_OFFER_ID!,
    aff_id: INVOLVE_AFF_ID!,
    source: INVOLVE_SOURCE,
    url: destUrl,
  });
  return `https://invol.co/aff_m?${params.toString()}`;
}

/**
 * Link affiliate Shopee manual yang VALID (https) bila ada — prioritas tertinggi.
 * Sumber: field `product.affiliate_url`, ATAU peta `SHOPEE_AFFILIATE_LINKS`
 * (lib/affiliate-links.ts) yang dipetakan per id produk.
 */
function manualAffiliate(product: Product): string | null {
  const u = product.affiliate_url?.trim() || SHOPEE_AFFILIATE_LINKS[product.id]?.trim();
  return u && /^https:\/\//i.test(u) ? u : null;
}

/** URL halaman produk Shopee langsung bila diketahui & valid. */
function directShopeeUrl(product: Product): string | null {
  const u = product.shopee_url?.trim();
  return u && /^https:\/\/(www\.)?shopee\.co\.id\//i.test(u) ? u : null;
}

/**
 * URL tujuan Shopee mentah (sebelum dibungkus affiliate): halaman produk bila
 * diketahui, kalau tidak halaman PENCARIAN brand + nama.
 */
function shopeeDestination(product: Product): string {
  return (
    directShopeeUrl(product) ??
    `https://shopee.co.id/search?keyword=${encodeURIComponent(`${product.brand} ${product.name}`)}`
  );
}

/** Apakah kita punya link LANGSUNG ke halaman produk (bukan sekadar pencarian). */
function hasDirectProductLink(product: Product): boolean {
  return !!manualAffiliate(product) || !!directShopeeUrl(product);
}

/**
 * Apakah tombol Shopee untuk produk ini MENGHASILKAN komisi.
 * True bila: ada link affiliate manual, ATAU otomasi Involve Asia aktif.
 * Dipakai untuk memutuskan apakah menampilkan disclosure (jujur — tidak mengaku
 * komisi untuk link pencarian biasa saat otomasi mati).
 */
export function hasShopeeAffiliate(product: Product): boolean {
  return !!manualAffiliate(product) || involveEnabled();
}

/**
 * URL tujuan tombol Shopee:
 * 1. Link affiliate manual produk bila ada (override per-produk).
 * 2. Bila otomasi Involve Asia aktif → bungkus tujuan Shopee jadi deeplink komisi.
 * 3. Bila belum dikonfigurasi → link PENCARIAN Shopee biasa (tanpa komisi),
 *    supaya pengguna tetap bisa menemukan produknya.
 */
export function shopeeUrl(product: Product): string {
  const manual = manualAffiliate(product);
  if (manual) return manual;
  const auto = involDeeplink(shopeeDestination(product));
  if (auto) return auto;
  return shopeeDestination(product);
}

/**
 * Label tombol Shopee. "Beli di Shopee" hanya saat kita punya link LANGSUNG ke
 * halaman produk; selain itu "Cari di Shopee" (jujur — link mengarah ke pencarian
 * meski tetap berkomisi lewat Involve Asia).
 */
export function shopeeButtonLabel(product: Product): string {
  return hasDirectProductLink(product) ? "Beli di Shopee" : "Cari di Shopee";
}
