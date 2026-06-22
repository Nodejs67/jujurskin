import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRecommendations, type AnalysisInput } from "@/lib/recommendations";
import { enforceRateLimit } from "@/lib/rate-limit";
import { clipStr, readJsonLimited } from "@/lib/validate";

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
  // Rate limit: maksimal 10 analisa / menit / IP.
  const limited = enforceRateLimit(req, { bucket: "analisis", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const input = (await readJsonLimited(req, 32 * 1024)) as AnalysisInput;

    if (!input.usia || !input.kota || !input.tipe_kulit || !input.budget) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const hasil = generateRecommendations(input);

    // Try to save to Supabase — if it fails, still return the result
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("skin_analyses")
          .insert({
            nama: input.nama || null,
            usia: input.usia,
            kota: input.kota,
            jenis_kelamin: input.jenis_kelamin,
            tipe_kulit: input.tipe_kulit,
            masalah: input.masalah,
            budget: input.budget,
            produk_existing: input.produk_existing || null,
            // Advanced lifestyle & history fields (quiz 7 langkah)
            penggunaan_sunscreen: input.penggunaan_sunscreen || null,
            paparan_matahari: input.paparan_matahari || null,
            lingkungan: input.lingkungan || null,
            kualitas_tidur: input.kualitas_tidur || null,
            tingkat_stress: input.tingkat_stress || null,
            riwayat_hormonal: input.riwayat_hormonal ?? null,
            status_kehamilan: input.status_kehamilan || null,
            riwayat_sensitif: input.riwayat_sensitif ?? null,
            reaksi_produk: input.reaksi_produk || null,
            pengalaman_retinoid: input.pengalaman_retinoid || null,
            hasil,
          })
          .select("id")
          .single();

        if (!error && data?.id) {
          return NextResponse.json({ id: data.id, hasil });
        }
        // Supabase error (e.g., table doesn't exist) — fall through to return hasil without id
        console.error("Supabase insert error:", error?.message);
      } catch (dbErr) {
        console.error("Supabase connection error:", dbErr);
      }
    }

    // Return hasil without id — client will use localStorage fallback
    return NextResponse.json({ hasil });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Baca SATU hasil analisa berdasarkan id (via service role). Dipakai halaman
// /hasil supaya tabel skin_analyses bisa dikunci RLS (anon tak boleh bulk-read).
// Hanya mengembalikan baris yang id-nya tepat diminta — tidak bisa di-enumerate
// massal seperti SELECT * langsung ke tabel.
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, { bucket: "analisis-get", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const id = clipStr(req.nextUrl.searchParams.get("id"), 64);
  // Hanya terima UUID yang valid (hindari probing/format aneh).
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "id tidak valid" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });

  const { data, error } = await supabase
    .from("skin_analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ row: data });
}
