"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, LogOut, Mail, Calendar, Loader2, Repeat, TrendingUp, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

const QUICK_LINKS = [
  { href: "/analisis", icon: Sparkles, label: "Analisis Kulit", desc: "Mulai atau ulangi analisis" },
  { href: "/rutinitas", icon: Repeat, label: "Rutinitas", desc: "Lihat rutinitas AM/PM kamu" },
  { href: "/progress", icon: TrendingUp, label: "Progress", desc: "Jurnal & foto perkembangan kulit" },
  { href: "/tidak-perlu", icon: FlaskConical, label: "Cek Produk Tidak Perlu", desc: "Hemat dari produk mubazir" },
];

export default function AkunPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/masuk?next=/akun");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  const nama = (user.user_metadata?.full_name as string)?.trim() || "Pengguna JujurSkin";
  const initial = nama.charAt(0).toUpperCase();
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
        {/* Profil */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{nama}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" /> Bergabung {joined}
            </p>
          </div>
        </motion.div>

        {/* Akses cepat */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <l.icon className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Catatan: sinkron antar perangkat akan segera hadir */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-sm text-foreground font-medium mb-1">Segera hadir</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rutinitas dan riwayat progress kamu saat ini tersimpan di perangkat ini. Sinkronisasi otomatis ke akun
            (agar bisa diakses dari HP & laptop) sedang kami kerjakan.
          </p>
        </div>

        <Button variant="outline" onClick={handleSignOut} className="w-full gap-2">
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </div>
    </main>
  );
}
