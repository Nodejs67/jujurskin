"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type { AnalysisStage } from "@/lib/skin-analysis";

// Jeda baca antar baris. Perhitungan aslinya selesai dalam milidetik — jeda ini
// murni supaya manusia sempat MEMBACA prosesnya. Angka `ms` yang ditampilkan
// tetap waktu eksekusi SEBENARNYA, tidak pernah dikarang.
const DWELL_MS = 420;

/**
 * HUD pipeline analisis kulit — menampilkan tahap-tahap NYATA yang dijalankan
 * mesin on-device, beserta waktu eksekusi aslinya.
 *
 * Aturan keras: tiap baris di sini WAJIB berasal dari `AnalysisStage` yang
 * di-emit oleh kode yang benar-benar berjalan. Jangan pernah menambah baris
 * hiasan (mis. "Lighting normalized", "UV damage") yang tidak dikerjakan mesin
 * — itu membatalkan seluruh alasan komponen ini ada.
 */
export function SkinAnalysisHud({
  stages,
  onDone,
}: {
  stages: AnalysisStage[];
  onDone?: () => void;
}) {
  const [shown, setShown] = useState(0);
  const done = shown >= stages.length;
  const totalMs = stages.reduce((a, s) => a + s.ms, 0);

  useEffect(() => {
    if (shown >= stages.length) {
      const t = setTimeout(() => onDone?.(), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), DWELL_MS);
    return () => clearTimeout(t);
  }, [shown, stages.length, onDone]);

  return (
    <div data-hud className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <span className="text-[11px] font-semibold text-slate-300 tracking-wide">
          Analisis kulit · on-device
        </span>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {done ? "selesai" : "berjalan"}
        </span>
      </div>

      <ol className="space-y-2">
        {stages.slice(0, shown).map((s) => (
          <motion.li
            key={s.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 text-[11px] leading-tight"
          >
            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
            <span className="min-w-0 flex-1">
              <span className="block text-slate-200 break-words">{s.label}</span>
              <span className="block text-slate-400 break-words">{s.detail}</span>
            </span>
            <span className="text-slate-500 shrink-0 tabular-nums">
              {s.ms < 0.1 ? "<0.1ms" : `${s.ms}ms`}
            </span>
          </motion.li>
        ))}
        {!done && (
          <li className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-3 h-3 shrink-0 border border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
            <span>memproses…</span>
          </li>
        )}
      </ol>

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-slate-800 space-y-1.5"
        >
          <p className="text-[11px] text-emerald-400">
            Analisis selesai dalam {Math.round(totalMs)}ms
          </p>
          <p className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-tight">
            <Lock className="w-3 h-3 shrink-0 mt-px" />
            <span>Semua dihitung di perangkatmu. Fotomu tidak pernah diunggah.</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
