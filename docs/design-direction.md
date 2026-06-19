# JujurSkin — Design Direction (4 Opsi + Rekomendasi Final)

> Lanjutan dari `docs/ui-research.md`. Belum menyentuh app utama.
> Prototype semua opsi nanti hidup di route `/design-preview`.

## Fondasi bersama (semua opsi)
- **Mobile-first** + **Bottom Navigation** (Beranda · Analisis · Alat · Produk · Akun).
- **Search persist + chip kategori** di header (fitur kebuka, bukan ketimbun menu).
- **Anti-pink** → aksen **emerald hijau jujur** + gold hangat.
- Tipografi: **Fraunces** (display) + **Plus Jakarta Sans** (body).
- Kartu rounded-2xl, shadow lembut, foto-forward. Kualitas visual setara "Series A".
- Microcopy jujur sebagai elemen visual (badge "✓ Worth it / Tidak perlu").

---

## OPTION A — MODERN MINIMALIST
**Mood:** tenang, bersih, terpercaya (Linear × Notion × Aesop). Konten yang berbicara.

### Wireframe — Mobile
```
┌──────────────────────────┐
│ ✦ JujurSkin        ⌘ ◍   │  header tipis
│ ┌──────────────────────┐ │
│ │ 🔍 Cari produk/bahan │ │  search pill
│ └──────────────────────┘ │
│ Skincare yang            │  H1 display, lega
│ jujur.                   │
│ Rekomendasi tanpa iklan. │
│ [ Mulai Analisis → ]     │  1 CTA dominan
│                          │
│ ── Alat Jujur ──         │
│ ▢ BPOM   ▢ Konflik       │  grid 2 kolom, ikon
│ ▢ Sunscr ▢ Foto          │  minimal, banyak ruang
│                          │
│ ── Produk pilihan ──     │
│ [card] [card]            │
├──────────────────────────┤
│ ⌂   ✦   ▦   ▢   ◍        │  bottom nav
└──────────────────────────┘
```
### Wireframe — Desktop
```
┌───────────────────────────────────────────────┐
│ ✦ JujurSkin   [🔍 search......]      Masuk [CTA]│
│ chip · chip · chip · chip · chip               │
├───────────────────────────────────────────────┤
│  Skincare yang jujul,            ┌───────────┐ │
│  bukan yang viral.               │ kartu     │ │
│  Rekomendasi tanpa iklan.        │ hasil     │ │
│  [Mulai →] [Cara kerja]          │ analisis  │ │
│                                  └───────────┘ │
│  ── Alat Jujur ──  (grid 4, ikon lembut)       │
│  ── Produk pilihan ── (grid 4, kartu foto)     │
└───────────────────────────────────────────────┘
```
- **Hierarchy:** 1 H1 besar → 1 CTA → grid alat → grid produk. Sedikit warna, banyak ruang.
- **UX flow:** to-the-point; user paham nilai dalam 1 layar, langsung CTA.
- **Mobile:** ringan, cepat, hemat data; bottom nav untuk pindah cepat.
- **Desktop:** kolom tunggal lebar + 1 kartu pendukung; tidak ramai.
- **Plus:** terpercaya, cepat, "jujur". **Minus:** kurang "wow"/emosional untuk audiens beauty.

---

## OPTION B — PREMIUM LUXURY
**Mood:** editorial mahal (Aesop × Sephora × Apple). Foto besar, serif, sinematik.

