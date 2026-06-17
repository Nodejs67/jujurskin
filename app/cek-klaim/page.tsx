"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle, ShieldAlert, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeClaim, CONTOH_KLAIM, type ClaimResult } from "@/lib/claims";

export default function CekKlaimPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ClaimResult | null>(null);

  function run(input: string) {
    setText(input);
    setResult(analyzeClaim(input));
  }

  const verdictStyle =
    result?.verdictLevel === "bahaya"
      ? { box: "border-destructive/30 bg-destructive/8", text: "text-destructive", icon: ShieldAlert }
      : result?.verdictLevel === "skeptis"
      ? { box: "border-yellow-500/40 bg-yellow-400/10", text: "text-yellow-800", icon: AlertTriangle }
      : { box: "border-green-500/30 bg-green-400/10", text: "text-green-700", icon: CheckCircle };

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">JujurSkin</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">🚨 Cek Klaim Iklan</h1>
          <p className="text-sm text-muted-foreground">
            Tempel klaim iklan/produk skincare yang kamu ragukan. Kami bongkar pola pemasaran yang menyesatkan dan tunjukkan faktanya.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder='Contoh: "Cream pemutih instan, hasil dalam 3 hari, 100% aman tanpa efek samping!"'
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => run(text)} disabled={!text.trim()} className="gap-2">
              <Search className="w-4 h-4" /> Analisis Klaim
            </Button>
            {text && (
              <Button variant="outline" onClick={() => { setText(""); setResult(null); }} className="border-border">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Contoh */}
        {!result && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Atau coba contoh:</p>
            <div className="flex flex-col gap-2">
              {CONTOH_KLAIM.map((c) => (
                <button
                  key={c}
                  onClick={() => run(c)}
                  className="text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  “{c}”
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hasil */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Verdict */}
              <div className={`rounded-2xl border p-5 ${verdictStyle.box}`}>
                <div className="flex items-center gap-2 mb-1">
                  <verdictStyle.icon className={`w-5 h-5 ${verdictStyle.text}`} />
                  <p className={`text-sm font-bold ${verdictStyle.text}`}>
                    {result.findings.length} red flag terdeteksi
                  </p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.verdict}</p>
              </div>

              {/* Findings */}
              {result.findings.map((f) => (
                <div
                  key={f.id}
                  className={`rounded-xl border p-4 ${f.severity === "tinggi" ? "border-destructive/20 bg-destructive/5" : "border-yellow-500/30 bg-yellow-400/10"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${f.severity === "tinggi" ? "bg-destructive/15 text-destructive" : "bg-yellow-500/20 text-yellow-800"}`}>
                      Red flag {f.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Memicu kata: <span className="font-medium text-foreground">“{f.matched}”</span>
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{f.truth}</p>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/edukasi" className="text-xs text-primary hover:underline">Pelajari ingredient yang benar →</Link>
                <Link href="/produk" className="text-xs text-primary hover:underline">Lihat produk terkurasi →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Analisis berbasis pola kata kunci pemasaran yang umum menyesatkan — bukan penilaian hukum atas produk tertentu. Tujuannya melatih kamu jadi pembeli yang kritis.
          </p>
        </div>
      </div>
    </main>
  );
}
