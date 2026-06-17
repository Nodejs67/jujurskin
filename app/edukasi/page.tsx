"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, BookOpen, Shield, FlaskConical, Sparkles, Droplets, Leaf, Sun, ChevronRight, CheckCircle, AlertTriangle, Baby, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import {
  INGREDIENTS,
  CATEGORY_LABELS,
  EVIDENCE_LABELS,
  SAFETY_LABELS,
  type IngredientCategory,
  type Ingredient,
} from "@/lib/ingredients";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const CATEGORY_ICONS: Record<IngredientCategory, React.ElementType> = {
  treatment: FlaskConical,
  sunscreen: Sun,
  moisturizer: Droplets,
  brightening: Sparkles,
  soothing: Leaf,
  antioxidant: Shield,
};

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  treatment: "text-blue-700 bg-blue-400/10 border-blue-400/20",
  sunscreen: "text-yellow-700 bg-yellow-400/10 border-yellow-400/20",
  moisturizer: "text-cyan-700 bg-cyan-400/10 border-cyan-400/20",
  brightening: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  soothing: "text-green-700 bg-green-400/10 border-green-400/20",
  antioxidant: "text-orange-700 bg-orange-400/10 border-orange-400/20",
};

const SAFETY_COLORS: Record<string, string> = {
  sangat_aman: "text-green-700 bg-green-400/10 border-green-400/20",
  aman: "text-blue-700 bg-blue-400/10 border-blue-400/20",
  hati_hati: "text-yellow-700 bg-yellow-400/10 border-yellow-400/20",
};

const EVIDENCE_COLORS: Record<string, string> = {
  kuat: "text-green-700",
  sedang: "text-yellow-700",
  terbatas: "text-muted-foreground",
};

function IngredientCard({ ingredient, onClick }: { ingredient: Ingredient; onClick: () => void }) {
  const CatIcon = CATEGORY_ICONS[ingredient.category];

  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      className="w-full text-left glow-card rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ingredient.emoji}</span>
          <div>
            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
              {ingredient.name}
            </h3>
            {ingredient.aliases.length > 0 && (
              <p className="text-xs text-muted-foreground">{ingredient.aliases[0]}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{ingredient.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${CATEGORY_COLORS[ingredient.category]}`}>
          <CatIcon className="w-2.5 h-2.5 mr-1" />
          {CATEGORY_LABELS[ingredient.category]}
        </Badge>
        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${SAFETY_COLORS[ingredient.safety_rating]}`}>
          {SAFETY_LABELS[ingredient.safety_rating]}
        </Badge>
        <Badge variant="outline" className={`text-xs px-2 py-0.5 border-border ${EVIDENCE_COLORS[ingredient.evidence_level]}`}>
          {EVIDENCE_LABELS[ingredient.evidence_level]}
        </Badge>
        {ingredient.pregnancy_safe && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 text-rose-700 border-rose-400/30 bg-rose-400/5">
            🤰 Hamil OK
          </Badge>
        )}
        {ingredient.beginner_friendly && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 text-amber-700 border-amber-400/30 bg-amber-400/5">
            ⭐ Pemula
          </Badge>
        )}
        {ingredient.irritation_risk === "tinggi" && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 text-red-700 border-red-400/30 bg-red-400/5">
            ⚠️ Iritasi Tinggi
          </Badge>
        )}
      </div>
    </motion.button>
  );
}

const ALL_CATEGORIES: (IngredientCategory | "semua")[] = [
  "semua",
  "treatment",
  "sunscreen",
  "moisturizer",
  "brightening",
  "soothing",
  "antioxidant",
];

type SmartFilter = "aman_hamil" | "pemula" | "low_iritasi" | "bukti_kuat";

const SMART_FILTERS: { id: SmartFilter; label: string; icon: React.ElementType; color: string }[] = [
  { id: "aman_hamil", label: "Aman Hamil", icon: Baby, color: "text-rose-700 bg-rose-400/10 border-rose-400/30" },
  { id: "pemula", label: "Pemula Friendly", icon: Star, color: "text-amber-700 bg-amber-400/10 border-amber-400/30" },
  { id: "low_iritasi", label: "Low Iritasi", icon: Zap, color: "text-green-700 bg-green-400/10 border-green-400/30" },
  { id: "bukti_kuat", label: "Bukti Kuat", icon: Shield, color: "text-blue-700 bg-blue-400/10 border-blue-400/30" },
];

