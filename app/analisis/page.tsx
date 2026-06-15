"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Problem, SkinType } from "@/lib/recommendations";

const TOTAL_STEPS = 5;

type FormData = {
  nama: string;
  usia: string;
  kota: string;
  jenis_kelamin: "pria" | "wanita" | "";
  tipe_kulit: SkinType | "";
  masalah: Problem[];
  budget: number;
  produk_existing: string;
};

const BUDGET_OPTIONS = [
  { label: "Di bawah Rp 50.000", value: 50000 },
  { label: "Rp 50.000 – 150.000", value: 150000 },
  { label: "Rp 150.000 – 300.000", value: 300000 },
  { label: "Rp 300.000 – 500.000", value: 500000 },
  { label: "Di atas Rp 500.000", value: 750000 },
];

const SKIN_TYPES: { value: SkinType; label: string; desc: string; emoji: string }[] = [
  { value: "normal", label: "Normal", desc: "Tidak terlalu kering, tidak terlalu berminyak", emoji: "😊" },
  { value: "berminyak", label: "Berminyak", desc: "Sering kilap, pori-pori besar, mudah berjerawat", emoji: "💧" },
  { value: "kering", label: "Kering", desc: "Terasa kencang, bersisik, kadang gatal", emoji: "🌵" },
  { value: "kombinasi", label: "Kombinasi", desc: "T-zone berminyak (dahi, hidung), pipi normal/kering", emoji: "⚡" },
  { value: "sensitif", label: "Sensitif", desc: "Mudah kemerahan, iritasi, atau bereaksi terhadap produk", emoji: "🌸" },
];

const MASALAH_OPTIONS: { value: Problem; label: string; emoji: string }[] = [
  { value: "jerawat", label: "Jerawat aktif", emoji: "😤" },
  { value: "bekas_jerawat", label: "Bekas jerawat", emoji: "🔴" },
  { value: "kusam", label: "Kulit kusam", emoji: "😶" },
  { value: "pori_besar", label: "Pori-pori besar", emoji: "🔍" },
  { value: "kering", label: "Kulit kering/dehidrasi", emoji: "💧" },
  { value: "berminyak", label: "Minyak berlebih", emoji: "✨" },
  { value: "pigmentasi", label: "Noda hitam/hiperpigmentasi", emoji: "🌑" },
  { value: "anti_aging", label: "Tanda penuaan dini", emoji: "⏰" },
];

const slide = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

