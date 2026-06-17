"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ShieldCheck, Star, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, type Product } from "@/lib/products";
import { productSafety } from "@/lib/safety";

export default function BandingkanProdukPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </main>
      }
    >
      <Inner />
    </Suspense>
  );
}

function ProductSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const sorted = [...PRODUCTS].sort((x, y) => x.brand.localeCompare(y.brand));
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">— Pilih produk —</option>
        {sorted.map((p) => (
          <option key={p.id} value={p.id}>
            {p.brand} — {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const [aId, setAId] = useState(params.get("a") || "");
  const [bId, setBId] = useState(params.get("b") || "");

  useEffect(() => {
    const q = new URLSearchParams();
    if (aId) q.set("a", aId);
    if (bId) q.set("b", bId);
    const qs = q.toString();
    router.replace(`/bandingkan-produk${qs ? `?${qs}` : ""}`);
  }, [aId, bId, router]);

  const a = PRODUCTS.find((p) => p.id === aId) || null;
  const b = PRODUCTS.find((p) => p.id === bId) || null;
  const both = a && b;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/produk" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Produk
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Bandingkan 2 Produk</h1>
          <p className="text-sm text-muted-foreground">Pilih dua produk untuk melihat perbandingan jujur berdampingan — harga, keamanan, ingredient, dan kecocokan.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ProductSelect value={aId} onChange={setAId} label="Produk A" />
          <ProductSelect value={bId} onChange={setBId} label="Produk B" />
        </div>

        {both ? (
          <Comparison a={a} b={b} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <span className="text-3xl">⚖️</span>
            <p className="text-sm text-muted-foreground mt-2">Pilih dua produk di atas untuk mulai membandingkan.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function Comparison({ a, b }: { a: Product; b: Product }) {
  const sa = productSafety(a);
  const sb = productSafety(b);

  const Head = ({ p }: { p: Product }) => (
    <div className="text-center">
      <div className="text-2xl mb-1">{p.emoji}</div>
      <Link href={`/produk/${p.id}`} className="text-xs font-semibold text-foreground hover:text-primary leading-tight block">
        {p.name}
      </Link>
      <p className="text-[11px] text-muted-foreground">{p.brand}</p>
    </div>
  );

  const Row = ({ label, av, bv, aHi, bHi }: { label: string; av: React.ReactNode; bv: React.ReactNode; aHi?: boolean; bHi?: boolean }) => (
    <div className="grid grid-cols-2 gap-px bg-border">
      <div className={`bg-card p-3 ${aHi ? "ring-1 ring-inset ring-primary/40" : ""}`}>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 md:hidden">{label} · A</p>
        <div className="text-xs text-foreground">{av}</div>
      </div>
      <div className={`bg-card p-3 ${bHi ? "ring-1 ring-inset ring-primary/40" : ""}`}>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 md:hidden">{label} · B</p>
        <div className="text-xs text-foreground">{bv}</div>
      </div>
    </div>
  );

  const LabelRow = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold text-muted-foreground pt-3 pb-1">{children}</p>
  );

  const safetyColor = (lvl: string) => (lvl === "Tinggi" ? "text-green-700" : lvl === "Cukup" ? "text-yellow-800" : "text-destructive");

  // Ringkasan beda
  const summary: string[] = [];
  if (a.price_min !== b.price_min) {
    const cheaper = a.price_min < b.price_min ? a : b;
    const diff = Math.abs(a.price_min - b.price_min);
    summary.push(`${cheaper.brand} ${cheaper.name} lebih murah (selisih mulai Rp ${diff.toLocaleString("id")}).`);
  }
  if (sa.score !== sb.score) {
    const safer = sa.score > sb.score ? a : b;
    summary.push(`${safer.brand} ${safer.name} skor keamanannya lebih tinggi (${Math.max(sa.score, sb.score)}/100).`);
  }
  if (a.rating_community !== b.rating_community) {
    const rated = a.rating_community > b.rating_community ? a : b;
    summary.push(`${rated.brand} ${rated.name} rating komunitasnya lebih tinggi (${rated.rating_community.toFixed(1)}).`);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Header sticky-ish */}
      <div className="grid grid-cols-2 gap-px bg-border rounded-t-2xl overflow-hidden border border-border">
        <div className="bg-card p-4"><Head p={a} /></div>
        <div className="bg-card p-4"><Head p={b} /></div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <LabelRow>Harga</LabelRow>
        <Row label="Harga"
          av={<span className="font-semibold text-accent">Rp {a.price_min.toLocaleString("id")}–{a.price_max.toLocaleString("id")}</span>}
          bv={<span className="font-semibold text-accent">Rp {b.price_min.toLocaleString("id")}–{b.price_max.toLocaleString("id")}</span>}
          aHi={a.price_min < b.price_min} bHi={b.price_min < a.price_min}
        />
        <LabelRow>Skor Keamanan</LabelRow>
        <Row label="Keamanan"
          av={<span className={`font-semibold ${safetyColor(sa.level)}`}>{sa.score}/100 · {sa.level}</span>}
          bv={<span className={`font-semibold ${safetyColor(sb.level)}`}>{sb.score}/100 · {sb.level}</span>}
          aHi={sa.score > sb.score} bHi={sb.score > sa.score}
        />
        <LabelRow>BPOM</LabelRow>
        <Row label="BPOM"
          av={a.bpom_registered ? <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Terdaftar</span> : <span className="text-yellow-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Belum</span>}
          bv={b.bpom_registered ? <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Terdaftar</span> : <span className="text-yellow-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Belum</span>}
        />
        {(a.spf || b.spf) && (
          <>
            <LabelRow>SPF</LabelRow>
            <Row label="SPF" av={a.spf ? `SPF ${a.spf}` : "—"} bv={b.spf ? `SPF ${b.spf}` : "—"} />
          </>
        )}
        <LabelRow>Rating komunitas</LabelRow>
        <Row label="Rating"
          av={<span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" /> {a.rating_community.toFixed(1)}</span>}
          bv={<span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" /> {b.rating_community.toFixed(1)}</span>}
          aHi={a.rating_community > b.rating_community} bHi={b.rating_community > a.rating_community}
        />
        <LabelRow>Cocok untuk tipe kulit</LabelRow>
        <Row label="Tipe kulit"
          av={<span className="capitalize">{a.skin_types.join(", ")}</span>}
          bv={<span className="capitalize">{b.skin_types.join(", ")}</span>}
        />
        <LabelRow>Untuk masalah</LabelRow>
        <Row label="Concerns" av={a.concerns.join(", ")} bv={b.concerns.join(", ")} />
        <LabelRow>Ingredient utama</LabelRow>
        <Row label="Ingredient"
          av={<div className="flex flex-wrap gap-1">{a.key_ingredients.map((k) => <Badge key={k} variant="outline" className="text-[10px] border-border text-muted-foreground">{k}</Badge>)}</div>}
          bv={<div className="flex flex-wrap gap-1">{b.key_ingredients.map((k) => <Badge key={k} variant="outline" className="text-[10px] border-border text-muted-foreground">{k}</Badge>)}</div>}
        />
        <LabelRow>Sebaiknya dihindari oleh</LabelRow>
        <Row label="Skip" av={a.who_should_skip || "—"} bv={b.who_should_skip || "—"} />
      </div>

      {summary.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Ringkasan jujur</p>
          </div>
          <ul className="space-y-1">
            {summary.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary mt-0.5">•</span><span>{s}</span></li>
            ))}
            <li className="text-xs text-muted-foreground flex gap-2"><span className="text-primary mt-0.5">•</span><span>Yang &quot;lebih bagus&quot; tergantung kebutuhan kulitmu — bukan sekadar harga atau rating.</span></li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}
