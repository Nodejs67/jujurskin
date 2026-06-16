"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

function generateSparkle(color: string): Sparkle {
  return {
    id: Math.random().toString(36).slice(2),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color,
    delay: Math.random() * 2,
    scale: Math.random() * 1 + 0.3,
    lifespan: Math.random() * 10 + 5,
  };
}

interface SparklesTextProps {
  children: string;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

export function SparklesText({
  children,
  className,
  sparklesCount = 6,
  colors = { first: "#86efac", second: "#d4af37" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: sparklesCount }, () =>
        generateSparkle(Math.random() > 0.5 ? colors.first : colors.second),
      ),
    );
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) =>
          Math.random() > 0.7
            ? generateSparkle(Math.random() > 0.5 ? colors.first : colors.second)
            : s,
        ),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute z-20 select-none"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, sparkle.scale, 0] }}
          transition={{ duration: sparkle.lifespan * 0.3, delay: sparkle.delay, repeat: Infinity }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 160 160"
            fill={sparkle.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z" />
          </svg>
        </motion.span>
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
