"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormState = {
  nama: string;
  usia: string;
  kota: string;
  pengguna_aktif: boolean | null;
  hal_disukai: string;
  hal_membingungkan: string;
  fitur_diinginkan: string;
  fitur_tidak_penting: string;
  rating: number;
};

export default function FeedbackPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    nama: "", usia: "", kota: "", pengguna_aktif: null,
    hal_disukai: "", hal_membingungkan: "", fitur_diinginkan: "", fitur_tidak_penting: "",
    rating: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (form.pengguna_aktif === null) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          usia: form.usia ? parseInt(form.usia) : null,
        }),
      });
      setSubmitted(true);
    } catch {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Terima kasih! 🙏</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Feedbackmu sangat berharga untuk JujurSkin. Setiap masukan langsung membantu kami membangun platform yang lebih baik.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Sparkles className="w-4 h-4" /> Coba Analisis Kulit
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="border-border">
              Kembali ke Beranda
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <span className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs text-primary uppercase tracking-widest mb-2">User Feedback</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">Apa pendapatmu?</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            JujurSkin dibangun berdasarkan masukan nyata dari pengguna. Tidak ada agenda tersembunyi — kita ingin tahu yang jujur.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">

          {/* Rating */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground mb-3">Rating keseluruhan</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => update("rating", n)}
                  className={`p-2 rounded-lg transition-all ${form.rating >= n ? "text-accent scale-110" : "text-muted-foreground/30 hover:text-muted-foreground"}`}>
                  <Star className="w-7 h-7" fill={form.rating >= n ? "currentColor" : "none"} />
                </button>
              ))}
              {form.rating > 0 && (
                <span className="text-sm text-muted-foreground self-center ml-1">
                  {["", "Mengecewakan", "Kurang", "Cukup", "Bagus", "Sempurna"][form.rating]}
                </span>
              )}
            </div>
          </div>

          {/* Profil pengguna */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <p className="text-sm font-medium text-foreground">Profil kamu</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-xs text-muted-foreground mb-1 block">Nama / Inisial</label>
                <input value={form.nama} onChange={e => update("nama", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/30 text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Contoh: S" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Umur</label>
                <input type="number" value={form.usia} onChange={e => update("usia", e.target.value)} min={10} max={80}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/30 text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="24" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kota</label>
                <input value={form.kota} onChange={e => update("kota", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/30 text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Jakarta" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Pengguna skincare aktif?</label>
              <div className="flex gap-3">
                {[{ label: "Ya, aktif", value: true }, { label: "Tidak / jarang", value: false }].map((o) => (
                  <button key={String(o.value)} onClick={() => update("pengguna_aktif", o.value)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${form.pengguna_aktif === o.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pertanyaan feedback */}
          {[
            { field: "hal_disukai" as const, label: "Hal yang kamu sukai", placeholder: "Contoh: Tampilannya bersih, rekomendasinya masuk akal, penjelasannya jelas..." },
            { field: "hal_membingungkan" as const, label: "Hal yang membingungkan", placeholder: "Contoh: Tidak jelas cara pakainya, loading lama, istilah terlalu teknis..." },
            { field: "fitur_diinginkan" as const, label: "Fitur yang paling kamu inginkan", placeholder: "Contoh: Scan produk pakai kamera, reminder pakai skincare, chatbot tanya jawab..." },
            { field: "fitur_tidak_penting" as const, label: "Fitur yang menurutmu tidak penting", placeholder: "Contoh: Leaderboard, forum komunitas, artikel panjang..." },
          ].map((q) => (
            <div key={q.field} className="rounded-xl border border-border bg-card p-5">
              <label className="text-sm font-medium text-foreground mb-2 block">{q.label}</label>
              <textarea value={form[q.field] as string} onChange={e => update(q.field, e.target.value)} rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary/30 text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder={q.placeholder} />
            </div>
          ))}

          <Button onClick={handleSubmit} disabled={loading || form.pengguna_aktif === null}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12">
            {loading
              ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> Mengirim...</>
              : <><Send className="w-4 h-4" /> Kirim Feedback</>
            }
          </Button>

          {form.pengguna_aktif === null && (
            <p className="text-xs text-center text-muted-foreground/80">Isi "Pengguna skincare aktif?" untuk lanjut</p>
          )}

          <p className="text-xs text-center text-muted-foreground/80 pb-6">
            Semua field opsional kecuali pilihan pengguna aktif. Identitasmu aman.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
