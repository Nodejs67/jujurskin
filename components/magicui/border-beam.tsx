"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  delay?: number;
}

export function BorderBeam({
  className,
  duration = 6,
  colorFrom = "#86efac",
  colorTo = "#d4af37",
  borderWidth = 1,
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
        style={
          {
            background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 20%, ${colorTo} 40%, transparent 50%)`,
            animation: `border-spin ${duration}s linear infinite`,
            animationDelay: `-${delay}s`,
          } as CSSProperties
        }
      />
      <div
        className="absolute rounded-[inherit] bg-card"
        style={{ inset: `${borderWidth}px` }}
      />
    </div>
  );
}
