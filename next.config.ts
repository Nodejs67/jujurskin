import type { NextConfig } from "next";

/**
 * Security headers. Diterapkan ke semua route.
 *
 * CSP sengaja masih mengizinkan 'unsafe-inline' untuk script/style karena Next
 * App Router & framer-motion menyuntik inline script/style tanpa nonce. Ini
 * kompromi yang disengaja — perlindungan utama di sini: anti-clickjacking
 * (frame-ancestors/X-Frame-Options), anti MIME-sniffing, base-uri & object-src
 * terkunci, dan kontrol referrer/izin perangkat. Upgrade berikutnya (opsional):
 * CSP berbasis nonce lewat middleware untuk membuang 'unsafe-inline' script.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Supabase (REST + realtime websocket), Vercel insights, dan API publik lain
  // yang dipanggil dari client. AI berbayar dipanggil dari server, bukan client.
  "connect-src 'self' https: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kamera diizinkan (fitur analisis foto on-device); mikrofon/lokasi/pembayaran dimatikan.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
