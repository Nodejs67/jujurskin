"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function CallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const next = sp.get("next") || "/akun";
    const code = sp.get("code");
    const oauthError = sp.get("error_description") || sp.get("error");

    if (oauthError) {
      setError("Login Google dibatalkan atau gagal. Coba lagi, ya.");
      return;
    }

    const supabase = createClient();
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      if (ok) router.replace(next);
      else setError("Gagal menyelesaikan login. Coba lagi dari halaman masuk.");
    };

    // AuthProvider global juga mendeteksi sesi dari URL — pantau perubahannya.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) finish(true);
    });

    (async () => {
      // 1) Mungkin sesi sudah terbentuk (auto-detect / exchange oleh AuthProvider).
      const { data: s0 } = await supabase.auth.getSession();
      if (s0.session) return finish(true);

      // 2) Coba tukar kode sendiri (kalau belum dipakai).
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) return finish(true);
        // Kode mungkin sudah dipakai instance lain → cek ulang sesi.
        const { data: s1 } = await supabase.auth.getSession();
        if (s1.session) return finish(true);
      } else {
        // Tanpa kode: kalau memang sudah ada sesi, lanjut; kalau tidak, ke 'next'.
        return finish(true);
      }

      // 3) Beri waktu listener menyelesaikan, lalu cek terakhir kali.
      setTimeout(async () => {
        const { data: s2 } = await supabase.auth.getSession();
        finish(!!s2.session);
      }, 3000);
    })();

    return () => sub.subscription.unsubscribe();
  }, [sp, router]);

  if (error) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full text-center rounded-3xl border border-border bg-card p-8">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="text-lg font-bold mb-2">Login gagal</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{error}</p>
          <Link
            href="/masuk"
            className="inline-block w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-3 bg-background">
      <Loader2 className="w-7 h-7 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Menyelesaikan login…</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] flex items-center justify-center bg-background">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
