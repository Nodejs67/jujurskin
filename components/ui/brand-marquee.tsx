"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * BrandMarquee — strip nama brand terverifikasi berjalan pelan (looping).
 * Tanpa logo image (pakai teks) supaya ringan. Hormati reduced-motion.
 */
export function BrandMarquee({
  brands,
  speed = 28,
}: {
  brands: string[];
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const row = [...brands, ...brands]; // duplikat untuk loop mulus

  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* fade tepi kiri/kanan */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FFF7F9] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FFF7F9] to-transparent" />

      <motion.div
        className="flex w-max items-center gap-3"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {row.map((b, i) => (
          <span
            key={`${b}-${i}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-rose-100 bg-white/70 px-4 py-1.5 text-sm font-semibold text-slate-600 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FB4E78]" />
            {b}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
