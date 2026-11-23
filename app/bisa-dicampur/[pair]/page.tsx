import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { safeJsonLd } from "@/lib/jsonld";
import { KONFLIK_PAIRS, getKonflikPair, pairsFor } from "@/lib/konflik-pairs";

const BASE = "https://jujurskin.com";

// Hanya pasangan yang dibentuk dari data; selain itu 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return KONFLIK_PAIRS.map((p) => ({ pair: p.slug }));
}

const verdict = (sev: "high" | "medium") =>
  sev === "high"
    ? { label: "Jangan digabung", short: "Sebaiknya tidak dipakai bersamaan" }
    : { label: "Pisahkan waktu pakainya", short: "Boleh dua-duanya dalam rutinitas, tapi jangan di waktu yang sama" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const p = getKonflikPair(pair);
  if (!p) return { title: "Halaman tidak ditemukan" };

  const title = `${p.a.name} dan ${p.b.name}: Boleh Dicampur?`;
  const description = `${verdict(p.severity).short}. Penjelasan singkat kenapa ${p.a.name} dan ${p.b.name} bentrok, dan cara mengatur pemakaiannya supaya kulit tetap aman.`;
  const url = `${BASE}/bisa-dicampur/${p.slug}`;

  return {
    title,
    description,
    keywords: [`${p.a.name} dan ${p.b.name}`, `${p.a.name} ${p.b.name} bareng`, "skincare boleh dicampur", "ingredient skincare bentrok"],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function PairPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const p = getKonflikPair(pair);
  if (!p) notFound();

  const v = verdict(p.severity);
  const related = [...pairsFor(p.a.id, p.slug), ...pairsFor(p.b.id, p.slug)]
    .filter((x, i, arr) => arr.findIndex((y) => y.slug === x.slug) === i)
    .slice(0, 8);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Bolehkah ${p.a.name} dan ${p.b.name} dipakai bersamaan?`,
        acceptedAnswer: { "@type": "Answer", text: `${v.short}. ${p.reasons.join(" ")}` },
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faq) }} />
      <main className="flex-1 px-6 pt-28 pb-20">
        <article className="max-w-2xl mx-auto">
          <p className="text-xs text-primary uppercase tracking-widest mb-3">Boleh dicampur?</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {p.a.name} dan {p.b.name}: boleh dicampur?
          </h1>

          <div
            className={`rounded-2xl border p-5 mb-8 ${
              p.severity === "high" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <p className={`text-sm font-bold ${p.severity === "high" ? "text-red-700" : "text-amber-800"}`}>
              {v.label}
            </p>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">{v.short}.</p>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Kenapa bentrok</h2>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              {p.reasons.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Kalau tetap mau memakai keduanya</h2>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Pisahkan waktunya, misalnya satu di pagi hari dan satu di malam hari, atau di hari yang berbeda.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Mulai dari satu bahan dulu, tambahkan yang kedua setelah kulit terbiasa.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Hentikan kalau kulit terasa perih, panas, atau mengelupas, lalu biarkan skin barrier pulih.</span></li>
            </ul>
          </section>

          <section className="mb-8 grid sm:grid-cols-2 gap-3">
            {[p.a, p.b].map((ing) => (
              <Link
                key={ing.id}
                href={`/edukasi/ingredient/${ing.id}`}
                className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors"
              >
                <p className="text-sm font-semibold text-foreground">{ing.name}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ing.tagline}</p>
                <p className="mt-2 text-xs text-primary">Baca selengkapnya →</p>
              </Link>
            ))}
          </section>

          <section className="mb-8 rounded-2xl bg-rose-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Rutinitasmu aman?</p>
            <p className="mt-1 text-sm text-slate-600">Masukkan bahan atau produkmu, kami cek mana yang bentrok. Gratis dan tanpa daftar.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/cek-konflik" className="inline-flex items-center px-4 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold">Cek konflik bahan</Link>
              <Link href="/roast" className="inline-flex items-center px-4 h-10 rounded-full border border-primary text-primary text-sm font-semibold">Coba Jujur Check</Link>
            </div>
          </section>

          {related.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">Pasangan lain yang sering ditanyakan</h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/bisa-dicampur/${r.slug}`} className="inline-flex px-3 py-1.5 rounded-full border border-border text-xs text-foreground hover:border-primary/50">
                      {r.a.name} + {r.b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            Ini informasi umum, bukan nasihat medis. Untuk kulit yang parah, menetap, atau menyakitkan, konsultasikan ke dokter kulit.
          </p>

          <div className="mt-10 pt-6 border-t border-border">
            <Link href="/bisa-dicampur" className="text-sm text-primary hover:underline">← Semua pasangan bahan</Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
