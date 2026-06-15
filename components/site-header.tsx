"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/panduan", label: "Panduan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/produk", label: "Produk" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold tracking-tight">JujurSkin</span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hover:text-foreground transition-colors ${pathname === link.href ? "text-primary font-medium" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => router.push("/analisis")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium"
        >
          Analisis Gratis
        </Button>
      </div>
    </nav>
  );
}
