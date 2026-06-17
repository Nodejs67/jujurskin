"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft, Sparkles, FlaskConical, Info, Search, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { INGREDIENTS, type Ingredient } from "@/lib/ingredients";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// Keyword map for fuzzy matching
const INGREDIENT_ALIASES: Record<string, string> = {
  "retinol": "retinol",
  "vitamin a": "retinol",
  "retinoid": "retinol",
  "niacinamide": "niacinamide",
  "vitamin b3": "niacinamide",
  "aha": "glycolic-acid",
  "glycolic acid": "glycolic-acid",
  "glycolic": "glycolic-acid",
  "bha": "salicylic-acid",
  "salicylic acid": "salicylic-acid",
  "salicylic": "salicylic-acid",
  "sa": "salicylic-acid",
  "vitamin c": "vitamin-c",
  "ascorbic acid": "vitamin-c",
  "ascorbyl": "vitamin-c",
  "hyaluronic acid": "hyaluronic-acid",
  "ha": "hyaluronic-acid",
  "ceramide": "ceramide",
  "centella": "centella-asiatica",
  "cica": "centella-asiatica",
  "azelaic acid": "azelaic-acid",
  "azelaic": "azelaic-acid",
  "alpha arbutin": "alpha-arbutin",
  "arbutin": "alpha-arbutin",
  "sunscreen": "sunscreen-spf50",
  "spf": "sunscreen-spf50",
  "zinc oxide": "sunscreen-spf50",
  "glycerin": "glycerin",
  "glycerine": "glycerin",
  "benzoyl peroxide": "benzoyl-peroxide",
  "bpo": "benzoyl-peroxide",
  "bp": "benzoyl-peroxide",
  "aloe vera": "aloe-vera",
  "aloe": "aloe-vera",
  "panthenol": "panthenol",
  "vitamin b5": "panthenol",
  "kojic acid": "kojic-acid",
  "kojic": "kojic-acid",
  "squalane": "squalane",
  "lactic acid": "lactic-acid",
  "lactic": "lactic-acid",
  "vitamin e": "vitamin-e",
  "tocopherol": "vitamin-e",
  "bakuchiol": "bakuchiol",
  "tranexamic acid": "tranexamic-acid",
  "txa": "tranexamic-acid",
  "peptide": "peptide",
  "beta glucan": "beta-glucan",
  "beta-glucan": "beta-glucan",
  "mugwort": "mugwort",
  "artemisia": "mugwort",
  "ferulic acid": "ferulic-acid",
  "ferulic": "ferulic-acid",
  "pha": "pha",
  "gluconolactone": "pha",
  "zinc": "zinc",
  "tea tree": "tea-tree",
  "neem": "neem",
  "adenosine": "adenosine",
  "allantoin": "allantoin",
  "licorice": "licorice-root",
  "licorice root": "licorice-root",
  "glabridin": "licorice-root",
  "mandelic acid": "mandelic-acid",
  "mandelic": "mandelic-acid",
  "polyglutamic acid": "polyglutamic-acid",
  "pga": "polyglutamic-acid",
  "copper peptide": "copper-peptide",
  "ghk-cu": "copper-peptide",
  "resveratrol": "resveratrol",
  "rosehip": "rosehip-oil",
  "rosehip oil": "rosehip-oil",
  "sodium pca": "sodium-pca",
  "ascorbyl glucoside": "ascorbyl-glucoside",
  "aa2g": "ascorbyl-glucoside",
};

function matchIngredients(text: string): Ingredient[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [alias, id] of Object.entries(INGREDIENT_ALIASES)) {
    if (lower.includes(alias)) {
      found.add(id);
    }
  }

  return INGREDIENTS.filter((i) => found.has(i.id));
}

type ConflictResult = {
  ingredient1: Ingredient;
  ingredient2: Ingredient;
  reason: string;
  severity: "high" | "medium";
};

