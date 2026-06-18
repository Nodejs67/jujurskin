// Kamus istilah skincare ala Indonesia — bahasa sehari-hari + istilah yang sering bikin bingung.
export type Istilah = {
  term: string;
  kategori: "Gejala/Kondisi" | "Bahan" | "Teknik" | "Istilah Umum";
  arti: string;
  lihat?: string; // istilah terkait
};

export const KAMUS: Istilah[] = [
  { term: "Bruntusan", kategori: "Gejala/Kondisi", arti: "Bintik-bintik kecil kasar di permukaan kulit (sering di dahi/pipi) tanpa nanah. Bisa karena penyumbatan, iritasi, fungal acne, atau produk yang tidak cocok." },
  { term: "Beruntusan", kategori: "Gejala/Kondisi", arti: "Sebutan lain untuk bruntusan — tekstur kulit yang tidak rata oleh bintik-bintik halus.", lihat: "Bruntusan" },
  { term: "Purging", kategori: "Gejala/Kondisi", arti: "Jerawat 'mendadak muncul' di awal pemakaian bahan yang mempercepat pergantian sel (retinoid, AHA/BHA). Muncul di area yang biasa berjerawat, dan membaik dalam 4–6 minggu.", lihat: "Breakout" },
  { term: "Breakout", kategori: "Gejala/Kondisi", arti: "Jerawat yang muncul karena produk TIDAK cocok / menyumbat. Beda dari purging: sering di area baru, tidak membaik, malah makin parah → hentikan produknya.", lihat: "Purging" },
  { term: "Fungal Acne", kategori: "Gejala/Kondisi", arti: "Bukan jerawat sungguhan, tapi pertumbuhan jamur Malassezia (Malassezia folliculitis). Bintik seragam, gatal, sering di dahi/punggung. Tidak mempan obat jerawat biasa — butuh antijamur." },
  { term: "Jerawat Batu", kategori: "Gejala/Kondisi", arti: "Jerawat besar, keras, nyeri, jauh di dalam kulit (kistik/nodul). Sebaiknya ke dokter — memencet bisa bikin bekas permanen.", lihat: "Bopeng" },
  { term: "Komedo", kategori: "Gejala/Kondisi", arti: "Pori tersumbat. Komedo hitam (blackhead) = terbuka & teroksidasi; komedo putih (whitehead) = tertutup." },
  { term: "PIH", kategori: "Gejala/Kondisi", arti: "Post-Inflammatory Hyperpigmentation — noda gelap/cokelat bekas jerawat. Memudar perlahan; sunscreen + bahan pencerah membantu." },
  { term: "PIE", kategori: "Gejala/Kondisi", arti: "Post-Inflammatory Erythema — bekas jerawat kemerahan/pink (bukan cokelat). Umum di kulit lebih terang; butuh waktu & perlindungan barrier." },
  { term: "Bopeng", kategori: "Gejala/Kondisi", arti: "Bekas jerawat berupa lubang/cekungan (atrophic scar). Tidak hilang dengan skincare biasa — butuh tindakan dokter (mis. subcision, laser, microneedling).", lihat: "Jerawat Batu" },
  { term: "Skin Barrier", kategori: "Istilah Umum", arti: "Lapisan terluar kulit yang melindungi dari iritasi & menjaga kelembapan. Kalau rusak: kulit perih, merah, kering, mudah iritasi. Diperbaiki dengan menyederhanakan rutinitas + pelembap." },
  { term: "Purge vs Breakout", kategori: "Istilah Umum", arti: "Cara membedakan: purging = di area langganan jerawat & membaik; breakout = di area baru & memburuk.", lihat: "Purging" },
  { term: "Niacinamide", kategori: "Bahan", arti: "Vitamin B3. Serbaguna: kontrol minyak, samarkan noda, kuatkan barrier, redakan kemerahan. Lembut, cocok pemula." },
  { term: "Ceramide", kategori: "Bahan", arti: "Lemak alami kulit yang menyusun skin barrier. Bahan pelembap penting untuk kulit kering/sensitif/barrier rusak." },
  { term: "Centella / Cica", kategori: "Bahan", arti: "Centella asiatica (daun pegagan). Menenangkan kemerahan & iritasi, bantu pemulihan barrier. Populer untuk kulit sensitif/berjerawat." },
  { term: "Retinoid / Retinol", kategori: "Bahan", arti: "Turunan vitamin A. Ampuh untuk jerawat, tekstur, penuaan. Mulai pelan (seminggu 2x), bisa bikin purging & kering. Wajib sunscreen, hindari saat hamil." },
  { term: "AHA / BHA / PHA", kategori: "Bahan", arti: "Exfoliant kimia. AHA (mis. glycolic, lactic) kerja di permukaan untuk kusam/noda; BHA (salicylic) masuk pori untuk jerawat/komedo; PHA paling lembut untuk kulit sensitif." },
  { term: "Hyaluronic Acid", kategori: "Bahan", arti: "Humektan pengikat air — bikin kulit terhidrasi & 'plump'. Pakai di kulit lembap lalu kunci dengan pelembap, terutama di ruangan ber-AC." },
  { term: "Sunscreen Chemical vs Mineral", kategori: "Bahan", arti: "Chemical (kimia) menyerap UV, umumnya bening; mineral (zinc/titanium) memantul UV, bisa whitecast. Lihat fitur Sunscreen No-Whitecast.", lihat: "Whitecast" },
  { term: "Double Cleansing", kategori: "Teknik", arti: "Cuci 2 langkah: pembersih berbasis minyak (luruhkan sunscreen/makeup) lalu pembersih berbasis air. Untuk yang pakai sunscreen/makeup tebal — tidak wajib tiap orang." },
  { term: "Slugging", kategori: "Teknik", arti: "Mengunci kelembapan dengan lapisan oklusif (mis. petroleum jelly) di langkah terakhir malam. Untuk kulit kering/barrier rusak; hati-hati di kulit berminyak/berjerawat & cuaca lembap." },
  { term: "Layering", kategori: "Teknik", arti: "Menyusun produk dari paling cair ke paling kental. Beri jeda bila perlu agar tiap produk menyerap." },
  { term: "Patch Test", kategori: "Teknik", arti: "Tes produk baru di area kecil (mis. rahang/belakang telinga) beberapa hari sebelum dipakai ke seluruh wajah — cegah reaksi." },
  { term: "Whitecast", kategori: "Istilah Umum", arti: "Lapisan putih/abu-abu yang ditinggalkan sebagian sunscreen, paling terlihat di kulit sawo matang/gelap. Lihat fitur Sunscreen No-Whitecast." },
  { term: "Glass Skin", kategori: "Istilah Umum", arti: "Tren kulit tampak bening-mulus seperti kaca. Indah sebagai estetika, tapi bukan standar kesehatan kulit — kulit sehat tak harus 'glass'." },
  { term: "Glowing", kategori: "Istilah Umum", arti: "Kulit tampak sehat & 'bercahaya'. Datang dari kulit terhidrasi & barrier sehat — bukan harus dari banyak produk mahal." },
  { term: "Non-comedogenic", kategori: "Istilah Umum", arti: "Diformulasikan agar tidak menyumbat pori. Klaim ini membantu, tapi tidak ada jaminan 100% — reaksi tiap kulit berbeda." },
  { term: "Tone Up", kategori: "Istilah Umum", arti: "Produk yang membuat kulit tampak lebih cerah seketika (sering dari pigmen putih). Bersifat sementara di permukaan — bukan benar-benar memutihkan kulit." },
];
