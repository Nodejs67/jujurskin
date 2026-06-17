export interface ArticleSection {
  heading: string;
  body: string;
  tip?: string;
  warning?: string;
  list?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  emoji: string;
  tags: string[];
  date: string;
  read_time: number; // menit
  sections: ArticleSection[];
  related_ingredients?: string[]; // ingredient IDs
  related_articles?: string[];    // article slugs
}

export const ARTICLES: Article[] = [
  {
    id: "a1",
    slug: "rutinitas-skincare-pemula",
    title: "Panduan Lengkap Membangun Rutinitas Skincare dari Nol",
    excerpt: "Bingung mulai dari mana? Ini urutan produk yang benar, berapa produk yang cukup, dan mengapa lebih sedikit lebih baik untuk pemula.",
    emoji: "🌱",
    tags: ["Pemula", "Rutinitas", "Panduan"],
    date: "2026-06-01",
    read_time: 6,
    related_ingredients: ["niacinamide", "ceramide", "sunscreen-spf50"],
    related_articles: ["sunscreen-wajib-setiap-hari", "skin-barrier-rusak"],
    sections: [
      {
        heading: "Mengapa Banyak Produk ≠ Kulit Lebih Baik",
        body: "Salah satu kesalahan terbesar pemula adalah langsung membeli banyak produk sekaligus. Kulit butuh waktu untuk beradaptasi — dan ketika kamu pakai 8 produk baru dalam satu minggu, kamu tidak akan tahu mana yang membantu dan mana yang menyebabkan reaksi.",
        tip: "Mulai dengan 3 produk saja: cleanser, moisturizer, sunscreen. Tambahkan satu produk baru per 2 minggu.",
      },
      {
        heading: "3 Produk Wajib untuk Pemula",
        body: "Sebelum berpikir soal serum vitamin C, retinol, atau AHA/BHA — pastikan fondasi ini sudah ada:",
        list: [
          "Cleanser: Bersihkan kulit tanpa strip barrier. Pilih yang pH-balanced dan bebas SLS jika kulitmu sensitif.",
          "Moisturizer: Kunci kelembapan dan perbaiki barrier. Cari yang mengandung ceramide, hyaluronic acid, atau glycerin.",
          "Sunscreen SPF50+: SATU-SATUNYA produk anti-aging yang terbukti secara ilmiah. Tanpa ini, semua produk lain sia-sia.",
        ],
        warning: "Jangan beli sunscreen dan langsung di-skip karena terasa lengket. Coba 3-4 formula berbeda sampai ketemu yang cocok — ada yang ringan, ada yang gel, ada yang tinted.",
      },
      {
        heading: "Urutan Pemakaian yang Benar",
        body: "Skincare layering bukan sekadar soal urutan — ada logikanya. Produk dengan tekstur paling ringan selalu duluan, lalu yang lebih berat.",
        list: [
          "Pagi: Cleanser ringan → Toner/Essence (opsional) → Serum → Moisturizer → Sunscreen",
          "Malam: Oil/Balm Cleanser → Cleanser air → Toner → Serum aktif (retinol, AHA) → Moisturizer",
        ],
        tip: "Wait time antar produk tidak wajib — kecuali setelah retinol (tunggu 20-30 menit) atau AHA/BHA (tunggu 10-15 menit).",
      },
      {
        heading: "Kapan Tambahkan Serum Aktif?",
        body: "Setelah 4-6 minggu dengan 3 produk dasar dan kulit sudah stabil, baru pertimbangkan menambah serum aktif. Pilih SATU masalah yang paling mengganggu kamu: jerawat, kusam, atau tanda penuaan.",
        list: [
          "Jerawat aktif → Salicylic Acid (BHA) atau Niacinamide",
          "Bekas jerawat/kusam → Vitamin C atau AHA",
          "Kulit kering/kusam → Hyaluronic Acid",
          "Anti-aging → Retinol (mulai konsentrasi rendah)",
        ],
      },
      {
        heading: "Tanda Rutinitas Kamu Berhasil",
        body: "Setelah 4-6 minggu konsisten: kulit terasa lebih lembap, tidak terlalu berminyak atau kering, jerawat baru lebih jarang muncul, dan kulit terasa lebih nyaman sepanjang hari. Perubahan visual (cerah, mulus) biasanya terlihat setelah 8-12 minggu.",
      },
    ],
  },

  {
    id: "a2",
    slug: "niacinamide-ingredient-terbaik",
    title: "Niacinamide: Mengapa Hampir Semua Orang Butuh Ingredient Ini",
    excerpt: "Niacinamide bisa mengecilkan pori, kontrol minyak, cerahkan bekas jerawat, dan memperkuat barrier kulit — semuanya dalam satu botol. Inilah cara kerjanya.",
    emoji: "🌿",
    tags: ["Ingredient", "Niacinamide", "Semua Jenis Kulit"],
    date: "2026-06-03",
    read_time: 5,
    related_ingredients: ["niacinamide", "zinc-pca", "hyaluronic-acid"],
    related_articles: ["rutinitas-skincare-pemula", "bha-vs-aha"],
    sections: [
      {
        heading: "Apa Itu Niacinamide?",
        body: "Niacinamide adalah bentuk vitamin B3 yang larut air. Tidak seperti banyak ingredient aktif yang hanya menarget satu masalah, niacinamide memiliki multiple mode of action — ia bekerja di beberapa jalur biologis sekaligus, yang menjelaskan kenapa manfaatnya sangat beragam.",
      },
      {
        heading: "5 Manfaat yang Terbukti secara Ilmiah",
        body: "Inilah yang membuat niacinamide berbeda dari banyak klaim skincare yang berlebihan:",
        list: [
          "Kontrol minyak: Mengurangi produksi sebum hingga 25% dalam studi klinis (konsentrasi 2-4%)",
          "Perkecil tampilan pori: Dengan mengurangi produksi sebum dan memperkuat struktur kulit di sekitar pori",
          "Cerahkan hiperpigmentasi: Memblok transfer melanin dari melanosit ke sel kulit permukaan",
          "Perkuat skin barrier: Meningkatkan produksi ceramide dan protein barrier (involucrin, filaggrin)",
          "Anti-inflamasi: Mengurangi kemerahan dan reaktivitas kulit, cocok untuk kulit berjerawat",
        ],
      },
      {
        heading: "Berapa Konsentrasi yang Tepat?",
        body: "Untuk kontrol minyak dan pori: 2-4% sudah efektif. Untuk hiperpigmentasi: 5% ke atas. Produk dengan 10%+ niacinamide bisa menyebabkan kemerahan sementara pada sebagian orang — bukan tanda berbahaya, tapi bisa mengganggu.",
        tip: "Mulai dengan konsentrasi 5% jika kamu baru pertama coba. Naikkan ke 10% kalau kulitmu sudah toleran.",
      },
      {
        heading: "Mitos: Niacinamide Tidak Boleh Dipakai dengan Vitamin C",
        body: "Ini adalah mitos yang sudah usang. Studi lama mengklaim keduanya bereaksi membentuk niacin yang menyebabkan flushing — tapi ini hanya terjadi pada suhu sangat tinggi yang tidak akan tercapai di kulitmu. Dalam kondisi pemakaian normal, keduanya aman dan bahkan bersinergi: niacinamide menstabilkan vitamin C dan mencegah oksidasi.",
        warning: "Satu-satunya alasan untuk tidak mencampur: jika kamu menggunakan vitamin C pH rendah (pH 2-3) dan langsung dilanjut niacinamide — pH-nya berubah dan efektivitas vitamin C berkurang. Solusi: tunggu 15 menit atau pakai di waktu berbeda (pagi/malam).",
      },
      {
        heading: "Rekomendasi Produk dengan Niacinamide",
        body: "Produk niacinamide terbaik di Indonesia tidak harus mahal. Azarine, Skintific, dan Somethinc semuanya punya formula niacinamide yang solid di harga terjangkau. Yang penting adalah konsistensi pemakaian — niacinamide butuh 8-12 minggu untuk hasil optimal.",
      },
    ],
  },

  {
    id: "a3",
    slug: "retinol-panduan-pemula",
    title: "Retinol untuk Pemula: Mulai Dari Mana dan Cara Hindari Iritasi",
    excerpt: "Retinol adalah gold standard anti-aging, tapi juga ingredient yang paling sering disalahgunakan. Panduan ini mengajarkan cara memulai dengan aman.",
    emoji: "⭐",
    tags: ["Retinol", "Anti-Aging", "Ingredient Aktif"],
    date: "2026-06-05",
    read_time: 7,
    related_ingredients: ["retinol", "adapalene", "bakuchiol", "tretinoin"],
    related_articles: ["skin-barrier-rusak", "sunscreen-wajib-setiap-hari"],
    sections: [
      {
        heading: "Mengapa Retinol Begitu Istimewa?",
        body: "Retinol adalah vitamin A yang bekerja di tingkat sel. Ia mempercepat turnover sel kulit, merangsang produksi kolagen, mengurangi tampilan garis halus, dan mengecilkan pori yang tersumbat. Tidak ada ingredient lain yang memiliki kombinasi manfaat seperti ini dengan bukti klinis sekuat retinol.",
      },
      {
        heading: "Retinoid Berbeda-beda: Mana yang Cocok Untukmu?",
        body: "Banyak yang mengira semua 'retinol' itu sama. Padahal ada hierarki kekuatan:",
        list: [
          "Retinyl Palmitate (OTC, paling lemah): Cocok untuk pemula ekstrem atau kulit sangat sensitif",
          "Bakuchiol (alternatif nabati): Bukan retinoid sejati tapi memiliki mekanisme mirip, sangat aman untuk hamil",
          "Retinol 0.01-0.1% (OTC, lemah-sedang): Titik awal ideal untuk pemula",
          "Retinal/Retinaldehyde (OTC, kuat): 11x lebih kuat dari retinol, lebih cepat hasilnya",
          "HPR/Granactive Retinoid (OTC, kuat): Lebih stabil, lebih sedikit iritasi dari retinol konsentrasi setara",
          "Adapalene 0.1% (OTC, resep di beberapa negara): Fokus pada jerawat, lebih stabil dari retinol",
          "Tretinoin 0.025-0.1% (resep dokter): Paling kuat, paling terbukti, butuh pengawasan dokter",
        ],
        tip: "Pemula: mulai dari Retinol 0.025-0.05% atau Adapalene 0.1% (untuk kulit berjerawat). Jangan langsung lompat ke tretinoin tanpa konsultasi.",
      },
      {
        heading: "Retinization: Fase Adaptasi yang Normal",
        body: "Minggu 1-4 menggunakan retinol, kulitmu mungkin mengalami kemerahan, pengelupasan, dan kekeringan. Ini disebut retinization — bukan tanda alergi, tapi proses adaptasi sel kulit terhadap percepatan turnover. Sebagian besar orang melewati fase ini.",
        warning: "Bedakan retinization (pengelupasan ringan, kemerahan sementara yang reda dalam 2-3 minggu) dengan reaksi sensitif (gatal intens, breakout parah, iritasi tidak membaik). Yang kedua: hentikan dan konsultasi dokter.",
      },
      {
        heading: "Metode Buffering: Cara Mulai Paling Aman",
        body: "Untuk meminimalkan iritasi, ada dua pendekatan terbukti:",
        list: [
          "Sandwich method: Aplikasikan moisturizer tipis → retinol → moisturizer lagi. Lapisan moisturizer 'mendilute' efek iritasi retinol.",
          "Frequency ramping: Minggu 1-2: sekali seminggu. Minggu 3-4: dua kali. Bulan 2: tiga kali. Baru setelah itu naikkan ke setiap malam.",
        ],
      },
      {
        heading: "Aturan Wajib Saat Pakai Retinol",
        body: "Ini bukan opsional — ini fundamental:",
        list: [
          "SELALU sunscreen di pagi hari. Retinol meningkatkan sensitivitas UV secara signifikan.",
          "Pakai HANYA di malam hari. Retinol terurai oleh cahaya UV.",
          "Jangan campur dengan AHA/BHA di malam yang sama — terlalu iritan. Bergantian malam.",
          "Hindari jika hamil atau berencana hamil.",
        ],
      },
    ],
  },

  {
    id: "a4",
    slug: "sunscreen-wajib-setiap-hari",
    title: "Sunscreen Setiap Hari: Mengapa Ini Satu-Satunya Produk Anti-Aging yang Benar-Benar Bekerja",
    excerpt: "Tidak ada serum, krim, atau treatment yang bisa mengalahkan sunscreen dalam mencegah penuaan kulit. Ini bukan hype — ini sains.",
    emoji: "☀️",
    tags: ["Sunscreen", "Anti-Aging", "UV Protection"],
    date: "2026-06-07",
    read_time: 5,
    related_ingredients: ["sunscreen-spf50", "vitamin-c", "niacinamide"],
    related_articles: ["rutinitas-skincare-pemula", "retinol-panduan-pemula"],
    sections: [
      {
        heading: "80% Tanda Penuaan Kulit Disebabkan UV, Bukan Usia",
        body: "Studi ikonik 'Twin Study' dari Journal of Investigative Dermatology membuktikan: kembar identik dengan kebiasaan sun exposure berbeda menunjukkan perbedaan tampilan usia yang dramatis setelah beberapa dekade. UV radiation adalah penyebab utama photoaging — kerutan, bintik hitam, tekstur kasar, dan hilangnya elastisitas kulit.",
        tip: "UV menembus awan hingga 80%. Pakai sunscreen bahkan di hari mendung atau di dalam mobil dekat jendela.",
      },
      {
        heading: "SPF Berapa yang Cukup?",
        body: "SPF mengukur perlindungan terhadap UVB (yang membakar kulit). Tapi kamu juga butuh perlindungan UVA (yang mempercepat penuaan dan menembus lebih dalam):",
        list: [
          "Minimal SPF30 untuk aktivitas indoor-dominant",
          "SPF50+ untuk aktivitas outdoor, di Indonesia sangat dianjurkan karena UV index rata-rata 8-11",
          "PA+++ atau PA++++ untuk perlindungan UVA yang baik (lebih tinggi lebih baik)",
          "Broad spectrum: pastikan ada label ini",
        ],
        warning: "SPF50 bukan 2x lebih kuat dari SPF25. SPF25 memblok 96% UVB, SPF50 memblok 98%. Perbedaannya kecil — yang lebih penting adalah aplikasi yang cukup dan reapply setiap 2 jam.",
      },
      {
        heading: "Berapa Banyak yang Harus Dipakai?",
        body: "Ini adalah kesalahan paling umum: memakai sunscreen terlalu sedikit. SPF yang tertera di label diuji dengan 2mg/cm² kulit. Untuk wajah dewasa, ini setara dengan sekitar 1/4 sendok teh (sekitar 1.5-2ml). Dalam praktiknya: untuk kulit wajah, ini sekitar 2-3 'finger lengths' atau 2 pump untuk dispenser standar.",
      },
      {
        heading: "Chemical vs Physical Sunscreen",
        body: "Keduanya efektif. Perbedaan:",
        list: [
          "Chemical (Avobenzone, Octinoxate, Tinosorb): menyerap UV dan mengubahnya jadi panas. Tekstur lebih ringan, tidak white cast, tapi butuh 15-20 menit sebelum efektif.",
          "Physical/Mineral (Zinc Oxide, Titanium Dioxide): memantulkan UV. Lebih cocok untuk sensitif dan hamil, tapi bisa white cast dan terasa lebih berat.",
          "Hybrid: kombinasi keduanya. Pilihan terbaik untuk kebanyakan orang.",
        ],
        tip: "Untuk kulit berminyak di Indonesia: cari sunscreen bertekstur gel, watery, atau matte. Untuk kulit kering: sunscreen dengan gliserin atau hyaluronic acid lebih nyaman.",
      },
      {
        heading: "Sunscreen Terbaik adalah Yang Mau Kamu Pakai Setiap Hari",
        body: "Sunscreen SPF100 yang kamu skip karena terasa berat atau meninggalkan white cast jauh lebih buruk dari sunscreen SPF30 yang kamu pakai setiap hari dengan senang hati. Eksperimen dengan berbagai formula sampai kamu menemukan yang terasa nyaman di kulitmu — ini worth the investment.",
      },
    ],
  },

  {
    id: "a5",
    slug: "skin-barrier-rusak",
    title: "Skin Barrier Rusak: Tanda-Tanda, Penyebab, dan Cara Memperbaikinya",
    excerpt: "Kulit selalu kering meski pakai moisturizer? Tiba-tiba sensitif padahal dulu tidak? Mungkin skin barrier-mu rusak. Ini cara memperbaikinya.",
    emoji: "🛡️",
    tags: ["Skin Barrier", "Kulit Sensitif", "Recovery"],
    date: "2026-06-09",
    read_time: 6,
    related_ingredients: ["ceramide", "hyaluronic-acid", "panthenol", "centella-asiatica"],
    related_articles: ["rutinitas-skincare-pemula", "niacinamide-ingredient-terbaik"],
    sections: [
      {
        heading: "Apa Itu Skin Barrier?",
        body: "Skin barrier (atau stratum corneum) adalah lapisan terluar kulit yang terdiri dari sel-sel kulit mati (korneosit) yang 'disemen' bersama oleh lipid — terutama ceramide, fatty acid, dan cholesterol. Fungsinya ganda: mencegah air keluar (TEWL — transepidermal water loss) dan mencegah iritan, bakteri, dan alergen masuk.",
      },
      {
        heading: "Tanda-Tanda Skin Barrier Terganggu",
        body: "Kamu mungkin tidak menyadari barrier-mu rusak sampai muncul gejala ini:",
        list: [
          "Kulit terasa kencang dan kering bahkan setelah pakai moisturizer",
          "Produk yang dulu cocok tiba-tiba menyebabkan perih atau kemerahan",
          "Breakout yang tidak biasa di area yang jarang berjerawat",
          "Kulit terasa 'terbakar' saat pakai produk water-based",
          "Flaking dan pengelupasan yang tidak berhenti meski dilembapkan",
        ],
      },
      {
        heading: "Penyebab Umum Skin Barrier Rusak",
        body: "Sering kali ini adalah hasil 'over-skincare' — terlalu banyak aktif dalam satu rutinitas:",
        list: [
          "Over-exfoliation: pakai AHA/BHA terlalu sering (lebih dari 3x seminggu untuk pemula)",
          "Retinol tanpa buffer atau terlalu cepat menaikkan konsentrasi",
          "Cleanser terlalu harsh (pH tinggi, mengandung SLS)",
          "Layering terlalu banyak aktif yang iritan sekaligus",
          "Faktor eksternal: kurang tidur kronis, stres tinggi, perubahan cuaca drastis",
        ],
        tip: "Paradoks skincare: semakin banyak produk aktif yang kamu pakai, semakin tinggi risiko barrier rusak.",
      },
      {
        heading: "Protokol Pemulihan Barrier (2-4 Minggu)",
        body: "Ini yang perlu kamu lakukan ketika barrier rusak:",
        list: [
          "STOP semua aktif: hentikan AHA, BHA, retinol, vitamin C untuk sementara",
          "Simplify: kembali ke 3 produk saja — gentle cleanser, ceramide moisturizer, sunscreen",
          "Pilih moisturizer dengan ceramide, panthenol, dan glycerin — trio perbaikan barrier terkuat",
          "Hindari fragrance dalam produk selama pemulihan",
          "Tidur cukup: kulit regenerasi terbaik antara pukul 23.00-02.00",
        ],
        warning: "Jangan pakai exfoliant apapun selama recovery — bahkan vitamin C bisa iritan untuk barrier yang sangat rusak. Sabar dan konsisten.",
      },
      {
        heading: "Ingredient Terbaik untuk Perbaiki Barrier",
        body: "Ceramide adalah bahan utama yang dibutuhkan barrier. Kombinasikan dengan:",
        list: [
          "Ceramide NP/AP/EOP: komponen lipid utama barrier",
          "Panthenol (B5): mempercepat penyembuhan sel kulit",
          "Centella Asiatica / Madecassoside: anti-inflamasi dan regenerasi",
          "Beta-Glucan: humektan yang menenangkan lebih lembut dari HA",
          "Niacinamide 2-4%: membantu produksi ceramide secara alami",
        ],
      },
    ],
  },

  {
    id: "a6",
    slug: "bha-vs-aha",
    title: "BHA vs AHA: Kapan Pakai Salicylic Acid dan Kapan Pakai Glycolic Acid?",
    excerpt: "Dua exfoliant kimia ini bekerja sangat berbeda. Salah memilih bisa memperparah masalah kulitmu. Ini panduan memilih yang tepat.",
    emoji: "⚗️",
    tags: ["AHA", "BHA", "Exfoliant", "Jerawat"],
    date: "2026-06-11",
    read_time: 5,
    related_ingredients: ["salicylic-acid", "glycolic-acid", "lactic-acid", "pha"],
    related_articles: ["skin-barrier-rusak", "retinol-panduan-pemula"],
    sections: [
      {
        heading: "Perbedaan Fundamental: Larut Air vs Larut Minyak",
        body: "Ini adalah perbedaan yang menentukan segalanya. AHA (Alpha Hydroxy Acid) larut air — ia hanya bekerja di permukaan kulit. BHA (Beta Hydroxy Acid, salicylic acid) larut minyak — ia bisa menembus ke dalam pori yang tersumbat sebum.",
      },
      {
        heading: "Kapan Pilih BHA (Salicylic Acid)?",
        body: "BHA adalah pilihan utama jika kamu punya masalah berikut:",
        list: [
          "Komedo hitam (blackhead) dan komedo putih (whitehead)",
          "Jerawat aktif — BHA memiliki sifat anti-inflamasi dan antibakteri",
          "Pori-pori besar yang terlihat tersumbat sebum",
          "Kulit berminyak yang cenderung breakout",
          "Milia (biji-bijian putih keras di kulit)",
        ],
        tip: "Konsentrasi efektif: 0.5-2% untuk wajah. Lebih dari 2% biasanya untuk body atau spot treatment.",
      },
      {
        heading: "Kapan Pilih AHA?",
        body: "AHA bekerja lebih di permukaan tapi bisa merata ke seluruh kulit, bukan hanya di pori. Pilih AHA untuk:",
        list: [
          "Tekstur kulit kasar atau tidak merata",
          "Hiperpigmentasi dan bekas jerawat (post-inflammatory hyperpigmentation)",
          "Kulit kusam yang butuh 'reset'",
          "Garis halus dan penuaan (glycolic acid di konsentrasi 8%+ terbukti merangsang kolagen)",
          "Kulit kering: lactic acid lebih gentile dan juga humektan",
        ],
      },
      {
        heading: "PHA: Pilihan untuk Kulit Sensitif",
        body: "PHA (Polyhydroxy Acid) adalah generasi ketiga chemical exfoliant. Molekulnya lebih besar dari AHA sehingga tidak menembus sedalam AHA — lebih sedikit iritasi, tapi tetap efektif untuk tekstur dan brightness. Jika kulitmu sensitif atau barrier sedang recovery, mulai dari PHA.",
      },
      {
        heading: "Cara Aman Menggabungkan Exfoliant",
        body: "Kamu tidak harus memilih satu. Banyak produk toner/serum sudah menggabungkan AHA + BHA + PHA dalam satu formula. Tapi jika pakai produk terpisah:",
        list: [
          "Jangan pakai AHA dan BHA di malam yang sama jika kulit sensitif",
          "Jangan pakai exfoliant bersamaan dengan retinol — bergantian malam",
          "Selalu sunscreen esok paginya — exfoliant meningkatkan photosensitivity",
          "Pemula: mulai 1x seminggu, naik perlahan ke 2-3x seminggu",
        ],
        warning: "Over-exfoliation adalah penyebab No.1 skin barrier rusak. Lebih sedikit, lebih jarang, lebih aman.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const TAG_LABELS: Record<string, string> = {
  Pemula: "Pemula",
  Rutinitas: "Rutinitas",
  Panduan: "Panduan",
  Ingredient: "Ingredient",
  Niacinamide: "Niacinamide",
  "Semua Jenis Kulit": "Semua Jenis Kulit",
  Retinol: "Retinol",
  "Anti-Aging": "Anti-Aging",
  "Ingredient Aktif": "Ingredient Aktif",
  Sunscreen: "Sunscreen",
  "UV Protection": "UV Protection",
  "Skin Barrier": "Skin Barrier",
  "Kulit Sensitif": "Kulit Sensitif",
  Recovery: "Recovery",
  AHA: "AHA",
  BHA: "BHA",
  Exfoliant: "Exfoliant",
  Jerawat: "Jerawat",
};
