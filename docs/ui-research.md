# JujurSkin — UI/UX Research (2025–2026)

> Dokumen riset **sebelum** prototyping. Tidak ada perubahan ke aplikasi utama.
> Output lanjutan: `docs/design-direction.md` → lalu prototype di `/design-preview`.
> Screenshot referensi tersimpan di `docs/refs/`.

---

## 1. AUDIT APLIKASI SAAT INI

### 1.1 Apa itu JujurSkin
Platform skincare **jujur** Indonesia: memberi rekomendasi berbasis kondisi kulit & budget
(bukan iklan), termasuk berani bilang produk apa yang **tidak perlu** dibeli. Gratis.

### 1.2 Target user
- **Mayoritas akses dari HP** (mobile-first wajib).
- Perempuan & laki-laki Indonesia, banyak **pemula** skincare.
- **Budget-conscious**, skeptis terhadap iklan/over-claim, cari **kepercayaan**.
- Konteks lokal: iklim tropis, BPOM, whitecast, harga Rupiah.

### 1.3 Inventaris 31 halaman (dikelompokkan)
| Kelompok | Halaman |
|---|---|
| **Inti / flow** | `/` (landing), `/analisis` (kuesioner 8 langkah), `/analisis-foto`, `/hasil`, `/rutinitas`, `/progress` |
| **Alat Jujur** | `/cek-bpom`, `/cek-klaim`, `/cek-konflik`, `/sunscreen`, `/ke-dokter`, `/simulasi`, `/kalkulator`, `/tidak-perlu` |
| **Jelajah/edukasi** | `/produk`, `/produk/[id]`, `/bandingkan`, `/bandingkan-produk`, `/edukasi`, `/edukasi/ingredient/[slug]`, `/kamus`, `/mitos-fakta`, `/iklim`, `/kulit-tropis`, `/panduan`, `/artikel`, `/artikel/[slug]` |
| **Akun/lainnya** | `/akun`, `/masuk`, `/kebijakan`, `/feedback` |

### 1.4 Flow pengguna utama
1. Landing → "Analisis Gratis" → kuesioner 8 langkah (+opsi foto) → `/hasil` → `/rutinitas` → `/progress`.
2. Eksplor mandiri: alat cek (BPOM/konflik/sunscreen) & katalog produk.

### 1.5 PAIN POINT — diidentifikasi
**Desktop & global**
| # | Masalah | Bukti |
|---|---|---|
| D1 | **Landing kepanjangan** — ~13 section full-height (`py-24`), monoton (semua `h2 text-3xl/4xl font-bold`, selang-seling `bg-secondary/20`). | `app/page.tsx` |
| D2 | **Font generik/kaku** — Geist (font tools developer), tidak ada karakter brand kecantikan. | `app/layout.tsx` |
| D3 | **Kanvas muted ke-hijau-an**, kurang "terang & bersih" ala retail beauty. | `globals.css` token |
| D4 | **Tidak ada search & tidak ada "belanja/jelajah" di depan** — beda total dgn Sociolla/FD yang search+grid first. | landing |
| D5 | Efek berat (BorderBeam/marquee/blob) → pernah bikin **kartu blank** & terasa ramai. | history session 17 |

**Mobile (kritis — mayoritas user)**
| # | Masalah | Bukti |
|---|---|---|
| M1 | **25+ fitur ketimbun di menu hamburger** (3 grup) → fitur "hilang" dari user. | `site-header.tsx` |
| M2 | **Tidak ada bottom navigation** — pola wajib app mobile modern (Sociolla/FD/Tokopedia semua punya). | — |
| M3 | Landing panjang = **scroll lelah**, lambat ke aksi utama. | `app/page.tsx` |
| M4 | Kartu/teks rapat di beberapa alat; hierarki kurang tegas di layar kecil. | berbagai `/cek-*` |
| M5 | Penemuan produk lemah: tidak ada chip kategori / filter cepat khas e-commerce. | `/produk` |

### 1.6 Yang SUDAH baik (pertahankan)
- Token semantik Tailwind konsisten → redesign murah.
- Konten kaya & jujur (disclaimer, "tidak perlu", BPOM) → **pembeda brand**, jangan dihilangkan.
- Identitas hijau (natural/jujur) → anti-pink, justru pembeda dari kompetitor.

---

## 2. SUMBER & METODE RISET
- **Galeri/inspirasi:** Figma Community, Dribbble, Mobbin (alur app nyata), Landingfolio, UI8, Godly, Land-book, Refero, Pageflows.
- **Benchmark produk nyata** (di-screenshot, lihat `docs/refs/`): Sociolla, Female Daily, Sephora, Tokopedia, Linear, Stripe, Airbnb.
- Metode: tangkap layout nyata + sintesis pola dari produk ber-rating UX tinggi 2025–2026.

---

## 3. KATALOG 50+ REFERENSI (dikelompokkan per aspek)

