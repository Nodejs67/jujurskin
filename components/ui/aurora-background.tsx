"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AuroraBackground — latar gradient "aurora" beranimasi (futuristik kalem).
 * Diadaptasi dari 21st.dev (AuroraBackground) ke palet brand JujurSkin
 * (pink #FB4E78 + peach + ungu lembut).
 * - Responsif: blob lebih kecil di mobile (hemat GPU di HP).
 * - Menghormati prefers-reduced-motion (animasi mati kalau user minta).
 */
export function AuroraBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion();
  const float = (a: number[], b: number[], scale: number[], dur: number) =>
    reduce ? undefined : { x: a, y: b, scale, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div
      className={cn("relative overflow-hidden bg-[#FFF7F9]", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-1/4 left-1/5 h-[26rem] w-[26rem] rounded-full blur-3xl will-change-transform md:h-[42rem] md:w-[42rem]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(251,78,120,0.36), transparent 60%)",
          }}
          animate={float([0, 60, -40, 0], [0, -40, 30, 0], [1, 1.15, 0.95, 1], 18)}
        />
        <motion.div
          className="absolute top-1/4 right-1/5 h-[24rem] w-[24rem] rounded-full blur-3xl will-change-transform md:h-[38rem] md:w-[38rem]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,176,138,0.4), transparent 60%)",
          }}
          animate={float([0, -50, 40, 0], [0, 40, -30, 0], [1, 0.9, 1.1, 1], 22)}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/2 hidden h-[22rem] w-[22rem] rounded-full blur-3xl will-change-transform sm:block md:h-[34rem] md:w-[34rem]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(168,85,247,0.22), transparent 60%)",
          }}
          animate={float([0, 40, -30, 0], [0, -20, 20, 0], [1, 1.05, 0.97, 1], 26)}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
