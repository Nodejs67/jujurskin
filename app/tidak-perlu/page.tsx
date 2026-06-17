"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Scissors, XCircle, AlertTriangle, CheckCircle2, Wallet, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import {
  ITEM_GROUPS,
  analyzeRedundancy,
  itemLabel,
  itemEmoji,
  type RedundancyContext,
} from "@/lib/redundancy";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const AGE_OPTIONS = [
  { label: "< 25", value: 22 },
  { label: "25–29", value: 27 },
  { label: "30–39", value: 34 },
  { label: "40+", value: 42 },
];

export default function TidakPerluPage() {
  const router = useRouter();
  const [owned, setOwned] = useState<string[]>([]);
  const [usia, setUsia] = useState<number | undefined>(undefined);
  const [heavyMakeup, setHeavyMakeup] = useState(false);
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    setOwned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setChecked(false);
  };

  const reset = () => {
    setOwned([]);
    setUsia(undefined);
    setHeavyMakeup(false);
    setChecked(false);
  };

  const result = useMemo(() => {
    if (!checked) return null;
    const ctx: RedundancyContext = { usia, heavyMakeup };
    return analyzeRedundancy(owned, ctx);
  }, [checked, owned, usia, heavyMakeup]);

  const skipItems = result?.skips.filter((s) => s.severity === "skip") ?? [];
  const cautionItems = result?.skips.filter((s) => s.severity === "caution") ?? [];

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Produk Tidak Perlu</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10 text-xs px-3 py-1">
            <Scissors className="w-3 h-3 mr-1.5" /> Produk Tidak Perlu Checker
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Produk mana yang{" "}
            <span className="gradient-text">tidak perlu kamu beli?</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Centang produk yang kamu punya atau mau beli. Kami akan jujur bilang mana yang tumpang tindih, mubazir,
            atau belum kamu butuhkan — beserta estimasi uang yang bisa kamu hemat.
          </p>
        </motion.div>

        {/* Konteks: usia + makeup */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Usia kamu (opsional, untuk akurasi):</p>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => { setUsia(usia === a.value ? undefined : a.value); setChecked(false); }}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                    usia === a.value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => { setHeavyMakeup(!heavyMakeup); setChecked(false); }}
              className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${heavyMakeup ? "bg-primary" : "bg-secondary"}`}
              aria-pressed={heavyMakeup}
              aria-label="Sering pakai makeup atau sunscreen tebal"
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${heavyMakeup ? "left-4" : "left-0.5"}`} />
            </button>
            <span className="text-xs text-muted-foreground">Saya sering pakai makeup / sunscreen tebal</span>
          </label>
        </motion.div>

        {/* Checklist produk */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-5 mb-6">
          {ITEM_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="text-xs text-muted-foreground/80 uppercase tracking-wide mb-2">{group.group}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((item) => {
                  const active = owned.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                        active
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:text-foreground"
                      }`}
                      aria-pressed={active}
                    >
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </span>
                      <span className="text-base leading-none">{item.emoji}</span>
                      <span className="leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setChecked(true)}
            disabled={owned.length === 0}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Scissors className="w-4 h-4" /> Cek Mana yang Tidak Perlu
          </Button>
          {owned.length > 0 && (
            <Button variant="outline" onClick={reset} className="border-border gap-1.5 text-muted-foreground">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>

        {/* Hasil */}
        <AnimatePresence>
          {checked && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Verdict + total hemat */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm text-foreground leading-relaxed">{result.verdict}</p>
                {result.totalSaving > 0 && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
                    <Wallet className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Estimasi yang bisa kamu hemat</p>
                      <p className="text-lg font-bold text-accent">Rp {result.totalSaving.toLocaleString("id")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tidak perlu (skip) */}
              {skipItems.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    {skipItems.length} produk yang tidak perlu
                  </p>
                  {skipItems.map((s, i) => (
                    <motion.div
                      key={s.itemId}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl border border-destructive/25 bg-destructive/8"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl leading-none mt-0.5">{itemEmoji(s.itemId)}</span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-foreground">{itemLabel(s.itemId)}</span>
                            {s.saving > 0 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-accent/40 text-accent">
                                Hemat Rp {s.saving.toLocaleString("id")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tergantung kondisi (caution) */}
              {cautionItems.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    {cautionItems.length} produk yang sifatnya opsional
                  </p>
                  {cautionItems.map((s, i) => (
                    <motion.div
                      key={s.itemId}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl border border-yellow-400/25 bg-yellow-400/5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl leading-none mt-0.5">{itemEmoji(s.itemId)}</span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-foreground">{itemLabel(s.itemId)}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-yellow-400/40 text-yellow-400">
                              Tergantung kondisi
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tidak ada yang mubazir */}
              {skipItems.length === 0 && cautionItems.length === 0 && (
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="p-5 rounded-xl border border-green-400/25 bg-green-400/5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Tidak ada produk yang mubazir ✅</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pilihan produkmu sudah relevan dan tidak tumpang tindih. Bagus — lebih hemat dan kulit tidak overload.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Minimum Effective Routine — apa yang JUSTRU wajib */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" /> Minimum Effective Routine
                </p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  3 ini sudah cukup untuk 90% orang. Lengkapi yang esensial dulu sebelum menambah produk lain.
                </p>
                <div className="space-y-2">
                  {["cleanser", "moisturizer", "sunscreen"].map((id) => {
                    const ownedIt = result.essentialsOwned.includes(id);
                    const missing = result.essentialsMissing.find((e) => e.id === id);
                    return (
                      <div
                        key={id}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${
                          ownedIt ? "border-green-400/25 bg-green-400/5" : "border-yellow-400/25 bg-yellow-400/5"
                        }`}
                      >
                        {ownedIt ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {itemLabel(id)}{" "}
                            <span className={`text-xs font-normal ${ownedIt ? "text-green-400" : "text-yellow-400"}`}>
                              {ownedIt ? "· sudah punya" : "· belum punya"}
                            </span>
                          </p>
                          {missing && <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{missing.why}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA lanjut */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Mau tahu produk apa yang justru PALING kamu butuhkan sesuai kondisi kulit & budget? Analisis kulit kami memberi
                  rekomendasi terurut prioritas — sekaligus daftar produk yang bisa kamu skip.
                </p>
                <Button onClick={() => router.push("/analisis")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Sparkles className="w-4 h-4" /> Analisis Kulit Gratis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tip awal */}
        {!checked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="text-xs text-primary font-semibold mb-2">💡 Kenapa fitur ini ada?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Industri skincare untung kalau kamu beli sebanyak mungkin. JujurSkin tidak. Kami tidak terafiliasi brand dan
              tidak ada iklan — jadi kami bisa jujur bilang: sering kali kamu sudah punya cukup, atau bahkan terlalu banyak.
              Lebih sedikit produk yang tepat &gt; banyak produk yang tumpang tindih.
            </p>
          </motion.div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
