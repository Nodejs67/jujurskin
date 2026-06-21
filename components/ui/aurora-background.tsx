"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AuroraBackground — latar futuristik: gradient "aurora" + tech-grid +
 * cursor spotlight (desktop). Palet brand JujurSkin (pink/peach/ungu).
 *
 * Optimasi HP: animasi aurora HANYA jalan di desktop (>=768px) + saat
 * motion diizinkan. Di mobile gradient-nya STATIS (hemat GPU/baterai),
 * spotlight juga mati (tidak ada mouse). Hormati prefers-reduced-motion.
 */
export function AuroraBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // animasikan hanya di layar besar + bukan reduced-motion
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setAnimate(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;
    const r = root.getBoundingClientRect();
    glow.style.background = `radial-gradient(440px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(251,78,120,0.14), transparent 70%)`;
    glow.style.opacity = "1";
  };
  const onLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  const float = (a: number[], b: number[], scale: number[], dur: number) =>
    animate ? { x: a, y: b, scale, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const } } : undefined;

  return (
    <div
      ref={rootRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("relative overflow-hidden bg-[#FFF7F9]", className)}
      {...props}
    >
      {/* Aurora blobs (statis di mobile, beranimasi di desktop) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute -top-1/4 left-1/5 h-[26rem] w-[26rem] rounded-full blur-3xl will-change-transform md:h-[42rem] md:w-[42rem]"
          style={{ background: "radial-gradient(circle at center, rgba(251,78,120,0.36), transparent 60%)" }}
          animate={float([0, 60, -40, 0], [0, -40, 30, 0], [1, 1.15, 0.95, 1], 18)}
        />
        <motion.div
          className="absolute top-1/4 right-1/5 h-[24rem] w-[24rem] rounded-full blur-3xl will-change-transform md:h-[38rem] md:w-[38rem]"
          style={{ background: "radial-gradient(circle at center, rgba(255,176,138,0.4), transparent 60%)" }}
          animate={float([0, -50, 40, 0], [0, 40, -30, 0], [1, 0.9, 1.1, 1], 22)}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/2 hidden h-[22rem] w-[22rem] rounded-full blur-3xl will-change-transform sm:block md:h-[34rem] md:w-[34rem]"
          style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.22), transparent 60%)" }}
          animate={float([0, 40, -30, 0], [0, -20, 20, 0], [1, 1.05, 0.97, 1], 26)}
        />
      </div>

      {/* Tech grid halus (statis, dengan radial mask) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,78,120,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,78,120,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.06,
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 22%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 22%, #000 25%, transparent 75%)",
        }}
      />

      {/* Cursor spotlight (desktop saja) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-300 md:block"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
