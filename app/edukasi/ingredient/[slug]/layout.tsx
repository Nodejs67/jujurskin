import type { Metadata } from "next";
import { getIngredientById, CATEGORY_LABELS, SAFETY_LABELS } from "@/lib/ingredients";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ing = getIngredientById(slug);

  if (!ing) {
    return {
      title: "Ingredient Tidak Ditemukan",
      description: "Ingredient yang kamu cari tidak ada di database JujurSkin.",
    };
  }

  const category = CATEGORY_LABELS[ing.category];
  const safety = SAFETY_LABELS[ing.safety_rating];
  const title = `${ing.name} — ${category} Skincare`;
  const description = `${ing.name}: ${ing.tagline}. Keamanan: ${safety}. ${ing.pregnancy_safe ? "Aman untuk ibu hamil." : ""} Pelajari manfaat, cara pakai, dan konflik ingredient di JujurSkin.`;

  return {
    title,
    description,
    keywords: [
      ing.name,
      ...ing.aliases,
      category,
      "ingredient skincare",
      "skincare indonesia",
      `${ing.name} manfaat`,
      `${ing.name} cara pakai`,
    ],
    openGraph: {
      title,
      description,
      url: `https://jujurskin.vercel.app/edukasi/ingredient/${ing.id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `https://jujurskin.vercel.app/edukasi/ingredient/${ing.id}`,
    },
  };
}

export default function IngredientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
