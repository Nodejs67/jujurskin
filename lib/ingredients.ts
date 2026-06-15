export type IngredientCategory =
  | "treatment"
  | "sunscreen"
  | "moisturizer"
  | "brightening"
  | "soothing"
  | "antioxidant";

export type EvidenceLevel = "kuat" | "sedang" | "terbatas";
export type SafetyRating = "sangat_aman" | "aman" | "hati_hati";

export interface Ingredient {
  id: string;
  name: string;
  aliases: string[];
  category: IngredientCategory;
  emoji: string;
  color: string;

  tagline: string;
  description: string;
  how_it_works: string;

  good_for: string[];
  avoid_if: string[];

  recommended_concentration?: string;
  how_to_use: string;
  frequency: string;

  works_well_with: string[];
  conflicts_with: { name: string; reason: string }[];

  evidence_level: EvidenceLevel;
  safety_rating: SafetyRating;
  pregnancy_safe: boolean;

  price_in_indonesia: string;
  popular_products: string[];

  myths: { myth: string; fact: string }[];
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: "niacinamide",
    name: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide", "Niacin Amide"],
    category: "brightening",
    emoji: "✨",
    color: "purple",
    tagline: "Si serba bisa — kontrol minyak & cerahkan kulit",
    description:
      "Niacinamide adalah bentuk Vitamin B3 yang paling banyak diteliti dalam skincare. Ia mengerjakan banyak hal sekaligus: mengecilkan pori, mengontrol minyak, mencerahkan bekas jerawat, memperkuat skin barrier, dan meredakan kemerahan — semua dalam satu bahan.",
    how_it_works:
      "Niacinamide menghambat transfer melanin (pigmen gelap) ke sel kulit, sehingga bekas jerawat dan noda hitam memudar. Ia juga mengatur produksi sebum (minyak) dan membantu kulit memproduksi ceramide alaminya sendiri untuk memperkuat barrier.",
    good_for: [
      "Semua tipe kulit",
      "Bekas jerawat & hiperpigmentasi",
      "Kulit berminyak & berpori besar",
      "Kulit sensitif (karena sangat gentle)",
    ],
    avoid_if: [],
    recommended_concentration: "5–10% optimal. Di atas 20% bisa iritasi.",
    how_to_use:
      "Oleskan setelah cleanser, sebelum moisturizer. Bisa dipakai pagi dan malam. Tidak perlu menunggu kering sebelum layer produk berikutnya.",
    frequency: "Pagi dan malam, setiap hari",
    works_well_with: ["Hyaluronic Acid", "Ceramide", "Retinol", "Sunscreen", "AHA/BHA"],
    conflicts_with: [
      {
        name: "Vitamin C (L-Ascorbic Acid)",
        reason:
          "Kalau dicampur, keduanya bisa saling melemahkan. Pakai di waktu berbeda: Vitamin C pagi, Niacinamide malam.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Mulai Rp 35.000 (lokal) hingga Rp 120.000 (import)",
    popular_products: [
      "Somethinc Niacinamide + Moisture Beet (±Rp 60k)",
      "Skintific 5X Ceramide + Niacinamide (±Rp 65k)",
      "NPURE Centella Niacinamide Serum (±Rp 45k)",
      "Wardah Lightening Serum (±Rp 35k)",
      "The Ordinary Niacinamide 10% + Zinc 1% (±Rp 130k via reseller)",
    ],
    myths: [
      {
        myth: "Niacinamide tidak boleh dipakai bersamaan dengan Vitamin C",
        fact: "Dulu ada kekhawatiran ini, tapi riset modern menunjukkan keduanya aman dipakai di layer berbeda (Vitamin C pagi, Niacinamide malam). Mereka tidak bereaksi berbahaya di kulit.",
      },
      {
        myth: "Semakin tinggi konsentrasinya, semakin bagus hasilnya",
        fact: "Konsentrasi efektif adalah 5–10%. Di atas 10% tidak memberikan manfaat tambahan, tapi risiko iritasi meningkat.",
      },
    ],
  },

  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    aliases: ["BHA", "Beta Hydroxy Acid", "SA", "Asam Salisilat"],
    category: "treatment",
    emoji: "🔬",
    color: "blue",
    tagline: "Masuk ke dalam pori dan bersihkan dari dalam",
    description:
      "Salicylic Acid (BHA) adalah satu-satunya exfoliant yang larut minyak, artinya ia bisa menembus ke dalam pori untuk membersihkan kotoran dan sebum yang menyumbat. Ini menjadikannya senjata paling efektif melawan komedo dan jerawat.",
    how_it_works:
      "BHA larut dalam minyak sehingga bisa menembus lapisan sebum dan masuk ke dalam pori. Di sana, ia meluruhkan ikatan antara sel kulit mati sehingga pori tidak tersumbat. Ia juga punya sifat anti-inflamasi yang menenangkan jerawat aktif.",
    good_for: [
      "Jerawat aktif (semua jenis)",
      "Komedo hitam & putih",
      "Kulit berminyak dan berpori besar",
      "Kulit kombinasi",
    ],
    avoid_if: [
      "Kulit sangat kering atau sensitif (mulai perlahan)",
      "Alergi aspirin (BHA secara kimia mirip aspirin)",
    ],
    recommended_concentration: "0.5–2% untuk skincare topikal",
    how_to_use:
      "Pakai setelah cleanser. Kalau toner: langsung ke kapas lalu usap wajah. Kalau serum: oleskan tipis ke area bermasalah. Selalu pakai sunscreen setelah pakai BHA karena meningkatkan sensitivitas UV.",
    frequency: "Mulai 2–3x/minggu, naikkan ke setiap hari kalau kulit sudah toleran",
    works_well_with: ["Niacinamide", "Hyaluronic Acid", "Centella Asiatica"],
    conflicts_with: [
      {
        name: "Retinol",
        reason: "Dua exfoliant aktif bersamaan = over-exfoliation. Pakai di hari berbeda.",
      },
      {
        name: "AHA (Glycolic/Lactic Acid)",
        reason: "Kombinasi dua exfoliant bisa merusak skin barrier. Jangan pakai di waktu yang sama.",
      },
      {
        name: "Benzoyl Peroxide",
        reason: "Bisa menyebabkan iritasi berlebihan jika dipakai bersamaan di waktu yang sama.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "aman",
    pregnancy_safe: false,
    price_in_indonesia: "Mulai Rp 25.000 (toner lokal) hingga Rp 100.000",
    popular_products: [
      "Somethinc BHA+ Exfoliating Toner (±Rp 65k)",
      "Skintific BHA Acne Serum (±Rp 70k)",
      "COSRX BHA Blackhead Power Liquid (±Rp 120k via reseller)",
      "Azarine Acne Spot Serum BHA (±Rp 45k)",
      "Emina Bright Stuff Facial Wash (BHA, ±Rp 30k)",
    ],
    myths: [
      {
        myth: "BHA harus 'perih' atau 'menyengat' supaya bekerja",
        fact: "Perih = iritasi, bukan efektivitas. Kalau BHA menyengat, itu tanda konsentrasi terlalu tinggi atau kulit belum toleran. Mulai dari konsentrasi rendah.",
      },
      {
        myth: "BHA bisa menghilangkan komedo dalam seminggu",
        fact: "BHA butuh 4–8 minggu pemakaian konsisten untuk hasil optimal. Komedo yang sudah lama terbentuk butuh waktu untuk luruh.",
      },
    ],
  },

  {
    id: "glycolic-acid",
    name: "Glycolic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid", "Asam Glikolat"],
    category: "treatment",
    emoji: "🧪",
    color: "orange",
    tagline: "Exfoliant terkuat untuk kulit bersinar",
    description:
      "Glycolic Acid adalah AHA (exfoliant yang larut air) dengan molekul terkecil, sehingga penetrasinya paling dalam dan efeknya paling cepat terlihat. Sangat efektif untuk mencerahkan kulit kusam, memudarkan hiperpigmentasi, dan menghaluskan tekstur kulit.",
    how_it_works:
      "Glycolic Acid melonggarkan ikatan antar sel kulit mati di lapisan terluar kulit (stratum corneum). Ketika sel-sel tua ini luruh, kulit baru yang lebih cerah dan halus muncul ke permukaan. Ini juga membantu produk lain meresap lebih dalam.",
    good_for: [
      "Kulit kusam tidak bercahaya",
      "Hiperpigmentasi & bekas jerawat",
      "Tekstur kasar & tidak rata",
      "Pori tersumbat (komedo)",
      "Tanda penuaan awal",
    ],
    avoid_if: [
      "Kulit sangat sensitif",
      "Kulit sedang mengalami iritasi aktif",
      "Baru selesai laser/peeling",
    ],
    recommended_concentration: "5–10% untuk daily use, 20–30% untuk chemical peel",
    how_to_use:
      "Pakai malam hari sebagai toner atau serum setelah cleanser. WAJIB diikuti sunscreen keesokan paginya karena AHA meningkatkan sensitivitas UV signifikan.",
    frequency: "1–3x/minggu untuk pemula, bisa setiap malam setelah toleransi terbentuk",
    works_well_with: ["Hyaluronic Acid", "Ceramide", "Niacinamide (beda waktu)"],
    conflicts_with: [
      {
        name: "Retinol",
        reason: "Over-exfoliation. Pakai di malam yang berbeda.",
      },
      {
        name: "BHA (Salicylic Acid)",
        reason: "Dua exfoliant aktif di waktu yang sama merusak skin barrier.",
      },
      {
        name: "Benzoyl Peroxide",
        reason: "Iritasi dan inaktivasi satu sama lain.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "aman",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 50.000–180.000",
    popular_products: [
      "Somethinc AHA-BHA-PHA Exfoliating Toner (±Rp 80k)",
      "Azarine AHA Toner (±Rp 45k)",
      "The Ordinary Glycolic Acid 7% Toning Solution (±Rp 150k reseller)",
      "NPURE AHA Toner (±Rp 50k)",
    ],
    myths: [
      {
        myth: "AHA boleh dipakai pagi hari",
        fact: "Secara teknis boleh, tapi sangat tidak dianjurkan karena AHA meningkatkan photosensitivity drastis. Kalau mau pagi, HARUS pakai sunscreen SPF 50+ dan reapply.",
      },
      {
        myth: "AHA dan BHA bisa dipakai bersamaan untuk hasil lebih cepat",
        fact: "Kombinasi dua exfoliant aktif justru merusak skin barrier. Bergantian di hari berbeda sudah cukup, bahkan lebih efektif.",
      },
    ],
  },

  {
    id: "retinol",
    name: "Retinol",
    aliases: ["Vitamin A", "Retinoic Acid (Tretinoin)", "Retinoid"],
    category: "treatment",
    emoji: "🌙",
    color: "amber",
    tagline: "Bahan anti-aging paling terbukti secara ilmiah",
    description:
      "Retinol adalah turunan Vitamin A yang paling banyak diteliti dan terbukti dalam skincare. Ia mempercepat regenerasi sel kulit, merangsang produksi kolagen, mengurangi tanda penuaan, dan membantu atasi jerawat. Versi resep dokter (Tretinoin/Vitacid) jauh lebih kuat dari versi OTC.",
    how_it_works:
      "Retinol diubah kulit menjadi retinoic acid, yang kemudian berikatan dengan reseptor di inti sel. Ini memicu sel kulit untuk memperbarui dirinya lebih cepat, merangsang fibroblast memproduksi lebih banyak kolagen, dan menghambat enzim yang merusak kolagen (MMP). Hasilnya: kulit lebih muda, lebih kencang, lebih merata.",
    good_for: [
      "Tanda penuaan (kerutan, garis halus)",
      "Tekstur kulit tidak merata",
      "Jerawat membandel",
      "Bekas jerawat yang lama",
      "Usia 25 tahun ke atas",
    ],
    avoid_if: [
      "Kehamilan & menyusui (BERBAHAYA)",
      "Kulit terbakar atau sangat iritasi",
      "Di bawah 20 tahun (tidak perlu)",
      "Baru selesai waxing atau laser",
    ],
    recommended_concentration: "0.1–0.3% untuk pemula, 0.5–1% untuk yang sudah terbiasa",
    how_to_use:
      "HANYA malam hari. Mulai 1x/minggu selama 2 minggu, lalu naikkan secara bertahap. Oleskan tipis ke wajah kering setelah cleanser, lalu tutup dengan moisturizer tebal. Jangan pakai di area mata tanpa arahan dokter.",
    frequency: "Mulai 1x/minggu → 2x → 3x → bertahap sampai setiap malam (butuh 1–3 bulan adaptasi)",
    works_well_with: ["Hyaluronic Acid", "Ceramide (moisturizer)", "Niacinamide"],
    conflicts_with: [
      {
        name: "AHA/BHA",
        reason: "Tiga exfoliant aktif = over-exfoliation dan iritasi parah. Pakai di hari berbeda.",
      },
      {
        name: "Benzoyl Peroxide",
        reason: "Bisa mengoksidasi dan menonaktifkan retinol.",
      },
      {
        name: "Vitamin C (L-Ascorbic Acid)",
        reason: "Keduanya tidak stabil di pH yang sama. Pakai Vitamin C pagi, Retinol malam.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "hati_hati",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 70.000–200.000 (OTC), Vitacid perlu resep dokter",
    popular_products: [
      "Somethinc Bakuchiol + Retinol 0.3% (±Rp 85k)",
      "Skintific Retinol 0.3% (±Rp 80k)",
      "Azarine Retinol Serum (±Rp 65k)",
      "Vitacid 0.025% / 0.05% (resep dokter, ±Rp 25k)",
      "The Ordinary Retinol 0.2% in Squalane (±Rp 90k reseller)",
    ],
    myths: [
      {
        myth: "'Purging' retinol artinya jerawat makin parah — harus berhenti",
        fact: "Purging (jerawat sementara lebih banyak di 2–4 minggu pertama) adalah normal karena sel kulit mati naik lebih cepat. Ini harus dibedakan dari iritasi. Purging biasanya di area yang biasa berjerawat, iritasi di mana saja.",
      },
      {
        myth: "Retinol boleh dipakai di bawah sinar matahari kalau sudah dikombinasi produk lain",
        fact: "Tidak. Retinol degradasi di cahaya dan panas, dan membuat kulit jauh lebih sensitif UV. Selalu HANYA malam hari.",
      },
    ],
  },

  {
    id: "vitamin-c",
    name: "Vitamin C",
    aliases: ["L-Ascorbic Acid", "LAA", "Ascorbic Acid", "Asam Askorbat"],
    category: "brightening",
    emoji: "🍊",
    color: "orange",
    tagline: "Antioksidan terkuat untuk kulit cerah bercahaya",
    description:
      "Vitamin C (L-Ascorbic Acid) adalah antioksidan paling kuat dalam skincare. Ia mencerahkan warna kulit tidak merata, melindungi dari kerusakan akibat radikal bebas (polusi, UV), dan merangsang produksi kolagen. Tapi ia juga yang paling tidak stabil dan butuh formulasi yang tepat.",
    how_it_works:
      "L-Ascorbic Acid menghambat enzim tyrosinase yang menghasilkan melanin (pigmen gelap), sehingga produksi hiperpigmentasi berkurang. Sebagai antioksidan, ia menetralkan radikal bebas sebelum merusak sel. Ia juga dibutuhkan sebagai kofaktor dalam sintesis kolagen.",
    good_for: [
      "Kulit kusam tidak bercahaya",
      "Hiperpigmentasi & noda matahari",
      "Kerusakan akibat sinar UV (pagi hari)",
      "Antioksidan perlindungan polusi",
      "Mendukung produksi kolagen",
    ],
    avoid_if: [
      "Kulit sangat sensitif (pilih turunan Vitamin C yang lebih gentle)",
      "Kulit berjerawat aktif banyak (bisa memperburuk di beberapa orang)",
    ],
    recommended_concentration:
      "10–20% untuk L-Ascorbic Acid. Turunan seperti Ascorbyl Glucoside lebih gentle tapi butuh konsentrasi lebih tinggi.",
    how_to_use:
      "Pagi hari setelah cleanser, SEBELUM sunscreen. Vitamin C dan sunscreen adalah duo perlindungan terbaik siang hari. Simpan di tempat gelap dan sejuk karena mudah teroksidasi.",
    frequency: "Setiap pagi",
    works_well_with: [
      "Vitamin E (melipatgandakan efek antioksidan)",
      "Ferulic Acid (menstabilkan Vitamin C)",
      "Sunscreen SPF 50+",
      "Hyaluronic Acid",
    ],
    conflicts_with: [
      {
        name: "Niacinamide",
        reason: "Bisa saling menetralkan jika dicampur langsung. Aman di layer berbeda atau di waktu berbeda.",
      },
      {
        name: "Retinol",
        reason: "pH berbeda, saling tidak stabil. Vitamin C pagi, Retinol malam.",
      },
      {
        name: "AHA/BHA",
        reason: "Bisa menurunkan pH dan mendestabilisasi Vitamin C.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 50.000–200.000",
    popular_products: [
      "Skintific Vitamin C Brightening Serum (±Rp 70k)",
      "Azarine Vitamin C 10% Brightening Serum (±Rp 55k)",
      "Somethinc Vitamin C Hyaluronic Serum (±Rp 80k)",
      "NPURE Centella + Vitamin C (±Rp 55k)",
      "The Ordinary Ascorbyl Glucoside Solution 12% (±Rp 150k reseller)",
    ],
    myths: [
      {
        myth: "Kalau serum Vitamin C berubah kekuningan/kecoklatan, harus dibuang",
        fact: "Perubahan warna ini adalah proses oksidasi alami — artinya produknya memang bekerja tapi mulai kehilangan potensi. Tidak berbahaya, tapi efektivitasnya berkurang. Lebih baik simpan di kulkas atau tempat gelap.",
      },
      {
        myth: "Vitamin C membuat kulit makin cerah/putih",
        fact: "Vitamin C mencerahkan NODA gelap dan meratakan warna kulit, bukan memutihkan kulit secara keseluruhan. Warna kulit aslimu tidak berubah.",
      },
    ],
  },

  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    aliases: ["HA", "Sodium Hyaluronate", "Asam Hialuronat"],
    category: "moisturizer",
    emoji: "💧",
    color: "blue",
    tagline: "Humektan terbaik — bisa menahan 1000x beratnya dalam air",
    description:
      "Hyaluronic Acid (HA) adalah humektan alami yang diproduksi tubuh kita sendiri. Kemampuannya menahan air sangat luar biasa — 1 gram HA bisa menahan hingga 6 liter air. Cocok untuk SEMUA tipe kulit, termasuk berminyak dan berjerawat.",
    how_it_works:
      "HA bekerja seperti spons — ia menarik molekul air dari udara sekitar dan dari lapisan kulit yang lebih dalam ke permukaan kulit. Ini menjaga kulit tetap terhidrasi dari dalam. Ada berbagai ukuran molekul: ukuran kecil meresap lebih dalam, ukuran besar memberi efek plumping di permukaan.",
    good_for: [
      "Semua tipe kulit",
      "Kulit kering dan dehidrasi",
      "Kulit berminyak yang butuh hidrasi tanpa minyak",
      "Kulit sensitif",
      "Cocok dikombinasi dengan SEMUA bahan aktif",
    ],
    avoid_if: ["Tidak ada kontraindikasi"],
    recommended_concentration: "0.1–2% sudah sangat efektif",
    how_to_use:
      "Oleskan ke kulit yang MASIH LEMBAB/BASAH (setelah cuci muka, sebelum mengeringkan sempurna). HA butuh air di sekitarnya untuk bekerja — di iklim sangat kering, HA bisa menarik air dari lapisan kulit lebih dalam jika tidak dikunci dengan moisturizer.",
    frequency: "Pagi dan malam, setiap hari",
    works_well_with: ["SEMUA bahan aktif", "Niacinamide", "Vitamin C", "Retinol", "Ceramide"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Mulai Rp 30.000",
    popular_products: [
      "Hada Labo Gokujyun Premium (±Rp 80k)",
      "Somethinc Hyaluronic Acid Serum (±Rp 60k)",
      "Skintific Multi Peptide + Hyaluronic Acid (±Rp 75k)",
      "Azarine Hydrasoothe Serum HA (±Rp 45k)",
      "The Ordinary Hyaluronic Acid 2% + B5 (±Rp 120k reseller)",
    ],
    myths: [
      {
        myth: "HA hanya untuk kulit kering",
        fact: "HA cocok untuk semua tipe kulit. Kulit berminyak juga butuh hidrasi — tanpa hidrasi yang cukup, kulit justru produksi lebih banyak minyak sebagai kompensasi.",
      },
      {
        myth: "HA bisa 'mengisi' kerutan secara permanen",
        fact: "HA topikal hanya memberikan efek plumping sementara karena menambah hidrasi. Untuk isi kerutan secara permanen, dibutuhkan filler HA yang disuntikkan dokter.",
      },
    ],
  },

  {
    id: "ceramide",
    name: "Ceramide",
    aliases: ["Ceramide NP", "Ceramide AP", "Ceramide EOP"],
    category: "moisturizer",
    emoji: "🧱",
    color: "green",
    tagline: "Memperkuat skin barrier — tembok pelindung kulitmu",
    description:
      "Ceramide adalah lipid (lemak) yang secara alami ada di skin barrier — lapisan terluar kulit yang melindungi dari polusi, bakteri, dan kehilangan air. Saat skin barrier rusak (akibat over-exfoliation, cuaca, atau skincare keras), kulit menjadi kering, merah, dan sensitif. Ceramide memperbaikinya.",
    how_it_works:
      "Kulit terdiri dari sel-sel kulit yang disatukan oleh ceramide, kolesterol, dan asam lemak — seperti bata dan semen. Saat ceramide berkurang, 'semen' ini renggang dan kulit jadi bocor (TEWL tinggi = kulit kehilangan air). Mengoleskan ceramide dari luar membantu mengisi kekosongan ini dan memperbaiki barrier.",
    good_for: [
      "Kulit kering dan sangat kering",
      "Kulit sensitif dan reaktif",
      "Kulit yang baru over-exfoliation",
      "Eksim dan psoriasis ringan",
      "Kulit bayi dan anak",
      "Semua usia",
    ],
    avoid_if: [],
    how_to_use:
      "Oleskan sebagai moisturizer terakhir dalam routine (setelah serum/aktif). Bisa dipakai pagi dan malam. Sangat dianjurkan dipakai saat kulit sedang recovery dari iritasi.",
    frequency: "Pagi dan malam",
    works_well_with: ["SEMUA bahan aktif", "Hyaluronic Acid", "Niacinamide", "Cholesterol", "Fatty Acids"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 60.000–200.000",
    popular_products: [
      "CeraVe Moisturizing Cream (±Rp 120k)",
      "Skintific 5X Ceramide Barrier Serum (±Rp 75k)",
      "Cetaphil Moisturizing Cream (±Rp 80k)",
      "Elyzette Ceramide Moisturizer (±Rp 65k)",
      "Vaseline Intensive Care Ceramide (±Rp 45k)",
    ],
    myths: [
      {
        myth: "Ceramide hanya untuk kulit kering dan tua",
        fact: "Ceramide dibutuhkan semua tipe kulit karena semua orang punya skin barrier. Bahkan kulit berminyak bisa punya skin barrier yang lemah.",
      },
    ],
  },

  {
    id: "centella-asiatica",
    name: "Centella Asiatica",
    aliases: ["Cica", "Gotu Kola", "Pegagan", "TECA", "Madecassoside"],
    category: "soothing",
    emoji: "🌿",
    color: "green",
    tagline: "Soothing terbaik — menenangkan dan menyembuhkan kulit",
    description:
      "Centella Asiatica (Cica) adalah tanaman herbal yang tumbuh subur di Asia Tenggara, termasuk Indonesia. Sejak lama dipakai dalam pengobatan tradisional, dan sekarang terbukti ilmiah untuk meredakan peradangan, mempercepat penyembuhan, dan merangsang kolagen. Kini menjadi salah satu bahan paling populer di skincare Korea.",
    how_it_works:
      "Kandungan aktif utamanya — madecassoside, asiaticosice, asiatic acid — punya sifat anti-inflamasi kuat. Madecassoside khususnya sangat efektif menenangkan kulit yang meradang dan mempercepat regenerasi sel. Cica juga merangsang fibroblast untuk memproduksi kolagen.",
    good_for: [
      "Kulit sensitif dan mudah merah",
      "Kulit yang sedang iritasi atau over-exfoliation",
      "Setelah prosedur (laser, chemical peel)",
      "Jerawat aktif yang meradang",
      "Luka bekas jerawat",
    ],
    avoid_if: [],
    how_to_use:
      "Bisa dipakai kapanpun dalam routine. Sebagai serum: setelah cleanser, sebelum moisturizer. Sebagai krim: sebagai moisturizer malam. Aman untuk area sensitif termasuk kelopak mata.",
    frequency: "Pagi dan/atau malam, bisa setiap hari",
    works_well_with: [
      "SEMUA bahan aktif",
      "Niacinamide",
      "Ceramide",
      "Hyaluronic Acid",
      "Madecassoside",
    ],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 30.000–150.000",
    popular_products: [
      "NPURE Centella Asiatica Serum (±Rp 45k)",
      "Skin1004 Madagascar Centella Toning Toner (±Rp 120k reseller)",
      "Somethinc Cica Moisture Gel (±Rp 65k)",
      "Elzatta Cica Repair (±Rp 40k)",
      "Dr. Jart+ Cicapair Tiger Grass (±Rp 350k reseller)",
    ],
    myths: [
      {
        myth: "Centella hanya untuk kulit sensitif",
        fact: "Cica bermanfaat untuk semua tipe kulit karena sifat anti-inflamasi dan kolagen-stimulasinya. Kulit normal dan berminyak juga mendapat manfaat dari perlindungan dan perbaikan kulit.",
      },
    ],
  },

  {
    id: "azelaic-acid",
    name: "Azelaic Acid",
    aliases: ["Asam Azelaik", "Azelaic", "AA"],
    category: "treatment",
    emoji: "⚗️",
    color: "purple",
    tagline: "Senjata rahasia: atasi jerawat DAN rosacea DAN bekas hitam",
    description:
      "Azelaic Acid adalah bahan multi-tasker yang underrated. Ia secara simultan mengatasi jerawat aktif, memudarkan bekas jerawat, meredakan kemerahan akibat rosacea, dan mencerahkan hiperpigmentasi — dengan efek samping yang sangat minimal. Sangat cocok untuk kulit sensitif.",
    how_it_works:
      "Azelaic Acid menghambat pertumbuhan bakteri P. acnes (penyebab jerawat), sekaligus menghambat tyrosinase untuk mencegah produksi melanin berlebih. Sifat anti-inflamasinya meredakan kemerahan. Karena bersumber dari gandum dan jagung, ia tergolong sangat gentle.",
    good_for: [
      "Jerawat aktif ringan–sedang",
      "Rosacea dan kemerahan kronis",
      "Bekas jerawat kemerahan (PIE)",
      "Hiperpigmentasi dan melasma",
      "Kulit sensitif yang tidak toleran BHA/AHA",
      "Aman untuk ibu hamil (diresepkan dokter)",
    ],
    avoid_if: [],
    recommended_concentration: "10% OTC efektif, 15–20% versi resep untuk kondisi lebih serius",
    how_to_use:
      "Oleskan tipis di area bermasalah atau seluruh wajah, setelah cleanser. Bisa pagi atau malam. Tidak meningkatkan photosensitivity sebesar AHA/BHA.",
    frequency: "1–2x sehari",
    works_well_with: ["Niacinamide", "Ceramide", "Sunscreen", "Hyaluronic Acid"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 45.000–120.000",
    popular_products: [
      "Azarine Azelaic Acid 10% Serum (±Rp 55k)",
      "Somethinc Azelaic Acid Serum (±Rp 75k)",
      "The Ordinary Azelaic Acid Suspension 10% (±Rp 150k reseller)",
      "Skintific Azelaic Acid 10% (±Rp 70k)",
    ],
    myths: [
      {
        myth: "Azelaic Acid sama saja dengan BHA untuk jerawat",
        fact: "Keduanya atasi jerawat tapi dengan cara berbeda. Azelaic Acid lebih gentle, aman kehamilan, dan juga efektif untuk rosacea — BHA lebih kuat untuk komedo dan kulit berminyak. Berbeda kondisi, berbeda pilihan.",
      },
    ],
  },

  {
    id: "alpha-arbutin",
    name: "Alpha Arbutin",
    aliases: ["Arbutin", "Alpha-Arbutin"],
    category: "brightening",
    emoji: "🤍",
    color: "slate",
    tagline: "Pencerah noda kulit yang aman dan efektif",
    description:
      "Alpha Arbutin adalah turunan sintetis dari hydroquinone yang jauh lebih aman. Ia adalah salah satu pencerah noda dan hiperpigmentasi paling efektif yang tersedia tanpa resep dokter. Sangat gentle dan aman untuk pemakaian jangka panjang.",
    how_it_works:
      "Alpha Arbutin menghambat enzim tyrosinase yang bertanggung jawab untuk produksi melanin. Dengan menghambat enzim ini, produksi pigmen gelap di kulit berkurang secara signifikan. Berbeda dari hydroquinone yang keras, alpha arbutin bekerja lebih bertahap tapi lebih aman.",
    good_for: [
      "Hiperpigmentasi & noda hitam",
      "Bekas jerawat gelap (PIH)",
      "Melasma ringan",
      "Semua tipe kulit termasuk sensitif",
    ],
    avoid_if: [],
    recommended_concentration: "1–2% OTC, 3–5% lebih efektif",
    how_to_use: "Oleskan setelah cleanser, sebelum moisturizer. Bisa pagi atau malam. Hasil optimal dikombinasi dengan Vitamin C pagi dan Retinol malam.",
    frequency: "Pagi dan/atau malam",
    works_well_with: ["Vitamin C (sinergi pencerah)", "Niacinamide", "Kojic Acid"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 50.000–150.000",
    popular_products: [
      "Somethinc Alpha Arbutin Serum (±Rp 70k)",
      "NPURE Alpha Arbutin Serum (±Rp 50k)",
      "Elzatta Alpha Arbutin (±Rp 45k)",
      "The Ordinary Alpha Arbutin 2% + HA (±Rp 140k reseller)",
    ],
    myths: [
      {
        myth: "Alpha Arbutin sama berbahayanya dengan Hydroquinone",
        fact: "Alpha Arbutin dan Hydroquinone memang secara kimia berkaitan, tapi mekanisme kerjanya berbeda. Alpha Arbutin jauh lebih stabil dan aman untuk penggunaan jangka panjang tanpa efek samping seperti HQ.",
      },
    ],
  },

  {
    id: "sunscreen-spf50",
    name: "Sunscreen SPF 50+",
    aliases: ["Tabir Surya", "Sun Protection", "UV Protection", "Sunblock"],
    category: "sunscreen",
    emoji: "☀️",
    color: "yellow",
    tagline: "Produk paling penting dalam semua routine skincare",
    description:
      "Sunscreen bukan sekedar produk — ia adalah fondasi dari semua skincare. Tanpa sunscreen, semua treatment lain (Vitamin C, Retinol, AHA/BHA) menjadi sia-sia karena UV merusak kulit lebih cepat dari yang bisa diperbaiki produk manapun. Di Indonesia dengan UV index rata-rata 8–10, sunscreen adalah keharusan.",
    how_it_works:
      "Ada dua jenis: Chemical sunscreen (menyerap UV dan mengubahnya jadi panas) dan Mineral sunscreen (Zinc Oxide/Titanium Dioxide — memantulkan UV). Perlindungan SPF mengukur perlindungan dari UVB (penyebab sunburn), sedangkan PA+++ mengukur perlindungan dari UVA (penuaan dini).",
    good_for: [
      "SEMUA orang, setiap hari — hujan atau cerah",
      "Mencegah penuaan dini (photoaging)",
      "Mencegah hiperpigmentasi memburuk",
      "Melindungi dari kanker kulit",
      "Memaksimalkan efektivitas semua skincare lain",
    ],
    avoid_if: [],
    recommended_concentration: "SPF 50+ PA+++ minimum untuk Indonesia",
    how_to_use:
      "LANGKAH TERAKHIR pagi hari, setelah semua skincare, 15–20 menit sebelum keluar rumah. Jumlah: 2 ruas jari untuk wajah dan leher (sekitar 1/4 sendok teh). Reapply setiap 2 jam jika di luar ruangan, segera setelah berenang atau berkeringat.",
    frequency: "SETIAP PAGI tanpa kecuali, bahkan di dalam ruangan (karena UVA menembus kaca)",
    works_well_with: ["SEMUA produk skincare", "Khususnya Vitamin C (duo perlindungan terbaik)"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Mulai Rp 25.000 (Emina) hingga Rp 200.000+",
    popular_products: [
      "Azarine Hydrasoothe Sunscreen SPF 45 (±Rp 35k — terbaik budget)",
      "Make Over Powerstay Photoprotection SPF 50+ (±Rp 55k)",
      "Wardah UV Shield SPF 50 (±Rp 50k)",
      "Skin1004 Madagascar Centella Sun Serum SPF 50+ (±Rp 95k reseller)",
      "Skintific Aqua Air Sunscreen SPF 50 (±Rp 65k)",
    ],
    myths: [
      {
        myth: "Kalau kulit gelap, tidak perlu sunscreen",
        fact: "Kulit lebih gelap memang punya lebih banyak melanin yang melindungi dari sunburn, tapi TIDAK terlindungi dari kerusakan UV, penuaan dini, dan kanker kulit. Semua warna kulit butuh sunscreen.",
      },
      {
        myth: "Kalau cuaca mendung atau di dalam ruangan, tidak perlu sunscreen",
        fact: "UVA (penyebab penuaan) menembus awan dan kaca. Di dalam ruangan pun, jika ada jendela, kamu terpapar UVA. Pakai setiap hari tanpa kecuali.",
      },
      {
        myth: "Foundation/BB cream dengan SPF sudah cukup",
        fact: "Untuk proteksi SPF yang efektif, kamu butuh 1/4 sendok teh produk untuk wajah. Tidak ada yang memakai makeup sebanyak itu. SPF dalam makeup hanya bonus, bukan pengganti sunscreen.",
      },
    ],
  },

  {
    id: "glycerin",
    name: "Glycerin",
    aliases: ["Gliserin", "Glycerol"],
    category: "moisturizer",
    emoji: "🫧",
    color: "blue",
    tagline: "Humektan paling terjangkau dan efektif",
    description:
      "Glycerin adalah humektan yang ada di hampir semua produk skincare dan sangat murah. Kemampuannya menarik dan mempertahankan air menjadikannya salah satu bahan terpenting dalam moisturizer. Cocok untuk semua tipe kulit, termasuk kulit sensitif bayi.",
    how_it_works: "Glycerin menarik molekul air dari udara dan lapisan kulit lebih dalam ke permukaan kulit, mempertahankan kelembapan.",
    good_for: ["Semua tipe kulit", "Kulit kering dan dehidrasi", "Kulit sensitif", "Kulit berminyak (humektan ringan)"],
    avoid_if: [],
    how_to_use: "Biasanya sudah ada dalam formulasi produk, tidak perlu dipakai tersendiri.",
    frequency: "Pagi dan malam",
    works_well_with: ["Semua bahan"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Glycerin murni Rp 10.000–30.000 per botol besar",
    popular_products: [
      "Vaseline Intensive Care (mengandung Glycerin)",
      "Cetaphil Moisturizing Lotion",
      "Hada Labo Gokujyun",
    ],
    myths: [],
  },

  {
    id: "benzoyl-peroxide",
    name: "Benzoyl Peroxide",
    aliases: ["BP", "BPO", "Benzoil Peroksida"],
    category: "treatment",
    emoji: "💊",
    color: "red",
    tagline: "Pembunuh bakteri jerawat tercepat dan paling efektif",
    description:
      "Benzoyl Peroxide adalah bahan anti-jerawat paling efektif yang tersedia OTC. Ia membunuh bakteri P. acnes langsung, menghentikan jerawat aktif lebih cepat dari bahan lain. Tapi ia juga cukup keras dan bisa mengiritasi kulit sensitif.",
    how_it_works:
      "BPO melepaskan oksigen yang bersifat toksik bagi bakteri P. acnes (yang tidak bisa hidup dalam lingkungan oksigen tinggi). Tidak seperti antibiotik, bakteri tidak bisa resisten terhadap BPO.",
    good_for: ["Jerawat aktif (terutama yang meradang)", "Komedo yang terinfeksi", "Kulit berminyak berjerawat"],
    avoid_if: [
      "Kulit sensitif atau reaktif",
      "Perlu dilakukan patch test dulu",
    ],
    recommended_concentration: "2.5–5% efektif dan lebih sedikit efek samping dari 10%",
    how_to_use: "Pakai sebagai spot treatment di malam hari. Mulai tipis. JAUHKAN dari kain/handuk karena memutihkan kain.",
    frequency: "1x sehari (malam), atau sebagai spot treatment",
    works_well_with: ["Niacinamide (menenangkan iritasi)", "Ceramide (memperbaiki barrier)"],
    conflicts_with: [
      {
        name: "Retinol",
        reason: "BPO mengoksidasi dan menonaktifkan retinol.",
      },
      {
        name: "AHA/BHA",
        reason: "Over-exfoliation dan iritasi parah.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "hati_hati",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 20.000–80.000",
    popular_products: [
      "Benzolac Gel (resep dokter, ±Rp 25k)",
      "Acnes Facial Wash (ada kandungan BPO, ±Rp 30k)",
      "Gladskin Blemish Gel (±Rp 70k)",
    ],
    myths: [
      {
        myth: "Semakin tinggi konsentrasi BPO, semakin bagus hasilnya",
        fact: "BPO 2.5% sama efektifnya dengan 10% untuk membunuh bakteri, tapi jauh lebih sedikit iritasinya. Konsentrasi tinggi tidak berarti lebih efektif.",
      },
    ],
  },

  {
    id: "aloe-vera",
    name: "Aloe Vera",
    aliases: ["Lidah Buaya", "Aloe Barbadensis"],
    category: "soothing",
    emoji: "🪴",
    color: "green",
    tagline: "Menenangkan, mendinginkan, dan melembapkan kulit meradang",
    description:
      "Aloe Vera (Lidah Buaya) adalah tanaman yang mudah ditemukan di Indonesia dan punya manfaat nyata untuk kulit yang meradang, terbakar, atau iritasi. Mengandung polysaccharide yang menenangkan dan anti-inflamasi alami.",
    how_it_works: "Polysaccharide dalam Aloe Vera membentuk lapisan pelindung di permukaan kulit yang membantu mempertahankan kelembapan. Kandungan acemannan-nya punya sifat anti-inflamasi dan mempercepat penyembuhan.",
    good_for: ["Kulit terbakar matahari (sunburn)", "Kemerahan dan iritasi", "Kulit berminyak ringan", "Setelah prosedur kulit"],
    avoid_if: ["Alergi lateks (terkadang cross-reaktif)"],
    how_to_use: "Gel murni bisa dipakai langsung setelah cleanser. Produk yang mengandung Aloe Vera biasanya moisturizer atau after-sun.",
    frequency: "Sesuai kebutuhan, bisa setiap hari",
    works_well_with: ["Semua bahan", "Centella Asiatica (duo soothing)"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Gel lidah buaya murni Rp 15.000–40.000",
    popular_products: [
      "Wardah Aloe Vera Gel (±Rp 25k)",
      "Nature Republic Aloe Vera 92% (±Rp 45k)",
      "Innisfree Aloe Vera Gel (±Rp 65k reseller)",
    ],
    myths: [
      {
        myth: "Aloe Vera dari tanaman langsung lebih bagus dari produk",
        fact: "Gel segar dari tanaman mengandung enzim aloin yang bisa mengiritasi kulit jika dipakai langsung. Produk Aloe Vera yang sudah diproses umumnya lebih aman.",
      },
    ],
  },

  {
    id: "panthenol",
    name: "Panthenol",
    aliases: ["Vitamin B5", "Pro-Vitamin B5", "Dexpanthenol"],
    category: "soothing",
    emoji: "🌸",
    color: "pink",
    tagline: "Mempercepat penyembuhan dan melembapkan dalam",
    description:
      "Panthenol (Pro-Vitamin B5) adalah bahan yang diubah kulit menjadi Pantothenic Acid — vitamin yang dibutuhkan untuk regenerasi sel kulit. Ia sangat efektif mempercepat penyembuhan, meredakan iritasi, dan melembapkan dari dalam.",
    how_it_works: "Panthenol meresap ke dalam kulit dan diubah menjadi Pantothenic Acid yang merangsang proliferasi sel kulit dan mempercepat penyembuhan luka. Sebagai humektan, ia juga menarik dan mempertahankan air.",
    good_for: ["Kulit iritasi atau kering", "Recovery setelah over-exfoliation", "Kulit sensitif", "Luka ringan dan lecet"],
    avoid_if: [],
    recommended_concentration: "1–5%",
    how_to_use: "Biasanya sudah ada dalam formulasi produk. Bisa juga dipakai sebagai serum tersendiri.",
    frequency: "Pagi dan/atau malam",
    works_well_with: ["Ceramide", "Centella Asiatica", "Hyaluronic Acid", "Semua bahan aktif"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Biasanya dalam formulasi produk. Panthenol serum ±Rp 50–120k",
    popular_products: [
      "Emina Bright Stuff Moisturizer (mengandung Panthenol)",
      "Skintific Mugwort + Panthenol (±Rp 65k)",
      "The Ordinary 100% Panthenol (±Rp 110k reseller)",
    ],
    myths: [],
  },

  {
    id: "kojic-acid",
    name: "Kojic Acid",
    aliases: ["Asam Kojat"],
    category: "brightening",
    emoji: "🌾",
    color: "amber",
    tagline: "Pencerah dari fermentasi jamur — efektif untuk melasma",
    description:
      "Kojic Acid dihasilkan dari proses fermentasi jamur (Aspergillus oryzae) dan sangat populer di skincare Asia. Ia adalah salah satu pencerah kulit paling efektif untuk melasma dan hiperpigmentasi, sering dikombinasikan dengan Alpha Arbutin atau Vitamin C.",
    how_it_works: "Kojic Acid menghambat enzim tyrosinase dan mengkelasi (mengikat) tembaga yang dibutuhkan tyrosinase untuk bekerja. Tanpa tembaga, produksi melanin terhambat.",
    good_for: ["Melasma", "Hiperpigmentasi", "Noda matahari (sun spots)", "Bekas jerawat gelap"],
    avoid_if: ["Kulit sangat sensitif (bisa mengiritasi pada konsentrasi tinggi)"],
    recommended_concentration: "0.5–2%",
    how_to_use: "Oleskan ke area bermasalah setelah cleanser. Selalu diikuti sunscreen karena menghambat produksi melanin membuat kulit lebih sensitif UV.",
    frequency: "1x sehari, mulai malam",
    works_well_with: ["Alpha Arbutin (sinergi kuat)", "Vitamin C", "Niacinamide"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 40.000–100.000",
    popular_products: [
      "Azarine Kojic Acid Brightening Serum (±Rp 50k)",
      "Implora Kojic Acid Sabun (±Rp 10k — sabun mandi, bukan untuk wajah)",
      "MS Glow Kojic Acid Series (berbagai produk)",
    ],
    myths: [],
  },

  {
    id: "squalane",
    name: "Squalane",
    aliases: ["Skualan", "Squalene (bentuk tidak stabil)"],
    category: "moisturizer",
    emoji: "✨",
    color: "amber",
    tagline: "Minyak ringan yang tidak menyumbat pori",
    description:
      "Squalane adalah minyak ringan yang hampir identik dengan sebum (minyak alami) kulit kita. Karena kemiripan ini, kulit menerimanya dengan sangat baik — tidak menyumbat pori, tidak menyebabkan jerawat, dan meresap dengan cepat. Sangat cocok bahkan untuk kulit berminyak.",
    how_it_works: "Squalane mengisi ruang di antara sel-sel lipid skin barrier, membantu mempertahankan kelembapan (TEWL control) sambil membuat kulit terasa lembut. Karena strukturnya mirip sebum, sangat tidak comedogenic.",
    good_for: ["Semua tipe kulit termasuk berminyak", "Kulit kering dan sensitif", "Sebagai carrier oil untuk bahan aktif"],
    avoid_if: [],
    how_to_use: "Pakai sebagai langkah terakhir (seal/lock in moisture) atau dicampur dengan moisturizer. Bisa pagi dan malam.",
    frequency: "Pagi dan/atau malam",
    works_well_with: ["Retinol (membantu toleransi)", "Ceramide", "Semua bahan aktif"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 80.000–200.000",
    popular_products: [
      "The Ordinary 100% Plant-Derived Squalane (±Rp 180k reseller)",
      "Biossance Squalane + Vitamin C Rose Oil (import)",
      "Somethinc Squalane Moisturizer (±Rp 80k)",
    ],
    myths: [
      {
        myth: "Minyak/oil pasti menyebabkan jerawat",
        fact: "Ini mitos. Squalane adalah salah satu oil paling non-comedogenic yang ada. Bahkan beberapa oil bisa membantu mengatur produksi sebum.",
      },
    ],
  },

  {
    id: "lactic-acid",
    name: "Lactic Acid",
    aliases: ["AHA", "Asam Laktat", "Alpha Hydroxy Acid"],
    category: "treatment",
    emoji: "🥛",
    color: "cream",
    tagline: "AHA paling gentle — exfoliant + pelembap sekaligus",
    description:
      "Lactic Acid adalah AHA yang lebih besar molekulnya dari Glycolic Acid, sehingga penetrasinya lebih lambat dan efek sampingnya lebih ringan. Uniknya, ia juga berfungsi sebagai humektan — mengeksfoliasi sekaligus melembapkan. Pilihan terbaik untuk pemula exfoliant.",
    how_it_works: "Seperti AHA lain, Lactic Acid meluruhkan sel kulit mati di permukaan. Karena molekulnya lebih besar dari Glycolic Acid, ia tidak meresap terlalu dalam — efeknya lebih gentle tapi tetap efektif untuk meratakan tekstur dan mencerahkan kulit.",
    good_for: ["Pemula yang baru coba exfoliant", "Kulit sensitif yang tidak toleran Glycolic", "Kulit kering yang butuh eksfoliasi", "Hiperpigmentasi ringan"],
    avoid_if: ["Kulit sangat sensitif (meski lebih gentle dari Glycolic)"],
    recommended_concentration: "5–12% untuk daily use",
    how_to_use: "Malam hari setelah cleanser. Seperti AHA lain, WAJIB diikuti sunscreen keesokan paginya.",
    frequency: "2–4x/minggu, bisa setiap malam setelah toleransi terbentuk",
    works_well_with: ["Hyaluronic Acid", "Ceramide", "Niacinamide (beda waktu)"],
    conflicts_with: [
      {
        name: "Retinol",
        reason: "Over-exfoliation. Pakai di hari berbeda.",
      },
      {
        name: "BHA (Salicylic Acid)",
        reason: "Dua exfoliant di waktu sama merusak barrier.",
      },
    ],
    evidence_level: "kuat",
    safety_rating: "aman",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 40.000–150.000",
    popular_products: [
      "The Ordinary Lactic Acid 5% + HA (±Rp 130k reseller)",
      "Somethinc AHA-BHA-PHA (ada Lactic Acid, ±Rp 80k)",
      "Azarine AHA Toner (±Rp 45k)",
    ],
    myths: [],
  },

  {
    id: "vitamin-e",
    name: "Vitamin E",
    aliases: ["Tocopherol", "Tocotrienol"],
    category: "antioxidant",
    emoji: "🛡️",
    color: "amber",
    tagline: "Antioksidan pelindung yang memperkuat Vitamin C",
    description:
      "Vitamin E (Tocopherol) adalah antioksidan larut-lemak yang melindungi sel kulit dari kerusakan oksidatif. Ia bekerja terutama di lapisan lipid kulit, dan efektivitasnya berlipat ganda ketika dikombinasikan dengan Vitamin C.",
    how_it_works: "Vitamin E mengintersep radikal bebas di lapisan lemak kulit sebelum merusak sel. Setelah bekerja, Vitamin C 'meregenerasi' Vitamin E agar bisa bekerja kembali — inilah mengapa kombinasi keduanya sangat powerful.",
    good_for: ["Semua tipe kulit", "Perlindungan dari UV (bukan pengganti sunscreen)", "Kulit kering dan rusak"],
    avoid_if: ["Kulit sangat berminyak (rasa berminyak di produk murni)"],
    how_to_use: "Biasanya sudah dalam formulasi produk. Minyak Vitamin E murni bisa dipakai malam hari.",
    frequency: "Pagi dan/atau malam",
    works_well_with: ["Vitamin C (SANGAT dianjurkan)", "Ferulic Acid", "Sunscreen"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Kapsul Vitamin E tokoferol Rp 15.000–50.000",
    popular_products: [
      "Natur-E Vitamin E Oil (±Rp 30k)",
      "The Ordinary Vitamin C Suspension (mengandung Vitamin E)",
      "Azarine Vitamin CE (±Rp 60k)",
    ],
    myths: [
      {
        myth: "Memecahkan kapsul Vitamin E suplemen dan mengoleskan isinya ke wajah sama efektifnya",
        fact: "Minyak Vitamin E dari kapsul suplemen adalah formulasi oral yang tidak dirancang untuk kulit. Konsentrasinya tidak terkontrol, teksturnya terlalu berminyak, dan bisa menyumbat pori.",
      },
    ],
  },

  {
    id: "bakuchiol",
    name: "Bakuchiol",
    aliases: ["Retinol Alami", "Bakuchiol Plant Retinol"],
    category: "treatment",
    emoji: "🌱",
    color: "green",
    tagline: "Alternatif retinol yang aman untuk ibu hamil",
    description:
      "Bakuchiol adalah ekstrak tanaman (biji Babchi) yang memiliki efek mirip retinol pada kulit — merangsang kolagen, mempercepat regenerasi sel, dan mengurangi tanda penuaan — tanpa iritasi khas retinol. Sangat populer untuk yang tidak toleran retinol atau sedang hamil.",
    how_it_works: "Bakuchiol mengaktifkan reseptor retinoid di kulit (seperti retinol), tapi lewat jalur kimia yang berbeda sehingga tidak mengiritasi. Stimulasi kolagen dan regenerasi selnya lebih lambat dari retinol, tapi efeknya nyata dalam studi klinis.",
    good_for: ["Ibu hamil dan menyusui", "Kulit sensitif yang tidak toleran retinol", "Pemula anti-aging"],
    avoid_if: [],
    how_to_use: "Bisa pagi atau malam, tidak sephotosensitif retinol. Tapi tetap pakai sunscreen.",
    frequency: "1–2x sehari",
    works_well_with: ["Hyaluronic Acid", "Ceramide", "Niacinamide", "Vitamin C"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 75.000–200.000",
    popular_products: [
      "Somethinc Bakuchiol + Retinol (±Rp 85k)",
      "NPURE Bakuchiol Serum (±Rp 70k)",
      "Skintific Bakuchiol Retinol (±Rp 80k)",
    ],
    myths: [],
  },

  {
    id: "tranexamic-acid",
    name: "Tranexamic Acid",
    aliases: ["TXA", "Asam Traneksamat"],
    category: "brightening",
    emoji: "💎",
    color: "indigo",
    tagline: "Pencerah terbaru dan paling menjanjikan untuk melasma",
    description:
      "Tranexamic Acid adalah bahan yang awalnya dipakai dalam dunia medis untuk menghentikan perdarahan, lalu ditemukan punya efek pencerah kulit yang luar biasa — terutama untuk melasma. Sekarang menjadi salah satu bahan paling dicari di skincare.",
    how_it_works: "Tranexamic Acid memblokir interaksi antara keratinosit (sel kulit) dan melanosit (sel pigmen) yang menyebabkan produksi melanin berlebih. Ia juga menghambat produksi plasmin dan prostaglandin yang terlibat dalam pigmentasi.",
    good_for: ["Melasma (sangat efektif)", "Hiperpigmentasi post-inflammatory", "Noda bekas jerawat membandel", "Sun spots"],
    avoid_if: [],
    recommended_concentration: "2–5% topikal",
    how_to_use: "Oleskan sebagai serum setelah cleanser, sebelum moisturizer. Pagi atau malam, tapi tetap pakai sunscreen.",
    frequency: "1–2x sehari",
    works_well_with: ["Niacinamide (sinergi kuat)", "Alpha Arbutin", "Kojic Acid", "Vitamin C"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 60.000–180.000",
    popular_products: [
      "Somethinc Tranexamic Acid Serum (±Rp 90k)",
      "Skintific Tranexamic Acid (±Rp 85k)",
      "NPURE Tranexamic Acid (±Rp 65k)",
    ],
    myths: [],
  },

  {
    id: "peptide",
    name: "Peptide",
    aliases: ["Polypeptide", "Signal Peptide", "Copper Peptide"],
    category: "treatment",
    emoji: "🔗",
    color: "blue",
    tagline: "Sinyal protein untuk memacu produksi kolagen alami",
    description:
      "Peptide adalah rantai pendek asam amino yang berfungsi sebagai 'sinyal' untuk sel kulit — memberi tahu fibroblast untuk memproduksi lebih banyak kolagen, elastin, dan bahan-bahan pendukung kulit lainnya. Berbeda dari retinol, Peptide tidak mengiritasi dan aman kehamilan.",
    how_it_works: "Peptide meresap ke kulit dan mengikat reseptor spesifik yang memicu produksi kolagen dan elastin. Ada berbagai jenis: signal peptide (merangsang produksi), carrier peptide (mengantarkan mineral), dan neurotransmitter-inhibiting peptide (relaxing effect).",
    good_for: ["Anti-aging", "Kulit kendur", "Garis halus dan kerutan", "Kulit sensitif yang tidak toleran retinol"],
    avoid_if: [],
    how_to_use: "Pakai setelah toner, sebelum moisturizer. Tidak ada restriksi waktu — bisa pagi dan malam.",
    frequency: "Pagi dan malam",
    works_well_with: ["Hyaluronic Acid", "Niacinamide", "Ceramide", "Vitamin C"],
    conflicts_with: [
      {
        name: "AHA/BHA",
        reason: "Exfoliant bisa memecah rantai peptide sehingga mengurangi efektivitasnya. Pakai di waktu berbeda.",
      },
    ],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 80.000–300.000",
    popular_products: [
      "The Ordinary Buffet (±Rp 250k reseller)",
      "Somethinc Peptide Serum (±Rp 110k)",
      "Skintific Peptide Anti-Aging (±Rp 90k)",
    ],
    myths: [
      {
        myth: "Collagen dalam skincare bisa diserap kulit dan mengisi kolagen yang hilang",
        fact: "Molekul kolagen terlalu besar untuk meresap kulit. Peptide bekerja BUKAN dengan mengisi kolagen dari luar, tapi dengan memicu kulit untuk memproduksi lebih banyak kolagennya sendiri.",
      },
    ],
  },

  {
    id: "beta-glucan",
    name: "Beta-Glucan",
    aliases: ["β-Glucan", "Oat Beta Glucan"],
    category: "soothing",
    emoji: "🌾",
    color: "amber",
    tagline: "Pelembap terdalam yang bahkan lebih efektif dari Hyaluronic Acid",
    description:
      "Beta-Glucan adalah polisakarida yang diekstrak dari oat atau jamur yang punya kemampuan hidrasi luar biasa — beberapa studi menunjukkan ia lebih efektif dari Hyaluronic Acid dalam mempertahankan kelembapan. Ia juga menenangkan kulit dan mendukung penyembuhan.",
    how_it_works: "Beta-Glucan bekerja sebagai humektan super: menarik air dari udara ke kulit. Ukuran molekulnya memungkinkan ia meresap lebih dalam dari HA konvensional. Ia juga mengaktifkan respon imun kulit yang mendukung penyembuhan dan repair.",
    good_for: ["Kulit sangat kering", "Kulit sensitif dan reaktif", "Setelah prosedur kulit", "Kulit yang butuh hidrasi intens"],
    avoid_if: [],
    how_to_use: "Biasanya ada dalam toner, essence, atau serum hidrasi. Pakai setelah cleanser.",
    frequency: "Pagi dan malam",
    works_well_with: ["Ceramide", "Hyaluronic Acid", "Panthenol"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 50.000–150.000 (biasanya dalam formulasi)",
    popular_products: [
      "Somethinc Beta Glucan Toner (±Rp 60k)",
      "Skintific Beta Glucan Serum (±Rp 75k)",
      "Hada Labo Gokujyun Premium (ada Beta-Glucan)",
    ],
    myths: [],
  },

  {
    id: "mugwort",
    name: "Mugwort",
    aliases: ["Artemisia", "Ssuk", "Artemisia Vulgaris"],
    category: "soothing",
    emoji: "🌿",
    color: "green",
    tagline: "Herbal Korea yang viral — menenangkan jerawat dan kulit sensitif",
    description:
      "Mugwort (Artemisia) adalah tanaman herbal Asia Timur yang sangat populer dalam skincare Korea. Mengandung flavonoid, vitamin, dan mineral yang menenangkan kulit berjerawat, memperkuat skin barrier, dan memiliki sifat anti-inflamasi yang kuat.",
    how_it_works: "Artemisinin dan flavonoid dalam Mugwort memiliki sifat anti-inflamasi dan antimikroba. Mereka membantu menenangkan kemerahan, mengurangi pembengkakan jerawat, dan menenangkan kulit yang terekspos polusi.",
    good_for: ["Kulit berjerawat dan berminyak", "Kemerahan dan inflamasi", "Kulit sensitif terhadap lingkungan", "Skin barrier yang lemah"],
    avoid_if: ["Alergi terhadap tanaman Asteraceae (ragweed, krisan)"],
    how_to_use: "Biasanya ada dalam toner atau serum. Cocok untuk dipakai di kedua waktu (pagi/malam).",
    frequency: "Sesuai produk",
    works_well_with: ["Centella Asiatica (duo soothing Korea)", "Niacinamide", "BHA"],
    conflicts_with: [],
    evidence_level: "terbatas",
    safety_rating: "aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 55.000–150.000",
    popular_products: [
      "COSRX Centella + Mugwort Toner (±Rp 120k reseller)",
      "Skintific Mugwort + Niacinamide (±Rp 75k)",
      "I'm From Mugwort Mask (±Rp 200k reseller)",
    ],
    myths: [],
  },

  {
    id: "ferulic-acid",
    name: "Ferulic Acid",
    aliases: ["Asam Ferulat"],
    category: "antioxidant",
    emoji: "⚡",
    color: "amber",
    tagline: "Penstabil ajaib yang melipatgandakan efek Vitamin C",
    description:
      "Ferulic Acid adalah antioksidan dari tanaman (beras, gandum, kopi) yang paling dikenal karena kemampuannya menstabilkan Vitamin C dan melipatgandakan efektivitasnya. Sebuah studi ikonik membuktikan Ferulic Acid + Vitamin C + Vitamin E memberikan perlindungan UV 8x lebih baik.",
    how_it_works: "Ferulic Acid menurunkan pH produk Vitamin C ke level optimal sekaligus mengkelasi ion logam yang mempercepat oksidasi. Efek sinergisnya dengan Vitamin C dan Vitamin E membuat trio ini jadi standar emas antioksidan skincare.",
    good_for: ["Meningkatkan efek Vitamin C yang sudah dipakai", "Perlindungan dari radikal bebas", "Anti-aging preventif"],
    avoid_if: [],
    recommended_concentration: "0.5–1%",
    how_to_use: "Jarang dipakai sendiri — biasanya sudah dalam formulasi produk Vitamin C yang bagus. Pakai pagi hari.",
    frequency: "Setiap pagi (bersama Vitamin C)",
    works_well_with: ["Vitamin C (WAJIB)", "Vitamin E", "Sunscreen"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Biasanya dalam formulasi — produk C+E+Ferulic Rp 150–400k",
    popular_products: [
      "The Ordinary Ascorbyl Glucoside Solution (Ferulic Acid formulasi)",
      "SkinCeuticals C E Ferulic (premium, ±Rp 1,8jt)",
      "Azarine Vitamin CE Serum (ada Ferulic, ±Rp 60k)",
    ],
    myths: [],
  },

  {
    id: "pha",
    name: "PHA (Polyhydroxy Acid)",
    aliases: ["Polyhydroxy Acid", "Gluconolactone", "Lactobionic Acid"],
    category: "treatment",
    emoji: "💧",
    color: "blue",
    tagline: "Exfoliant paling gentle — AHA untuk kulit sensitif",
    description:
      "PHA adalah generasi ketiga chemical exfoliant setelah AHA dan BHA. Molekulnya lebih besar dari AHA sehingga meresap lebih lambat dan lebih gentle. Selain mengeksfoliasi, PHA juga berfungsi sebagai humektan. Satu-satunya exfoliant yang benar-benar cocok untuk kulit sensitif.",
    how_it_works: "PHA meluruhkan sel kulit mati di permukaan seperti AHA, tapi karena ukuran molekulnya besar, penetrasinya sangat superfisial. Hasilnya lebih lambat dari AHA tapi tidak mengiritasi sama sekali. Juga menarik air sebagai humektan.",
    good_for: ["Kulit sensitif yang gagal toleransi AHA/BHA", "Pemula exfoliant", "Kulit kering yang butuh eksfoliasi ringan"],
    avoid_if: [],
    recommended_concentration: "5–15%",
    how_to_use: "Malam hari. Lebih aman dari AHA untuk photosensitivity, tapi tetap pakai sunscreen.",
    frequency: "Bisa setiap malam (jauh lebih gentle dari AHA/BHA)",
    works_well_with: ["Ceramide", "Hyaluronic Acid", "Niacinamide"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "aman",
    pregnancy_safe: true,
    price_in_indonesia: "Rp 60.000–180.000",
    popular_products: [
      "Somethinc AHA-BHA-PHA (±Rp 80k)",
      "Paula's Choice Resist AHA Smoothing Serum (import)",
      "Acwell No. 62 (ada PHA, reseller)",
    ],
    myths: [],
  },

  {
    id: "zinc",
    name: "Zinc (Seng)",
    aliases: ["Zinc Oxide", "Zinc Sulfate", "Zinc PCA"],
    category: "treatment",
    emoji: "🔬",
    color: "blue",
    tagline: "Mineral anti-inflamasi — kontrol minyak dan redakan jerawat",
    description:
      "Zinc dalam bentuk berbeda punya peran berbeda di skincare: Zinc Oxide sebagai filter UV mineral fisik, Zinc PCA untuk kontrol sebum, dan Zinc Sulfate sebagai anti-inflamasi untuk jerawat. Mineral esensial yang defisiensinya bisa memperburuk kondisi kulit.",
    how_it_works: "Zinc menghambat 5-alpha reductase (enzim yang mengubah testosteron menjadi DHT, pemicu produksi sebum berlebih). Juga anti-inflamasi dan mendukung penyembuhan luka. Zinc Oxide memantulkan/menyebarkan sinar UV secara fisik.",
    good_for: ["Kulit berminyak dan berjerawat", "Sebagai filter UV mineral", "Kemerahan dan inflamasi"],
    avoid_if: [],
    how_to_use: "Tergantung bentuk: Zinc Oxide dalam sunscreen, Zinc PCA dalam serum minyak, suplemen Zinc untuk dari dalam.",
    frequency: "Sesuai produk",
    works_well_with: ["Niacinamide", "BHA", "Centella Asiatica"],
    conflicts_with: [],
    evidence_level: "kuat",
    safety_rating: "sangat_aman",
    pregnancy_safe: true,
    price_in_indonesia: "Tergantung bentuk produk Rp 20.000–150.000",
    popular_products: [
      "Wardah UV Shield (Zinc Oxide sunscreen, ±Rp 50k)",
      "Azarine Zinc Pore Serum (Zinc PCA, ±Rp 45k)",
      "Somethinc Zinc Serum (±Rp 65k)",
    ],
    myths: [],
  },

  {
    id: "tea-tree",
    name: "Tea Tree Oil",
    aliases: ["Minyak Pohon Teh", "Melaleuca Alternifolia"],
    category: "treatment",
    emoji: "🍃",
    color: "green",
    tagline: "Antibakteri alami — spot treatment herbal yang terbukti",
    description:
      "Tea Tree Oil adalah minyak esensial dari pohon Melaleuca alternifolia asal Australia yang punya sifat antibakteri dan antifungal yang signifikan. Sering dipakai sebagai spot treatment jerawat alami. HARUS diencerkan sebelum dipakai langsung ke kulit.",
    how_it_works: "Terpinen-4-ol (komponen utama Tea Tree Oil) merusak membran sel bakteri termasuk P. acnes. Pada konsentrasi 5%, efektivitasnya untuk jerawat setara dengan Benzoyl Peroxide 5% tapi dengan iritasi lebih rendah dalam beberapa studi.",
    good_for: ["Jerawat aktif sebagai spot treatment", "Infeksi jamur ringan", "Ketombe"],
    avoid_if: ["Kulit sangat sensitif", "JANGAN pakai tidak diencerkan (bisa membakar kulit)"],
    recommended_concentration: "5% atau encerkan 1-2 tetes dalam carrier oil",
    how_to_use: "Spot treatment malam hari. Encerkan dalam carrier oil (misal, squalane) jika pakai Tea Tree murni. Jangan dipakai ke seluruh wajah.",
    frequency: "1x malam hari sebagai spot treatment",
    works_well_with: ["Niacinamide (menenangkan)", "Aloe Vera"],
    conflicts_with: [],
    evidence_level: "sedang",
    safety_rating: "hati_hati",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 30.000–100.000",
    popular_products: [
      "The Body Shop Tea Tree Oil (±Rp 60–150k reseller)",
      "Acnes Tea Tree Spot Gel (±Rp 35k)",
      "Skintific Tea Tree + Niacinamide (±Rp 65k)",
    ],
    myths: [
      {
        myth: "Tea Tree Oil boleh dipakai langsung ke wajah karena 'natural'",
        fact: "Natural tidak berarti aman dalam konsentrasi penuh. Tea Tree Oil murni HARUS diencerkan — konsentrasi tidak terkontrol bisa menyebabkan luka bakar kimia pada kulit.",
      },
    ],
  },

  {
    id: "neem",
    name: "Neem Oil",
    aliases: ["Minyak Mimba", "Azadirachta Indica"],
    category: "treatment",
    emoji: "🌳",
    color: "green",
    tagline: "Minyak anti-jerawat dan antijamur yang kuat dari pohon nimba",
    description:
      "Neem Oil dari pohon Azadirachta Indica adalah bahan herbal yang sudah dipakai ribuan tahun dalam pengobatan Ayurveda. Kaya akan asam lemak, antioksidan, dan senyawa aktif yang punya sifat antibakteri, antifungal, dan anti-inflamasi kuat.",
    how_it_works: "Azadirachtin dan nimbin dalam Neem Oil mengganggu siklus hidup bakteri dan jamur. Asam lemaknya (oleat, linoleat) juga membantu melembapkan dan memperkuat skin barrier. Kandungan antioksidannya melindungi dari kerusakan radikal bebas.",
    good_for: ["Jerawat hormonal membandel", "Kulit berminyak berjerawat", "Ketombe", "Infeksi jamur kulit ringan"],
    avoid_if: ["Kulit sensitif (bau kuat bisa mengganggu)", "HARUS diencerkan"],
    how_to_use: "Encerkan 1-2% dalam carrier oil atau moisturizer. Jangan pakai murni. Cocok sebagai spot treatment atau masker campuran.",
    frequency: "2-3x seminggu",
    works_well_with: ["Tea Tree (tapi hati-hati, dua bahan keras)", "Aloe Vera", "Squalane (carrier)"],
    conflicts_with: [],
    evidence_level: "terbatas",
    safety_rating: "hati_hati",
    pregnancy_safe: false,
    price_in_indonesia: "Rp 40.000–120.000",
    popular_products: [
      "Neem Oil murni organik (±Rp 50–80k di Tokopedia)",
      "Himalaya Neem Face Wash (±Rp 30k)",
      "Hara Naturals Neem Spot Serum (±Rp 65k)",
    ],
    myths: [
      {
        myth: "Semakin banyak Neem Oil yang dipakai, semakin efektif untuk jerawat",
        fact: "Neem Oil harus diencerkan dan konsentrasi tinggi justru bisa mengiritasi. Konsistensi dalam konsentrasi rendah lebih baik dari pemakaian berlebihan.",
      },
    ],
  },
];

export function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

export function getIngredientsByCategory(category: IngredientCategory): Ingredient[] {
  return INGREDIENTS.filter((i) => i.category === category);
}

export function searchIngredients(query: string): Ingredient[] {
  const q = query.toLowerCase();
  return INGREDIENTS.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.aliases.some((a) => a.toLowerCase().includes(q)) ||
      i.tagline.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
  );
}

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  treatment: "Aktif & Treatment",
  sunscreen: "Sun Protection",
  moisturizer: "Pelembap & Hidrasi",
  brightening: "Pencerah",
  soothing: "Soothing & Repair",
  antioxidant: "Antioksidan",
};

export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  kuat: "Bukti Kuat",
  sedang: "Bukti Sedang",
  terbatas: "Bukti Terbatas",
};

export const SAFETY_LABELS: Record<SafetyRating, string> = {
  sangat_aman: "Sangat Aman",
  aman: "Aman",
  hati_hati: "Perlu Hati-hati",
};