function findConflicts(ingredients: Ingredient[]): ConflictResult[] {
  const results: ConflictResult[] = [];

  for (let i = 0; i < ingredients.length; i++) {
    for (let j = i + 1; j < ingredients.length; j++) {
      const a = ingredients[i];
      const b = ingredients[j];

      // Check a's conflicts for b
      for (const conflict of a.conflicts_with) {
        const matchesB =
          conflict.name.toLowerCase().includes(b.name.toLowerCase()) ||
          b.name.toLowerCase().includes(conflict.name.toLowerCase()) ||
          b.aliases.some((al) => al.toLowerCase().includes(conflict.name.toLowerCase()));

        if (matchesB) {
          const severity = conflict.reason.toLowerCase().includes("jangan") ||
            conflict.reason.toLowerCase().includes("rusak") ||
            conflict.reason.toLowerCase().includes("menonaktifkan") ? "high" : "medium";
          results.push({ ingredient1: a, ingredient2: b, reason: conflict.reason, severity });
        }
      }

      // Check b's conflicts for a
      for (const conflict of b.conflicts_with) {
        const matchesA =
          conflict.name.toLowerCase().includes(a.name.toLowerCase()) ||
          a.name.toLowerCase().includes(conflict.name.toLowerCase()) ||
          a.aliases.some((al) => al.toLowerCase().includes(conflict.name.toLowerCase()));

        if (matchesA) {
          // Avoid duplicate
          const alreadyAdded = results.some(
            (r) => (r.ingredient1.id === a.id && r.ingredient2.id === b.id) ||
              (r.ingredient1.id === b.id && r.ingredient2.id === a.id)
          );
          if (!alreadyAdded) {
            const severity = conflict.reason.toLowerCase().includes("jangan") ||
              conflict.reason.toLowerCase().includes("rusak") ||
              conflict.reason.toLowerCase().includes("menonaktifkan") ? "high" : "medium";
            results.push({ ingredient1: b, ingredient2: a, reason: conflict.reason, severity });
          }
        }
      }
    }
  }

  return results;
}

const PRESET_COMBOS = [
  { label: "Retinol + AHA", ingredients: "Retinol, Glycolic Acid (AHA)" },
  { label: "Vit C + BHA", ingredients: "Vitamin C, Salicylic Acid (BHA)" },
  { label: "BPO + Retinol", ingredients: "Benzoyl Peroxide, Retinol" },
  { label: "Niacinamide + Vit C", ingredients: "Niacinamide, Vitamin C" },
];