export default function AnalisisPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    nama: "", usia: "", kota: "", jenis_kelamin: "",
    tipe_kulit: "", masalah: [], budget: 150000, produk_existing: "",
  });

  const update = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleMasalah = (p: Problem) => {
    setForm((prev) => ({
      ...prev,
      masalah: prev.masalah.includes(p)
        ? prev.masalah.filter((m) => m !== p)
        : [...prev.masalah, p],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.usia && form.kota && form.jenis_kelamin;
    if (step === 2) return form.tipe_kulit !== "";
    if (step === 3) return form.masalah.length > 0;
    if (step === 4) return form.budget > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const input = {
      ...form,
      usia: parseInt(form.usia),
      jenis_kelamin: (form.jenis_kelamin || "wanita") as "pria" | "wanita",
      tipe_kulit: (form.tipe_kulit || "normal") as import("@/lib/recommendations").SkinType,
    };

    try {
      const res = await fetch("/api/analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          router.push(`/hasil?id=${data.id}`);
          return;
        }
        if (data.hasil) {
          localStorage.setItem("jujurskin_hasil", JSON.stringify(data.hasil));
          router.push("/hasil");
          return;
        }
      }
    } catch {
      // API unavailable — generate client-side
    }

    // Fallback: generate recommendations in browser
    try {
      const { generateRecommendations } = await import("@/lib/recommendations");
      const hasil = generateRecommendations(input);
      localStorage.setItem("jujurskin_hasil", JSON.stringify(hasil));
      router.push("/hasil");
    } catch {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <span className="text-xs text-muted-foreground">{step} / {TOTAL_STEPS}</span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-border">
          <motion.div className="h-full bg-primary" animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Profil ── */}
            {step === 1 && (
              <motion.div key="step1" variants={slide} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">Langkah 1 dari 5</p>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Halo! Kita kenalan dulu 👋</h1>
                  <p className="text-sm text-muted-foreground">Semakin lengkap datamu, semakin akurat rekomendasinya.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Nama / Inisial <span className="text-muted-foreground font-normal">(opsional)</span></label>
                    <input value={form.nama} onChange={e => update("nama", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Nama atau inisial kamu" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Usia <span className="text-destructive">*</span></label>
                      <input type="number" value={form.usia} onChange={e => update("usia", e.target.value)} min={10} max={80}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Umur kamu" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Kota <span className="text-destructive">*</span></label>
                      <input value={form.kota} onChange={e => update("kota", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Kota tempat tinggal" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Jenis Kelamin <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["wanita", "pria"] as const).map(g => (
                        <button key={g} onClick={() => update("jenis_kelamin", g)}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all ${form.jenis_kelamin === g ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-border/80"}`}>
                          {g === "wanita" ? "👩 Perempuan" : "👨 Laki-laki"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Tipe kulit ── */}
            {step === 2 && (
              <motion.div key="step2" variants={slide} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">Langkah 2 dari 5</p>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Apa tipe kulitmu?</h1>
                  <p className="text-sm text-muted-foreground">Pilih yang paling menggambarkan kondisi kulit harian kamu.</p>
                </div>
                <div className="space-y-3">
                  {SKIN_TYPES.map(t => (
                    <button key={t.value} onClick={() => update("tipe_kulit", t.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${form.tipe_kulit === t.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-border/80"}`}>
                      <span className="text-2xl">{t.emoji}</span>
                      <div>
                        <p className={`text-sm font-semibold ${form.tipe_kulit === t.value ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                      {form.tipe_kulit === t.value && <CheckCircle className="w-4 h-4 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Masalah ── */}
            {step === 3 && (
              <motion.div key="step3" variants={slide} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">Langkah 3 dari 5</p>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Masalah utama kulitmu?</h1>
                  <p className="text-sm text-muted-foreground">Pilih semua yang relevan. Kami akan prioritaskan yang paling penting.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MASALAH_OPTIONS.map(m => {
                    const active = form.masalah.includes(m.value);
                    return (
                      <button key={m.value} onClick={() => toggleMasalah(m.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-border/80"}`}>
                        <span className="text-xl">{m.emoji}</span>
                        <span className={`text-sm font-medium leading-tight ${active ? "text-primary" : "text-foreground"}`}>{m.label}</span>
                        {active && <CheckCircle className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {form.masalah.length > 0 && (
                  <p className="text-xs text-primary">{form.masalah.length} masalah dipilih</p>
                )}
              </motion.div>
            )}

            {/* ── STEP 4: Budget ── */}
            {step === 4 && (
              <motion.div key="step4" variants={slide} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">Langkah 4 dari 5</p>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Budget skincare per bulan?</h1>
                  <p className="text-sm text-muted-foreground">Kami akan pastikan rekomendasinya sesuai budget — tidak lebih, tidak kurang.</p>
                </div>
                <div className="space-y-3">
                  {BUDGET_OPTIONS.map(b => (
                    <button key={b.value} onClick={() => update("budget", b.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${form.budget === b.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-border/80"}`}>
                      <span className={`text-sm font-medium ${form.budget === b.value ? "text-primary" : "text-foreground"}`}>{b.label}</span>
                      {form.budget === b.value && <CheckCircle className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs text-muted-foreground">💡 Tidak perlu beli semua sekaligus. Kami akan tunjukkan produk mana yang paling dulu.</p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: Produk existing ── */}
            {step === 5 && (
              <motion.div key="step5" variants={slide} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">Langkah 5 dari 5</p>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Produk yang sudah kamu pakai?</h1>
                  <p className="text-sm text-muted-foreground">Ini membantu kami tahu apa yang sudah ada dan apa yang tidak perlu dibeli lagi.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Produk skincare saat ini <span className="text-muted-foreground font-normal">(opsional)</span></label>
                  <textarea
                    value={form.produk_existing}
                    onChange={e => update("produk_existing", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Contoh: Cetaphil cleanser, toner brightening X, moisturizer Y, sunscreen Z..." />
                  <p className="text-xs text-muted-foreground mt-2">Sebutkan nama produk atau kandungan aktif yang kamu tahu.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <p className="text-xs font-medium text-foreground mb-3">Ringkasan data kamu:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Nama:</span> <span className="text-foreground">{form.nama || "—"}</span></div>
                    <div><span className="text-muted-foreground">Usia:</span> <span className="text-foreground">{form.usia} tahun</span></div>
                    <div><span className="text-muted-foreground">Kota:</span> <span className="text-foreground">{form.kota}</span></div>
                    <div><span className="text-muted-foreground">Tipe kulit:</span> <span className="text-foreground capitalize">{form.tipe_kulit}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Masalah:</span> <span className="text-foreground">{form.masalah.map(m => m.replace("_", " ")).join(", ") || "—"}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Budget:</span> <span className="text-primary font-medium">Rp {form.budget.toLocaleString("id")}</span></div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-border flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 gap-2">
                Lanjut <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 gap-2">
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> Menganalisis...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analisis Kulitku</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
