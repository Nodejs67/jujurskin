import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GlassCard — kartu glassmorphism. Diadaptasi dari 21st.dev (Glass Card)
 * ke palet terang JujurSkin (kaca putih + shadow pink lembut).
 */
export function GlassCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card"
      className={cn(
        "rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(251,78,120,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
