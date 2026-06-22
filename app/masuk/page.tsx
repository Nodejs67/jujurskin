"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";

type Mode = "masuk" | "daftar";

const inputClass =
  "w-full pl-11 pr-3 py-3 rounded-xl border border-border bg-white/70 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition";

/** Logo Google resmi 4 warna */
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.4C29.6 34.6 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.6 5.4C39.9 41 44 36 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

/** Latar aurora futuristik — blob blur lembut warna brand, ringan di HP */
function AuroraBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="animate-aurora absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl opacity-60 sm:h-96 sm:w-96"
        style={{ background: "radial-gradient(circle, #FB4E78 0%, transparent 70%)" }}
      />
      <div
        className="animate-aurora absolute top-1/3 -right-24 h-72 w-72 rounded-full blur-3xl opacity-50 sm:h-96 sm:w-96"
        style={{ background: "radial-gradient(circle, #FF8FA3 0%, transparent 70%)", animationDelay: "-5s" }}
      />
      <div
        className="animate-aurora absolute -bottom-24 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-40 sm:h-96 sm:w-96"
        style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 70%)", animationDelay: "-9s" }}
      />
      {/* grid halus */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] flex items-center justify-center bg-background">
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [needConfirm, setNeedConfirm] = useState(false);

  // Kalau sudah login, langsung arahkan keluar dari halaman ini
  useEffect(() => {
    if (!authLoading && user) router.replace(redirectTo);
  }, [authLoading, user, router, redirectTo]);

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
      // sukses → browser di-redirect ke Google (tidak balik ke sini)
    } catch (err: unknown) {
      setError(translateError(err instanceof Error ? err.message : String(err)));
      setGoogleLoading(false);
    }
  }

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
      <main className="relative min-h-[100dvh] flex items-center justify-center px-6 bg-background">
        <AuroraBg />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-sm w-full text-center rounded-3xl p-8 shadow-[0_24px_70px_-20px_rgba(251,78,120,0.35)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-lg font-bold mb-2">Cek email kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Kami mengirim link konfirmasi ke <strong className="text-foreground">{email}</strong>. Klik link itu untuk
            mengaktifkan akun, lalu masuk.
          </p>
          <button
            onClick={() => {
              setNeedConfirm(false);
              setMode("masuk");
            }}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Kembali ke halaman masuk
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 bg-background">
      <AuroraBg />

      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-[0_24px_70px_-20px_rgba(251,78,120,0.35)]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-[#F43F5E] flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg gradient-text">JujurSkin</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {mode === "masuk" ? "Masuk untuk menyimpan rutinitas & riwayatmu" : "Buat akun gratis — selamanya"}
        </p>

        {/* Tombol Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || submitting}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-white/80 hover:bg-white text-sm font-medium text-foreground shadow-sm hover:shadow transition disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          {mode === "masuk" ? "Masuk dengan Google" : "Daftar dengan Google"}
        </button>

        {/* Pemisah */}
        <div className="flex items-center gap-3 my-5">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">atau pakai email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/60 mb-5">
          {(["masuk", "daftar"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "masuk" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "daftar" && (
            <div className="relative">
              <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
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
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
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
            <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-[#F43F5E] text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
              </>
            ) : mode === "masuk" ? (
              "Masuk"
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <div className="mt-5 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Gratis, tanpa iklan, data kamu tidak dijual
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Foto wajah tidak pernah disimpan di server
          </p>
        </div>
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
  if (m.includes("provider is not enabled") || m.includes("unsupported provider"))
    return "Login Google belum aktif. Coba pakai email dulu, ya.";
  if (m.includes("rate limit") || m.includes("too many")) return "Terlalu banyak percobaan. Coba lagi sebentar.";
  return msg || "Terjadi kesalahan. Coba lagi.";
}
