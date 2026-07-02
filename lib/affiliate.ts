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
 * yang membungkus URL tujuan di domain shopee.co.id. Begitu satu deeplink dibuat,
 * SEMUA produk otomatis punya link komisi tanpa perlu generate satu-satu.
 *
 * Format BARU (2026-07, terverifikasi live): short-link `invl.io`
 *   https://invl.io/<code>?aff_sub=<subid>&url=<dest>
 * Kode <code> (mis. "clnlp1t") membawa ID publisher + offer; parameter `url=` DIBACA
 * dinamis oleh redirector (tes: tukar url → tujuan ikut pindah, affiliate_id tetap
 * nempel), jadi satu kode dipakai ulang untuk semua produk dengan menukar `url=`.
 *
 * Format LAMA (masih didukung sbg fallback):
 *   https://invol.co/aff_m?offer_id=<offer>&aff_id=<aff>&source=<subid>&url=<dest>
 * Semua nilai ini BUKAN rahasia — muncul di setiap link affiliate publik.
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
// Format BARU (short-link invl.io): satu kode dari Deeplink Generator, dipakai ulang.
const INVOLVE_LINK_CODE = process.env.NEXT_PUBLIC_INVOLVE_LINK_CODE?.trim();
// Format LAMA (fallback): offer_id + aff_id.
const INVOLVE_OFFER_ID = process.env.NEXT_PUBLIC_INVOLVE_OFFER_ID?.trim();
const INVOLVE_AFF_ID = process.env.NEXT_PUBLIC_INVOLVE_AFF_ID?.trim();
// Sub-id pelacakan (di link baru = `aff_sub`, di link lama = `source`).
const INVOLVE_SOURCE = process.env.NEXT_PUBLIC_INVOLVE_SOURCE?.trim() || "jujurskin";

/** Apakah otomasi Involve Asia aktif (kode short-link ATAU pasangan offer/aff terisi). */
export function involveEnabled(): boolean {
  return !!INVOLVE_LINK_CODE || (!!INVOLVE_OFFER_ID && !!INVOLVE_AFF_ID);
}

/**
 * Bungkus URL tujuan (harus di domain shopee.co.id) menjadi deeplink affiliate
 * Involve Asia. Mengembalikan null bila otomasi belum dikonfigurasi.
 * Prioritas: short-link `invl.io` (baru) → `invol.co/aff_m` (lama).
 */
export function involDeeplink(destUrl: string): string | null {
  if (INVOLVE_LINK_CODE) {
    const params = new URLSearchParams({ aff_sub: INVOLVE_SOURCE, url: destUrl });
    return `https://invl.io/${INVOLVE_LINK_CODE}?${params.toString()}`;
  }
  if (INVOLVE_OFFER_ID && INVOLVE_AFF_ID) {
    const params = new URLSearchParams({
      offer_id: INVOLVE_OFFER_ID,
      aff_id: INVOLVE_AFF_ID,
      source: INVOLVE_SOURCE,
      url: destUrl,
    });
    return `https://invol.co/aff_m?${params.toString()}`;
  }
  return null;
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
