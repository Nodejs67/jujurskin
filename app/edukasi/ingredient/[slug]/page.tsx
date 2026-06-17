"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield,
  FlaskConical, BookOpen, ShoppingBag, Sparkles, Baby, Clock,
  Star, Zap, GitCompare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getIngredientById,
  CATEGORY_LABELS,
  EVIDENCE_LABELS,
  SAFETY_LABELS,
  INGREDIENTS,
  type Ingredient,
} from "@/lib/ingredients";
import { PRODUCTS } from "@/lib/products";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const SAFETY_STYLES: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  sangat_aman: { color: "text-green-600", bg: "bg-green-400/10", border: "border-green-400/20", icon: CheckCircle },
  aman: { color: "text-blue-600", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: CheckCircle },
  hati_hati: { color: "text-yellow-600", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: AlertTriangle },
};

const EVIDENCE_STYLES: Record<string, string> = {
  kuat: "text-green-600",
  sedang: "text-yellow-600",
  terbatas: "text-muted-foreground",
};

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-4xl">🔬</p>
        <h2 className="text-xl font-bold text-foreground">Ingredient tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground">Ingredient ini belum ada di database kami.</p>
        <Button onClick={onBack} className="bg-primary text-primary-foreground">
          Kembali ke Edukasi
        </Button>
      </div>
    </div>
  );
}

