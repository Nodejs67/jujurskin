import { ImageResponse } from "next/og";

export const alt = "JujurSkin — Platform Skincare Jujur Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #eef4ea 0%, #f5f8f2 60%, #e7f0e4 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "999px",
              background: "#dce8d6",
              border: "3px solid #7aa583",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🌿
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700, color: "#2f3d34" }}>JujurSkin</div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: 800,
            color: "#27332b",
            lineHeight: 1.15,
            maxWidth: "1000px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          Skincare yang berani bilang apa yang
          <span style={{ color: "#FB4E78", marginLeft: "16px" }}>TIDAK</span>
          <span style={{ marginLeft: "16px" }}>perlu kamu beli.</span>
        </div>

        {/* Subline */}
        <div style={{ fontSize: "30px", color: "#4a5a4f", marginTop: "36px", maxWidth: "920px" }}>
          Rekomendasi berbasis kondisi kulit & budget — bukan iklan.
        </div>

        {/* Footer chips */}
        <div style={{ display: "flex", gap: "16px", marginTop: "48px" }}>
          {["Tidak terafiliasi brand", "Berbasis sains", "100% Gratis"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: "24px",
                color: "#2f3d34",
                background: "#ffffff",
                border: "2px solid #cfe0c8",
                borderRadius: "999px",
                padding: "10px 26px",
                display: "flex",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
