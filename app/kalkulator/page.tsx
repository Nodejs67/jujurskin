"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, DollarSign, CheckCircle, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { PRODUCTS } from "@/lib/products";


const STARTER_KITS: {
  name: string;
  desc: string;
  budget_min: number;
  budget_max: number;
  items: { name: string; category: string; price: number; optional?: boolean }[];
}[] = [
  {
    name: "Starter Pack Minimal",
    desc: "3 produk yang paling penting — titik mulai yang solid",
    budget_min: 70000,
    budget_max: 120000,
    items: [
      { name: "Cleanser gentle", category: "Cleanser", price: 35000 },
      { name: "Moisturizer ringan", category: "Moisturizer", price: 30000 },
      { name: "Sunscreen SPF 50+", category: "Sunscreen", price: 35000 },
    ],
  },
  {
    name: "Starter Pack Lengkap",
    desc: "4-5 produk — routine yang sudah cukup komprehensif",
    budget_min: 150000,
    budget_max: 250000,
    items: [
      { name: "Cleanser low-pH", category: "Cleanser", price: 45000 },
      { name: "Toner hidrasi", category: "Toner", price: 55000 },
      { name: "Serum Niacinamide", category: "Serum", price: 65000 },
      { name: "Moisturizer", category: "Moisturizer", price: 60000 },
      { name: "Sunscreen SPF 50+", category: "Sunscreen", price: 55000 },
    ],
  },
  {
    name: "Routine Anti-Jerawat",
    desc: "Fokus mengatasi jerawat dan bekasnya",
    budget_min: 150000,
    budget_max: 300000,
    items: [
      { name: "Cleanser BHA / low-pH", category: "Cleanser", price: 45000 },
      { name: "BHA serum (Salicylic Acid)", category: "Serum AHA/BHA", price: 70000 },
      { name: "Niacinamide serum", category: "Serum", price: 65000 },
      { name: "Moisturizer oil-free", category: "Moisturizer", price: 65000 },
      { name: "Sunscreen ringan SPF 50", category: "Sunscreen", price: 55000 },
    ],
  },
  {
    name: "Routine Kulit Kering",
    desc: "Fokus hidrasi dan memperkuat skin barrier",
    budget_min: 160000,
    budget_max: 280000,
    items: [
      { name: "Cream cleanser gentle", category: "Cleanser", price: 55000 },
      { name: "Hyaluronic Acid serum", category: "Serum", price: 75000 },
      { name: "Ceramide moisturizer", category: "Moisturizer", price: 110000 },
      { name: "Sunscreen SPF 50+", category: "Sunscreen", price: 55000 },
    ],
  },
  {
    name: "Routine Anti-Aging",
    desc: "Fokus pencegahan penuaan dini dan pencerah",
    budget_min: 200000,
    budget_max: 400000,
    items: [
      { name: "Cleanser gentle", category: "Cleanser", price: 45000 },
      { name: "Vitamin C serum (pagi)", category: "Serum Vitamin C", price: 65000 },
      { name: "Retinol serum (malam)", category: "Serum Retinol", price: 80000 },
      { name: "Ceramide moisturizer", category: "Moisturizer", price: 110000 },
      { name: "Sunscreen SPF 50+", category: "Sunscreen", price: 55000 },
    ],
  },
];

const BUDGET_SLABS = [
  { label: "< Rp 100.000", value: 100000 },
  { label: "Rp 100k – 200k", value: 200000 },
  { label: "Rp 200k – 350k", value: 350000 },
  { label: "Rp 350k – 500k", value: 500000 },
  { label: "> Rp 500.000", value: 750000 },
];

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id")}`;
}

