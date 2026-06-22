"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, CheckCircle, XCircle, FlaskConical, AlertTriangle,
  Users, Send, MapPin, Sparkles, ShieldCheck, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCTS, getActivesWithPercent, type ProductCategory } from "@/lib/products";
import { productSafety } from "@/lib/safety";
import { shopeeUrl, shopeeButtonLabel, hasShopeeAffiliate, AFFILIATE_DISCLOSURE } from "@/lib/affiliate";
import { SiteFooter } from "@/components/site-footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  sunscreen: "Sunscreen",
  cleanser: "Cleanser",
  moisturizer: "Moisturizer",
  serum_niacinamide: "Serum Niacinamide",
  serum_vitamin_c: "Serum Vitamin C",
  serum_aha_bha: "Serum AHA/BHA",
  serum_retinol: "Serum Retinol",
  serum_brightening: "Serum Brightening",
  toner: "Toner",
  treatment_jerawat: "Treatment Jerawat",
};

const SKIN_TYPE_LABELS: Record<string, string> = {
  normal: "Normal",
  berminyak: "Berminyak",
  kering: "Kering",
  kombinasi: "Kombinasi",
  sensitif: "Sensitif",
  "semua tipe": "Semua Tipe",
  berjerawat: "Berjerawat",
};

interface Review {
  id: string;
  rating: number;
  komentar: string | null;
  nama: string;
  skin_type: string | null;
  created_at: string;
}

