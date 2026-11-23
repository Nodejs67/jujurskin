"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, Plus, Trash2, Wallet, Search, FlaskConical,
  AlertTriangle, Clock, ShieldAlert, Download, RotateCcw, Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import type { RoastFinding, RoastResult } from "@/lib/roast/types";

const SKIN_TYPES = ["Berminyak", "Kering", "Kombinasi", "Normal", "Sensitif"];
const CONCERNS = ["Jerawat", "Bekas jerawat", "Kusam", "Pori besar", "Kemerahan", "Penuaan"];

const ANALYZING_STEPS = [
  { icon: Search, text: "Membaca ingredient..." },
  { icon: FlaskConical, text: "Mencari fungsi yang dobel..." },
  { icon: Wallet, text: "Menghitung uang terbuang..." },
];

const FINDING_STYLE: Record<RoastFinding["kind"], { icon: typeof AlertTriangle; tone: string; label: string }> = {
  overlap: { icon: AlertTriangle, tone: "text-rose-800 bg-rose-50 border-rose-200", label: "Fungsi dobel" },
  conflict: { icon: Clock, tone: "text-amber-800 bg-amber-50 border-amber-200", label: "Atur waktu pakai" },
  missing: { icon: ShieldAlert, tone: "text-emerald-800 bg-emerald-50 border-emerald-200", label: "Belum ada" },
  overload: { icon: FlaskConical, tone: "text-violet-800 bg-violet-50 border-violet-200", label: "Terlalu banyak aktif" },
};

const rupiah = (n: number) => n.toLocaleString("id-ID");
const digitsOnly = (s: string) => s.replace(/\D/g, "");

interface Row {
  id: number;
  name: string;
  price: string;
}

let nextId = 4;

