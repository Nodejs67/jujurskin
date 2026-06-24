import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { enforceRateLimit } from "@/lib/rate-limit";
import { clipStr, intInRange, readJsonLimited } from "@/lib/validate";
import { PRODUCTS } from "@/lib/products";

// Set id produk yang sah — POST review hanya boleh untuk produk yang BENAR ada,
// supaya DB tidak bisa dipoles ulasan palsu untuk id sembarang/ngarang.
const VALID_PRODUCT_IDS = new Set(PRODUCTS.map((p) => p.id));

// Service-role HANYA untuk menulis review (server-side). RLS product_reviews:
// anon boleh SELECT (review publik) tapi TIDAK boleh INSERT langsung — semua
// tulisan harus lewat route ini (tervalidasi + rate-limited).
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Rate limit baca: cegah scraping massal (enumerasi product_id).
  const limited = await enforceRateLimit(request, { bucket: "reviews-get", limit: 40, windowMs: 60_000 });
  if (limited) return limited;

  const product_id = clipStr(request.nextUrl.searchParams.get("product_id"), 120);
  if (!product_id) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  // Pakai service role + filter per-produk. Tabel product_reviews dikunci RLS
  // (anon tak bisa SELECT langsung) sehingga tak bisa di-dump massal via anon key.
  const service = getServiceSupabase();
  if (!service) return NextResponse.json({ reviews: [] });

  const { data, error } = await service
    .from("product_reviews")
    .select("id, product_id, rating, komentar, nama, skin_type, created_at")
    .eq("product_id", product_id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ reviews: [] });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(request: NextRequest) {
  // Rate limit: maksimal 4 review / menit / IP (cegah spam ulasan).
  const limited = await enforceRateLimit(request, { bucket: "reviews", limit: 4, windowMs: 60_000 });
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonLimited(request)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const product_id = clipStr(body.product_id, 120);
  const rating = intInRange(body.rating, 1, 5);
  if (!product_id || rating === null) {
    return NextResponse.json({ error: "product_id valid & rating 1–5 wajib" }, { status: 400 });
  }
  if (!VALID_PRODUCT_IDS.has(product_id)) {
    return NextResponse.json({ error: "Produk tidak dikenali" }, { status: 400 });
  }

  const service = getServiceSupabase();
  if (!service) return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });

  const { data, error } = await service
    .from("product_reviews")
    .insert({
      product_id,
      rating,
      komentar: clipStr(body.komentar, 1500),
      nama: clipStr(body.nama, 60) ?? "Pengguna Anonim",
      skin_type: clipStr(body.skin_type, 40),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan review" }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}