### 3.1 LAYOUT (struktur halaman, grid, density)
1. **Sociolla** — search + banner carousel + grid produk rapi, whitespace lega.
2. **Female Daily** — community/review + grid + ikon kategori bulat.
3. **Sephora** — hero editorial + rail produk horizontal + filter kuat.
4. **Ulta** — grid padat tapi tertata, mega-promo.
5. **Tokopedia** — super-app: search dominan + ikon kategori grid + feed.
6. **Shopee** — density tinggi, flash-sale rail, kategori ikon.
7. **Blibli** — kartu bersih, banyak section bertema.
8. **Airbnb** — kartu foto besar, grid responsif, filter pill sticky.
9. **Pinterest** — masonry grid, foto-forward, minim chrome.
10. **Linear** — landing satu-fokus, section ber-ritme, banyak ruang gelap.
11. **Stripe** — hero gradient, grid fitur, dokumentasi rapi.
12. **Notion** — kanvas putih, ilustrasi, blok modular.
13. **Vercel** — kontras hitam-putih, grid presisi.
14. **Apple** — section sinematik full-bleed, fokus 1 pesan/section.

### 3.2 NAVIGATION
15. **Tokopedia/Shopee** — **bottom nav 5 ikon** (Home/Feed/Cart/Transaksi/Akun) → standar mobile ID.
16. **Sociolla** — top search persist + kategori mega-menu.
17. **Female Daily** — tab REVIEWS/ARTICLES/STUDIO + ikon kategori bulat scrollable.
18. **Airbnb** — search-bar sebagai nav utama; filter pill sticky di bawah header.
19. **Instagram/TikTok** — bottom nav minimal + gesture; content-first.
20. **Linear** — top nav tipis, mega-dropdown rapi.
21. **Stripe** — nav hover-reveal terstruktur per persona.
22. **Raycast/Arc** — command palette (⌘K) untuk fitur banyak → relevan utk 25+ alat JujurSkin.

### 3.3 CARD DESIGN
23. **Airbnb** — foto rounded-xl, info ringkas, rating inline; gold standard.
24. **Sephora** — kartu produk: foto, brand, nama, ★, harga, badge (Clean/New).
25. **Sociolla** — kartu produk + label diskon + wishlist heart.
26. **Pinterest** — kartu tanpa border, bayangan halus, hover action.
27. **Stripe** — kartu fitur dengan ikon gradient lembut.
28. **Linear** — kartu gelap glass + border tipis bercahaya.
29. **Notion** — kartu template dengan cover ilustrasi.
30. **Revolut/Cash App** — kartu fintech: angka besar, hirarki tegas.

### 3.4 TYPOGRAPHY
31. **Aesop / Typology** — serif editorial, lega, kesan jujur & premium.
32. **Apple** — SF, hirarki ukuran sangat jelas, headline besar tipis.
33. **Stripe** — sans modern (Sohne-like), readable, tracking rapi.
34. **Linear** — Inter-tight, kontras berat/ringan kuat.
35. **Airbnb** — Cereal (custom), bulat & ramah.
36. **Plus Jakarta Sans** — sans buatan Indonesia, hangat (kandidat body JujurSkin).
37. **Fraunces / Instrument Serif** — serif modern utk headline (kandidat display).
38. **Glossier** — sans minimalis + sentuhan serif logo.

### 3.5 COLOR SYSTEM
39. **Sociolla / Female Daily** — putih + **pink** (yg DIHINDARI JujurSkin).
40. **Glossier** — pink pucat + nude → terlalu "pink" juga.
41. **Aesop** — krem/olive/hitam → premium natural (selaras hijau jujur).
42. **Linear** — dark + aksen indigo bercahaya.
43. **Stripe** — putih + indigo/ungu + gradient halus.
44. **Notion** — putih + abu netral, aksen minim.
45. **Airbnb** — putih + coral (Rausch) sebagai 1 aksen.
46. **Oura / Whoop** — dark premium, data-viz elegan (relevan utk skor kulit).
47. **JujurSkin** — **emerald hijau jujur** sebagai 1 aksen + gold hangat → anti-pink, on-brand.

### 3.6 MOBILE UX
48. **Tokopedia/Shopee** — bottom nav, sticky search, kategori ikon, sheet filter.
49. **Sephora app (Mobbin)** — onboarding skin-profile, scan kulit, rail rekomendasi.
50. **Curology / Hims&Hers / Skin+Me** — **skin quiz flow** bertahap, progress bar, 1 pertanyaan/layar → patokan untuk `/analisis`.
51. **Duolingo / Headspace** — progress & retensi: streak, badge, microcopy ramah.
52. **Airbnb** — bottom sheet, map+list, filter pill → pola interaksi mobile halus.
53. **Oura** — ring score + tren mingguan → patokan `/progress` & Healthy Skin Score.

