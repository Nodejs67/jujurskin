import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk komponen client (browser).
 * Pakai createBrowserClient agar sesi auth tersimpan & otomatis di-refresh.
 * Catatan: client lama di lib/supabase.ts tetap dipakai untuk API routes (server, tanpa auth).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
