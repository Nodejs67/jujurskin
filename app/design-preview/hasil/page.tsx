"use client";

/**
 * /design-preview/hasil — PREVIEW gaya hasil analisis "playful beauty"
 * Referensi: Emina (badge angka pink, foto bulat, copy "bestie", CTA pink),
 * dipadu kebersihan Sociolla & Female Daily (header, search, kartu produk).
 * TIDAK mengubah aplikasi utama. Dummy data.
 */

import { useEffect } from "react";
import { Heart, ShoppingBag, Menu, Search, Star, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const DISPLAY = "'Baloo 2','Plus Jakarta Sans',cursive";
const BODY = "'Nunito','Plus Jakarta Sans',sans-serif";

const ASPECTS = [
  { n: 1, name: "Ukuran Pori", tone: "radial-gradient(circle at 35% 30%,#f5d8c6,#d8a98c)",
    text: "Perawatan pori-porimu udah oke banget! Tetap rutin bersihin muka & pakai produk yang cocok biar pori makin halus dan kulitmu makin sehat. Well done! ✨" },
  { n: 2, name: "Dark Spots", tone: "radial-gradient(circle at 40% 35%,#caa085,#8a5e44)",
    text: "Bintik hitammu terkelola dengan baik! Lanjut pakai produk yang tepat dan lindungi kulit dari matahari tiap hari yaa. Keep glowing, bestie! 🌷" },
  { n: 3, name: "Tekstur", tone: "radial-gradient(circle at 50% 40%,#f1ded0,#cdb29c)",
    text: "Usahamu merawat kulit keren banget! Rutin eksfoliasi lembut, pakai pelembap, dan lindungi kulitmu — wajahmu bakal makin halus & bercahaya. 💛" },
  { n: 4, name: "Jerawat", tone: "radial-gradient(circle at 40% 35%,#f4cdbc,#da9a86)",
    text: "Keren! Kamu berhasil atasi jerawat dengan baik. Komitmenmu skincare-an oke banget. Tetap konsisten biar kulitmu makin sehat & happy. 💪" },
  { n: 5, name: "Kulit Kemerahan", tone: "radial-gradient(circle at 45% 40%,#f7cac3,#e18a82)",
    text: "Kemerahanmu terjaga dengan baik! Hindari produk yang terlalu keras dan rajin pakai pelembap menenangkan. Soft & calm terus ya, bestie! 🌸" },
];

const PRODUCTS = [
  { name: "Niacinamide 10% Serum", brand: "Lokal A", price: "79.000", off: "20%", rate: "4.9" },
  { name: "Gentle Cleanser pH 5.5", brand: "Lokal B", price: "55.000", off: "", rate: "4.7" },
  { name: "Sunscreen SPF 50", brand: "Lokal C", price: "89.000", off: "15%", rate: "4.9" },
];

export default function HasilPreviewPage() {
  useEffect(() => {
    const id = "gf-emina";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5ddd0", fontFamily: BODY, display: "flex", justifyContent: "center" }}>
      {/* device column */}
      <div style={{ width: "100%", maxWidth: 440, position: "relative", background: "linear-gradient(180deg,#FFF1F6 0%,#FFF7EC 38%,#FFEDE6 100%)", minHeight: "100vh", boxShadow: "0 0 60px -20px rgba(0,0,0,.25)" }}>

        {/* Header (Sociolla/Emina-style) */}
        <div style={{ borderTop: "3px solid #FF6FB0", background: "#fff", position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#FF4DA6,#FF8FC0)", display: "grid", placeItems: "center", color: "#fff" }}><Heart className="w-4 h-4" fill="#fff" /></span>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, color: "#FF4D9D", fontSize: 19 }}>jujurskin</div>
                <div style={{ fontSize: 7.5, letterSpacing: 1.5, color: "#FBA1C4", fontWeight: 700 }}>JUJUR · GRATIS</div>
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, color: "#FF6FB0" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#8a8a8a" }}>Masuk</span>
              <Heart className="w-5 h-5" />
              <ShoppingBag className="w-5 h-5" />
              <span style={{ width: 1, height: 18, background: "#eee" }} />
              <Menu className="w-5 h-5" />
            </div>
          </div>
          {/* search (Sociolla/FD) */}
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF0F6", border: "1.5px solid #FFD7E8", borderRadius: 999, padding: "9px 14px", color: "#E889B0", fontSize: 13, fontWeight: 600 }}>
              <Search className="w-4 h-4" /> Cari produk, bahan, masalah kulit…
            </div>
          </div>
        </div>

        {/* Card hasil */}
        <div style={{ padding: "18px 14px 150px" }}>
          <div style={{ background: "#fff", borderRadius: 26, padding: "22px 18px", boxShadow: "0 20px 50px -24px rgba(214,80,140,.45)", border: "1px solid #FFE4F0" }}>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFEAF3", color: "#E84E97", fontWeight: 800, fontSize: 11.5, padding: "5px 12px", borderRadius: 999 }}>
                <Sparkles className="w-3.5 h-3.5" /> HASIL ANALISIS KULITMU
              </span>
            </div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 27, textAlign: "center", color: "#2b2330", margin: "6px 0 4px" }}>Pertahankan Aspek Ini 💖</h1>
            <p style={{ textAlign: "center", color: "#9b8e97", fontSize: 13, marginBottom: 18 }}>5 hal yang udah kamu jaga dengan baik, bestie!</p>

            {ASPECTS.map((a) => (
              <div key={a.n} style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#FF3D9A,#FF7DB6)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, boxShadow: "0 6px 14px -4px rgba(255,61,154,.6)" }}>{a.n}</span>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: "#2b2330" }}>{a.name}</h3>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ float: "left", width: 78, height: 78, borderRadius: "50%", background: a.tone, marginRight: 14, marginBottom: 6, boxShadow: "0 6px 16px -6px rgba(180,90,120,.5)", border: "3px solid #fff", outline: "1.5px solid #FFE0EE" }} />
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#4a434f", fontWeight: 500 }}>{a.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rekomendasi produk (Sociolla/FD card style) */}
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: "#2b2330" }}>Rekomendasi buat kamu 🛍️</h2>
            <span style={{ color: "#E84E97", fontWeight: 700, fontSize: 13 }}>Lihat semua →</span>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "12px 2px 4px", scrollbarWidth: "none" }}>
            {PRODUCTS.map((p) => (
              <div key={p.name} style={{ width: 150, flexShrink: 0, background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #FFE4F0", boxShadow: "0 10px 24px -16px rgba(214,80,140,.4)" }}>
                <div style={{ height: 110, background: "linear-gradient(135deg,#FFE9F2,#FFF3E9)", position: "relative" }}>
                  {p.off && <span style={{ position: "absolute", top: 8, left: 8, background: "#FF3D9A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>-{p.off}</span>}
                  <span style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", color: "#FF6FB0" }}><Heart className="w-3.5 h-3.5" /></span>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: "#2b2330", lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ color: "#9b8e97", fontSize: 11 }}>{p.brand}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, margin: "5px 0" }}><Star className="w-3 h-3" fill="#FFB020" color="#FFB020" /><span style={{ fontSize: 11, color: "#9b8e97" }}>{p.rate}</span></div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15, color: "#E84E97" }}>Rp {p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA + Talk to Us (Emina-style) */}
        <div style={{ position: "sticky", bottom: 0, padding: "12px 14px 16px", background: "linear-gradient(180deg,transparent,#FFEDE6 30%)", display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{ flex: 1, border: 0, borderRadius: 999, padding: "15px 18px", background: "linear-gradient(90deg,#FF2E93,#FF6FB0)", color: "#fff", fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, boxShadow: "0 14px 30px -10px rgba(255,46,147,.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
            Lihat Rekomendasi <ArrowRight className="w-5 h-5" />
          </button>
          <button style={{ border: 0, borderRadius: 999, padding: "13px 16px", background: "linear-gradient(135deg,#FF9E7D,#FFC2A3)", color: "#fff", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 12px 26px -10px rgba(255,140,100,.7)", cursor: "pointer" }}>
            <MessageCircle className="w-4 h-4" /> Talk to Us
          </button>
        </div>
      </div>
    </div>
  );
}
