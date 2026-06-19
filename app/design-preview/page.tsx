"use client";

/**
 * /design-preview — HALAMAN PROTOTIPE TERPISAH.
 * Berisi 4 design direction (A/B/C/D) sebagai mockup dengan dummy data.
 * TIDAK mengimpor / mengubah komponen aplikasi utama.
 * Lihat docs/ui-research.md & docs/design-direction.md untuk konteks.
 */

import { useState, useEffect } from "react";

// ── Dummy data ────────────────────────────────────────────
const CATEGORIES = ["Analisis", "Foto", "BPOM", "Sunscreen", "Konflik", "Kamus", "Dokter"];
const TOOLS = [
  { ic: "🛡️", name: "Cek BPOM", desc: "Pastikan terdaftar & aman" },
  { ic: "⚗️", name: "Konflik Bahan", desc: "Yang tak boleh dicampur" },
  { ic: "☀️", name: "Sunscreen", desc: "Tanpa whitecast" },
  { ic: "📸", name: "Analisis Foto", desc: "Ukur kulit di HP-mu" },
];
const PRODUCTS = [
  { name: "Niacinamide 10% Serum", brand: "Lokal A", price: "79.000", rate: "4.9", badge: "✓ Worth it" },
  { name: "Gentle Cleanser pH 5.5", brand: "Lokal B", price: "55.000", rate: "4.7", badge: "Pemula" },
  { name: "Sunscreen SPF 50 No-Whitecast", brand: "Lokal C", price: "89.000", rate: "4.9", badge: "✓ Worth it" },
  { name: "Moisturizer Ceramide", brand: "Lokal D", price: "65.000", rate: "4.6", badge: "Hemat" },
];
const METRICS = [
  { k: "Kemerahan", v: "Rendah", c: "g" }, { k: "Minyak", v: "Sedang", c: "a" },
  { k: "Kerataan", v: "Baik", c: "g" }, { k: "Tone", v: "Sehat", c: "g" },
];

// ── Tema per direction ────────────────────────────────────
type Dir = "A" | "B" | "C" | "D";
const UI = "'Plus Jakarta Sans',-apple-system,Segoe UI,sans-serif";
const SERIF = "'Fraunces','Plus Jakarta Sans',serif";
type Theme = {
  label: string; mood: string; bg: string; ink: string; sub: string; card: string;
  line: string; accent: string; accent2: string; accentSoft: string; gold: string;
  warm: string; warmSoft: string; radius: number; display: string; body: string; rec?: boolean;
};
// warna default (akan ditimpa oleh PALETTES yang dipilih)
const C0 = { bg: "#FAF7F1", ink: "#1E2A26", sub: "#6E7B72", card: "#ffffff", line: "#ECE7DC",
  accent: "#2E8B6B", accent2: "#3DA882", accentSoft: "#E8F2EC", gold: "#C8765A", warm: "#C8765A", warmSoft: "#F6E7E0" };
const THEMES: Record<Dir, Theme> = {
  A: { ...C0, label: "A · Modern Minimalist", mood: "Tenang, bersih, terpercaya (Linear × Notion × Aesop)", radius: 16, display: SERIF, body: UI },
  B: { ...C0, label: "B · Premium Luxury", mood: "Editorial mahal (Aesop × Sephora × Apple)", radius: 6, display: SERIF, body: SERIF },
  C: { ...C0, label: "C · Female-focused Beauty", mood: "Sociolla/FD tanpa pink — hangat, ramah, foto-forward", radius: 20, display: SERIF, body: UI, rec: true },
  D: { ...C0, label: "D · SaaS Dashboard", mood: "App/tool: skor + grafik (Linear × Stripe × Oura)", radius: 16, display: UI, body: UI },
};

