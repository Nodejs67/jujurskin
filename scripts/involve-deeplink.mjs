#!/usr/bin/env node
/**
 * Util uji deeplink Involve Asia (mode TEMPLATE — tanpa API, format resmi terverifikasi).
 *
 * Pakai:
 *   NEXT_PUBLIC_INVOLVE_OFFER_ID=123 NEXT_PUBLIC_INVOLVE_AFF_ID=456 \
 *     node scripts/involve-deeplink.mjs "https://shopee.co.id/search?keyword=cetaphil%20gentle%20cleanser"
 *
 * Mengembalikan deeplink invol.co. Tujuan dipakai untuk memastikan konfigurasi
 * (offer_id/aff_id) sudah benar SEBELUM diisi ke .env.local & Vercel.
 *
 * Cara dapat offer_id & aff_id (sekali saja, TANPA API key):
 *   1. Login app.involve.asia → Promotion → Deeplink Generator.
 *   2. Tempel URL produk Shopee mana pun, pilih offer "Shopee Indonesia", Generate.
 *   3. Link hasil berbentuk: https://invol.co/aff_m?offer_id=XXXX&aff_id=YYYY&source=...&url=...
 *      Ambil XXXX (offer_id) dan YYYY (aff_id) dari situ.
 */

const offerId = (process.env.NEXT_PUBLIC_INVOLVE_OFFER_ID || "").trim();
const affId = (process.env.NEXT_PUBLIC_INVOLVE_AFF_ID || "").trim();
const source = (process.env.NEXT_PUBLIC_INVOLVE_SOURCE || "jujurskin").trim();
const dest = process.argv[2];

if (!offerId || !affId) {
  console.error("✗ Set NEXT_PUBLIC_INVOLVE_OFFER_ID dan NEXT_PUBLIC_INVOLVE_AFF_ID dulu.");
  process.exit(1);
}
if (!dest) {
  console.error('✗ Kasih URL tujuan Shopee. Contoh: node scripts/involve-deeplink.mjs "https://shopee.co.id/..."');
  process.exit(1);
}
if (!/^https:\/\/(www\.)?shopee\.co\.id\//i.test(dest)) {
  console.error("⚠ Tujuan sebaiknya di domain shopee.co.id (halaman produk/pencarian).");
}

const params = new URLSearchParams({ offer_id: offerId, aff_id: affId, source, url: dest });
console.log(`https://invol.co/aff_m?${params.toString()}`);
