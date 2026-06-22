import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { enforceRateLimit } from "@/lib/rate-limit";
import { clipStr, intInRange, toBool, readJsonLimited } from "@/lib/validate";

// Gunakan service role HANYA di server. Tabel feedback dikunci RLS (anon tak
// boleh baca/tulis langsung) — semua tulisan lewat route ini.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: maksimal 5 feedback / menit / IP.
  const limited = enforceRateLimit(req, { bucket: "feedback", limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let body: Record<string, unknown>;
    try {
      body = (await readJsonLimited(req)) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });
    }

    const { error } = await supabase.from("feedback").insert({
      nama: clipStr(body.nama, 80),
      usia: intInRange(body.usia, 1, 120),
      kota: clipStr(body.kota, 80),
      pengguna_aktif: toBool(body.pengguna_aktif),
      hal_disukai: clipStr(body.hal_disukai, 2000),
      hal_membingungkan: clipStr(body.hal_membingungkan, 2000),
      fitur_diinginkan: clipStr(body.fitur_diinginkan, 2000),
      fitur_tidak_penting: clipStr(body.fitur_tidak_penting, 2000),
      rating: intInRange(body.rating, 1, 5),
    });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Gagal menyimpan feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("feedback route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CATATAN KEAMANAN: endpoint GET dihapus. Sebelumnya GET mengembalikan SELURUH
// feedback (nama/usia/kota/komentar) ke siapa pun tanpa autentikasi — kebocoran
// data. Untuk melihat feedback, baca lewat Supabase dashboard (akun pemilik).
