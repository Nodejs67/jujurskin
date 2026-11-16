"use client";

import { useEffect, useState } from "react";
import type { Recommendation } from "@/lib/recommendations";

const KEY = "jujurskin_belanja";

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id");

/**
 * Daftar belanja dari hasil analisis. Centang disimpan di perangkat (localStorage),
 * tidak ke server. Urutan = prioritas dari mesin rekomendasi (bukan komisi).
 */
export function ShoppingList({ recs }: { recs: Recommendation[] }) {
  const [bought, setBought] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBought(JSON.parse(raw));
    } catch { /* abaikan: tetap jalan tanpa penyimpanan */ }
  }, []);

  const toggle = (name: string) => {
    const next = { ...bought, [name]: !bought[name] };
    setBought(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* abaikan */ }
  };

  if (recs.length === 0) return null;

  const left = recs.filter((r) => !bought[r.product]);
  const minLeft = left.reduce((a, r) => a + r.price_min, 0);
  const maxLeft = left.reduce((a, r) => a + r.price_max, 0);

  const copy = async () => {
    const text =
      "Daftar belanja skincare (JujurSkin)\n" +
      recs.map((r, i) => `${bought[r.product] ? "[x]" : "[ ]"} ${i + 1}. ${r.product} (${rp(r.price_min)}-${rp(r.price_max)})`).join("\n") +
      `\nSisa: ${rp(minLeft)}-${rp(maxLeft)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard bisa diblokir; abaikan */ }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4" aria-labelledby="daftar-belanja">
      <h2 id="daftar-belanja" className="text-sm font-semibold text-foreground mb-1">Daftar belanja</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Urut dari yang paling dulu dibeli. Centang yang sudah kamu punya atau sudah dibeli.
      </p>
      <ul className="space-y-2">
        {recs.map((r, i) => (
          <li key={r.product}>
            <label className="flex items-start gap-3 cursor-pointer min-h-[44px] rounded-lg border border-border px-3 py-2">
              <input
                type="checkbox"
                checked={!!bought[r.product]}
                onChange={() => toggle(r.product)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span className={`flex-1 text-sm ${bought[r.product] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {i + 1}. {r.product}
              </span>
              <span className="text-xs font-semibold text-primary shrink-0">
                {rp(r.price_min)}–{rp(r.price_max)}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Sisa dibeli: <strong className="text-foreground">{rp(minLeft)}–{rp(maxLeft)}</strong>
        </p>
        <button
          type="button"
          onClick={copy}
          className="text-xs font-medium text-primary underline underline-offset-2 min-h-[44px] px-2"
        >
          {copied ? "Tersalin" : "Salin daftar"}
        </button>
      </div>
    </section>
  );
}
