import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="max-w-md w-full text-center py-24">
          <p className="text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Halaman ini tidak ada
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Mungkin tautannya salah atau halamannya sudah dipindahkan. Tapi
            tenang — yang penting kulitmu tetap terawat. Yuk kembali ke jalur.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Ke Beranda
            </Link>
            <Link
              href="/analisis"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors"
            >
              Mulai Analisis Gratis
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
