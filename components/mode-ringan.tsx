"use client";

import { useEffect, useState } from "react";
import { Feather } from "lucide-react";

const KEY = "jujur-ringan";

// Mode Ringan: matikan animasi & efek berat agar lebih lancar di HP lama /
// koneksi lambat & irit baterai. Otomatis menyala bila browser minta hemat data.
export function ModeRingan() {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let val = false;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === null) {
        // hormati preferensi browser hemat data jika ada
        val = window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches || false;
      } else {
        val = saved === "1";
      }
    } catch {}
    apply(val);
    setOn(val);
    setReady(true);
  }, []);

  function apply(v: boolean) {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.ringan = v ? "1" : "0";
    }
  }

  function toggle() {
    const v = !on;
    setOn(v);
    apply(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  }

  if (!ready) return null;

  return (
    <button onClick={toggle} aria-pressed={on}
      title="Matikan animasi & efek berat — lebih lancar di HP lama / koneksi lambat"
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
      <Feather className="w-3.5 h-3.5" />
      Mode Ringan: {on ? "AKTIF" : "nonaktif"}
    </button>
  );
}
