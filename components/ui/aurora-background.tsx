"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AuroraBackground — latar gradient "aurora" beranimasi (futuristik kalem).
 * Diadaptasi dari 21st.dev (AuroraBackground) ke palet brand JujurSkin
 * (pink #FB4E78 + peach + ungu lembut). Presentational murni, aman.
 */
export function AuroraBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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
          className="absolute -top-1/3 left-1/5 h-[42rem] w-[42rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(251,78,120,0.38), transparent 60%)",
          }}
          animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/5 h-[38rem] w-[38rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,176,138,0.42), transparent 60%)",
          }}
          animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/2 h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(168,85,247,0.22), transparent 60%)",
          }}
          animate={{ x: [0, 40, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