### Wireframe — Mobile
```
┌──────────────────────────┐
│ JUJURSKIN          ☰     │  serif logo, minimal
│  [ foto wajah full-bleed]│  hero sinematik
│   "Rawat, bukan          │  serif besar overlay
│    memutihkan."          │
│   ─ Mulai perjalanan     │
│                          │
│  ── Filosofi kami ──     │  section editorial
│  teks + foto bergantian  │
│  ── Pilihan kurасі ──    │  produk kurasi
├──────────────────────────┤
│ ⌂   ✦   ▦   ▢   ◍        │
└──────────────────────────┘
```
### Desktop
```
┌───────────────────────────────────────────────┐
│ JUJURSKIN        Filosofi  Produk  Alat   Masuk│
│ ███████ foto full-bleed sinematik ████████████ │
│        "Rawat, bukan memutihkan."              │
│         ─ Mulai perjalanan kulitmu             │
├───────────────────────────────────────────────┤
│  teks editorial  |  foto              (50/50)  │
│  Pilihan kurasi  (grid 3, kartu elegan)        │
└───────────────────────────────────────────────┘
```
- **Hierarchy:** foto > headline serif > microcopy. Warna muted (deep green/krem/gold).
- **UX flow:** storytelling dulu → produk kurasi → analisis. Lebih lambat ke aksi.
- **Mobile:** indah, tapi foto berat → perlu optimasi; CTA tidak seagresif e-commerce.
- **Desktop:** sangat memukau, kesan brand premium.
- **Plus:** prestise & diferensiasi brand. **Minus:** terasa eksklusif/mahal, kurang "approachable" untuk pemula budget-conscious; konversi bisa lebih lambat.

---

## OPTION C — FEMALE-FOCUSED BEAUTY APP  ⭐ (paling dekat referensi Jericho)
**Mood:** Sociolla/Female Daily/Glossier **tanpa pink** — hangat, ramah, foto-forward, bisa dijelajah.

### Wireframe — Mobile
```
┌──────────────────────────┐
│ jujurskin     ♡   ◍      │
│ ┌──────────────────────┐ │
│ │ 🔍 Cari skincare...  │ │  search dominan
│ └──────────────────────┘ │
│ ◯ ◯ ◯ ◯ ◯  → kategori   │  ikon bulat scroll
│ Analis Foto BPOM Sun ...│
│ ┌──────────────────────┐ │
│ │  banner: Analisis    │ │  banner CTA
│ │  kulit gratis →      │ │
│ └──────────────────────┘ │
│ ── Buat kamu ──          │
│ [card][card]             │  grid produk 2 kol
│ [card][card]             │  foto, ★, harga, badge
│ ── Lagi dibahas ──       │  rail review/komunitas
├──────────────────────────┤
│ ⌂   ✦   ▦   ▢   ◍        │  bottom nav 5
└──────────────────────────┘
```
### Desktop
```
┌───────────────────────────────────────────────┐
│ jujurskin   [🔍 Cari skincare, bahan...]  ♡ ◍ │
│ ◯Analisis ◯Foto ◯BPOM ◯Sunscreen ◯Kamus ...   │  kategori bulat
├───────────────────────────────────────────────┤
│ ┌─ banner hero: Analisis gratis ─┐ ┌ mini ┐   │  hero + side cards
│ └────────────────────────────────┘ └──────┘   │
│ ── Untuk kamu ──   (grid 4 kartu produk)       │
│ ── Alat Jujur ──   (grid 4 kartu ikon)         │
│ ── Lagi dibahas ── (rail review/komunitas)     │
└───────────────────────────────────────────────┘
```
- **Hierarchy:** search → kategori bulat → banner CTA → grid produk → komunitas.
- **UX flow:** familiar untuk audiens beauty ID; jelajah & aksi sama-sama mudah.
- **Mobile:** **paling kuat** — bottom nav, kategori bulat, grid, sheet filter; pola yang sudah dikenal user.
- **Desktop:** kaya tapi tertata; terasa "marketplace beauty".
- **Plus:** **konversi & familiarity tertinggi**, mobile-friendly, ramah pemula. **Minus:** kalau kurang disiplin bisa terasa "ramai" seperti referensinya → harus dijaga whitespace & 1 aksen.

---

## OPTION D — SAAS DASHBOARD STYLE
**Mood:** app/tool (Linear × Stripe × Oura). Kartu data, skor, grafik progres.

