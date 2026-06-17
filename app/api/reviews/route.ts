import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const product_id = request.nextUrl.searchParams.get("product_id");
  if (!product_id) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", product_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ reviews: [] });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { product_id, rating, komentar, nama, skin_type } = body;

  if (!product_id || !rating) {
    return NextResponse.json({ error: "product_id and rating required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id,
      rating: Number(rating),
      komentar: komentar ?? null,
      nama: nama ?? "Pengguna Anonim",
      skin_type: skin_type ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan review" }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}
