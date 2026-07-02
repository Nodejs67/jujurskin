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
  {
    id: "a7",
    slug: "jerawat-hijab",
    title: "Jerawat di Garis Hijab: Kenapa Terjadi & Cara Mengatasinya",
    excerpt: "Jerawat di dahi, pipi, dan garis hijab sangat umum di Indonesia. Ini penyebabnya (acne mechanica) dan cara menanganinya tanpa harus lepas hijab.",
    emoji: "🧕",
    tags: ["Hijab", "Jerawat", "Indonesia"],
    date: "2026-06-18",
    read_time: 5,
    related_ingredients: ["niacinamide", "salicylic-acid"],
    related_articles: ["skin-barrier-rusak", "bha-vs-aha"],
    sections: [
      {
        heading: "Kenapa Jerawat Muncul di Area Hijab?",
        body: "Gesekan kain, keringat yang terperangkap, dan panas lembap di balik hijab menciptakan kondisi ideal untuk jerawat — namanya acne mechanica. Iklim tropis Indonesia yang panas dan lembap membuatnya makin sering terjadi, terutama di dahi, pelipis, dan garis rahang.",
        tip: "Ini bukan karena kamu 'kotor'. Acne mechanica murni soal gesekan + keringat + bakteri, bukan kebersihan.",
      },
      {
        heading: "Yang Bisa Kamu Lakukan",
        body: "Tidak perlu lepas hijab. Fokus ke mengurangi keringat terperangkap dan menjaga barrier:",
        list: [
          "Pilih bahan hijab yang menyerap & breathable (katun, voal) — hindari polyester tebal saat aktivitas berat.",
          "Ganti ciput/inner setiap hari; ganti hijab kalau sudah lembap kena keringat.",
          "Bersihkan wajah setelah seharian berhijab — double cleanse ringan kalau pakai sunscreen/makeup.",
          "Niacinamide untuk meredakan radang + BHA (salicylic acid) 1–2x/minggu untuk membersihkan pori.",
        ],
        warning: "Jangan over-treat dengan banyak produk aktif sekaligus — barrier yang lemah malah memperparah jerawat. Pelan tapi konsisten.",
      },
      {
        heading: "Kapan Perlu ke Dokter?",
        body: "Kalau jerawat meradang besar, nyeri, bernanah, atau tak membaik setelah 6–8 minggu perawatan dasar, konsultasikan ke dokter kulit. Ini bukan diagnosis medis — hanya panduan umum.",
      },
    ],
  },
  {
    id: "a8",
    slug: "skincare-puasa-ramadan",
    title: "Skincare Saat Puasa: Jaga Kulit Tetap Lembap Selama Ramadan",
    excerpt: "Puasa bisa membuat kulit lebih kering karena asupan cairan berkurang. Ini cara menyesuaikan rutinitas skincare selama Ramadan — sederhana & realistis.",
    emoji: "🌙",
    tags: ["Puasa", "Ramadan", "Hidrasi"],
    date: "2026-06-18",
    read_time: 4,
    related_ingredients: ["hyaluronic-acid", "ceramide"],
    related_articles: ["rutinitas-skincare-pemula", "skin-barrier-rusak"],
    sections: [
      {
        heading: "Kenapa Kulit Lebih Kering Saat Puasa",
        body: "Selama berpuasa, asupan air berkurang dan pola tidur sering berubah. Kulit bisa terasa lebih kering, kusam, dan barrier sedikit melemah. Ini wajar dan bisa diatasi tanpa produk mahal.",
        tip: "Manfaatkan waktu sahur & berbuka untuk minum cukup air (total ~8 gelas terbagi). Hidrasi dari dalam paling berpengaruh.",
      },
      {
        heading: "Penyesuaian Rutinitas",
        body: "Tidak perlu mengganti semua produk. Cukup geser fokus ke hidrasi & barrier:",
        list: [
          "Pakai pelembap lebih rich di malam hari (cari ceramide, hyaluronic acid, glycerin).",
          "Jangan skip sunscreen di pagi hari — puasa tidak mengubah kebutuhan proteksi UV.",
          "Kurangi eksfoliasi berlebih saat kulit sedang kering/sensitif.",
          "Hindari air terlalu panas saat wudhu/cuci muka — bisa memperparah kekeringan.",
        ],
      },
      {
        heading: "Tetap Realistis",
        body: "Kulit kusam ringan saat puasa itu normal dan sementara. Tidak perlu panik beli banyak produk baru — fokus konsistensi pelembap + sunscreen + hidrasi cukup.",
        warning: "Hati-hati produk yang menjanjikan 'glowing instan saat Ramadan'. Tidak ada yang instan; yang ada konsisten.",
      },
    ],
  },
  {
    id: "a9",
    slug: "kulit-sehat-bukan-putih",
    title: "Kulit Sehat Lebih Penting daripada Kulit Putih",
    excerpt: "Standar 'putih = cantik' membuat banyak orang Indonesia membeli produk pemutih berbahaya. Ini kenapa kulit sehat adalah tujuan yang benar — dan lebih realistis.",
    emoji: "🌿",
    tags: ["Mindset", "Kulit Sehat", "Edukasi"],
    date: "2026-06-18",
    read_time: 5,
    related_articles: ["sunscreen-wajib-setiap-hari", "skin-barrier-rusak"],
    sections: [
      {
        heading: "Warna Kulit Bukan Ukuran Kesehatan",
        body: "Warna kulit ditentukan genetik (melanin) dan justru melanin melindungi dari sinar UV. Mengejar 'putih' berarti melawan biologi tubuhmu sendiri — dan sering mendorong orang memakai produk berbahaya.",
        tip: "Tujuan yang sehat: barrier kuat, lembap, merata, terlindungi UV — bukan beberapa tingkat lebih terang.",
      },
      {
        heading: "Bahaya Produk Pemutih Abal-abal",
        body: "Banyak krim pemutih ilegal di pasaran mengandung merkuri dan hidrokuinon dosis tinggi. 'Hasil cepat' mereka justru tanda bahaya:",
        list: [
          "Merkuri: merusak ginjal & saraf, menipiskan kulit, bisa picu hiperpigmentasi parah jangka panjang.",
          "Hidrokuinon tanpa pengawasan dokter: bisa sebabkan ochronosis (kulit menghitam permanen).",
          "Steroid tersembunyi: kulit 'mulus' sesaat, lalu rusak parah saat dihentikan.",
        ],
        warning: "Produk yang menjanjikan putih dalam beberapa hari hampir pasti mengandung bahan berbahaya. Cek legalitas BPOM-nya dulu.",
      },
      {
        heading: "Fokus yang Benar",
        body: "Kalau ingin kulit lebih cerah & merata secara aman: rutin sunscreen (mencegah noda baru), niacinamide/vitamin C untuk meratakan tona perlahan, dan sabar. Hasilnya bertahap tapi nyata dan aman.",
      },
    ],
  },
  {
    id: "a10",
    slug: "cara-merawat-kulit-berminyak",
    title: "Cara Merawat Kulit Berminyak Tanpa Bikin Makin Berminyak",
    excerpt: "Kulit berminyak bukan berarti harus dikeringkan. Justru sering karena terlalu 'dibersihkan'. Ini cara merawatnya yang benar.",
    emoji: "💧",
    tags: ["Kulit Berminyak", "Panduan", "Jerawat"],
    date: "2026-06-10",
    read_time: 6,
    related_ingredients: ["niacinamide", "salicylic-acid", "hyaluronic-acid", "sunscreen-spf50"],
    related_articles: ["pelembap-untuk-kulit-berjerawat", "rutinitas-skincare-pemula"],
    sections: [
      {
        heading: "Kenapa Kulitmu Berminyak",
        body: "Kulit memproduksi minyak (sebum) untuk melindungi diri. Produksi ini dipengaruhi genetik, hormon, cuaca panas-lembap (khas Indonesia), dan — ini yang sering terlewat — seberapa kasar kamu memperlakukan kulitmu. Semakin sering kulit di-strip habis minyaknya, semakin keras ia memproduksi minyak balik.",
      },
      {
        heading: "Kesalahan Paling Umum",
        body: "Banyak orang dengan kulit berminyak justru memperparah kondisinya dengan cara-cara ini:",
        list: [
          "Cuci muka berkali-kali sehari sampai kulit 'kesat' — ini merusak barrier dan memicu minyak berlebih.",
          "Pakai sabun yang bikin ketarik/kaku setelah cuci muka.",
          "Melewatkan pelembap karena takut 'makin berminyak'.",
          "Pakai alkohol/toner astringent keras tiap hari.",
        ],
        warning: "Kulit yang terasa 'ketarik' setelah cuci muka bukan tanda bersih — itu tanda barrier terkikis.",
      },
      {
        heading: "Rutinitas yang Benar untuk Kulit Berminyak",
        body: "Tujuannya bukan menghilangkan minyak, tapi menyeimbangkan. Fondasinya sederhana:",
        list: [
          "Cleanser lembut ber-pH seimbang, maksimal 2x sehari.",
          "Niacinamide untuk membantu mengatur produksi minyak & memperkecil tampilan pori.",
          "Pelembap ringan (gel/water-based) — tetap wajib, justru bikin kulit berhenti 'panik' produksi minyak.",
          "Sunscreen setiap pagi (pilih tekstur gel/fluid supaya tidak lengket).",
          "Salicylic acid (BHA) 1–3x seminggu kalau ada komedo/jerawat — larut minyak, membersihkan pori dari dalam.",
        ],
        tip: "Cari label 'non-comedogenic' dan tekstur water/gel-based untuk kulit berminyak.",
      },
      {
        heading: "Yang Tidak Perlu Kamu Beli",
        body: "Kamu tidak butuh 5 produk 'oil-control' sekaligus. Clay mask sesekali boleh, tapi bukan keharusan. Blotting paper cukup untuk mengangkat minyak di siang hari tanpa merusak apa pun. Fokus ke konsistensi, bukan jumlah produk.",
      },
    ],
  },
  {
    id: "a11",
    slug: "cara-merawat-kulit-kering",
    title: "Cara Merawat Kulit Kering & Mudah Mengelupas",
    excerpt: "Kulit kering butuh dua hal berbeda: air (hydration) dan minyak (moisture). Salah satunya saja tidak cukup. Ini bedanya.",
    emoji: "🏜️",
    tags: ["Kulit Kering", "Panduan", "Skin Barrier"],
    date: "2026-06-11",
    read_time: 6,
    related_ingredients: ["hyaluronic-acid", "ceramide", "glycerin", "squalane"],
    related_articles: ["skin-barrier-rusak", "rutinitas-skincare-pemula"],
    sections: [
      {
        heading: "Kering vs Dehidrasi: Tidak Sama",
        body: "Kulit kering (dry) = kekurangan MINYAK, biasanya tipe kulit bawaan. Kulit dehidrasi = kekurangan AIR, bisa terjadi pada tipe kulit apa pun termasuk berminyak. Banyak yang salah menangani karena tidak tahu bedanya — memberi minyak pada kulit yang sebenarnya butuh air, atau sebaliknya.",
      },
      {
        heading: "Formula Sederhana: Air Dulu, Kunci Kemudian",
        body: "Perawatan kulit kering paling efektif mengikuti urutan ini:",
        list: [
          "Humektan (menarik air): hyaluronic acid, glycerin — pakai di kulit yang masih sedikit lembap.",
          "Emolien & occlusive (mengunci air): ceramide, squalane, shea butter — lapisan di atasnya supaya air tidak menguap.",
        ],
        tip: "Aplikasikan pelembap saat kulit masih agak lembap setelah cuci muka — ini mengunci lebih banyak air.",
      },
      {
        heading: "Hindari Ini",
        body: "Beberapa kebiasaan diam-diam membuat kulit kering makin parah:",
        list: [
          "Air panas saat cuci muka/mandi — melarutkan minyak alami kulit.",
          "Eksfoliasi berlebihan (scrub/AHA tiap hari) pada kulit yang sudah kering.",
          "Produk beralkohol tinggi dan parfum kuat.",
        ],
        warning: "Kalau kulit sampai perih, merah, dan mengelupas terus-menerus, itu tanda barrier rusak — sederhanakan rutinitas dan fokus pelembap dulu.",
      },
    ],
  },
  {
    id: "a12",
    slug: "bekas-jerawat-pie-pih",
    title: "Bekas Jerawat Merah vs Hitam (PIE vs PIH): Beda & Cara Memudarkannya",
    excerpt: "Bekas jerawat merah dan bekas jerawat cokelat butuh penanganan berbeda. Salah bahan = tidak akan memudar. Ini panduannya.",
    emoji: "🔴",
    tags: ["Bekas Jerawat", "Jerawat", "Mencerahkan"],
    date: "2026-06-12",
    read_time: 7,
    related_ingredients: ["niacinamide", "vitamin-c", "azelaic-acid", "alpha-arbutin", "sunscreen-spf50"],
    related_articles: ["cara-merawat-kulit-berminyak", "kulit-sehat-bukan-putih"],
    sections: [
      {
        heading: "Dua Jenis Bekas yang Sering Tertukar",
        body: "Yang biasa disebut 'bekas jerawat' umumnya bukan lubang, tapi noda warna. Ada dua jenis: PIE (Post-Inflammatory Erythema) = noda KEMERAHAN/pink, dari pembuluh darah kecil. PIH (Post-Inflammatory Hyperpigmentation) = noda COKELAT/hitam, dari kelebihan melanin. Keduanya rata dengan kulit (bukan bopeng), dan keduanya bisa memudar — tapi butuh bahan berbeda.",
      },
      {
        heading: "Untuk Noda Merah (PIE)",
        body: "Fokus menenangkan peradangan dan memperkuat pembuluh darah kecil:",
        list: [
          "Niacinamide — menenangkan & memperkuat barrier.",
          "Centella asiatica (cica) — meredakan kemerahan.",
          "Sunscreen — mencegah kemerahan makin lama memudar.",
        ],
      },
      {
        heading: "Untuk Noda Cokelat (PIH)",
        body: "Fokus meratakan produksi melanin secara bertahap:",
        list: [
          "Vitamin C — antioksidan & membantu meratakan tona.",
          "Alpha arbutin, azelaic acid, tranexamic acid — menargetkan hiperpigmentasi.",
          "Eksfoliasi lembut (mandelic/lactic acid) untuk mempercepat pergantian sel.",
        ],
        warning: "Hindari produk 'pemutih instan'. Yang menjanjikan hilang dalam hitungan hari sering mengandung merkuri/hidrokuinon ilegal yang justru merusak kulit. Cek BPOM dulu.",
      },
      {
        heading: "Satu Bahan yang Wajib untuk Keduanya",
        body: "Apa pun jenis bekasnya, SUNSCREEN adalah yang paling menentukan. Tanpa perlindungan UV, semua noda (merah maupun cokelat) akan lebih lama memudar — bahkan makin gelap. Ini bahan paling murah dan paling efektif untuk bekas jerawat. Sabar: memudarkan noda butuh hitungan minggu-bulan, bukan hari.",
      },
    ],
  },
  {
    id: "a13",
    slug: "urutan-skincare-pagi-malam",
    title: "Urutan Pakai Skincare Pagi & Malam yang Benar",
    excerpt: "Urutan yang salah bikin produk mahal jadi sia-sia. Aturannya sederhana: dari yang paling cair ke paling kental.",
    emoji: "🔢",
    tags: ["Panduan", "Rutinitas", "Pemula"],
    date: "2026-06-13",
    read_time: 5,
    related_ingredients: ["vitamin-c", "retinol", "niacinamide", "sunscreen-spf50"],
    related_articles: ["rutinitas-skincare-pemula", "retinol-panduan-pemula"],
    sections: [
      {
        heading: "Aturan Emas: Cair ke Kental",
        body: "Prinsip dasar urutan skincare: aplikasikan dari tekstur paling ringan/cair ke paling berat/kental. Produk cair tidak bisa menembus lapisan produk yang lebih tebal, jadi kalau urutannya terbalik, bahan aktifnya tidak terserap optimal.",
      },
      {
        heading: "Urutan Pagi (AM)",
        body: "Tujuan pagi = melindungi kulit sepanjang hari:",
        list: [
          "1. Cleanser (atau cukup bilas air kalau kulit kering)",
          "2. Toner/essence hidrasi (opsional)",
          "3. Serum antioksidan (mis. vitamin C)",
          "4. Pelembap",
          "5. Sunscreen — SELALU langkah terakhir di pagi hari, tidak boleh dilewat",
        ],
        tip: "Kalau waktu mepet, minimal: cleanser → pelembap → sunscreen. Itu sudah cukup.",
      },
      {
        heading: "Urutan Malam (PM)",
        body: "Tujuan malam = membersihkan & memperbaiki:",
        list: [
          "1. Cleanser (double cleanse kalau pakai sunscreen/makeup: pembersih berbasis minyak dulu, baru cleanser biasa)",
          "2. Toner/essence (opsional)",
          "3. Bahan aktif treatment (retinol ATAU eksfoliasi — jangan barengan)",
          "4. Serum hidrasi",
          "5. Pelembap (occlusive lebih kental boleh di malam hari)",
        ],
        warning: "Retinol dan AHA/BHA sebaiknya tidak dipakai bersamaan dalam satu malam — bisa memicu iritasi. Selang-seling harinya.",
      },
    ],
  },
  {
    id: "a14",
    slug: "vitamin-c-untuk-wajah",
    title: "Vitamin C untuk Wajah: Manfaat, Cara Pakai, & Kesalahan Umum",
    excerpt: "Vitamin C bisa bikin kulit lebih cerah & terlindungi — tapi hanya kalau dipakai dengan benar. Ini yang perlu kamu tahu.",
    emoji: "🍊",
    tags: ["Vitamin C", "Mencerahkan", "Antioksidan"],
    date: "2026-06-14",
    read_time: 6,
    related_ingredients: ["vitamin-c", "ferulic-acid", "vitamin-e", "sunscreen-spf50"],
    related_articles: ["bekas-jerawat-pie-pih", "sunscreen-wajib-setiap-hari"],
    sections: [
      {
        heading: "Apa yang Sebenarnya Dilakukan Vitamin C",
        body: "Vitamin C adalah antioksidan: ia membantu menetralkan radikal bebas dari sinar UV dan polusi. Manfaat yang didukung baik: membantu meratakan tona kulit, memudarkan noda cokelat secara bertahap, dan mendukung produksi kolagen. Ia bekerja paling baik sebagai 'pelengkap' sunscreen di pagi hari, bukan pengganti.",
      },
      {
        heading: "Bentuk Vitamin C: Tidak Semua Sama",
        body: "Ada banyak turunan vitamin C. L-Ascorbic Acid = paling kuat tapi paling mudah teroksidasi & bisa mengiritasi. Turunan seperti Sodium Ascorbyl Phosphate atau Ascorbyl Glucoside = lebih lembut & stabil, cocok untuk pemula/kulit sensitif meski efeknya lebih perlahan.",
        tip: "Kalau serum vitamin C-mu berubah warna jadi kuning tua/cokelat, itu tanda teroksidasi — efektivitasnya menurun.",
      },
      {
        heading: "Kesalahan Umum",
        body: "Hal-hal yang bikin vitamin C tidak bekerja atau malah bikin iritasi:",
        list: [
          "Langsung pakai konsentrasi tinggi (15–20%) padahal kulit belum terbiasa.",
          "Menyimpan di tempat kena cahaya/panas (mempercepat oksidasi).",
          "Berharap 'memutihkan' — vitamin C meratakan & mencerahkan tona, bukan mengubah warna dasar kulit.",
        ],
        warning: "Kalau dikombinasi dengan eksfoliasi kuat dan kulit jadi perih/merah, kurangi frekuensinya.",
      },
    ],
  },
  {
    id: "a15",
    slug: "cara-memilih-sunscreen",
    title: "Cara Memilih Sunscreen Sesuai Jenis Kulit",
    excerpt: "SPF berapa yang cukup? Chemical atau physical? Ini panduan memilih sunscreen yang benar-benar kamu pakai setiap hari.",
    emoji: "☀️",
    tags: ["Sunscreen", "Panduan", "UV Protection"],
    date: "2026-06-15",
    read_time: 6,
    related_ingredients: ["sunscreen-spf50", "niacinamide", "centella-asiatica"],
    related_articles: ["sunscreen-wajib-setiap-hari", "cara-merawat-kulit-berminyak"],
    sections: [
      {
        heading: "Arti SPF dan PA",
        body: "SPF mengukur perlindungan terhadap UVB (penyebab kulit terbakar). PA (+ sampai ++++) mengukur perlindungan terhadap UVA (penyebab penuaan & noda). Untuk Indonesia yang UV-nya tinggi sepanjang tahun, cari minimal SPF 30, idealnya SPF 50, dengan PA+++ atau PA++++.",
      },
      {
        heading: "Chemical vs Physical (Mineral)",
        body: "Dua jenis utama, keduanya efektif:",
        list: [
          "Chemical (kimia): tekstur ringan, mudah menyerap, tidak meninggalkan white cast. Cocok untuk pemakaian harian & kulit yang tidak suka rasa berat.",
          "Physical/mineral (zinc oxide, titanium dioxide): duduk di permukaan memantulkan UV, cenderung lebih lembut untuk kulit sensitif, tapi bisa meninggalkan white cast.",
        ],
        tip: "Sunscreen terbaik adalah yang teksturnya kamu suka — karena itu yang akan kamu pakai tiap hari & reapply.",
      },
      {
        heading: "Sesuaikan dengan Kulitmu",
        body: "Panduan singkat sesuai jenis kulit:",
        list: [
          "Berminyak/berjerawat: gel/fluid, water-based, non-comedogenic, label matte.",
          "Kering: yang mengandung pelembap (hyaluronic acid, glycerin), tekstur krim.",
          "Sensitif: mineral/physical, tanpa parfum, mengandung cica/panthenol.",
        ],
        warning: "Sebanyak apa pun SPF-nya, kalau jumlah oles kurang, perlindungan turun drastis. Pakai secukupnya (± dua ruas jari untuk wajah) dan reapply tiap 2–3 jam saat aktif di luar.",
      },
    ],
  },
  {
    id: "a16",
    slug: "purging-vs-breakout",
    title: "Purging atau Breakout? Cara Membedakan & Apa yang Harus Dilakukan",
    excerpt: "Produk baru bikin jerawatan — lanjut atau stop? Bedanya purging dan breakout menentukan jawabannya.",
    emoji: "🌋",
    tags: ["Jerawat", "Purging", "Pemula"],
    date: "2026-06-16",
    read_time: 5,
    related_ingredients: ["retinol", "salicylic-acid", "glycolic-acid", "niacinamide"],
    related_articles: ["retinol-panduan-pemula", "bha-vs-aha"],
    sections: [
      {
        heading: "Apa Itu Purging",
        body: "Purging terjadi saat bahan yang MEMPERCEPAT pergantian sel kulit (retinol, AHA, BHA) mendorong sumbatan yang sudah ada di dalam pori untuk keluar lebih cepat. Jerawat yang muncul sebenarnya 'sudah dalam antrean' — hanya dipercepat kemunculannya.",
      },
      {
        heading: "Cara Membedakan Purging vs Breakout",
        body: "Perhatikan tiga hal ini:",
        list: [
          "Pemicu: Purging hanya dari bahan yang mempercepat turnover (retinoid, AHA/BHA). Kalau produknya pelembap/serum hidrasi biasa → kemungkinan breakout, bukan purging.",
          "Lokasi: Purging muncul di area yang MEMANG biasa berjerawat. Breakout sering muncul di area baru yang tidak biasa.",
          "Durasi: Purging mereda dalam sekitar 4–6 minggu (satu siklus kulit). Kalau lewat dari itu dan makin parah → kemungkinan produk tidak cocok.",
        ],
        tip: "Mulai bahan aktif baru perlahan (2–3x seminggu) untuk meminimalkan purging.",
      },
      {
        heading: "Yang Harus Dilakukan",
        body: "Kalau purging: lanjutkan tapi kurangi frekuensi, perkuat pelembap & sunscreen, sabar. Kalau breakout/reaksi (perih, gatal, kemerahan, bengkak): hentikan produk tersebut. Reaksi alergi bukan purging dan tidak akan membaik dengan diteruskan.",
        warning: "Kulit perih, gatal, bengkak, atau ruam = tanda iritasi/alergi, BUKAN purging. Stop produknya.",
      },
    ],
  },
  {
    id: "a17",
    slug: "hyaluronic-acid-cara-pakai",
    title: "Hyaluronic Acid: Kenapa Bisa Bikin Kulit Makin Kering Kalau Salah Pakai",
    excerpt: "Hyaluronic acid menarik air — dan itu bisa jadi bumerang di udara kering. Ini cara memakainya supaya benar-benar melembapkan.",
    emoji: "💦",
    tags: ["Hyaluronic Acid", "Hidrasi", "Kulit Kering"],
    date: "2026-06-17",
    read_time: 5,
    related_ingredients: ["hyaluronic-acid", "glycerin", "ceramide", "squalane"],
    related_articles: ["cara-merawat-kulit-kering", "skin-barrier-rusak"],
    sections: [
      {
        heading: "Cara Kerja Hyaluronic Acid",
        body: "Hyaluronic acid (HA) adalah humektan — ia menarik dan mengikat air. Satu molekulnya bisa mengikat air ratusan kali beratnya. Itu sebabnya ia jadi bahan hidrasi populer. Tapi ada satu hal penting: HA menarik air dari mana pun yang tersedia — termasuk dari lapisan dalam kulitmu sendiri kalau udara di sekitar kering.",
      },
      {
        heading: "Kesalahan yang Bikin Makin Kering",
        body: "Di ruangan ber-AC atau udara kering, HA yang diaplikasikan pada kulit KERING bisa menarik air dari dalam kulit dan menguap — meninggalkan kulit lebih kering dari sebelumnya. Solusinya sederhana:",
        list: [
          "Aplikasikan HA pada kulit yang masih LEMBAP (setelah cuci muka/semprot toner), bukan kulit kering.",
          "SELALU kunci dengan pelembap (occlusive) di atasnya supaya air tidak menguap.",
        ],
        tip: "Urutan yang benar: kulit lembap → hyaluronic acid → pelembap. Jangan biarkan HA 'telanjang' di lapisan paling atas.",
      },
      {
        heading: "HA Bukan Segalanya",
        body: "HA memberi air, tapi tidak memberi minyak. Untuk kulit yang benar-benar kering, HA saja tidak cukup — kamu tetap butuh ceramide/squalane untuk memperbaiki dan mengunci. HA adalah pelengkap yang bagus, bukan solusi tunggal.",
      },
    ],
  },
  {
    id: "a18",
    slug: "kulit-kusam-penyebab-solusi",
    title: "Kulit Kusam: Penyebab & Cara Mengembalikan Cerah Alami",
    excerpt: "Kusam bukan soal warna kulit, tapi soal tekstur & pantulan cahaya. Kabar baiknya: hampir semua penyebabnya bisa diperbaiki.",
    emoji: "✨",
    tags: ["Kulit Kusam", "Mencerahkan", "Panduan"],
    date: "2026-06-18",
    read_time: 6,
    related_ingredients: ["vitamin-c", "niacinamide", "lactic-acid", "sunscreen-spf50"],
    related_articles: ["kulit-sehat-bukan-putih", "vitamin-c-untuk-wajah"],
    sections: [
      {
        heading: "Kusam ≠ Kulit Gelap",
        body: "Penting dibedakan: kulit kusam adalah kulit yang kehilangan 'cahaya' dan terlihat lelah/abu-abu — ini soal kesehatan & tekstur permukaan, bukan warna dasar kulitmu. Kulit sawo matang yang sehat tetap bisa terlihat 'glowing'. Tujuan kita mengembalikan pantulan cahaya alami, bukan mengubah warna kulit.",
      },
      {
        heading: "Penyebab Umum Kulit Kusam",
        body: "Biasanya kombinasi beberapa faktor ini:",
        list: [
          "Penumpukan sel kulit mati di permukaan.",
          "Dehidrasi — kulit kekurangan air terlihat lebih kusam.",
          "Paparan UV tanpa perlindungan (menggelapkan & merusak tekstur).",
          "Kurang tidur, stres, merokok.",
        ],
      },
      {
        heading: "Cara Mengembalikan Cerah Alami",
        body: "Langkah yang benar-benar bekerja, tanpa 'pemutih':",
        list: [
          "Eksfoliasi lembut (lactic acid/PHA) 1–2x seminggu untuk mengangkat sel mati.",
          "Hidrasi cukup (hyaluronic acid + pelembap) — kulit lembap memantulkan cahaya lebih baik.",
          "Vitamin C & niacinamide untuk meratakan tona.",
          "Sunscreen tiap hari — mencegah kusam & noda baru.",
          "Tidur cukup & minum air.",
        ],
        warning: "Waspadai produk 'glow instan' yang menjanjikan hasil dalam semalam. Cahaya alami dibangun bertahap, bukan dari bahan pemutih berbahaya.",
      },
    ],
  },
  {
    id: "a19",
    slug: "pelembap-untuk-kulit-berjerawat",
    title: "Kulit Berminyak & Berjerawat Tetap Butuh Pelembap",
    excerpt: "Mitos 'kulit berjerawat jangan pakai pelembap' justru bikin jerawat makin parah. Ini penjelasannya.",
    emoji: "🧴",
    tags: ["Jerawat", "Kulit Berminyak", "Mitos"],
    date: "2026-06-19",
    read_time: 5,
    related_ingredients: ["niacinamide", "hyaluronic-acid", "centella-asiatica", "salicylic-acid"],
    related_articles: ["cara-merawat-kulit-berminyak", "bha-vs-aha"],
    sections: [
      {
        heading: "Kenapa Mitos Ini Berbahaya",
        body: "Banyak yang percaya kulit berjerawat/berminyak harus dibiarkan 'kering' supaya jerawat cepat hilang. Kenyataannya, kulit yang dikeringkan akan merespons dengan memproduksi LEBIH banyak minyak dan barrier-nya melemah — dua hal yang justru memperparah jerawat.",
      },
      {
        heading: "Terutama Kalau Kamu Pakai Obat Jerawat",
        body: "Bahan anti-jerawat seperti salicylic acid, benzoyl peroxide, atau retinoid membuat kulit cenderung kering & mengelupas. Tanpa pelembap, kulit jadi iritasi, dan kamu akhirnya berhenti pakai obatnya sebelum bekerja. Pelembap justru yang membuat treatment jerawat bisa kamu lanjutkan sampai tuntas.",
        tip: "Pakai pelembap membantumu bertahan dengan treatment jerawat lebih lama — dan konsistensi adalah kunci hasil.",
      },
      {
        heading: "Pelembap yang Tepat untuk Kulit Berjerawat",
        body: "Bukan sembarang pelembap. Cari yang:",
        list: [
          "Non-comedogenic (tidak menyumbat pori).",
          "Tekstur ringan: gel atau lotion water-based.",
          "Mengandung bahan menenangkan: niacinamide, centella, panthenol.",
          "Bebas minyak berat & parfum kuat kalau kulitmu reaktif.",
        ],
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
