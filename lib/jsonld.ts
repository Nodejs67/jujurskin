/**
 * Serialisasi objek JSON-LD untuk disuntik via dangerouslySetInnerHTML dengan
 * aman. JSON.stringify biasa TIDAK meng-escape "<", sehingga string seperti
 * "</script>" di dalam data bisa menutup tag <script> lebih awal (XSS).
 * Meng-escape "<", ">", dan "&" menjadi escape unicode setara sudah menutup
 * vektor breakout di dalam <script type="application/ld+json">.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
