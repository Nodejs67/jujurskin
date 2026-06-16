import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#86efac40] dark:bg-primary/10",
        className,
      )}
    >
      <span
        className="absolute inset-0 block h-full w-full animate-gradient rounded-full bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 bg-[length:300%_100%] p-[1px]"
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}
