"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ARTICLES, TAG_LABELS } from "@/lib/articles";
import { SiteFooter } from "@/components/site-footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function ArtikelPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(ARTICLES.flatMap((a) => a.tags)));
  const filtered = activeTag
    ? ARTICLES.filter((a) => a.tags.includes(activeTag))
    : ARTICLES;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary font-medium tracking-wider uppercase">Artikel</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Baca Sebelum Beli</h1>
          <p className="text-muted-foreground text-sm">
            Artikel skincare berbasis ilmu pengetahuan. Tanpa sponsored content, tanpa klaim berlebihan.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              activeTag === null
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            Semua
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {TAG_LABELS[tag] ?? tag}
            </button>
          ))}
        </div>

        {/* Articles list */}
        <motion.div
          key={activeTag}
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filtered.map((article) => (
            <motion.a
              key={article.id}
              href={`/artikel/${article.slug}`}
              variants={fadeUp}
              className="group block rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all p-5"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0 mt-0.5">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">
                        {TAG_LABELS[tag] ?? tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base leading-snug mb-1.5">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.read_time} menit baca
                      </span>
                      <span>
                        {new Date(article.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary/0 group-hover:text-primary/80 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-border/40 bg-card/20 p-6 text-center">
          <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">Mau tahu lebih banyak?</p>
          <p className="text-xs text-muted-foreground mb-4">
            Eksplor database 100+ ingredient skincare kami, lengkap dengan skor bukti ilmiah.
          </p>
          <a
            href="/edukasi"
            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
          >
            Ke Halaman Edukasi <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