// ── PALETTE (riset-based, mostly perempuan + anti-pink) ────
type PaletteKey = "euca" | "sage" | "jade" | "emerald";
type Palette = { name: string; note: string; bg: string; card: string; ink: string; sub: string; line: string; accent: string; accent2: string; accentSoft: string; warm: string; warmSoft: string; gold: string };
const PALETTES: Record<PaletteKey, Palette> = {
  euca:    { name: "Eucalyptus & Clay ★", note: "Hijau condong-biru lembut + terracotta hangat. Paling sesuai riset.",
             bg: "#FAF7F1", card: "#FFFFFF", ink: "#1E2A26", sub: "#6E7B72", line: "#ECE7DC", accent: "#2E8B6B", accent2: "#3DA882", accentSoft: "#E8F2EC", warm: "#C8765A", warmSoft: "#F6E7E0", gold: "#C8765A" },
  sage:    { name: "Sage & Soft Gold", note: "Sage desaturated + gold champagne. Paling kalem/premium.",
             bg: "#FAF8F2", card: "#FFFFFF", ink: "#20281F", sub: "#6F7A70", line: "#EAE6DB", accent: "#4E7E63", accent2: "#6F9B7D", accentSoft: "#E9F0EA", warm: "#C2922E", warmSoft: "#F5ECD6", gold: "#C2922E" },
  jade:    { name: "Jade & Apricot", note: "Jade + apricot hangat. Paling 'feminin' tapi non-pink.",
             bg: "#FBF6EF", card: "#FFFFFF", ink: "#1E2A26", sub: "#6E7B72", line: "#EFE7DC", accent: "#2E8B6B", accent2: "#3DA882", accentSoft: "#E7F3ED", warm: "#E08A5E", warmSoft: "#FBEFE6", gold: "#E08A5E" },
  emerald: { name: "Emerald (lama)", note: "Versi sebelumnya — pembanding.",
             bg: "#FBFCFB", card: "#FFFFFF", ink: "#16231D", sub: "#6C7B73", line: "#ECEFE9", accent: "#1F8F5F", accent2: "#36B27E", accentSoft: "#EAF5EF", warm: "#C2922E", warmSoft: "#F7EFD9", gold: "#C2922E" },
};
const mc = (c: string) => (c === "g" ? "#1c7a4e" : c === "a" ? "#8a6a17" : "#b23b3b");
const mbg = (c: string) => (c === "g" ? "#e7f6ed" : c === "a" ? "#fbf0d8" : "#fde7e7");

