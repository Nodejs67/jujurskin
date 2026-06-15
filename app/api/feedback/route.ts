import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("feedback").insert({
      nama: body.nama || null,
      usia: body.usia || null,
      kota: body.kota || null,
      pengguna_aktif: body.pengguna_aktif ?? false,
      hal_disukai: body.hal_disukai || null,
      hal_membingungkan: body.hal_membingungkan || null,
      fitur_diinginkan: body.fitur_diinginkan || null,
      fitur_tidak_penting: body.fitur_tidak_penting || null,
      rating: body.rating || null,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Gagal menyimpan feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
