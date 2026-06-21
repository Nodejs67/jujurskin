"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BentoGrid / BentoCard — grid bento bermotion. Diadaptasi dari 21st.dev (Bento Grid).
 */
export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-pink-100/80 bg-white/60 p-6 backdrop-blur-sm",
        "shadow-sm transition-shadow hover:shadow-xl hover:shadow-pink-100",
        className,
      )}
    >
      {/* glow halus saat hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FB4E78]/0 blur-2xl transition-all duration-500 group-hover:bg-[#FB4E78]/20" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