---

## 4. COMPETITIVE ANALYSIS (12 referensi — kelebihan/kekurangan → pola diambil)

| Produk | Kelebihan | Kekurangan | Pola untuk JujurSkin |
|---|---|---|---|
| **Sociolla** | Search-first, grid produk rapi, whitespace lega, alur belanja jelas | Pink dominan, banyak promo modal (ramai), berat | Search persist + grid produk + chip kategori |
| **Female Daily** | Kuat di **review/komunitas & rating**, ikon kategori bulat, konten edukatif | Pink, density tinggi, navigasi tab agak penuh | Rating/ulasan jujur + ikon kategori bulat scrollable |
| **Sephora** | Kartu produk premium, badge (Clean/New), filter kuat, editorial | Sangat komersial, kurang "jujur/edukatif netral" | Anatomi kartu produk + badge ("✓ Worth it", "Pemula") |
| **Tokopedia** | **Bottom nav** ID-standard, search dominan, kategori ikon grid | Super-app ramai, banyak distraksi | Bottom nav 5-ikon + sticky search (jawab pain M1/M2) |
| **Shopee** | Penemuan cepat, flash-sale rail, microcopy aksi | Density & warna agresif, "murah meriah" | Rail horizontal "produk pilihan" + label hemat |
| **Pinterest** | Foto-forward, masonry, fokus visual, minim chrome | Sedikit teks/penjelasan | Masonry untuk inspirasi rutinitas/before-after |
| **Airbnb** | Kartu foto kelas dunia, filter pill sticky, ramah-premium | Bukan konteks beauty | Kartu, filter pill, kehangatan premium |
| **Stripe** | Hero gradient elegan, grid fitur, kredibilitas tinggi | Untuk developer, dingin utk beauty | Hero gradient halus + grid "Alat Jujur" |
| **Linear** | Ritme section, presisi, kesan startup mahal | Dark/teknis, bukan ritel | Presisi spacing, motion halus, kualitas "Series A" |
| **Notion** | Kanvas bersih, modular, ramah | Generik kalau ditiru mentah | Blok modular bersih utk edukasi/kamus |
| **Curology/Skin+Me** | **Skin quiz** bertahap, progress, kesan klinis dipercaya | Terbatas ke produk sendiri | Pola kuesioner 1-langkah/layar + progress |
| **Oura/Whoop** | Skor + tren data elegan, retensi via insight harian | Premium/dark, niche | Healthy Skin Score + tren mingguan `/progress` |

---

## 5. POLA UI PALING EFEKTIF (sintesis → dipakai di semua direction)

1. **Mobile-first + Bottom Navigation** (5 ikon: Beranda · Analisis · Alat · Produk · Akun) — jawab pain M1/M2.
2. **Search persist + chip kategori** di header → fitur kebuka, bukan ketimbun menu.
3. **Card-grid foto-forward** untuk produk & alat (rounded-2xl, shadow lembut, 1 aksen).
4. **Whitespace lega + kanvas terang** (retail-grade) + ritme section yang bervariasi (bukan 13× py-24 sama).
5. **Kuesioner 1-langkah/layar + progress** (sudah ada — tinggal dipoles ala Curology).
6. **Skor + tren** untuk Healthy Skin Score & progress (ala Oura).
7. **Tipografi berkarakter**: display serif (Fraunces) + body Plus Jakarta Sans.
8. **Microcopy jujur** sebagai fitur visual (badge "✓ Worth it / Tidak perlu", disclaimer rapi).
9. **Command palette (⌘K)/sheet "Semua Alat"** untuk 8+ alat → akses cepat tanpa berantakan.
10. **Motion halus & terukur** (kesan startup Series A, bukan efek norak).

---

## 6. SCREENSHOT REFERENSI TERSIMPAN (`docs/refs/`)
- `01-sociolla-m.png` — beauty marketplace ID (search + grid, pink).
- `02-femaledaily-m.png` — community/review + ikon kategori bulat.
- `03-sephora-m.png` — kartu produk premium + badge + filter.
- `04-tokopedia-m.png` — bottom nav + search + kategori ikon (pola mobile ID).
- `05-linear-d.png` — presisi section, kesan startup mahal.
- `06-stripe-d.png` — hero gradient + grid fitur.
- `07-airbnb-d.png` — kartu foto + filter pill.
> (Sebagian situs berat/anti-bot bisa gagal render; katalog §3–§4 tetap berbasis produk nyata.)

---

### Kesimpulan riset
JujurSkin perlu bergerak dari **"landing marketing panjang berbasis teks"** menjadi
**"app beauty mobile-first yang bisa dijelajah"** (search + kategori + grid + bottom nav),
dengan **identitas hijau jujur** (anti-pink), tipografi berkarakter, dan microcopy kejujuran
sebagai pembeda. Detail arah ada di `docs/design-direction.md`.
