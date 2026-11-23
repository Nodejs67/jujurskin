import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KONFLIK_PAIRS } from "@/lib/konflik-pairs";

const title = "Skincare Boleh Dicampur? Cek Pasangan Bahan";
const description =
  "Daftar pasangan bahan skincare yang bentrok, misalnya retinol dan vitamin C, lengkap dengan alasan dan cara mengatur pemakaiannya.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://jujurskin.com/bisa-dicampur" },
  openGraph: { title, description, url: "https://jujurskin.com/bisa-dicampur", type: "website" },
};

export default function BisaDicampurPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pt-28 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-primary uppercase tracking-widest mb-3">Cek bahan</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Skincare boleh dicampur?</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {KONFLIK_PAIRS.length} pasangan bahan yang perlu hati-hati kalau dipakai bersamaan. Pilih pasangannya untuk
            melihat alasannya. Atau{" "}
            <Link href="/cek-konflik" className="text-primary hover:underline">cek rutinitasmu langsung</Link>.
          </p>

          <ul className="grid sm:grid-cols-2 gap-3">
            {KONFLIK_PAIRS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/bisa-dicampur/${p.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {p.a.name} + {p.b.name}
                  </span>
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      p.severity === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.severity === "high" ? "Jangan digabung" : "Pisahkan waktu"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs text-muted-foreground leading-relaxed">
            Informasi umum, bukan nasihat medis. Untuk kulit yang parah, menetap, atau menyakitkan, konsultasikan ke dokter kulit.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
