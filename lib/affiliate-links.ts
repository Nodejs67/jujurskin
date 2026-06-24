/**
 * PETA LINK AFFILIATE SHOPEE (manual) — id produk → URL affiliate (https).
 *
 * Cara isi: di app/dashboard Shopee Affiliate, tempel URL produk → Generate →
 * Salin short link (mis. https://s.shopee.co.id/xxxx) → tempel sebagai value.
 *
 * Prioritas tertinggi di lib/affiliate.ts: kalau id ada di sini, tombol Shopee
 * pakai link ini (dapat komisi) & menampilkan disclosure. Kalau kosong, jatuh
 * ke otomasi Involve Asia (bila env diisi) atau link pencarian biasa.
 *
 * ⚠️ Komisi TIDAK boleh mengubah urutan rekomendasi (lihat lib/product-matcher.ts).
 * Urutan di bawah = prioritas dari AFFILIATE_PRIORITY.md (paling sering diklik dulu).
 * Tinggal hapus `// ` lalu tempel link di antara tanda kutip.
 */
export const SHOPEE_AFFILIATE_LINKS: Record<string, string> = {
  // ── Tier "Pilihan Jujur" (isi 34 ini DULU) ──
  // "cetaphil-gentle-cleanser": "",            // muncul 132×
  // "cerave-foaming-cleanser": "",             // 120×
  // "skintific-vitamin-c": "",                 // 94×
  // "isntree-hyaluronic-acid-sun-gel": "",     // 90×
  // "carasun-solar-smart-spf45": "",           // 72×
  // "senka-perfect-whip": "",                  // 54×
  // "azarine-azelaic-acid": "",                // 51×
  // "cerave-am-spf30": "",                     // 48×
  // "avoskin-sunbae-sunscreen-spf50": "",      // 48×
  // "azarine-hydrasoothe-spf45": "",           // 36×
  // "cosrx-snail-mucin-essence": "",           // 36×
  // "skintific-5x-ceramide": "",               // 36×
  // "cerave-moisturizing-cream": "",           // 34×
  // "somethinc-niacinamide": "",               // 30×
  // "hada-labo-gokujyun": "",                  // 24×
  // "avoskin-phte-essence": "",                // 24×
  // "avoskin-retinol": "",                     // 23×
  // "skintific-acne-serum": "",                // 22×
  // "wardah-aloe-vera-gel": "",                // 20×
  // "skinaqua-uv-moisture-milk-spf50": "",     // 18×
  // "loreal-revitalift-vitc-serum": "",        // 18×
  // "you-radiance-booster-serum": "",          // 18×
  // "skinaqua-tone-up-sunscreen": "",          // 18×
  // "npure-centella-cleanser": "",             // 18×
  // "emina-bright-stuff-moisturizer": "",      // 16×
  // "blp-face-mist": "",                       // 12×
  // "wardah-hydrating-toner": "",              // 12×
  // "sensatia-botanicals-tea-tree-serum": "",  // 11×
  // "olay-total-effects-cream": "",            // 8×
  // "loreal-revitalift-hyaluronic-serum": "",  // 6×
  // "hadalabo-gokujyun-face-wash": "",         // 6×
  // "erha-day-moisturizer": "",                // 2×
  // "originote-ceramide-moisturizer": "",      // 2×
  // "ponds-age-miracle-day-cream": "",         // 2×
};
