"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Lightbulb, AlertTriangle, BookOpen, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug, ARTICLES, TAG_LABELS } from "@/lib/articles";
import { SiteFooter } from "@/components/site-footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">📄</p>
          <h2 className="text-xl font-bold text-foreground">Artikel tidak ditemukan</h2>
          <p className="text-sm text-muted-foreground">
            Artikel ini belum ada atau telah dipindahkan.
          </p>
          <button
            onClick={() => router.push("/artikel")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            Ke Semua Artikel
          </button>
        </div>
      </div>
    );
  }

  const relatedArticles = ARTICLES.filter(
    (a) => article.related_articles?.includes(a.slug) && a.slug !== slug
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/artikel")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Artikel
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {article.read_time} menit baca
          </div>
        </div>
      </div>

      <article className="max-w-2xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Article header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
          <div className="text-5xl mb-4">{article.emoji}</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {TAG_LABELS[tag] ?? tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {article.excerpt}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(article.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>

        <div className="border-t border-border/40 mb-8" />

        {/* Article sections */}
        <div className="space-y-8">
          {article.sections.map((section, i) => (
            <motion.section
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="text-base font-semibold text-foreground mb-3">{section.heading}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>

              {section.list && (
                <ul className="mt-3 space-y-2">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.tip && (
                <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4 flex gap-3">
                  <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300/90">{section.tip}</p>
                </div>
              )}

              {section.warning && (
                <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-300/90">{section.warning}</p>
                </div>
              )}
            </motion.section>
          ))}
        </div>

        {/* Related ingredients */}
        {article.related_ingredients && article.related_ingredients.length > 0 && (
          <div className="mt-12 rounded-xl border border-border/40 bg-card/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Ingredient Terkait</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.related_ingredients.map((id) => (
                <a
                  key={id}
                  href={`/edukasi/ingredient/${id}`}
                  className="px-3 py-1 rounded-full border border-border/50 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors capitalize"
                >
                  {id.split("-").join(" ")}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Baca Juga</h3>
            </div>
            <div className="space-y-3">
              {relatedArticles.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/artikel/${rel.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-border/40 hover:border-primary/30 bg-card/20 hover:bg-card/40 p-4 transition-all"
                >
                  <span className="text-2xl flex-shrink-0">{rel.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {rel.read_time} menit
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-primary/0 group-hover:text-primary/60 transition-all rotate-180 group-hover:translate-x-1 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/artikel")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3 h-3" /> Kembali ke semua artikel
          </button>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