export default function CekKonflikPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState<string[]>(["", ""]);
  const [checked, setChecked] = useState(false);

  const addInput = () => {
    if (inputs.length < 4) setInputs([...inputs, ""]);
  };
  const removeInput = (i: number) => {
    if (inputs.length > 2) setInputs(inputs.filter((_, idx) => idx !== i));
  };
  const updateInput = (i: number, val: string) => {
    const next = [...inputs];
    next[i] = val;
    setInputs(next);
    setChecked(false);
  };

  const loadPreset = (preset: string) => {
    const parts = preset.split(",").map((s) => s.trim());
    const newInputs = [...parts];
    while (newInputs.length < 2) newInputs.push("");
    setInputs(newInputs.slice(0, 4));
    setChecked(false);
  };

  const allIngredients = useMemo(() => {
    if (!checked) return [];
    const combined = inputs.join(", ");
    return matchIngredients(combined);
  }, [inputs, checked]);

  const conflicts = useMemo(() => findConflicts(allIngredients), [allIngredients]);
  const safeIngredients = allIngredients.filter(
    (ing) => !conflicts.some((c) => c.ingredient1.id === ing.id || c.ingredient2.id === ing.id)
  );

  const hasAnyInput = inputs.some((s) => s.trim().length > 0);

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
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Cek Konflik Ingredient</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 flex-1">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10 text-xs px-3 py-1">
            <FlaskConical className="w-3 h-3 mr-1.5" /> Conflict Checker
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Apakah ingredient ini{" "}
            <span className="gradient-text">aman dikombinasikan?</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Masukkan ingredient atau produk yang kamu pakai — kami akan cek apakah ada konflik yang perlu dihindari.
          </p>
        </motion.div>

        {/* Preset Buttons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <p className="text-xs text-muted-foreground mb-2">Coba kombinasi populer:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_COMBOS.map((p) => (
              <button
                key={p.label}
                onClick={() => { loadPreset(p.ingredients); setChecked(false); }}
                className="px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input Fields */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3 mb-4">
          {inputs.map((val, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                <input
                  value={val}
                  onChange={(e) => updateInput(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1} (contoh: Retinol, BHA, Vitamin C)`}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {inputs.length > 2 && (
                <button onClick={() => removeInput(i)} className="p-3 rounded-xl border border-border bg-card text-muted-foreground/80 hover:text-destructive hover:border-destructive/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </motion.div>

        {inputs.length < 4 && (
          <button onClick={addInput} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
            <Plus className="w-3.5 h-3.5" /> Tambah ingredient
          </button>
        )}

        <Button
          onClick={() => setChecked(true)}
          disabled={!hasAnyInput}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mb-8"
        >
          <FlaskConical className="w-4 h-4" /> Cek Konflik
        </Button>

        {/* Results */}
        <AnimatePresence>
          {checked && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Detected ingredients */}
              {allIngredients.length > 0 ? (
                <>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                      {allIngredients.length} ingredient terdeteksi:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allIngredients.map((ing) => (
                        <Badge
                          key={ing.id}
                          variant="outline"
                          className={`text-xs ${
                            conflicts.some((c) => c.ingredient1.id === ing.id || c.ingredient2.id === ing.id)
                              ? "border-destructive/30 text-destructive bg-destructive/5"
                              : "border-primary/20 text-primary/80 bg-primary/5"
                          }`}
                        >
                          {ing.emoji} {ing.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Conflicts */}
                  {conflicts.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {conflicts.length} konflik ditemukan
                      </p>
                      {conflicts.map((c, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          initial="hidden"
                          animate="show"
                          transition={{ delay: i * 0.08 }}
                          className={`p-4 rounded-xl border ${
                            c.severity === "high"
                              ? "border-destructive/25 bg-destructive/8"
                              : "border-yellow-400/25 bg-yellow-400/5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {c.severity === "high" ? (
                              <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-sm font-semibold text-foreground">
                                  {c.ingredient1.name}
                                </span>
                                <span className="text-muted-foreground/80 text-xs">+</span>
                                <span className="text-sm font-semibold text-foreground">
                                  {c.ingredient2.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 ${
                                    c.severity === "high"
                                      ? "border-destructive/40 text-destructive"
                                      : "border-yellow-400/40 text-yellow-400"
                                  }`}
                                >
                                  {c.severity === "high" ? "Hindari" : "Hati-hati"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{c.reason}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      className="p-5 rounded-xl border border-green-400/25 bg-green-400/5 flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Tidak ada konflik yang diketahui ✅</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Kombinasi ingredient yang kamu masukkan aman digunakan bersamaan. Tetap lakukan patch test jika pertama kali mencoba produk baru.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Safe ingredients */}
                  {safeIngredients.length > 0 && conflicts.length > 0 && (
                    <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-4">
                      <p className="text-xs text-green-400 font-semibold mb-2">Aman dikombinasikan:</p>
                      <div className="flex flex-wrap gap-2">
                        {safeIngredients.map((ing) => (
                          <span key={ing.id} className="text-xs text-green-400/80">{ing.emoji} {ing.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learn more */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      Pelajari lebih dalam tentang setiap ingredient untuk memahami cara kerjanya dan cara menghindari konflik.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/edukasi")}
                      className="mt-3 w-full text-xs border-border"
                    >
                      Buka Edukasi Ingredient →
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="p-5 rounded-xl border border-border bg-card text-center"
                >
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm font-medium text-foreground mb-1">Ingredient tidak dikenali</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Coba ketik nama ingredient umum seperti "Retinol", "Niacinamide", "AHA", "BHA", "Vitamin C", "Benzoyl Peroxide", dsb.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["Retinol", "Niacinamide", "BHA", "Vitamin C", "Ceramide"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInputs([s, ""]); setChecked(false); }}
                        className="px-2.5 py-1 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tip section */}
        {!checked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 rounded-xl border border-primary/15 bg-primary/5 p-4"
          >
            <p className="text-xs text-primary font-semibold mb-2">💡 Cara pakai:</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• Ketik nama ingredient (misal: "Retinol" atau "AHA") di tiap kotak</li>
              <li>• Atau klik tombol preset untuk langsung cek kombinasi populer</li>
              <li>• Database kami mencakup 29+ ingredient skincare umum Indonesia</li>
            </ul>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <h2 className="text-lg font-bold text-foreground mb-2">Tidak yakin produk apa yang butuh?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Dapatkan rekomendasi personal berdasarkan kondisi kulit dan budgetmu.
          </p>
          <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" /> Analisis Kulit Gratis
          </Button>
        </motion.div>
      </div>

      <SiteFooter />
    </main>
  );
}
