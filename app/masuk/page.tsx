"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";

type Mode = "masuk" | "daftar";

const inputClass =
  "w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </main>
      }
    >
      <MasukInner />
    </Suspense>
  );
}

function MasukInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const redirectTo = searchParams.get("next") || "/akun";

  const [mode, setMode] = useState<Mode>("masuk");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [needConfirm, setNeedConfirm] = useState(false);

  // Kalau sudah login, langsung arahkan keluar dari halaman ini
  useEffect(() => {
    if (!authLoading && user) router.replace(redirectTo);
  }, [authLoading, user, router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const supabase = createClient();

    try {
      if (mode === "daftar") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: nama.trim() },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/akun` : undefined,
          },
        });
        if (error) throw error;
        // Jika email confirmation aktif, session masih null → minta cek email
        if (!data.session) {
          setNeedConfirm(true);
        } else {
          router.replace(redirectTo);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(redirectTo);
      }
    } catch (err: unknown) {
      setError(translateError(err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  }

  if (needConfirm) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center rounded-2xl border border-primary/30 bg-card p-8"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-lg font-bold mb-2">Cek email kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Kami mengirim link konfirmasi ke <strong className="text-foreground">{email}</strong>. Klik link itu untuk
            mengaktifkan akun, lalu masuk.
          </p>
          <Button
            onClick={() => {
              setNeedConfirm(false);
              setMode("masuk");
            }}
            className="w-full"
          >
            Kembali ke halaman masuk
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full rounded-2xl border border-border bg-card p-7"
      >
        <div className="flex items-center gap-2 justify-center mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold tracking-tight text-lg">JujurSkin</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {mode === "masuk" ? "Masuk untuk menyimpan rutinitas & riwayatmu" : "Buat akun gratis — selamanya"}
        </p>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted/50 mb-6">
          {(["masuk", "daftar"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "masuk" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "daftar" && (
            <div className="relative">
              <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama panggilan"
                className={inputClass}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi (min. 6 karakter)"
              autoComplete={mode === "masuk" ? "current-password" : "new-password"}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
              </>
            ) : mode === "masuk" ? (
              "Masuk"
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-5 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Gratis, tanpa iklan, data kamu tidak dijual
        </p>
      </motion.div>
    </main>
  );
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email atau kata sandi salah.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Email ini sudah terdaftar. Coba masuk.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Cek inbox kamu dulu.";
  if (m.includes("password should be at least")) return "Kata sandi minimal 6 karakter.";
  if (m.includes("unable to validate email")) return "Format email tidak valid.";
  if (m.includes("rate limit") || m.includes("too many")) return "Terlalu banyak percobaan. Coba lagi sebentar.";
  return msg || "Terjadi kesalahan. Coba lagi.";
}