// ── Primitives ────────────────────────────────────────────
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0" style={{ width: 322 }}>
      <div style={{ borderRadius: 38, border: "10px solid #1c1c1e", boxShadow: "0 30px 60px -20px rgba(0,0,0,.35)", overflow: "hidden", background: "#000" }}>
        <div style={{ height: 660, overflowY: "auto", position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}
function Star() { return <span style={{ color: "#c2922e", fontSize: 11 }}>★</span>; }

// ── Mobile mockups per direction ──────────────────────────
function MobileA({ t }: { t: typeof THEMES.A }) {
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: "100%", fontFamily: t.body }}>
      <div style={{ padding: "16px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <b style={{ fontFamily: t.display, fontSize: 18 }}>✦ JujurSkin</b><span style={{ color: t.sub }}>⌘ ◍</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", border: `1.5px solid ${t.line}`, borderRadius: 14, padding: "11px 14px", color: t.sub, fontSize: 13 }}>🔍 Cari produk / bahan…</div>
        <h1 style={{ fontFamily: t.display, fontSize: 34, lineHeight: 1.05, margin: "26px 0 10px", fontWeight: 600 }}>Skincare yang jujur.</h1>
        <p style={{ color: t.sub, fontSize: 14, marginBottom: 18 }}>Rekomendasi berbasis kondisi kulit & budget — bukan iklan.</p>
        <button style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 14, padding: "13px 18px", fontWeight: 700, fontSize: 14, width: "100%" }}>Mulai Analisis Gratis →</button>
        <SectionTitle t={t} title="Alat Jujur" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TOOLS.map((x) => (
            <div key={x.name} style={{ border: `1px solid ${t.line}`, borderRadius: t.radius, padding: 14, background: t.card }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: t.accentSoft, display: "grid", placeItems: "center", fontSize: 17, marginBottom: 9 }}>{x.ic}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{x.name}</div>
              <div style={{ color: t.sub, fontSize: 11.5 }}>{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav t={t} active={0} />
    </div>
  );
}
function MobileB({ t }: { t: typeof THEMES.B }) {
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: "100%", fontFamily: t.body }}>
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", letterSpacing: 1 }}><b style={{ fontFamily: t.display }}>JUJURSKIN</b><span>☰</span></div>
      <div style={{ height: 300, margin: "0 0 6px", background: `linear-gradient(160deg,${t.warmSoft},${t.accent2} 55%,${t.accent})`, display: "grid", placeItems: "end center", padding: 22, color: "#fff" }}>
        <div>
          <div style={{ fontFamily: t.display, fontSize: 30, lineHeight: 1.1, fontWeight: 600 }}>Rawat,<br />bukan memutihkan.</div>
          <div style={{ marginTop: 12, borderBottom: "1px solid #fff", display: "inline-block", paddingBottom: 3, fontSize: 13 }}>Mulai perjalanan →</div>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <SectionTitle t={t} title="Filosofi kami" />
        <p style={{ color: t.sub, fontSize: 14, lineHeight: 1.7 }}>Kami percaya kulit sehat tidak harus putih. Setiap rekomendasi diukur dari bahan & bukti — bukan tren.</p>
        <SectionTitle t={t} title="Pilihan kurasi" />
        {PRODUCTS.slice(0, 2).map((p) => (
          <div key={p.name} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: `1px solid ${t.line}` }}>
            <div style={{ width: 64, height: 64, background: "#e6e0d3", borderRadius: t.radius }} />
            <div><div style={{ fontFamily: t.display, fontWeight: 600, fontSize: 15 }}>{p.name}</div><div style={{ color: t.sub, fontSize: 12 }}>{p.brand}</div><div style={{ marginTop: 6, fontWeight: 700 }}>Rp {p.price}</div></div>
          </div>
        ))}
      </div>
      <BottomNav t={t} active={0} />
    </div>
  );
}
function MobileC({ t }: { t: typeof THEMES.C }) {
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: "100%", fontFamily: t.body }}>
      <div style={{ padding: "14px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b style={{ fontFamily: t.display, fontSize: 18 }}>jujurskin</b><span style={{ color: t.sub }}>♡ ◍</span>
      </div>
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#fff", border: `1.5px solid ${t.line}`, borderRadius: 999, padding: "11px 16px", color: t.sub, fontSize: 13 }}>🔍 Cari skincare, bahan…</div>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "14px 16px" }}>
        {CATEGORIES.map((c, i) => (
          <div key={c} style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: i === 0 ? t.accent : t.accentSoft, color: i === 0 ? "#fff" : t.accent, display: "grid", placeItems: "center", fontSize: 19 }}>{["🔬", "📸", "🛡️", "☀️", "⚗️", "📖", "🩺"][i]}</div>
            <div style={{ fontSize: 10.5, marginTop: 5, color: t.sub }}>{c}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: `linear-gradient(120deg,${t.accent},${t.accent2})`, borderRadius: t.radius, padding: 18, color: "#fff" }}>
          <div style={{ fontFamily: t.display, fontSize: 19, fontWeight: 600 }}>Analisis kulit gratis</div>
          <div style={{ fontSize: 12.5, opacity: .9, margin: "4px 0 12px" }}>Tahu masalah & produk yang pas dalam 2 menit.</div>
          <span style={{ background: "#fff", color: t.accent, fontWeight: 700, fontSize: 12.5, padding: "8px 14px", borderRadius: 999 }}>Mulai →</span>
        </div>
        <SectionTitle t={t} title="Buat kamu" link="Lihat semua" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {PRODUCTS.map((p) => <ProductCard key={p.name} t={t} p={p} />)}
        </div>
      </div>
      <div style={{ height: 70 }} />
      <BottomNav t={t} active={0} />
    </div>
  );
}
function MobileD({ t }: { t: typeof THEMES.D }) {
  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: "100%", fontFamily: t.body }}>
      <div style={{ padding: "16px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 12, color: t.sub }}>Selamat pagi,</div><b style={{ fontSize: 17 }}>Jeri 👋</b></div><span>◍</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.radius, padding: 18, textAlign: "center", boxShadow: "0 8px 24px -16px rgba(20,50,35,.35)" }}>
          <div style={{ fontSize: 12, color: t.sub }}>Healthy Skin Score</div>
          <div style={{ fontFamily: t.display, fontSize: 52, fontWeight: 800, color: t.accent, lineHeight: 1.1 }}>78</div>
          <div style={{ fontSize: 12, color: "#1c7a4e" }}>▲ +4 minggu ini</div>
          <div style={{ height: 8, borderRadius: 99, background: "#eef1ee", marginTop: 10, overflow: "hidden" }}><div style={{ width: "78%", height: "100%", background: t.accent }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ fontSize: 11.5, color: t.sub }}>{m.k}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: mc(m.c), background: mbg(m.c), padding: "2px 8px", borderRadius: 999 }}>{m.v}</span>
            </div>
          ))}
        </div>
        <SectionTitle t={t} title="Rutinitas hari ini" />
        {["Gentle Cleanser", "Niacinamide Serum", "Sunscreen SPF 50"].map((r, i) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: t.card, border: `1px solid ${t.line}`, borderRadius: 12, marginBottom: 8 }}>
            <span>{i < 1 ? "☑" : "☐"}</span><span style={{ fontSize: 13.5 }}>{r}</span>
          </div>
        ))}
        <SectionTitle t={t} title="Tren mingguan" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: 12 }}>
          {[40, 52, 48, 63, 70, 78].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: t.accent, opacity: .35 + i * .12, borderRadius: 4 }} />)}
        </div>
      </div>
      <div style={{ height: 70 }} />
      <BottomNav t={t} active={1} />
    </div>
  );
}
function ProductCard({ t, p }: { t: typeof THEMES.C; p: typeof PRODUCTS[number] }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.radius, overflow: "hidden" }}>
      <div style={{ height: 96, background: "linear-gradient(135deg,#eef6f0,#f6f3ea)", position: "relative" }}>
        <span style={{ position: "absolute", top: 8, left: 8, background: "#fff", border: `1px solid ${t.line}`, fontSize: 10, fontWeight: 700, color: p.badge === "Hemat" ? t.warm : t.accent, padding: "3px 8px", borderRadius: 999 }}>{p.badge}</span>
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.25 }}>{p.name}</div>
        <div style={{ color: t.sub, fontSize: 11 }}>{p.brand}</div>
        <div style={{ marginTop: 4 }}><Star /> <span style={{ fontSize: 11, color: t.sub }}>{p.rate}</span></div>
        <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>Rp {p.price}</div>
      </div>
    </div>
  );
}
function SectionTitle({ t, title, link }: { t: typeof THEMES.A; title: string; link?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "22px 0 12px" }}>
      <div style={{ fontFamily: t.display, fontSize: 18, fontWeight: 600 }}>{title}</div>
      {link && <span style={{ color: t.accent, fontSize: 12, fontWeight: 700 }}>{link} →</span>}
    </div>
  );
}
function BottomNav({ t, active }: { t: typeof THEMES.A; active: number }) {
  const items = [["⌂", "Beranda"], ["✦", "Analisis"], ["▦", "Alat"], ["▢", "Produk"], ["◍", "Akun"]];
  return (
    <div style={{ position: "sticky", bottom: 0, display: "flex", justifyContent: "space-around", background: t.card, borderTop: `1px solid ${t.line}`, padding: "9px 6px 12px" }}>
      {items.map(([ic, l], i) => (
        <div key={l} style={{ textAlign: "center", color: i === active ? t.accent : t.sub }}>
          <div style={{ fontSize: 18 }}>{ic}</div><div style={{ fontSize: 9.5, fontWeight: i === active ? 700 : 500 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ── Desktop strip per direction (ringkas) ─────────────────
function DesktopStrip({ t, dir }: { t: typeof THEMES.A; dir: Dir }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: t.bg, color: t.ink, fontFamily: t.body, border: `1px solid ${t.line}`, borderRadius: 16, overflow: "hidden" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: `1px solid ${t.line}` }}>
        <b style={{ fontFamily: t.display, fontSize: 16, letterSpacing: dir === "B" ? 1 : 0 }}>{dir === "B" ? "JUJURSKIN" : "✦ JujurSkin"}</b>
        {dir !== "B" && <div style={{ flex: 1, maxWidth: 360, background: "#fff", border: `1.5px solid ${t.line}`, borderRadius: 999, padding: "8px 14px", color: t.sub, fontSize: 12.5 }}>🔍 Cari produk, bahan, masalah kulit…</div>}
        <span style={{ marginLeft: "auto", background: t.accent, color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 12.5, fontWeight: 700 }}>Analisis Gratis</span>
      </div>
      {dir === "C" && (
        <div style={{ display: "flex", gap: 18, padding: "12px 18px", overflowX: "auto" }}>
          {CATEGORIES.map((c, i) => (
            <div key={c} style={{ textAlign: "center" }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: i === 0 ? t.accent : t.accentSoft, color: i === 0 ? "#fff" : t.accent, display: "grid", placeItems: "center" }}>{["🔬", "📸", "🛡️", "☀️", "⚗️", "📖", "🩺"][i]}</div><div style={{ fontSize: 10, color: t.sub, marginTop: 4 }}>{c}</div></div>
          ))}
        </div>
      )}
      {/* hero */}
      <div style={{ padding: 18 }}>
        {dir === "D" ? (
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 12 }}>
            <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.sub }}>Skin Score</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: t.accent }}>78</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {METRICS.map((m) => <div key={m.k} style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: 12, padding: 12 }}><div style={{ fontSize: 11, color: t.sub }}>{m.k}</div><span style={{ fontSize: 11.5, fontWeight: 700, color: mc(m.c), background: mbg(m.c), padding: "2px 7px", borderRadius: 999 }}>{m.v}</span></div>)}
            </div>
          </div>
        ) : dir === "B" ? (
          <div style={{ height: 150, borderRadius: t.radius, background: `linear-gradient(120deg,${t.warmSoft},${t.accent})`, display: "grid", placeItems: "center", color: "#fff", fontFamily: t.display, fontSize: 26, fontWeight: 600 }}>Rawat, bukan memutihkan.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: t.display, fontSize: 30, fontWeight: 600, lineHeight: 1.05 }}>Skincare yang jujur,<br />bukan yang viral.</div>
              <div style={{ color: t.sub, fontSize: 13, margin: "8px 0 14px" }}>Rekomendasi berbasis kondisi kulit & budget — bukan iklan.</div>
              <span style={{ background: t.accent, color: "#fff", borderRadius: 12, padding: "10px 16px", fontWeight: 700, fontSize: 13 }}>Mulai Analisis →</span>
            </div>
            <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.radius, height: 150 }} />
          </div>
        )}
        {/* product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16 }}>
          {PRODUCTS.map((p) => <ProductCard key={p.name} t={t} p={p} />)}
        </div>
      </div>
    </div>
  );
}

// ── Halaman ───────────────────────────────────────────────
export default function DesignPreviewPage() {
  const [dir, setDir] = useState<Dir>(() => {
    if (typeof window !== "undefined") {
      const d = new URLSearchParams(window.location.search).get("dir");
      if (d === "A" || d === "B" || d === "C" || d === "D") return d;
    }
    return "C";
  });
  const [pal, setPal] = useState<PaletteKey>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("pal");
      if (p === "euca" || p === "sage" || p === "jade" || p === "emerald") return p;
    }
    return "euca";
  });
  useEffect(() => {
    const id = "gf-preview";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  const pc = PALETTES[pal];
  const t: Theme = { ...THEMES[dir], ...pc };
  const mobiles: Record<Dir, React.ReactNode> = {
    A: <MobileA t={{ ...THEMES.A, ...pc }} />,
    B: <MobileB t={{ ...THEMES.B, ...pc }} />,
    C: <MobileC t={{ ...THEMES.C, ...pc }} />,
    D: <MobileD t={{ ...THEMES.D, ...pc }} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1311", color: "#e8efe9", fontFamily: UI, padding: "28px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#7fae93", textTransform: "uppercase" }}>JujurSkin · Design Preview</p>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, margin: "6px 0 4px" }}>4 Arah Desain — bandingkan & pilih</h1>
        <p style={{ color: "#9fb2a7", fontSize: 14, maxWidth: 640 }}>Mockup dummy. Aplikasi utama tidak diubah. Detail di <code>docs/design-direction.md</code>. Rekomendasi: <b style={{ color: "#7fae93" }}>C-hybrid</b>.</p>

        {/* Switcher */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "22px 0" }}>
          {(Object.keys(THEMES) as Dir[]).map((d) => (
            <button key={d} onClick={() => setDir(d)}
              style={{ border: dir === d ? "1.5px solid #36b27e" : "1.5px solid #2a322e", background: dir === d ? "#16241d" : "transparent", color: dir === d ? "#cdebd9" : "#9fb2a7", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              {THEMES[d].label}{THEMES[d].rec ? " ★" : ""}
            </button>
          ))}
        </div>

        {/* Palette switcher */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, color: "#7fae93", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Palette warna (riset · mostly perempuan · anti-pink)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(Object.keys(PALETTES) as PaletteKey[]).map((k) => {
              const P = PALETTES[k];
              return (
                <button key={k} onClick={() => setPal(k)}
                  style={{ display: "flex", alignItems: "center", gap: 8, border: pal === k ? "1.5px solid #36b27e" : "1.5px solid #2a322e", background: pal === k ? "#16241d" : "transparent", color: pal === k ? "#cdebd9" : "#9fb2a7", borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: 12.5 }}>
                  <span style={{ display: "flex", gap: 3 }}>
                    <i style={{ width: 14, height: 14, borderRadius: 4, background: P.accent }} />
                    <i style={{ width: 14, height: 14, borderRadius: 4, background: P.warm }} />
                    <i style={{ width: 14, height: 14, borderRadius: 4, background: P.bg, border: "1px solid #2a322e" }} />
                  </span>
                  {P.name}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "#9fb2a7", marginTop: 6 }}>{PALETTES[pal].note}</div>
        </div>

        {/* Mood */}
        <div style={{ background: "#15201b", border: "1px solid #243029", borderRadius: 14, padding: "12px 16px", marginBottom: 20, fontSize: 13.5, color: "#bcd2c5" }}>
          <b style={{ color: "#e8efe9" }}>{t.label}</b> — {t.mood}{t.rec ? "  ·  ⭐ Rekomendasi final (lihat alasan di bawah)" : ""}
        </div>

        {/* Preview: phone + desktop */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#7fae93", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Mobile (prioritas)</div>
            <Phone>{mobiles[dir]}</Phone>
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ fontSize: 12, color: "#7fae93", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Desktop</div>
            <DesktopStrip t={t} dir={dir} />
          </div>
        </div>

        {/* Rationale */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {[
            ["Conversion", { A: "Tinggi", B: "Sedang", C: "Tertinggi", D: "Sedang" }[dir]],
            ["Retention", { A: "Sedang", B: "Sedang", C: "Tinggi", D: "Tertinggi" }[dir]],
            ["Mobile usability", { A: "Tinggi", B: "Sedang", C: "Tertinggi", D: "Tinggi" }[dir]],
            ["Trend 2026", { A: "Tinggi", B: "Tinggi", C: "Tinggi", D: "Tinggi" }[dir]],
          ].map(([k, v]) => (
            <div key={k as string} style={{ background: "#15201b", border: "1px solid #243029", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11.5, color: "#7fae93", textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, background: "#13201a", border: "1px solid #2c5a40", borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 700, color: "#cdebd9", marginBottom: 6 }}>✅ Rekomendasi final: <b>Hybrid C-led</b></div>
          <p style={{ color: "#a9c3b5", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
            Basis <b>C (Beauty App, anti-pink)</b> untuk halaman publik (konversi & mobile tertinggi, familiar untuk audiens ID),
            dipoles disiplin <b>A (Minimalist)</b> agar tetap lega & "jujur premium" (bukan ramai seperti Sociolla/FD),
            dan area pasca-analisis (<code>/hasil</code>, <code>/progress</code>, <code>/rutinitas</code>) pakai <b>D (Dashboard)</b> untuk retensi.
          </p>
        </div>
      </div>
    </div>
  );
}