export default function EdukasiPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<IngredientCategory | "semua">("semua");
  const [smartFilters, setSmartFilters] = useState<SmartFilter[]>([]);

  const toggleSmartFilter = (f: SmartFilter) => {
    setSmartFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const filtered = useMemo(() => {
    let list = INGREDIENTS;
    if (activeCategory !== "semua") {
      list = list.filter((i) => i.category === activeCategory);
    }
    if (smartFilters.includes("aman_hamil")) list = list.filter(i => i.pregnancy_safe === true);
    if (smartFilters.includes("pemula")) list = list.filter(i => i.beginner_friendly === true);
    if (smartFilters.includes("low_iritasi")) list = list.filter(i => i.irritation_risk === "rendah");
    if (smartFilters.includes("bukti_kuat")) list = list.filter(i => i.evidence_level === "kuat");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.aliases.some((a) => a.toLowerCase().includes(q)) ||
          i.tagline.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, activeCategory, smartFilters]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Edukasi Ingredient</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10 text-xs px-3 py-1">
            <BookOpen className="w-3 h-3 mr-1.5" /> {INGREDIENTS.length} Ingredient
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Pahami apa yang kamu{" "}
            <span className="gradient-text">oleskan ke kulit</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Penjelasan ingredient skincare dalam bahasa Indonesia yang sederhana — bukan jargon kimia, tapi fakta yang bisa kamu pakai untuk keputusan lebih cerdas.
          </p>
        </motion.div>

        {/* Quick info boxes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: CheckCircle, label: "Aman dipakai", value: `${INGREDIENTS.filter(i => i.safety_rating === "sangat_aman").length} ingredient`, color: "text-green-700 bg-green-400/10 border-green-400/20" },
            { icon: Shield, label: "Bukti ilmiah kuat", value: `${INGREDIENTS.filter(i => i.evidence_level === "kuat").length} ingredient`, color: "text-primary bg-primary/10 border-primary/20" },
            { icon: AlertTriangle, label: "Perlu hati-hati", value: `${INGREDIENTS.filter(i => i.safety_rating === "hati_hati").length} ingredient`, color: "text-yellow-700 bg-yellow-400/10 border-yellow-400/20" },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl border p-4 text-center ${stat.color}`}>
              <stat.icon className="w-4 h-4 mx-auto mb-1.5" />
              <p className="text-sm font-bold">{stat.value}</p>
              <p className="text-xs opacity-90 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari ingredient... (contoh: niacinamide, retinol, BHA)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </motion.div>

        {/* Smart Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-muted-foreground self-center mr-1">Filter cepat:</span>
          {SMART_FILTERS.map((f) => {
            const isActive = smartFilters.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleSmartFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive ? f.color : "border-border bg-card text-muted-foreground hover:border-border/80"
                }`}
              >
                <f.icon className="w-3 h-3" /> {f.label}
              </button>
            );
          })}
          {smartFilters.length > 0 && (
            <button onClick={() => setSmartFilters([])} className="text-xs text-muted-foreground hover:text-foreground underline">
              Reset
            </button>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mb-8">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const Icon = cat === "semua" ? BookOpen : CATEGORY_ICONS[cat];
            const label = cat === "semua" ? "Semua" : CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            );
          })}
        </motion.div>

        {/* Results count */}
        {(query || activeCategory !== "semua" || smartFilters.length > 0) && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} ingredient ditemukan
          </p>
        )}

        {/* Ingredient Grid */}
        {filtered.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="show"
          >
            {filtered.map((ing) => (
              <IngredientCard
                key={ing.id}
                ingredient={ing}
                onClick={() => router.push(`/edukasi/ingredient/${ing.id}`)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-foreground font-medium">Ingredient tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">Coba kata kunci lain seperti nama kimia atau nama populernya</p>
            <button onClick={() => { setQuery(""); setActiveCategory("semua"); setSmartFilters([]); }} className="mt-4 text-xs text-primary hover:underline">
              Reset filter
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <p className="text-xs text-primary uppercase tracking-widest mb-3">Siap action?</p>
          <h2 className="text-xl font-bold text-foreground mb-2">Analisis kulitmu sekarang</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Setelah tahu ingredient-nya, dapatkan rekomendasi produk spesifik yang cocok untuk kondisi dan budget kamu.
          </p>
          <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" /> Analisis Gratis
          </Button>
        </motion.div>
      </div>
      <SiteFooter />
    </main>
  );
}
