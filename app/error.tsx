"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log ke konsol server/klien; sengaja tak menampilkan detail teknis ke pengguna.
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">🌿</div>
      <h1 className="text-xl font-bold text-foreground">Ada yang tidak beres</h1>
      <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
        Maaf, terjadi kesalahan saat memuat halaman ini. Coba muat ulang — kalau
        masih bermasalah, kembali ke beranda dulu, ya.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-95 transition-all"
        >
          Coba lagi
        </button>
        <a
          href="/"
          className="h-11 px-5 inline-flex items-center rounded-full border border-border text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          Ke beranda
        </a>
      </div>
    </div>
  );
}