function IngredientDetail({ ing }: { ing: Ingredient }) {
  const router = useRouter();
  const safeStyle = SAFETY_STYLES[ing.safety_rating];
  const SafeIcon = safeStyle.icon;

  const relatedIds = [...ing.works_well_with].slice(0, 4);
  const related = INGREDIENTS.filter((i) =>
    relatedIds.some((r) => i.name.toLowerCase().includes(r.toLowerCase()) || i.aliases.some(a => a.toLowerCase().includes(r.toLowerCase())))
  ).filter(i => i.id !== ing.id).slice(0, 3);

  const matchedProducts = PRODUCTS.filter((p) =>
    p.key_ingredients.some((ki) =>
      ki.toLowerCase().includes(ing.name.toLowerCase()) ||
      ing.aliases.some((al) => ki.toLowerCase().includes(al.toLowerCase().split(" ")[0]))
    )
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/edukasi")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Edukasi</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
              {CATEGORY_LABELS[ing.category]}
            </Badge>
            {ing.pregnancy_safe && (
              <Badge variant="outline" className="text-xs border-green-400/30 text-green-600 bg-green-400/10 gap-1">
                <Baby className="w-3 h-3" /> Aman Kehamilan
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{ing.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{ing.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Juga dikenal sebagai:{" "}
            <span className="text-foreground">{ing.aliases.join(", ")}</span>
          </p>
          <p className="mt-3 text-primary font-medium text-sm">{ing.tagline}</p>
        </motion.div>

        {/* Quick stats — 5 metrik */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
          className="grid grid-cols-5 gap-2">
          {/* Keamanan */}
          <div className={`rounded-xl border p-3 text-center ${safeStyle.bg} ${safeStyle.border}`}>
            <SafeIcon className={`w-4 h-4 mx-auto mb-1 ${safeStyle.color}`} />
            <p className={`text-[10px] font-semibold ${safeStyle.color} leading-tight`}>{SAFETY_LABELS[ing.safety_rating]}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Keamanan</p>
          </div>
          {/* Riset */}
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <Shield className={`w-4 h-4 mx-auto mb-1 ${EVIDENCE_STYLES[ing.evidence_level]}`} />
            <p className={`text-[10px] font-semibold ${EVIDENCE_STYLES[ing.evidence_level]} leading-tight`}>
              {EVIDENCE_LABELS[ing.evidence_level]}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Riset</p>
          </div>
          {/* Kehamilan */}
          <div className={`rounded-xl border p-3 text-center ${ing.pregnancy_safe ? "bg-rose-400/5 border-rose-400/20" : "bg-destructive/5 border-destructive/15"}`}>
            <Baby className={`w-4 h-4 mx-auto mb-1 ${ing.pregnancy_safe ? "text-rose-600" : "text-destructive/60"}`} />
            <p className={`text-[10px] font-semibold ${ing.pregnancy_safe ? "text-rose-600" : "text-destructive/70"} leading-tight`}>
              {ing.pregnancy_safe ? "Aman" : "Hindari"}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Hamil</p>
          </div>
          {/* Pemula */}
          <div className={`rounded-xl border p-3 text-center ${ing.beginner_friendly ? "bg-amber-400/5 border-amber-400/20" : "bg-muted/30 border-border"}`}>
            <Star className={`w-4 h-4 mx-auto mb-1 ${ing.beginner_friendly ? "text-amber-600" : "text-muted-foreground"}`} />
            <p className={`text-[10px] font-semibold leading-tight ${ing.beginner_friendly ? "text-amber-600" : "text-muted-foreground"}`}>
              {ing.beginner_friendly ? "Friendly" : "Advanced"}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Pemula</p>
          </div>
          {/* Iritasi */}
          {ing.irritation_risk && (
            <div className={`rounded-xl border p-3 text-center ${
              ing.irritation_risk === "rendah" ? "bg-green-400/5 border-green-400/20" :
              ing.irritation_risk === "sedang" ? "bg-amber-400/5 border-amber-400/20" :
              "bg-red-400/5 border-red-400/20"
            }`}>
              <Zap className={`w-4 h-4 mx-auto mb-1 ${
                ing.irritation_risk === "rendah" ? "text-green-600" :
                ing.irritation_risk === "sedang" ? "text-amber-600" : "text-red-600"
              }`} />
              <p className={`text-[10px] font-semibold leading-tight capitalize ${
                ing.irritation_risk === "rendah" ? "text-green-600" :
                ing.irritation_risk === "sedang" ? "text-amber-600" : "text-red-600"
              }`}>{ing.irritation_risk}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Iritasi</p>
            </div>
          )}
        </motion.div>

        {/* Compare CTA */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.12 }}>
          <a href={`/bandingkan?a=${ing.id}`}
            className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors">
            <GitCompare className="w-3.5 h-3.5" />
            Bandingkan {ing.name} dengan ingredient lain →
          </a>
        </motion.div>

        {/* Description */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" /> Apa itu {ing.name}?
          </p>
          <p className="text-sm text-foreground leading-relaxed">{ing.description}</p>
        </motion.div>

        {/* How it works */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-xs text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Bagaimana cara kerjanya?
          </p>
          <p className="text-sm text-foreground leading-relaxed">{ing.how_it_works}</p>
        </motion.div>

        {/* Good for / Avoid */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.25 }}
          className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-3">✅ Cocok untuk</p>
            <div className="space-y-2">
              {ing.good_for.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          {ing.avoid_if.length > 0 ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
              <p className="text-xs text-destructive/70 font-semibold uppercase tracking-wide mb-3">⚠️ Hindari jika</p>
              <div className="space-y-2">
                {ing.avoid_if.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-destructive/60 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-green-600 font-medium">Tidak ada kontraindikasi</p>
                <p className="text-xs text-muted-foreground mt-1">Aman untuk semua orang</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* How to use */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Cara Pemakaian
          </p>
          <div className="space-y-3">
            {ing.recommended_concentration && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
                <FlaskConical className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground mb-0.5">Konsentrasi yang dianjurkan</p>
                  <p className="text-xs text-muted-foreground">{ing.recommended_concentration}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground mb-0.5">Cara pakai</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ing.how_to_use}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
              <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground mb-0.5">Frekuensi</p>
                <p className="text-xs text-muted-foreground">{ing.frequency}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactions */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }}
          className="grid sm:grid-cols-2 gap-4">
          {/* Works well with */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-3">💚 Cocok dikombinasikan</p>
            <div className="space-y-1.5">
              {ing.works_well_with.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                  <span className="text-xs text-foreground">{item}</span>
                </div>
              ))}
              {ing.works_well_with.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Tidak ada aturan khusus</p>
              )}
            </div>
          </div>

          {/* Conflicts with */}
          <div className={`rounded-xl border p-5 ${ing.conflicts_with.length > 0 ? "border-yellow-400/20 bg-yellow-400/5" : "border-border bg-card"}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${ing.conflicts_with.length > 0 ? "text-yellow-600" : "text-muted-foreground"}`}>
              ⚠️ Jangan dikombinasikan
            </p>
            {ing.conflicts_with.length > 0 ? (
              <div className="space-y-3">
                {ing.conflicts_with.map((item, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-foreground mb-0.5">❌ {item.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-foreground">Bisa dikombinasikan dengan hampir semua bahan</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Products in Indonesia */}
        {ing.popular_products.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Produk Indonesia yang mengandung {ing.name}
            </p>
            <div className="space-y-2">
              {ing.popular_products.map((product, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="text-xs text-foreground">{product}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Harga estimasi, bisa berbeda di tiap platform
            </p>
          </motion.div>
        )}

        {/* Price info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.42 }}
          className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3">
          <ShoppingBag className="w-4 h-4 text-accent shrink-0" />
          <div>
            <p className="text-xs font-medium text-accent">Harga di Indonesia</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ing.price_in_indonesia}</p>
          </div>
        </motion.div>

        {/* Myths */}
        {ing.myths.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.45 }}>
            <p className="text-sm font-semibold text-foreground mb-3">Mitos vs Fakta</p>
            <div className="space-y-3">
              {ing.myths.map((myth, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-start gap-3 p-4 border-b border-border/50 bg-destructive/5">
                    <XCircle className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-destructive/60 font-medium mb-0.5 uppercase tracking-wide">Mitos</p>
                      <p className="text-sm text-foreground">&ldquo;{myth.myth}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-400/5">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-green-600 font-medium mb-0.5 uppercase tracking-wide">Fakta</p>
                      <p className="text-sm text-foreground leading-relaxed">{myth.fact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related ingredients */}
        {related.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.5 }}>
            <p className="text-sm font-semibold text-foreground mb-3">Bahan yang cocok dikombinasikan</p>
            <div className="grid grid-cols-3 gap-3">
              {related.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => window.location.href = `/edukasi/ingredient/${rel.id}`}
                  className="rounded-xl border border-border bg-card p-3 text-center hover:border-primary/30 transition-colors group"
                >
                  <span className="text-xl block mb-1">{rel.emoji}</span>
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {rel.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{rel.tagline}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matched products from our database */}
        {matchedProducts.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.52 }}>
            <p className="text-sm font-semibold text-foreground mb-3">Produk dengan {ing.name} dari database kami</p>
            <div className="space-y-2">
              {matchedProducts.map((prod) => (
                <div key={prod.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                  <span className="text-xl shrink-0">{prod.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                    <p className="text-xs text-muted-foreground">{prod.brand} · Rp {prod.price_min.toLocaleString("id")}</p>
                  </div>
                  {prod.bpom_registered && (
                    <Badge variant="outline" className="text-[10px] border-green-400/30 text-green-600 shrink-0">BPOM</Badge>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/produk")}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Lihat semua produk →
            </button>
          </motion.div>
        )}

        {/* Check conflicts CTA */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.53 }}
          className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-yellow-600 mb-1">Kombinasi dengan produk lain?</p>
            <p className="text-xs text-muted-foreground mb-2">Cek apakah {ing.name} aman dikombinasikan dengan ingredient lain yang kamu pakai.</p>
            <button
              onClick={() => router.push(`/cek-konflik`)}
              className="text-xs text-yellow-600 hover:underline font-medium"
            >
              Cek Konflik Ingredient →
            </button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.55 }} className="pb-6 space-y-3">
          <Button onClick={() => window.location.href = "/analisis"} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" /> Analisis Kulit dengan Rekomendasi Personal
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/edukasi"} className="w-full border-border gap-2">
            <BookOpen className="w-4 h-4" /> Lihat Semua Ingredient
          </Button>
        </motion.div>

      </div>
    </main>
  );
}

export default function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const ing = getIngredientById(slug);

  if (!ing) return <NotFound onBack={() => router.push("/edukasi")} />;
  return <IngredientDetail ing={ing} />;
}