### Wireframe — Mobile (state: sudah analisis)
```
┌──────────────────────────┐
│ Hai, Jeri 👋        ◍    │
│ ┌──────────────────────┐ │
│ │  Healthy Skin Score  │ │  gauge besar
│ │        78            │ │
│ │  ▲ +4 minggu ini     │ │
│ └──────────────────────┘ │
│ Kemerahan ▢  Minyak ▢    │  metric tiles
│ Kerataan  ▢  Tone   ▢    │
│ ── Rutinitas hari ini ── │  checklist AM/PM
│ ☑ Cleanser ☐ Sunscreen   │
│ ── Tren mingguan ──      │  chart
│ ▁▂▃▅▆▇                   │
├──────────────────────────┤
│ ⌂   ✦   ▦   ▢   ◍        │
└──────────────────────────┘
```
### Desktop
```
┌───────────────────────────────────────────────┐
│ ☰  Dashboard kulit          ⌘K        ◍ Jeri  │
│ ┌ Score 78 ┐ ┌ metrik grid ┐ ┌ rutinitas ┐    │
│ │  gauge   │ │ 4 tiles     │ │ checklist  │    │
│ └──────────┘ └─────────────┘ └────────────┘    │
│ ┌ Tren mingguan (line chart) ──────────────┐   │
│ └──────────────────────────────────────────┘   │
│ Alat (tile grid)  ·  ⌘K command palette        │
└───────────────────────────────────────────────┘
```
- **Hierarchy:** skor > metrik > tindakan harian > tren. Data-first.
- **UX flow:** terbaik **setelah** user analisis (return visit). Landing publik kurang "jualan".
- **Mobile:** rapi & informatif; bagus untuk **retensi harian**.
- **Desktop:** terasa produk canggih (kesan startup mahal).
- **Plus:** **retensi tertinggi**, cocok untuk `/hasil`, `/progress`, `/rutinitas`. **Minus:** sebagai halaman depan publik kurang menarik untuk pengunjung baru/pemula; butuh data dulu.

---

## MATRIKS PENILAIAN
| Kriteria | A Minimalist | B Luxury | C Beauty App | D Dashboard |
|---|---|---|---|---|
| **Conversion** (pengunjung→analisis) | ●●●○ | ●●○○ | ●●●● | ●●○○ |
| **Retention** (balik lagi) | ●●○○ | ●●○○ | ●●●○ | ●●●● |
| **Mobile usability** | ●●●○ | ●●○○ | ●●●● | ●●●○ |
| **Trend UI 2026** | ●●●● | ●●●○ | ●●●○ | ●●●● |
| **Cocok audiens ID/pemula** | ●●●○ | ●●○○ | ●●●● | ●●○○ |
| **Sesuai brand "jujur"** | ●●●● | ●●●○ | ●●●○ | ●●●○ |

---

## ✅ REKOMENDASI FINAL — Hybrid "C-led"

**Bukan satu opsi murni — kombinasi terbaik untuk JujurSkin:**

> **Basis = Option C (Female-focused Beauty App, anti-pink)** untuk semua halaman publik
> (landing, produk, alat) → konversi & mobile usability tertinggi, familiar untuk audiens.
>
> **Dipoles dengan disiplin Option A** (whitespace lega, 1 aksen, tipografi berkarakter) →
> supaya tidak "ramai" seperti Sociolla/FD, dan tetap berasa "jujur & premium".
>
> **Area login/hasil pakai Option D** (`/hasil`, `/progress`, `/rutinitas`) → dashboard skor +
> tren untuk **retensi**.

**Alasan:**
1. **Conversion & Mobile** → C menang telak untuk audiens beauty Indonesia yang mobile-first & familiar dengan pola Sociolla/FD/Tokopedia (search + kategori + grid + bottom nav).
2. **Retention** → D untuk area pasca-analisis (skor harian, tren, rutinitas) bikin user balik.
3. **Trend 2026 & brand** → disiplin A (minimalis, tipografi, motion halus) mengangkat kualitas ke level "Series A" dan menjaga nilai **jujur** (tidak norak, tidak pink).
4. **Diferensiasi** → emerald hijau + microcopy kejujuran membedakan dari semua kompetitor pink.

**Yang akan diprototipekan di `/design-preview`:** keempat opsi (A/B/C/D) sebagai mockup
homepage + komponen kunci, lalu **C-hybrid** ditandai sebagai default rekomendasi.
