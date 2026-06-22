import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { readJsonLimited } from "@/lib/validate";

// Lapisan SARAN berbasis AI teks (provider-agnostic, OpenAI-compatible).
// PENTING: route ini HANYA menerima ANGKA hasil ukur + konteks ringan.
// Foto TIDAK PERNAH dikirim ke sini maupun ke AI. (Privacy Doctrine)
//
// Ganti provider cukup dengan mengubah env (tanpa ubah kode):
//   AI_API_KEY   = kunci dari provider (DeepSeek / Gemini / Groq / dst)
//   AI_BASE_URL  = default https://api.deepseek.com  (Groq: https://api.groq.com/openai/v1)
//   AI_MODEL     = default deepseek-chat

type Body = {
  scores?: { redness?: number; oiliness?: number; evenness?: number };
  levels?: { redness?: string; oiliness?: string; evenness?: string };
  meta?: { usia?: string | number; tipe_kulit?: string; kota?: string; tone?: string };
};

export async function POST(req: NextRequest) {
  // Rate limit KETAT: endpoint ini memanggil AI BERBAYAR. Maksimal 6 / menit / IP
  // supaya tidak bisa dispam untuk membengkakkan tagihan.
  const limited = enforceRateLimit(req, { bucket: "saran-kulit", limit: 6, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const key = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY;
    // Belum dikonfigurasi → jangan error, biar halaman tetap jalan tanpa saran AI
    if (!key) return NextResponse.json({ saran: null, reason: "AI belum dikonfigurasi" });

    const baseUrl = process.env.AI_BASE_URL || "https://api.deepseek.com";
    const model = process.env.AI_MODEL || "deepseek-chat";

    const body = (await readJsonLimited(req, 4 * 1024)) as Body;
    const s = body.scores || {};
    const l = body.levels || {};
    const m = body.meta || {};

    const fakta = [
      `Kemerahan: level ${l.redness ?? "?"} (skor ${s.redness ?? "?"}/100)`,
      `Kilap/minyak T-zone: level ${l.oiliness ?? "?"} (skor ${s.oiliness ?? "?"}/100)`,
      `Kerataan warna: level ${l.evenness ?? "?"} (skor ${s.evenness ?? "?"}/100)`,
      m.tone ? `Perkiraan warna kulit (ITA): ${m.tone}` : "",
      m.tipe_kulit ? `Tipe kulit (klaim user): ${m.tipe_kulit}` : "",
      m.usia ? `Usia: ${m.usia}` : "",
      m.kota ? `Kota: ${m.kota}` : "",
    ].filter(Boolean).join("\n");

    const system =
      "Kamu asisten skincare untuk JujurSkin, platform Indonesia yang JUJUR dan anti jualan paksa. " +
      "Nilai: jujur > populer, tidak menakut-nakuti, tidak menyuruh beli banyak produk, gratis. " +
      "Aturan: (1) Bahasa Indonesia santai & ringkas. (2) Sebut GOLONGAN/bahan (mis. niacinamide, sunscreen), JANGAN sebut merek. " +
      "(3) Ini BUKAN diagnosis medis — kalau parah, sarankan ke dokter kulit. " +
      "(4) Angka berasal dari foto selfie biasa yang dipengaruhi cahaya/kamera, jadi sampaikan sebagai estimasi, bukan kepastian. " +
      "(5) Boleh bilang kalau kulitnya sudah cukup baik dan tidak perlu menambah produk.";

    const user =
      `Hasil pengukuran kulit dari foto (on-device):\n${fakta}\n\n` +
      "Tulis ringkas (maksimal ~150 kata): 1 kalimat rangkuman kondisi, lalu 2–3 saran konkret berbasis angka di atas " +
      "(fokus bahan/kebiasaan, bukan beli-beli), dan 1 kalimat jujur soal keterbatasan. Pakai poin singkat.";

    const ctrl = AbortSignal.timeout(20000);
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.5,
        max_tokens: 400,
      }),
      signal: ctrl,
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      console.error("AI provider error:", resp.status, txt.slice(0, 300));
      return NextResponse.json({ saran: null, reason: "AI sedang tidak tersedia" });
    }

    const data = await resp.json();
    const saran: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ saran: saran || null });
  } catch (err) {
    console.error("saran-kulit route error:", err);
    return NextResponse.json({ saran: null, reason: "Server error" });
  }
}
