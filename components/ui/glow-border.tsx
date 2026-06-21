"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * GlowBorder — bingkai gradient (pink→peach→ungu) yang berputar pelan.
 * Konten anak diletakkan di atas latar kaca. Hormati reduced-motion
 * (gradient tetap tampil, hanya berhenti berputar).
 */
export function GlowBorder({
  className,
  children,
  rounded = "rounded-2xl",
}: {
  className?: string;
  children: React.ReactNode;
  rounded?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden p-[1.5px]", rounded, className)}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-60%]"
        style={{
          background:
            "conic-gradient(from 0deg, #FB4E78, #FF8FB1, #A855F7, #FFB08A, #FB4E78)",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />
      <div className={cn("relative h-full w-full bg-white/85 backdrop-blur-md", rounded)}>
        {children}
      </div>
    </div>
  );
}
