import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRecommendations, type AnalysisInput } from "@/lib/recommendations";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const input: AnalysisInput = await req.json();

    if (!input.usia || !input.kota || !input.tipe_kulit || !input.budget) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const hasil = generateRecommendations(input);

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

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Gagal menyimpan analisis" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, hasil });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