export default function KalkulatorPage() {
  const router = useRouter();
  const [budget, setBudget] = useState<number | null>(null);
  const [selectedKit, setSelectedKit] = useState<number | null>(null);

  const affordableKits = useMemo(() => {
    if (!budget) return STARTER_KITS;
    return STARTER_KITS.filter((k) => k.budget_min <= budget);
  }, [budget]);

  const budgetProducts = useMemo(() => {
    if (!budget) return [];
    return PRODUCTS.filter((p) => p.price_min <= budget).sort((a, b) => b.rating_community - a.rating_community).slice(0, 6);
  }, [budget]);

  const kit = selectedKit !== null ? STARTER_KITS[selectedKit] : null;
  const kitTotal = kit ? kit.items.reduce((acc, i) => acc + i.price, 0) : 0;
  const kitSavings = kit && budget ? budget - kitTotal : 0;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Budget Planner</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex-1">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10 text-xs px-3 py-1">
            <DollarSign className="w-3 h-3 mr-1.5" /> Budget Planner
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Skincare terbaik untuk{" "}
            <span className="gradient-text">budgetmu</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Masukkan budget bulananmu dan kami akan tunjukkan starter kit terbaik yang bisa kamu bangun — tidak lebih, tidak kurang.
          </p>
        </motion.div>

        {/* Budget Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">Berapa budget skincare bulananmu?</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {BUDGET_SLABS.map((slab) => (
              <button
                key={slab.value}
                onClick={() => { setBudget(slab.value); setSelectedKit(null); }}
                className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                  budget === slab.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {slab.label}
              </button>
            ))}
          </div>

          {/* Input budget manual — ketik angka, otomatis diformat */}
          <div className="mt-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">Rp</span>
              <input
                inputMode="numeric"
                value={budget ? budget.toLocaleString("id") : ""}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setBudget(digits ? parseInt(digits, 10) : null);
                  setSelectedKit(null);
                }}
                placeholder="atau ketik sendiri, contoh: 150.000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Contoh: ketik <span className="text-foreground font-medium">150000</span> → otomatis jadi <span className="text-primary font-medium">Rp 150.000</span>.
            </p>
          </div>
        </motion.div>

        {budget && (
          <>
            {/* Starter Kits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-foreground">Starter Kit yang sesuai budgetmu:</p>
                <Badge variant="outline" className="text-xs border-primary/20 text-primary/70 bg-primary/5">
                  {affordableKits.length} opsi
                </Badge>
              </div>

              {affordableKits.length > 0 ? (
                <div className="space-y-3">
                  {affordableKits.map((k) => {
                    const total = k.items.reduce((acc, item) => acc + item.price, 0);
                    const isSelected = selectedKit === STARTER_KITS.indexOf(k);
                    const isAffordable = total <= budget;

                    return (
                      <button
                        key={k.name}
                        onClick={() => setSelectedKit(isSelected ? null : STARTER_KITS.indexOf(k))}
                        className={`w-full text-left rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/8"
                            : "border-border bg-card hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-foreground">{k.name}</p>
                              {isAffordable && (
                                <Badge variant="outline" className="text-[10px] border-green-400/30 text-green-400 px-1.5 py-0">
                                  Masuk budget ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{k.desc}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-accent">{formatRp(total)}</p>
                            <p className="text-xs text-muted-foreground/80">{k.items.length} produk</p>
                          </div>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 space-y-2 border-t border-border/50 pt-3"
                          >
                            {k.items.map((item, j) => (
                              <div key={j} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-primary/60 shrink-0" />
                                  <span className="text-foreground">{item.name}</span>
                                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground px-1.5 py-0">{item.category}</Badge>
                                </div>
                                <span className="text-muted-foreground">{formatRp(item.price)}</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                              <span className="text-xs font-semibold text-foreground">Total</span>
                              <span className="text-sm font-bold text-accent">{formatRp(total)}</span>
                            </div>
                            {isAffordable && kitSavings > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-green-400">Sisa budget</span>
                                <span className="text-xs font-semibold text-green-400">{formatRp(kitSavings)}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-6 text-center">
                  <p className="text-2xl mb-2">💡</p>
                  <p className="text-sm font-medium text-foreground mb-1">Budget sangat terbatas</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Dengan budget di bawah Rp 100k, prioritaskan hanya 1 produk: <strong>Sunscreen.</strong> Ini adalah investasi terpenting untuk kulitmu.
                  </p>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-left">
                    <p className="text-xs font-medium text-primary mb-1">Produk prioritas:</p>
                    <p className="text-xs text-foreground">Azarine Hydrasoothe SPF 45 — Rp 30.000–40.000</p>
                    <p className="text-xs text-foreground mt-1">Emina Sun Protection SPF 30 — Rp 25.000–35.000</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Budget products from database */}
            {budgetProducts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-foreground">Produk terbaik di budgetmu:</p>
                  <button onClick={() => router.push("/produk")} className="text-xs text-primary hover:underline">Lihat semua →</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {budgetProducts.map((prod) => (
                    <div key={prod.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
                      <span className="text-xl shrink-0">{prod.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                        <p className="text-[11px] text-muted-foreground">{prod.brand}</p>
                        <p className="text-[11px] text-accent font-semibold mt-0.5">{formatRp(prod.price_min)}+</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[10px] text-accent">★</span>
                        <span className="text-[10px] text-muted-foreground">{prod.rating_community.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Budget tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <p className="text-xs text-primary font-semibold mb-3">💡 Tips memaksimalkan budget</p>
              <div className="space-y-2">
                {[
                  "Tidak harus beli semua produk sekaligus — mulai dari sunscreen + cleanser dulu",
                  "Produk budget lokal (Azarine, Emina) sering sama efektifnya dengan premium import",
                  "Satu produk yang konsisten > lima produk yang berganti-ganti setiap bulan",
                  "Beli ukuran besar jika produknya cocok — harga per ml jauh lebih hemat",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <TrendingDown className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Analisis CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <h2 className="text-lg font-bold text-foreground mb-2">Ingin rekomendasi lebih personal?</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Analisis kondisi kulitmu dan dapatkan rekomendasi produk spesifik yang disesuaikan dengan tipe kulit, masalah, dan budgetmu.
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
