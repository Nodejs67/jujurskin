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
  // Link manual Shopee Affiliate (komisi penuh, prioritas tertinggi). Diisi 2026-07-02.
  "cetaphil-gentle-cleanser": "https://s.shopee.co.id/8V6zhN9AFr",   // muncul 132×
  "cerave-foaming-cleanser": "https://s.shopee.co.id/903GK1lq6b",    // 120×
  "skintific-vitamin-c": "https://s.shopee.co.id/2BCwBhFGxi",        // 94×
  // "isntree-hyaluronic-acid-sun-gel": "",     // 90× (out of stock)
  "carasun-solar-smart-spf45": "https://s.shopee.co.id/LlI17JRG1",   // 72×
  "senka-perfect-whip": "https://s.shopee.co.id/18RcZFJKl",          // 54×
  // "azarine-azelaic-acid": "",                // 51× (out of stock)
  "cerave-am-spf30": "https://s.shopee.co.id/5L9xzxUQDj",            // 48×
  "avoskin-sunbae-sunscreen-spf50": "https://s.shopee.co.id/8V6zlqGGm7", // 48×
  "azarine-hydrasoothe-spf45": "https://s.shopee.co.id/4Ay0bxm8gk",  // 36×
  "cosrx-snail-mucin-essence": "https://s.shopee.co.id/70IBzHlnEd",  // 36×
  "skintific-5x-ceramide": "https://s.shopee.co.id/AKYdxTTE24",      // 36×
  "cerave-moisturizing-cream": "https://s.shopee.co.id/8fQPyX3BsL",  // 34×
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
