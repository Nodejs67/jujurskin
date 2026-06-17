export interface ClaimRule {
  id: string;
  patterns: string[];
  title: string;
  truth: string;
  severity: "tinggi" | "sedang";
}

export interface ClaimFinding {
  id: string;
  matched: string;
  title: string;
  truth: string;
  severity: "tinggi" | "sedang";
}

export interface ClaimResult {
  findings: ClaimFinding[];
  verdict: string;
  verdictLevel: "bahaya" | "skeptis" | "wajar";
}

const RULES: ClaimRule[] = [
  {
    id: "cepat",
    patterns: ["dalam 3 hari", "3 hari", "7 hari", "dalam seminggu", "semalam", "instan", "seketika", "dalam hitungan hari", "langsung putih", "langsung glowing", "cepat memutih"],
    title: "Klaim hasil super cepat",
    truth: "Regenerasi kulit butuh ±28 hari, dan perubahan nyata umumnya 4–12 minggu. Klaim hasil dalam hitungan hari hampir selalu berlebihan — atau memakai bahan keras/ilegal yang merusak kulit jangka panjang.",
    severity: "tinggi",
  },
  {
    id: "memutihkan",
    patterns: ["memutihkan", "pemutih", "whitening", "putih dalam", "kulit putih", "glowing instan", "mancur putih", "bleaching"],
    title: "Fokus pada 'memutihkan'",
    truth: "Warna kulit ditentukan genetik — sehat ≠ putih. Produk yang menjanjikan kulit 'putih' cepat berisiko mengandung merkuri/hidrokuinon ilegal yang berbahaya. Fokuslah pada kulit sehat & merata.",
    severity: "tinggi",
  },
  {
    id: "absolut",
    patterns: ["100%", "pasti", "dijamin", "permanen", "selamanya", "menghilangkan total", "sembuh total", "bebas jerawat selamanya", "garansi hasil"],
    title: "Klaim absolut / jaminan hasil",
    truth: "Tidak ada produk skincare yang bisa menjamin 100% atau hasil permanen. Kulit dinamis dan respons tiap orang berbeda. Klaim 'dijamin/pasti' adalah tanda marketing berlebihan.",
    severity: "tinggi",
  },
  {
    id: "alami",
    patterns: ["100% alami", "bahan alami aman", "herbal aman", "alami jadi aman", "tanpa bahan kimia", "no chemical", "bebas kimia"],
    title: "Logika 'alami = aman' (keliru)",
    truth: "Alami belum tentu aman — banyak tanaman justru iritan/alergen. Dan 'tanpa bahan kimia' mustahil (air pun bahan kimia). Keamanan ditentukan formulasi & uji, bukan label 'alami'.",
    severity: "sedang",
  },
  {
    id: "tanpa-efek",
    patterns: ["tanpa efek samping", "aman untuk semua jenis kulit", "tanpa iritasi sama sekali", "no side effect", "100% aman"],
    title: "Klaim 'tanpa efek samping'",
    truth: "Tidak ada produk aktif yang bebas risiko untuk SEMUA orang. Bahan aktif (retinol, AHA/BHA) wajar menimbulkan masa penyesuaian. Patch test tetap perlu sebelum pakai rutin.",
    severity: "sedang",
  },
  {
    id: "pori",
    patterns: ["mengecilkan pori permanen", "menghilangkan pori", "pori hilang", "pori tertutup permanen"],
    title: "Pori 'hilang permanen'",
    truth: "Ukuran pori sebagian besar genetik. Pori bisa tampak lebih kecil saat bersih/kencang, tapi tidak bisa hilang atau mengecil permanen.",
    severity: "sedang",
  },
  {
    id: "detox",
    patterns: ["detox kulit", "mengeluarkan racun", "detoks wajah", "menyerap racun"],
    title: "Klaim 'detox' kulit",
    truth: "Kulit tidak 'menyimpan racun' yang perlu di-detox — itu tugas hati & ginjal. 'Detox kulit' adalah istilah marketing, bukan mekanisme dermatologi.",
    severity: "sedang",
  },
  {
    id: "klinis",
    patterns: ["teruji klinis", "terbukti klinis", "direkomendasikan dokter", "clinically proven", "uji klinis"],
    title: "Klaim 'teruji klinis' tanpa detail",
    truth: "Tanyakan: diuji oleh siapa, berapa orang, hasilnya apa? Klaim klinis tanpa data/sumber yang bisa dicek sering hanya gimmick pemasaran.",
    severity: "sedang",
  },
];

export function analyzeClaim(text: string): ClaimResult {
  const lower = ` ${text.toLowerCase()} `;
  const findings: ClaimFinding[] = [];

  for (const rule of RULES) {
    const matched = rule.patterns.find((p) => lower.includes(p));
    if (matched) {
      findings.push({ id: rule.id, matched, title: rule.title, truth: rule.truth, severity: rule.severity });
    }
  }

  const tinggi = findings.filter((f) => f.severity === "tinggi").length;
  let verdict: string;
  let verdictLevel: ClaimResult["verdictLevel"];

  if (tinggi > 0) {
    verdict = "Hati-hati — klaim ini mengandung red flag serius. Sangat mungkin berlebihan atau menyesatkan.";
    verdictLevel = "bahaya";
  } else if (findings.length > 0) {
    verdict = "Perlu skeptis. Ada beberapa pola klaim pemasaran yang patut dipertanyakan.";
    verdictLevel = "skeptis";
  } else {
    verdict = "Tidak terdeteksi red flag umum. Tetap cek ingredient & bukti — klaim wajar belum tentu cocok untuk kulitmu.";
    verdictLevel = "wajar";
  }

  return { findings, verdict, verdictLevel };
}

export const CONTOH_KLAIM = [
  "Memutihkan kulit dalam 3 hari, dijamin 100% glowing!",
  "Serum 100% alami, tanpa efek samping, aman untuk semua jenis kulit.",
  "Menghilangkan jerawat & bekasnya secara permanen dalam seminggu.",
  "Teruji klinis, mengecilkan pori secara permanen.",
];
