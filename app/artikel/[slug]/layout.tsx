import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { safeJsonLd } from "@/lib/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      description: "Artikel yang kamu cari tidak ada di JujurSkin.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://jujurskin.com/artikel/${article.slug}`,
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `https://jujurskin.com/artikel/${article.slug}`,
    },
  };
}

export default async function ArtikelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        keywords: article.tags.join(", "),
        url: `https://jujurskin.com/artikel/${article.slug}`,
        datePublished: article.date,
        publisher: {
          "@type": "Organization",
          name: "JujurSkin",
          url: "https://jujurskin.com",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
