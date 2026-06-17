import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  background?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export function ShimmerButton({
  children,
  className,
  background = "oklch(0.50 0.17 145)",
  onClick,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary/30 px-6 py-3 font-medium text-white text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_24px_oklch(0.75_0.18_145/0.4)]",
        className,
      )}
      style={{ background }}
      {...props}
    >
      {/* Shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
        aria-hidden
      />
      {children}
    </button>
  );
}
