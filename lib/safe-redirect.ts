/**
 * Validasi parameter "next"/redirect agar TIDAK bisa dipakai untuk open redirect.
 * Hanya mengizinkan path internal absolut (mulai dengan satu "/"), menolak URL
 * eksternal, protocol-relative ("//evil.com"), backslash trick, skema berbahaya,
 * dan karakter kontrol. Bila tidak valid → kembalikan fallback internal.
 *
 * Contoh serangan yang dicegah: /masuk?next=https://evil.com,
 * /masuk?next=//evil.com, /masuk?next=/\evil.com
 */
export function safeNextPath(raw: string | null | undefined, fallback = "/akun"): string {
  if (!raw || typeof raw !== "string") return fallback;
  const v = raw.trim();
  if (!v.startsWith("/")) return fallback; // wajib path internal
  if (v.startsWith("//") || v.startsWith("/\\")) return fallback; // protocol-relative / backslash
  if (v.includes("://")) return fallback; // tidak boleh ada skema absolut
  if (/^\/+\s*(javascript|data|vbscript):/i.test(v)) return fallback; // skema berbahaya
  // Tolak karakter non-printable / kontrol (kode < 32) tanpa regex control-char.
  for (let i = 0; i < v.length; i++) {
    if (v.charCodeAt(i) < 0x20) return fallback;
  }
  return v;
}
