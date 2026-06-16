import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "#86efac",
  shimmerSize = "0.1em",
  borderRadius = "12px",
  shimmerDuration = "1.8s",
  background = "oklch(0.55 0.18 145)",
  onClick,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      style={
        {
          "--shimmer-color": shimmerColor,
          "--border-radius": borderRadius,
          "--shimmer-duration": shimmerDuration,
          "--background": background,
          "--cut": shimmerSize,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-primary/20 px-6 py-3 text-white [background:var(--background)] [border-radius:var(--border-radius)] font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
        "before:absolute before:inset-0 before:rounded-[inherit] before:[background:linear-gradient(90deg,transparent_calc(var(--cut)*10),var(--shimmer-color),transparent_calc(100%_-_var(--cut)*10))] before:[background-size:200%_100%] before:animate-shimmer before:opacity-0 group-hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
