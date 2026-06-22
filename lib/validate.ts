/**
 * Helper validasi & sanitasi input untuk API route.
 * Mencegah payload raksasa (DoS), nilai di luar rentang, dan tipe tak terduga.
 */

/** Potong string ke panjang maksimum & buang spasi tepi. Non-string → null. */
export function clipStr(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

/** Bilangan bulat dalam rentang [min, max], atau null bila tak valid. */
export function intInRange(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  if (i < min || i > max) return null;
  return i;
}

/** Boolean longgar (terima true/false, "true"/"false", 1/0). Default false. */
export function toBool(v: unknown): boolean {
  return v === true || v === "true" || v === 1;
}

/**
 * Tolak body JSON yang terlalu besar (DoS guard) sebelum diparse penuh.
 * Mengembalikan body terparse, atau melempar bila melebihi batas byte.
 */
export async function readJsonLimited(req: Request, maxBytes = 16 * 1024): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  return text ? JSON.parse(text) : {};
}
