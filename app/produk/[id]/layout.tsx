import type { Metadata } from "next";
import { PRODUCTS, type ProductCategory } from "@/lib/products";
import { safeJsonLd } from "@/lib/jsonld";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Produk yang kamu cari tidak ada di database JujurSkin.",
    };
  }

  const title = `${product.name} — ${product.brand} | JujurSkin`;
  const description = `${product.tagline}. Harga: Rp${product.price_min.toLocaleString("id-ID")}–Rp${product.price_max.toLocaleString("id-ID")}. ${product.why_good}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      CATEGORY_LABELS[product.category],
      "skincare indonesia",
      `review ${product.name}`,
      `harga ${product.name}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://jujurskin.com/produk/${product.id}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `https://jujurskin.com/produk/${product.id}`,
    },
  };
}

export default async function ProdukDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        brand: { "@type": "Brand", name: product.brand },
        description: product.tagline,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice: product.price_min,
          highPrice: product.price_max,
        },
        // Catatan: TIDAK menyertakan aggregateRating. rating_community bukan hasil
        // agregasi ulasan nyata, jadi menerbitkannya sebagai structured data =
        // menyesatkan + melanggar kebijakan rich-result Google. Sambungkan dari
        // tabel product_reviews saat sudah ada ulasan asli yang cukup.
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