export default function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, komentar: "", nama: "", skin_type: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch(`/api/reviews?product_id=${product.id}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [product]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          rating: form.rating,
          komentar: form.komentar || null,
          nama: form.nama || "Pengguna Anonim",
          skin_type: form.skin_type || null,
        }),
      });
      const r = await fetch(`/api/reviews?product_id=${product.id}`);
      const data = await r.json();
      setReviews(data.reviews ?? []);
      setSubmitted(true);
      setForm({ rating: 5, komentar: "", nama: "", skin_type: "" });
    } catch {
      // still mark submitted to avoid double-submit
    } finally {
      setSubmitting(false);
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">📦</p>
          <h2 className="text-xl font-bold text-foreground">Produk tidak ditemukan</h2>
          <p className="text-sm text-muted-foreground">Produk ini belum ada di database kami.</p>
          <Button onClick={() => router.push("/produk")} className="bg-primary text-primary-foreground">
            Ke Semua Produk
          </Button>
        </div>
      </div>
    );
  }

  const communityAvg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : product.rating_community.toFixed(1);

  const actives = getActivesWithPercent(product);
  const safety = productSafety(product);
  const safetyColor =
    safety.level === "Tinggi" ? "text-green-700" : safety.level === "Cukup" ? "text-yellow-800" : "text-destructive";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/produk")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Produk
          </button>
          <Badge variant="outline" className="text-xs">
            {CATEGORY_LABELS[product.category]}
          </Badge>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Product hero */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
                {product.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
                <h1 className="text-lg font-bold text-foreground leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-muted-foreground">{product.tagline}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Harga</p>
                <p className="text-sm font-semibold text-foreground">
                  Rp{Math.round(product.price_min / 1000)}k–{Math.round(product.price_max / 1000)}k
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-primary" />
                  {communityAvg}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">BPOM</p>
                <p
                  className={`text-sm font-semibold flex items-center justify-center gap-1 ${
                    product.bpom_registered ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {product.bpom_registered ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {product.bpom_registered ? "Terdaftar" : "Belum"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Warning BPOM belum terverifikasi */}
        {!product.bpom_registered && (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-400/10 p-3 text-sm text-foreground flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
            <span>
              <strong className="text-yellow-800">Status BPOM belum terverifikasi.</strong>{" "}
              Bukan berarti berbahaya — hanya belum kami pastikan. Cek nomor BPOM-nya di{" "}
              <a href="https://cekbpom.pom.go.id/" target="_blank" rel="noopener noreferrer" className="text-primary underline">cekbpom.pom.go.id</a>{" "}
              atau lewat <Link href="/cek-bpom" className="text-primary underline">Cek BPOM</Link> sebelum membeli.
            </span>
          </div>
        )}

        {/* SPF badge */}
        {product.spf && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-300/90 flex items-center gap-2">
            ☀️ SPF {product.spf} — lindungi dari UV setiap hari
          </div>
        )}

        {/* Cocok untuk */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Cocok Untuk
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.skin_types.map((st) => (
              <Badge key={st} variant="secondary">
                {SKIN_TYPE_LABELS[st] ?? st}
              </Badge>
            ))}
          </div>
          {product.who_should_skip && (
            <p className="text-xs text-yellow-700/80 mt-2 flex items-start gap-1.5">
              <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>Skip jika: {product.who_should_skip}</span>
            </p>
          )}
        </motion.div>

        {/* Concerns */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" /> Mengatasi
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.concerns.map((c) => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-xs text-green-300/80"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Ingredient utama + kadar + komposisi lengkap */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" /> Bahan Aktif & Komposisi
          </h2>

          {/* Bahan aktif dengan kadar resmi (badge menonjol) */}
          {actives.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Kadar bahan aktif (sesuai klaim resmi brand):</p>
              <div className="flex flex-wrap gap-2">
                {actives.map((a) => (
                  <span
                    key={a.name + a.percent}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-sm font-semibold text-primary"
                  >
                    {a.name}
                    <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold">{a.percent}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bahan utama */}
          <p className="text-xs text-muted-foreground mb-2">Bahan utama:</p>
          <div className="flex flex-wrap gap-2">
            {product.key_ingredients.map((ki) => (
              <span
                key={ki}
                className="px-2.5 py-1 rounded-full border border-border/40 text-xs text-muted-foreground"
              >
                {ki}
              </span>
            ))}
          </div>

          {/* Komposisi lengkap (INCI) */}
          {product.full_ingredients && product.full_ingredients.length > 0 ? (
            <details className="mt-4 rounded-xl border border-border bg-card p-4">
              <summary className="text-sm font-semibold text-foreground cursor-pointer">
                Komposisi lengkap (INCI) — {product.full_ingredients.length} bahan
              </summary>
              <p className="text-xs text-foreground/80 leading-relaxed mt-3">
                {product.full_ingredients.join(", ")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-3">
                Sumber: kemasan/database publik. Formula bisa berubah sewaktu-waktu — selalu cek daftar bahan di kemasan asli sebelum membeli, terutama jika kamu punya alergi.
              </p>
            </details>
          ) : (
            <p className="text-[11px] text-muted-foreground mt-4 flex items-start gap-1.5">
              <FlaskConical className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>Daftar komposisi lengkap belum kami verifikasi untuk produk ini. Cek daftar bahan (INCI) di kemasan asli atau situs resmi brand.</span>
            </p>
          )}
        </motion.div>

        {/* Skor Keamanan */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Skor Keamanan
            </h2>
            <div className="text-right">
              <span className={`text-2xl font-bold ${safetyColor}`}>{safety.score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
              <p className={`text-[11px] font-medium ${safetyColor}`}>{safety.level}</p>
            </div>
          </div>
          <div className="space-y-2">
            {safety.params.map((p) => (
              <div key={p.label} className="flex items-start gap-2">
                {p.good ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-yellow-800 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{p.label}</p>
                  <p className="text-[11px] text-muted-foreground">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border">
            Skor berbasis heuristik (BPOM, transparansi, perkiraan iritasi) — panduan awal, bukan penilaian laboratorium/medis.
          </p>
        </motion.div>

        {/* Why good */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs text-primary font-medium">Mengapa JujurSkin Rekomendasikan</p>
          </div>
          <p className="text-sm text-foreground/80">{product.why_good}</p>
        </motion.div>

        {/* Where to buy */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Cari & Bandingkan Harga
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <a
              href={shopeeUrl(product)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-orange-400/30 bg-orange-400/10 text-sm font-medium text-orange-700 hover:bg-orange-400/20 transition-colors"
            >
              {shopeeButtonLabel(product)} <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(`${product.brand} ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-green-400/30 bg-green-400/10 text-sm font-medium text-green-700 hover:bg-green-400/20 transition-colors"
            >
              Cari di Tokopedia <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {hasShopeeAffiliate(product) && (
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 italic">
              {AFFILIATE_DISCLOSURE}
            </p>
          )}
          {product.where_to_buy.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Umumnya tersedia di: {product.where_to_buy.join(", ")}. Harga bisa beda tiap toko — bandingkan dulu sebelum beli.
            </p>
          )}
        </motion.div>

        {/* Reviews */}
        <div className="border-t border-border/30 pt-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Review Pengguna
            {reviews.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                ({reviews.length} ulasan)
              </span>
            )}
          </h2>

          {loadingReviews ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Memuat ulasan...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada ulasan. Jadilah yang pertama!
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-border/40 bg-card/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{review.nama}</span>
                      {review.skin_type && (
                        <Badge variant="secondary" className="text-[10px]">
                          {review.skin_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.komentar && (
                    <p className="text-sm text-muted-foreground">{review.komentar}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Review form */}
          {submitted ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 text-center">
              <CheckCircle className="w-6 h-6 text-green-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Terima kasih atas ulasanmu!</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
              >
                Tulis ulasan lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="rounded-xl border border-border/40 bg-card/20 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Tulis Ulasan</h3>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= form.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30 hover:text-primary"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Nama (opsional)</label>
                <input
                  type="text"
                  placeholder="Pengguna Anonim"
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Jenis Kulit (opsional)</label>
                <select
                  value={form.skin_type}
                  onChange={(e) => setForm((f) => ({ ...f, skin_type: e.target.value }))}
                  className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">Pilih jenis kulit...</option>
                  <option value="normal">Normal</option>
                  <option value="berminyak">Berminyak</option>
                  <option value="kering">Kering</option>
                  <option value="kombinasi">Kombinasi</option>
                  <option value="sensitif">Sensitif</option>
                  <option value="berjerawat">Berjerawat</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Komentar (opsional)</label>
                <textarea
                  placeholder="Bagaimana pengalaman kamu dengan produk ini?"
                  value={form.komentar}
                  onChange={(e) => setForm((f) => ({ ...f, komentar: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground"
              >
                <Send className="w-3.5 h-3.5 mr-2" />
                {submitting ? "Mengirim..." : "Kirim Ulasan"}
              </Button>
            </form>
          )}
        </div>

        {/* Compare CTA */}
        <div className="rounded-xl border border-border/40 bg-card/20 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Bandingkan dengan produk lain?</p>
            <p className="text-xs text-muted-foreground">Tool perbandingan ingredient side-by-side</p>
          </div>
          <button
            onClick={() => router.push("/bandingkan")}
            className="px-4 py-2 rounded-lg border border-primary/30 text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex-shrink-0 ml-4"
          >
            Bandingkan
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
