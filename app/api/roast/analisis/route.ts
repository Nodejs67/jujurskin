// ── POST /api/roast/analisis
//
// Mesin roast jalan di SERVER, bukan di browser. Dua alasan:
//   1. lib/products.ts ~295KB. ~90% pengguna JujurSkin buka via HP — kami tidak akan
//      mengirim katalog produk penuh ke paket data mereka hanya untuk menghitung skor.
//   2. Rate limit hanya bisa ditegakkan di server.
//
// KAMI TIDAK MENYIMPAN APA PUN. Daftar produk + harga seseorang adalah profil
// perilaku (apa yang dia punya, berapa yang dia belanjakan). Tidak ada tabel, tidak ada
// log isi. Fitur ini tidak butuh data itu untuk bekerja, jadi kami tidak mengambilnya.

import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { clipStr, intInRange, readJsonLimited } from "@/lib/validate";
import { analyzeRoast } from "@/lib/roast/engine";
import type { RoastProductInput } from "@/lib/roast/types";

const MAX_PRODUCTS = 15;

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, { bucket: "roast", limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonLimited(req)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const rawProducts = Array.isArray(body.products) ? body.products : [];
  const products: RoastProductInput[] = rawProducts
    .slice(0, MAX_PRODUCTS)
    .map((item): RoastProductInput | null => {
      const row = (item ?? {}) as Record<string, unknown>;
      const name = clipStr(row.name, 120);
      if (!name) return null;
      // Harga 0 dianggap "tidak diisi" — kami tidak mengarang penghematan dari nol.
      const price = intInRange(row.price, 1, 50_000_000);
      return { name, price: price ?? undefined };
    })
    .filter((p): p is RoastProductInput => p !== null);

  if (products.length === 0) {
    return NextResponse.json({ error: "Isi minimal satu produk dulu ya." }, { status: 400 });
  }

  const skinType = clipStr(body.skinType, 40) ?? undefined;
  const concerns = Array.isArray(body.concerns)
    ? body.concerns.map((c) => clipStr(c, 40)).filter((c): c is string => Boolean(c)).slice(0, 6)
    : undefined;

  const result = analyzeRoast({ skinType, concerns, products });

  return NextResponse.json(result, {
    // Hasil dihitung dari isi request, bukan sumber daya bersama — jangan pernah di-cache.
    headers: { "Cache-Control": "no-store" },
  });
}
