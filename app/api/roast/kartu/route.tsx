// ── Generator kartu share "Jujur Check" (PNG, siap posting IG Story).
//
// PRIVASI: route ini HANYA menerima angka agregat (skor, hemat, jumlah produk).
// Nama produk TIDAK PERNAH masuk URL — kartu yang dibagikan tidak boleh membocorkan
// isi lemari skincare seseorang, dan URL sering ikut tersimpan di riwayat/log.

import { ImageResponse } from "next/og";
import { scoreLabel } from "@/lib/roast/copy";

export const size = { width: 1080, height: 1350 };
export const contentType = "image/png";

/** Ambil integer dari query dengan pagar batas — jangan percaya input publik. */
function readInt(params: URLSearchParams, key: string, min: number, max: number, fallback: number): number {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

const formatRupiah = (n: number) => n.toLocaleString("id-ID");

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const score = readInt(params, "skor", 5, 100, 70);
  const saved = readInt(params, "hemat", 0, 100_000_000, 0);
  const analyzed = readInt(params, "produk", 0, 100, 0);
  const overlaps = readInt(params, "overlap", 0, 100, 0);
  const label = scoreLabel(score);

  // Warna mengikuti brand: hijau tenang + aksen pink JujurSkin.
  const accent = score >= 75 ? "#4f8a5b" : score >= 60 ? "#c98a2b" : "#FB4E78";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          background: "linear-gradient(160deg, #f3f7f0 0%, #eaf2e6 55%, #e2ece0 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "999px",
              background: "#dce8d6",
              border: "3px solid #7aa583",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
            }}
          >
            🌿
          </div>
          <div style={{ fontSize: "38px", fontWeight: 700, color: "#2f3d34" }}>JujurSkin</div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ fontSize: "26px", color: "#5c6b60" }}>jujurskin.com/roast</div>
        </div>

        <div style={{ display: "flex", fontSize: "34px", color: "#5c6b60", marginTop: "56px" }}>
          Jujur Check saya
        </div>

        {/* Skor */}
        <div style={{ display: "flex", alignItems: "flex-end", marginTop: "10px" }}>
          <div style={{ display: "flex", fontSize: "210px", fontWeight: 800, color: accent, lineHeight: 1 }}>
            {score}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "58px",
              fontWeight: 600,
              color: "#8a9a8f",
              marginLeft: "12px",
              marginBottom: "26px",
            }}
          >
            /100
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "40px", fontWeight: 600, color: "#2f3d34", marginTop: "8px" }}>
          {label}
        </div>

        {/* Angka utama */}
        <div style={{ display: "flex", gap: "20px", marginTop: "56px" }}>
          {[
            // Nominal rupiah butuh ruang lebih supaya tidak patah dua baris.
            { k: "Bisa dihemat", v: saved > 0 ? `Rp ${formatRupiah(saved)}` : "Rp 0", grow: 1.6 },
            { k: "Produk dicek", v: `${analyzed}`, grow: 1 },
            { k: "Fungsi dobel", v: `${overlaps}`, grow: 1 },
          ].map((stat) => (
            <div
              key={stat.k}
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: stat.grow,
                flexBasis: 0,
                background: "#ffffff",
                border: "2px solid #d7e4d1",
                borderRadius: "28px",
                padding: "30px 28px",
              }}
            >
              <div style={{ display: "flex", fontSize: "26px", color: "#6c7c71" }}>{stat.k}</div>
              <div
                style={{
                  display: "flex",
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "#27332b",
                  marginTop: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                {stat.v}
              </div>
            </div>
          ))}
        </div>

        {overlaps > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "48px",
              background: "#ffffff",
              border: "2px solid #d7e4d1",
              borderRadius: "28px",
              padding: "36px 34px",
            }}
          >
            <div style={{ display: "flex", fontSize: "28px", color: "#6c7c71" }}>Kami menemukan</div>
            <div style={{ display: "flex", fontSize: "46px", fontWeight: 700, color: "#27332b", marginTop: "12px" }}>
              {overlaps === 1
                ? "1 kelompok produk berfungsi sama"
                : `${overlaps} kelompok produk berfungsi sama`}
            </div>
          </div>
        )}

        <div style={{ flexGrow: 1 }} />

        <div
          style={{
            display: "flex",
            fontSize: "36px",
            lineHeight: 1.4,
            color: "#3c4a40",
            borderLeft: `8px solid ${accent}`,
            paddingLeft: "28px",
          }}
        >
          {/*
            JANGAN pilih kalimat ini cuma dari `saved`. Rutinitas bisa saja nol pemborosan
            TAPI kehilangan langkah esensial (mis. skor 77, hemat Rp 0, belum punya
            sunscreen) — dulu kartunya menyombong "rutinitasku ramping" padahal halaman
            di sebelahnya bilang "belum ada sunscreen". Skor yang membedakan keduanya.
          */}
          {saved > 0
            ? "Kulitku bukan kurang skincare. Dompetku yang butuh istirahat. 😭"
            : score >= 90
              ? "Rutinitasku ramping. Nggak ada yang perlu di-roast. 🌿"
              : "Ternyata ada yang kelewat dari rutinitasku. 👀"}
        </div>

        <div style={{ display: "flex", fontSize: "24px", color: "#7c8a80", marginTop: "40px" }}>
          Bukan diagnosis medis. Cek rutinitasmu sendiri di jujurskin.com/roast
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        // Kartu adalah fungsi murni dari query param — dua orang dengan angka sama
        // dapat gambar identik. Kalau fitur ini viral, cache-lah yang menahan beban,
        // bukan CPU server (satu render Satori ~300ms).
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
