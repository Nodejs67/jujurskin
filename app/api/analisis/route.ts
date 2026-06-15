import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRecommendations, type AnalysisInput } from "@/lib/recommendations";

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
  try {
    const input: AnalysisInput = await req.json();

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
