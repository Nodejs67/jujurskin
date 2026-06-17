"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, GitCompare, Search, CheckCircle, XCircle,
  AlertTriangle, Baby, Shield, Star, Zap, Sparkles, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  INGREDIENTS, CATEGORY_LABELS, EVIDENCE_LABELS, SAFETY_LABELS,
  type Ingredient,
} from "@/lib/ingredients";

// ── Popular pairs for quick compare
const POPULAR_PAIRS = [
  { a: "retinol", b: "bakuchiol", label: "Retinol vs Bakuchiol" },
  { a: "vitamin-c", b: "niacinamide", label: "Vitamin C vs Niacinamide" },
  { a: "salicylic-acid", b: "glycolic-acid", label: "BHA vs AHA" },
  { a: "hyaluronic-acid", b: "polyglutamic-acid", label: "HA vs PGA" },
  { a: "adapalene", b: "tretinoin", label: "Adapalene vs Tretinoin" },
  { a: "tranexamic-acid", b: "alpha-arbutin", label: "TXA vs Alpha Arbutin" },
  { a: "ceramide", b: "squalane", label: "Ceramide vs Squalane" },
  { a: "niacinamide", b: "zinc-pca", label: "Niacinamide vs Zinc PCA" },
];

function IngredientPicker({
  value,
  onChange,
  label,
  exclude,
}: {
  value: Ingredient | null;
  onChange: (ing: Ingredient) => void;
  label: string;
  exclude?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INGREDIENTS.filter(
      (i) =>
        i.id !== exclude &&
        (i.name.toLowerCase().includes(q) ||
          i.aliases.some((a) => a.toLowerCase().includes(q)))
    ).slice(0, 6);
  }, [query, exclude]);

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{label}</p>
      {value ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{value.emoji}</span>
              <div>
                <p className="font-semibold text-sm">{value.name}</p>
                <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[value.category]}</p>
              </div>
            </div>
            <button
              onClick={() => { setQuery(""); setOpen(false); onChange(null as unknown as Ingredient); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕ Ganti
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Ketik nama ingredient..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {open && results.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl border border-border bg-card shadow-lg z-20 overflow-hidden">
              {results.map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => { onChange(ing); setQuery(""); setOpen(false); }}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0"
                >
                  <span className="text-lg">{ing.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{ing.name}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[ing.category]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type CompareRow = {
  label: string;
  getA: (i: Ingredient) => React.ReactNode;
  getB: (i: Ingredient) => React.ReactNode;
  winner?: (a: Ingredient, b: Ingredient) => "a" | "b" | "tie";
};

function safetyScore(i: Ingredient) {
  return i.safety_rating === "sangat_aman" ? 3 : i.safety_rating === "aman" ? 2 : 1;
}
function evidenceScore(i: Ingredient) {
  return i.evidence_level === "kuat" ? 3 : i.evidence_level === "sedang" ? 2 : 1;
}
function irritationScore(i: Ingredient) {
  if (!i.irritation_risk) return 2;
  return i.irritation_risk === "rendah" ? 3 : i.irritation_risk === "sedang" ? 2 : 1;
}

function SafetyBadge({ ing }: { ing: Ingredient }) {
  const c = ing.safety_rating === "sangat_aman" ? "text-green-400" : ing.safety_rating === "aman" ? "text-blue-400" : "text-amber-400";
  return <span className={`text-xs font-semibold ${c}`}>{SAFETY_LABELS[ing.safety_rating]}</span>;
}
function EvidenceBadge({ ing }: { ing: Ingredient }) {
  const c = ing.evidence_level === "kuat" ? "text-green-400" : ing.evidence_level === "sedang" ? "text-amber-400" : "text-muted-foreground";
  return <span className={`text-xs font-semibold ${c}`}>{EVIDENCE_LABELS[ing.evidence_level]}</span>;
}
function IrritationBadge({ ing }: { ing: Ingredient }) {
  if (!ing.irritation_risk) return <span className="text-xs text-muted-foreground">—</span>;
  const c = ing.irritation_risk === "rendah" ? "text-green-400" : ing.irritation_risk === "sedang" ? "text-amber-400" : "text-red-400";
  return <span className={`text-xs font-semibold ${c} capitalize`}>{ing.irritation_risk}</span>;
}

function ConflictCheck({ a, b }: { a: Ingredient; b: Ingredient }) {
  const aConflictsWithB = a.conflicts_with.some(c =>
    b.name.toLowerCase().includes(c.name.toLowerCase()) ||
    b.aliases.some(al => c.name.toLowerCase().includes(al.toLowerCase().split(" ")[0]))
  );
  const conflictEntry = a.conflicts_with.find(c =>
    b.name.toLowerCase().includes(c.name.toLowerCase()) ||
    b.aliases.some(al => c.name.toLowerCase().includes(al.toLowerCase().split(" ")[0]))
  );
  const worksWell = a.works_well_with.some(w =>
    b.name.toLowerCase().includes(w.toLowerCase()) ||
    b.aliases.some(al => w.toLowerCase().includes(al.toLowerCase().split(" ")[0]))
  );

  if (aConflictsWithB) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm font-semibold text-red-400">Konflik — Jangan Dipakai Bersamaan!</p>
        </div>
        {conflictEntry && (
          <p className="text-xs text-muted-foreground leading-relaxed">{conflictEntry.reason}</p>
        )}
      </div>
    );
  }

  if (worksWell) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <p className="text-sm font-semibold text-green-400">Kompatibel — Bagus Dipakai Bersama!</p>
        </div>
        <p className="text-xs text-muted-foreground">{a.name} dan {b.name} bekerja sinergis.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-medium text-muted-foreground">Tidak ada konflik yang terdokumentasi — aman dipakai bersama.</p>
      </div>
    </div>
  );
}

function CompareTable({ a, b }: { a: Ingredient; b: Ingredient }) {
  const scoreA = evidenceScore(a) + safetyScore(a) + irritationScore(a) + (a.pregnancy_safe ? 1 : 0) + (a.beginner_friendly ? 1 : 0);
  const scoreB = evidenceScore(b) + safetyScore(b) + irritationScore(b) + (b.pregnancy_safe ? 1 : 0) + (b.beginner_friendly ? 1 : 0);
  const winner = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "tie";

  const rows: CompareRow[] = [
    {
      label: "Kategori",
      getA: (i) => <span className="text-xs text-primary">{CATEGORY_LABELS[i.category]}</span>,
      getB: (i) => <span className="text-xs text-primary">{CATEGORY_LABELS[i.category]}</span>,
    },
    {
      label: "Keamanan",
      getA: (i) => <SafetyBadge ing={i} />,
      getB: (i) => <SafetyBadge ing={i} />,
      winner: (a, b) => safetyScore(a) > safetyScore(b) ? "a" : safetyScore(b) > safetyScore(a) ? "b" : "tie",
    },
    {
      label: "Bukti Ilmiah",
      getA: (i) => <EvidenceBadge ing={i} />,
      getB: (i) => <EvidenceBadge ing={i} />,
      winner: (a, b) => evidenceScore(a) > evidenceScore(b) ? "a" : evidenceScore(b) > evidenceScore(a) ? "b" : "tie",
    },
    {
      label: "Risiko Iritasi",
      getA: (i) => <IrritationBadge ing={i} />,
      getB: (i) => <IrritationBadge ing={i} />,
      winner: (a, b) => irritationScore(a) > irritationScore(b) ? "a" : irritationScore(b) > irritationScore(a) ? "b" : "tie",
    },
    {
      label: "Aman Hamil",
      getA: (i) => i.pregnancy_safe
        ? <span className="text-xs text-rose-400 font-semibold">✓ Aman</span>
        : <span className="text-xs text-muted-foreground">Hindari</span>,
      getB: (i) => i.pregnancy_safe
        ? <span className="text-xs text-rose-400 font-semibold">✓ Aman</span>
        : <span className="text-xs text-muted-foreground">Hindari</span>,
      winner: (a, b) => a.pregnancy_safe && !b.pregnancy_safe ? "a" : !a.pregnancy_safe && b.pregnancy_safe ? "b" : "tie",
    },
    {
      label: "Ramah Pemula",
      getA: (i) => i.beginner_friendly
        ? <span className="text-xs text-amber-400 font-semibold">⭐ Ya</span>
        : <span className="text-xs text-muted-foreground">Advanced</span>,
      getB: (i) => i.beginner_friendly
        ? <span className="text-xs text-amber-400 font-semibold">⭐ Ya</span>
        : <span className="text-xs text-muted-foreground">Advanced</span>,
      winner: (a, b) => (a.beginner_friendly ? 1 : 0) > (b.beginner_friendly ? 1 : 0) ? "a" : (b.beginner_friendly ? 1 : 0) > (a.beginner_friendly ? 1 : 0) ? "b" : "tie",
    },
    {
      label: "Harga di Indonesia",
      getA: (i) => <span className="text-xs">{i.price_in_indonesia || "—"}</span>,
      getB: (i) => <span className="text-xs">{i.price_in_indonesia || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-3 gap-3">
        <div /> {/* spacer */}
        {[a, b].map((ing, idx) => (
          <motion.div
            key={ing.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-xl border p-3 text-center ${
              (idx === 0 && winner === "a") || (idx === 1 && winner === "b")
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <p className="text-xl mb-1">{ing.emoji}</p>
            <p className="text-xs font-bold leading-tight">{ing.name}</p>
            {((idx === 0 && winner === "a") || (idx === 1 && winner === "b")) && (
              <Badge className="text-[9px] mt-1.5 bg-primary/20 text-primary border-primary/30">🏆 Unggul</Badge>
            )}
          </motion.div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, i) => {
        const w = row.winner?.(a, b);
        return (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="grid grid-cols-3 gap-3 items-center"
          >
            <p className="text-xs text-muted-foreground font-medium">{row.label}</p>
            <div className={`rounded-lg border p-2.5 text-center ${w === "a" ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/60"}`}>
              {row.getA(a)}
              {w === "a" && <span className="block text-[9px] text-primary mt-0.5">✓ Lebih baik</span>}
            </div>
            <div className={`rounded-lg border p-2.5 text-center ${w === "b" ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/60"}`}>
              {row.getB(b)}
              {w === "b" && <span className="block text-[9px] text-primary mt-0.5">✓ Lebih baik</span>}
            </div>
          </motion.div>
        );
      })}

      {/* Conflict check */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Kompatibilitas</p>
        <ConflictCheck a={a} b={b} />
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold">Ringkasan Perbandingan</p>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p><strong className="text-foreground">{a.name}</strong>: {a.tagline}</p>
          <p><strong className="text-foreground">{b.name}</strong>: {b.tagline}</p>
          <div className="mt-3 pt-3 border-t border-border/40">
            {winner === "tie" ? (
              <p>Keduanya memiliki kualitas yang setara secara keseluruhan — pilihan bergantung pada <strong className="text-foreground">kebutuhan spesifik</strong> kulitmu.</p>
            ) : (
              <p>
                <strong className="text-primary">{winner === "a" ? a.name : b.name}</strong> unggul secara keseluruhan dalam metrik keamanan, bukti ilmiah, dan tolerabilitas.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail links */}
      <div className="grid grid-cols-2 gap-3">
        <a href={`/edukasi/ingredient/${a.id}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
          Detail {a.name} <ArrowRight className="w-3 h-3" />
        </a>
        <a href={`/edukasi/ingredient/${b.id}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
          Detail {b.name} <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function BandingkanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initA = searchParams.get("a") ? INGREDIENTS.find(i => i.id === searchParams.get("a")) ?? null : null;
  const initB = searchParams.get("b") ? INGREDIENTS.find(i => i.id === searchParams.get("b")) ?? null : null;

  const [ingA, setIngA] = useState<Ingredient | null>(initA);
  const [ingB, setIngB] = useState<Ingredient | null>(initB);

  const canCompare = ingA && ingB && ingA.id !== ingB.id;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Bandingkan Ingredient</span>
          </div>
          <Button size="sm" onClick={() => router.push("/analisis")} className="text-xs">
            Analisis Kulit
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-base">Perbandingan Ingredient</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Bandingkan dua ingredient secara berdampingan — keamanan, bukti ilmiah, risiko iritasi, dan kompatibilitasnya.
          </p>
        </motion.div>

        {/* Pickers */}
        <div className="grid sm:grid-cols-2 gap-4">
          <IngredientPicker
            value={ingA}
            onChange={(ing) => {
              if (ing === null) setIngA(null);
              else setIngA(ing);
            }}
            label="Ingredient A"
            exclude={ingB?.id}
          />
          <IngredientPicker
            value={ingB}
            onChange={(ing) => {
              if (ing === null) setIngB(null);
              else setIngB(ing);
            }}
            label="Ingredient B"
            exclude={ingA?.id}
          />
        </div>

        {/* Popular pairs */}
        {(!ingA || !ingB) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-muted-foreground mb-2">Perbandingan populer:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PAIRS.map((pair) => (
                <button
                  key={pair.label}
                  onClick={() => {
                    const a = INGREDIENTS.find(i => i.id === pair.a);
                    const b = INGREDIENTS.find(i => i.id === pair.b);
                    if (a) setIngA(a);
                    if (b) setIngB(b);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Compare result */}
        {canCompare && <CompareTable a={ingA} b={ingB} />}

        {/* Empty state */}
        {!canCompare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Pilih dua ingredient untuk memulai perbandingan</p>
          </motion.div>
        )}

        {/* Bottom links */}
        <div className="flex flex-wrap gap-3 pb-6 text-xs">
          <a href="/edukasi" className="text-primary/70 hover:text-primary transition-colors">← Database 100+ Ingredient</a>
          <a href="/cek-konflik" className="text-primary/70 hover:text-primary transition-colors">Cek Konflik →</a>
        </div>
      </div>
    </main>
  );
}

export default function BandingkanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <BandingkanContent />
    </Suspense>
  );
}
