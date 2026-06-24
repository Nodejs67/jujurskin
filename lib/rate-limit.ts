import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter untuk melindungi API route dari spam, penyalahgunaan, dan biaya
 * tak terduga (terutama endpoint yang memanggil AI berbayar).
 *
 * DUA LAPIS:
 *  1. Upstash Redis (persisten antar-instance serverless) bila env diisi:
 *       UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *     Dipanggil lewat REST API memakai fetch — TANPA dependency tambahan.
 *  2. In-memory per-instance (fallback) bila Upstash tidak dikonfigurasi ATAU
 *     sedang gagal/down — supaya proteksi tetap ada dan layanan tidak ikut mati.
 *
 * Tanpa env Upstash, perilaku PERSIS sama seperti sebelumnya (in-memory).
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

/**
 * Ambil IP klien. Dahulukan x-real-ip yang di-set oleh Vercel (lebih sulit
 * dipalsukan daripada x-forwarded-for yang bagian kirinya bisa di-spoof klien).
 */
export function clientIp(req: NextRequest): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    // Ambil entri TERAKHIR (paling dekat proxy tepercaya), bukan yang kiri (spoofable).
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
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

/** Implementasi in-memory (lapisan fallback / default). */
function rateLimitMemory(req: NextRequest, opts: RateLimitOptions): RateLimitResult {
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

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim();
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

/** Apakah rate-limit persisten via Upstash aktif. */
export function upstashEnabled(): boolean {
  return !!UPSTASH_URL && !!UPSTASH_TOKEN;
}

/**
 * Fixed-window counter di Upstash Redis lewat REST pipeline:
 *   INCR key            → naikkan & ambil hitungan saat ini
 *   PEXPIRE key ttl NX  → set kedaluwarsa HANYA saat key baru (awal jendela)
 *   PTTL key            → sisa waktu jendela (untuk Retry-After akurat)
 * Bila gagal (jaringan/Upstash down) → fallback ke in-memory.
 */
async function rateLimitUpstash(req: NextRequest, opts: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `rl:${opts.bucket}:${clientIp(req)}`;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, opts.windowMs, "NX"],
        ["PTTL", key],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);
    const data = (await res.json()) as Array<{ result?: number; error?: string }>;
    const count = Number(data?.[0]?.result);
    if (!Number.isFinite(count) || count < 1) throw new Error("upstash bad payload");
    const ttl = Number(data?.[2]?.result);
    const resetAt = now + (Number.isFinite(ttl) && ttl > 0 ? ttl : opts.windowMs);
    return { ok: count <= opts.limit, remaining: Math.max(0, opts.limit - count), resetAt };
  } catch {
    // Jangan jatuhkan layanan kalau Upstash bermasalah — tetap batasi via memori.
    return rateLimitMemory(req, opts);
  }
}

/** Cek & catat satu permintaan. ok=false bila melewati limit. */
export async function rateLimit(req: NextRequest, opts: RateLimitOptions): Promise<RateLimitResult> {
  return upstashEnabled() ? rateLimitUpstash(req, opts) : rateLimitMemory(req, opts);
}

/**
 * Helper: kembalikan response 429 standar bila limit terlampaui, atau null bila
 * masih boleh lanjut. Pemakaian di route:
 *   const limited = await enforceRateLimit(req, { bucket: "feedback", limit: 5, windowMs: 60_000 });
 *   if (limited) return limited;
 */
export async function enforceRateLimit(
  req: NextRequest,
  opts: RateLimitOptions
): Promise<NextResponse | null> {
  const res = await rateLimit(req, opts);
  if (res.ok) return null;
  const retryAfter = Math.ceil((res.resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfter)) } }
  );
}
