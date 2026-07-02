"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, ArrowLeft, ShoppingBag, Star, AlertTriangle,
  Sparkles, Filter, ChevronDown, ChevronUp,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PRODUCTS,
  CATEGORY_LABELS,
  type ProductCategory,
  type PriceRange,
  type Product,
  type SkinTypeMatch,
} from "@/lib/products";

const SKIN_TYPES: (SkinTypeMatch | "semua")[] = [
  "semua", "normal", "berminyak", "kering", "kombinasi", "sensitif", "berjerawat",
];

const SKIN_TYPE_LABELS: Record<SkinTypeMatch | "semua", string> = {
  semua: "Semua Jenis Kulit",
  normal: "Normal",
  berminyak: "Berminyak",
  kering: "Kering",
  kombinasi: "Kombinasi",
  sensitif: "Sensitif",
  berjerawat: "Berjerawat",
  "semua tipe": "Semua Tipe",
};

const fadeUp = {
  hidden: { y: 18 },
  show: { y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const PRICE_LABELS: Record<PriceRange, string> = {
  budget: "Budget (< Rp 60k)",
  mid: "Mid-range (Rp 60–150k)",
  premium: "Premium (> Rp 150k)",
};

const PRICE_COLORS: Record<PriceRange, string> = {
  budget: "text-green-700 bg-green-400/10 border-green-400/20",
  mid: "text-blue-700 bg-blue-400/10 border-blue-400/20",
  premium: "text-purple-700 bg-purple-400/10 border-purple-400/20",
};

const ALL_CATEGORIES: (ProductCategory | "semua")[] = [
  "semua",
  "sunscreen",
  "cleanser",
  "toner",
  "moisturizer",
  "serum_niacinamide",
  "serum_vitamin_c",
  "serum_aha_bha",
  "serum_retinol",
  "serum_brightening",
  "treatment_jerawat",
];

const ALL_PRICE_RANGES: (PriceRange | "semua")[] = ["semua", "budget", "mid", "premium"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "text-accent fill-accent" : "text-border"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/produk/${product.id}`}
        className="block w-full text-left glow-card rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
      >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} loading="lazy" className="w-12 h-12 rounded-lg object-contain bg-white border border-border shrink-0" />
          ) : (
            <span className="text-2xl">{product.emoji}</span>
          )}
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
            <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h2>
          </div>
        </div>
        {product.bpom_registered ? (
          <Badge variant="outline" className="text-xs border-green-400/30 text-green-700 bg-green-400/10 shrink-0">
            BPOM ✓
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs border-yellow-500/40 text-yellow-800 bg-yellow-400/15 shrink-0">
            <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Cek BPOM
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {product.tagline}
      </p>

      <div className="flex items-center justify-between mb-3">
        <StarRating rating={product.rating_community} />
        <span className="text-sm font-bold text-accent">
          Rp {product.price_min.toLocaleString("id")}
          {product.price_max !== product.price_min && (
            <span className="text-xs font-normal text-muted-foreground">–{product.price_max.toLocaleString("id")}</span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${PRICE_COLORS[product.price_range]}`}>
          {PRICE_LABELS[product.price_range]}
        </Badge>
        {product.spf && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 text-yellow-700 bg-yellow-400/10 border-yellow-400/20">
            SPF {product.spf}
          </Badge>
        )}
        {product.key_ingredients.slice(0, 2).map((ing) => (
          <Badge key={ing} variant="outline" className="text-xs px-2 py-0.5 border-border text-muted-foreground">
            {ing.split(" ")[0]}
          </Badge>
        ))}
      </div>
      </Link>
    </motion.div>
  );
}