export default function RoastPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: "", price: "" },
    { id: 2, name: "", price: "" },
    { id: 3, name: "", price: "" },
  ]);
  const [skinType, setSkinType] = useState<string>("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filled = rows.filter((r) => r.name.trim().length > 0);

  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const toggleConcern = (c: string) =>
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  async function runRoast() {
    if (filled.length === 0) {
      setError("Isi minimal satu produk dulu ya.");
      return;
    }
    setError(null);
    setStep("analyzing");

    const payload = {
      skinType: skinType || undefined,
      concerns: concerns.length ? concerns : undefined,
      products: filled.map((r) => ({
        name: r.name.trim(),
        price: r.price ? Number.parseInt(digitsOnly(r.price), 10) : undefined,
      })),
    };

    // Jeda kecil supaya animasi "sedang mengecek" sempat terbaca — bukan menunggu server.
    const [res] = await Promise.all([
      fetch("/api/roast/analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      new Promise((r) => setTimeout(r, 1900)),
    ]);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Gagal menganalisis. Coba lagi sebentar lagi.");
      setStep("input");
      return;
    }

    setResult((await res.json()) as RoastResult);
    setStep("result");
  }

  function reset() {
    setResult(null);
    setStep("input");
    setCopied(false);
  }

  const cardUrl = result
    ? `/api/roast/kartu?skor=${result.score}&hemat=${result.potentialSaving}&produk=${result.productsAnalyzed}&overlap=${result.findings.filter((f) => f.kind === "overlap").length}`
    : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://jujurskin.com/roast");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Browser tidak mengizinkan menyalin. Salin manual: jujurskin.com/roast");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8f2] to-white">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4" /> Beranda
        </Link>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Jujur Check</Badge>
              <h1 className="text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
                Berani skincare kamu <span className="text-rose-600">dijujurin</span>? 🌸
              </h1>
              <p className="mt-3 text-neutral-600">
                Tulis produk yang kamu pakai. Kami cek fungsi yang dobel, bahan yang bentrok, dan uang yang
                sebenarnya bisa kamu simpan.
              </p>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
                <label className="text-sm font-medium text-neutral-800">Tipe kulit kamu (opsional)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKIN_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSkinType(skinType === t ? "" : t)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        skinType === t
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <label className="mt-5 block text-sm font-medium text-neutral-800">Keluhan (opsional)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONCERNS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleConcern(c)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        concerns.includes(c)
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-medium text-neutral-800">Produk yang kamu pakai</label>
                  <span className="text-xs text-neutral-500">Harga boleh dikosongkan</span>
                </div>

                <div className="mt-3 space-y-2">
                  {rows.map((row, i) => (
                    <div key={row.id} className="flex gap-2">
                      <input
                        value={row.name}
                        onChange={(e) => updateRow(row.id, { name: e.target.value })}
                        placeholder={i === 0 ? "Somethinc Niacinamide" : "Nama produk"}
                        className="min-w-0 flex-[3] rounded-xl border border-neutral-300 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
                      />
                      <div className="relative flex-[2]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                          Rp
                        </span>
                        <input
                          value={row.price}
                          inputMode="numeric"
                          onChange={(e) => {
                            const d = digitsOnly(e.target.value);
                            updateRow(row.id, { price: d ? Number.parseInt(d, 10).toLocaleString("id-ID") : "" });
                          }}
                          placeholder="120.000"
                          className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-2 text-base outline-none focus:border-emerald-600"
                        />
                      </div>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                          aria-label={`Hapus produk baris ${i + 1}`}
                          className="shrink-0 rounded-xl border border-neutral-200 px-2.5 text-neutral-400 hover:border-rose-300 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setRows((prev) => [...prev, { id: nextId++, name: "", price: "" }])}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  <Plus className="h-4 w-4" /> Tambah produk
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

              <Button
                onClick={runRoast}
                size="lg"
                className="mt-5 w-full bg-rose-600 py-6 text-base font-semibold hover:bg-rose-700"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Roast Routine Saya
              </Button>

              <p className="mt-3 text-center text-xs text-neutral-500">
                Gratis, tanpa daftar. Kami tidak menyimpan daftar produkmu.
              </p>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <div className="text-5xl">🌸</div>
              <p className="mt-6 text-lg font-semibold text-neutral-900">JujurSkin sedang mengecek...</p>
              <div className="mt-8 w-full max-w-sm space-y-4">
                {ANALYZING_STEPS.map((s, i) => (
                  <motion.div
                    key={s.text}
                    initial={{ opacity: 0.25, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.55, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <s.icon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-neutral-700">{s.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm uppercase tracking-wide text-neutral-500">Jujur Check kamu</p>

              <div className="mt-2 flex items-end gap-2">
                <span
                  className={`text-7xl font-extrabold leading-none ${
                    result.score >= 75 ? "text-emerald-700" : result.score >= 60 ? "text-amber-600" : "text-rose-600"
                  }`}
                >
                  {result.score}
                </span>
                <span className="mb-2 text-2xl font-semibold text-neutral-400">/100</span>
              </div>
              <p className="mt-1 text-xl font-semibold text-neutral-900">{result.scoreLabel}</p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { k: "Total rutinitas", v: `Rp ${rupiah(result.totalSpend)}` },
                  { k: "Bisa dihemat", v: `Rp ${rupiah(result.potentialSaving)}` },
                  { k: "Produk dicek", v: `${result.productsAnalyzed}` },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-neutral-200 bg-white p-3">
                    <p className="text-xs text-neutral-500">{s.k}</p>
                    <p className="mt-1 text-sm font-bold text-neutral-900 sm:text-base">{s.v}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 rounded-2xl border-l-4 border-rose-400 bg-rose-50 p-4 text-neutral-800">
                {result.verdict}
              </p>

              <div className="mt-6 space-y-3">
                {result.findings.map((f, i) => {
                  const style = FINDING_STYLE[f.kind];
                  return (
                    <div key={i} className={`rounded-2xl border p-4 ${style.tone}`}>
                      <div className="flex items-center gap-2">
                        <style.icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-semibold uppercase tracking-wide">{style.label}</span>
                        {f.confidence === "rendah" && (
                          <span className="ml-auto rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium">
                            tebakan dari nama
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-semibold">{f.title}</p>
                      <p className="mt-1 text-sm opacity-90">{f.detail}</p>
                      {f.products.length > 0 && (
                        <ul className="mt-2 space-y-0.5 text-sm opacity-80">
                          {f.products.map((p) => (
                            <li key={p}>✓ {p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {result.unknownProducts.length > 0 && (
                <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600">
                  Kami belum mengenali: {result.unknownProducts.join(", ")}. Coba tulis nama merek + kandungannya
                  (mis. &quot;Somethinc Niacinamide&quot;) supaya analisisnya lebih tepat.
                </p>
              )}

              {/* Kartu share — inti fitur ini. */}
              <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="font-semibold text-neutral-900">Bagikan hasilmu ✨</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Kartu ini cuma berisi angka — nama produkmu tidak ikut dibagikan.
                </p>

                {/* eslint-disable-next-line @next/next/no-img-element -- PNG dinamis dari route handler, bukan aset statis */}
                <img
                  src={cardUrl}
                  alt={`Kartu Jujur Check: skor ${result.score} dari 100`}
                  width={1080}
                  height={1350}
                  className="mt-4 w-full rounded-xl border border-neutral-200"
                />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={cardUrl}
                    download="jujur-check.png"
                    className={cn(buttonVariants(), "flex-1 bg-neutral-900 hover:bg-neutral-800")}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PNG
                  </a>
                  <Button variant="outline" className="flex-1" onClick={copyLink}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : null}
                    {copied ? "Link disalin" : "Salin link"}
                  </Button>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-neutral-500">{result.disclaimer}</p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Cek lagi
                </Button>
                <Link
                  href="/analisis"
                  className={cn(buttonVariants(), "flex-1 bg-emerald-700 hover:bg-emerald-800")}
                >
                  Analisis kulit lengkap
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SiteFooter />
    </div>
  );
}
