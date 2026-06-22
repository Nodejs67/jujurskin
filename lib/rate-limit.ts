import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter ringan (tanpa dependency) untuk melindungi API route dari spam,
 * penyalahgunaan, dan biaya tak terduga (terutama endpoint yang memanggil AI
 * berbayar). Berbasis sliding-window per-IP di memori instance.
 *
 * ⚠️ CATATAN SERVERLESS: di Vercel, state memori tidak dibagikan antar instance
 * dan bisa hilang saat cold start — jadi ini adalah LAPISAN PERTAMA, bukan
 * proteksi sempurna. Untuk proteksi tingkat produksi yang persisten, upgrade ke
 * Upstash Redis (@upstash/ratelimit) atau aktifkan Vercel Firewall/Attack
 * Challenge. Desain ini sengaja sederhana supaya gampang ditingkatkan nanti.
 */

type Hit = { count: number; resetAt: number };
const store = new Map<string, Hit>();
let lastSweep = Date.now();

function sweep(now: number) {
  // Bersihkan entri kedaluwarsa sesekali agar Map tidak tumbuh tak terbatas.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
}

/** Ambil IP klien dari header proxy (Vercel mengisi x-forwarded-for). */
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitOptions {
  /** Jumlah maksimum permintaan dalam jendela waktu. */
  limit: number;
  /** Panjang jendela waktu dalam milidetik. */
  windowMs: number;
  /** Pembeda bucket (mis. nama route) agar limit tiap route terpisah. */
  bucket: string;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

/** Cek & catat satu permintaan. Mengembalikan ok=false bila melewati limit. */
export function rateLimit(req: NextRequest, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const key = `${opts.bucket}:${clientIp(req)}`;
  const cur = store.get(key);

  if (!cur || cur.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }

  cur.count++;
  const ok = cur.count <= opts.limit;
  return { ok, remaining: Math.max(0, opts.limit - cur.count), resetAt: cur.resetAt };
}

/**
 * Helper: kembalikan response 429 standar bila limit terlampaui, atau null bila
 * masih boleh lanjut. Pemakaian di route:
 *   const limited = enforceRateLimit(req, { bucket: "feedback", limit: 5, windowMs: 60_000 });
 *   if (limited) return limited;
 */
export function enforceRateLimit(
  req: NextRequest,
  opts: RateLimitOptions
): NextResponse | null {
  const res = rateLimit(req, opts);
  if (res.ok) return null;
  const retryAfter = Math.ceil((res.resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfter)) } }
  );
}