export default function ProdukPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "semua">("semua");
  const [activePriceRange, setActivePriceRange] = useState<PriceRange | "semua">("semua");
  const [activeSkinType, setActiveSkinType] = useState<SkinTypeMatch | "semua">("semua");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== "semua") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (activePriceRange !== "semua") {
      list = list.filter((p) => p.price_range === activePriceRange);
    }
    if (activeSkinType !== "semua") {
      list = list.filter(
        (p) => p.skin_types.includes("semua tipe") || p.skin_types.includes(activeSkinType)
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.key_ingredients.some((i) => i.toLowerCase().includes(q)) ||
          p.concerns.some((c) => c.toLowerCase().includes(q))
      );
    }
    return list;
  }, [query, activeCategory, activePriceRange, activeSkinType]);

  // Muat bertahap (ringan di HP): tampilkan sebagian dulu, sisanya saat di-scroll.
  const PAGE_SIZE = 18;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset jumlah tampil tiap filter/pencarian berubah
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeCategory, activePriceRange, activeSkinType]);

  // Infinite scroll: tambah saat sentinel mendekati layar
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible((v) => v + PAGE_SIZE);
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length, visible]);

  const shown = filtered.slice(0, visible);

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
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Produk Indonesia</span>
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
            <ShoppingBag className="w-3 h-3 mr-1.5" /> {PRODUCTS.length} Produk Terkurasi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Produk skincare Indonesia{" "}
            <span className="gradient-text">yang terbukti efektif</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Pilihan produk lokal dan terjangkau yang sudah terbukti — dikurasi berdasarkan ingredient, bukan endorsement. Mayoritas sudah terdaftar BPOM; produk yang belum kami verifikasi ditandai dengan label peringatan.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk, brand, atau ingredient... (contoh: niacinamide, Azarine, BHA)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </motion.div>

        {/* Filter toggle mobile */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
            {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 space-y-4">
            {/* Category */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {cat === "semua" ? "Semua Kategori" : CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Harga</p>
              <div className="flex flex-wrap gap-2">
                {ALL_PRICE_RANGES.map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setActivePriceRange(pr)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activePriceRange === pr
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {pr === "semua" ? "Semua Harga" : PRICE_LABELS[pr]}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Type */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Jenis Kulit</p>
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveSkinType(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeSkinType === st
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {SKIN_TYPE_LABELS[st]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Default category pills (visible always) */}
        {!showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {cat === "semua" ? "Semua" : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {(query || activeCategory !== "semua" || activePriceRange !== "semua" || activeSkinType !== "semua") && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground">{filtered.length} produk ditemukan</p>
            <button
              onClick={() => { setQuery(""); setActiveCategory("semua"); setActivePriceRange("semua"); setActiveSkinType("semua"); }}
              className="text-xs text-primary hover:text-primary transition-colors"
            >
              Reset filter
            </button>
          </div>
        )}

        {filtered.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="show"
          >
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-foreground font-medium">Produk tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">Coba kata kunci lain</p>
            <button
              onClick={() => { setQuery(""); setActiveCategory("semua"); setActivePriceRange("semua"); }}
              className="mt-4 text-xs text-primary hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}

        {/* Muat lebih banyak (infinite scroll + tombol fallback) — ringan di HP */}
        {filtered.length > 0 && visible < filtered.length && (
          <div ref={sentinelRef} className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-5 h-11 rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Muat lebih banyak
            </button>
            <p className="text-xs text-muted-foreground">
              Menampilkan {visible} dari {filtered.length} produk
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-xl border border-border bg-card/50 p-4 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Harga adalah estimasi dan bisa berbeda di tiap platform. JujurSkin tidak terafiliasi dengan brand manapun dan tidak mendapat komisi dari rekomendasi ini.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <p className="text-xs text-primary uppercase tracking-widest mb-3">Tidak tahu harus mulai dari mana?</p>
          <h2 className="text-xl font-bold text-foreground mb-2">Dapatkan rekomendasi personal</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Analisis kondisi kulitmu dan kami akan tunjukkan produk mana yang paling tepat untuk kamu — berdasarkan tipe kulit, masalah, dan budget.
          </p>
          <Button onClick={() => router.push("/analisis")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" /> Analisis Kulit Saya
          </Button>
        </motion.div>
      </div>
      <SiteFooter />
    </main>
  );
}
