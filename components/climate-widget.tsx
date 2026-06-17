"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Loader2, Sun, Droplets, Thermometer, AlertTriangle } from "lucide-react";

type Climate = {
  city: string;
  region: string;
  uv: number;
  humidity: number;
  temp: number;
};

function uvLevel(uv: number) {
  if (uv >= 8) return { label: "Ekstrem", color: "text-red-700", bg: "bg-red-400/10 border-red-400/20" };
  if (uv >= 6) return { label: "Tinggi", color: "text-orange-700", bg: "bg-orange-400/10 border-orange-400/20" };
  if (uv >= 3) return { label: "Sedang", color: "text-yellow-800", bg: "bg-yellow-400/10 border-yellow-400/20" };
  return { label: "Rendah", color: "text-green-700", bg: "bg-green-400/10 border-green-400/20" };
}

function tips(uv: number, humidity: number): string[] {
  const t: string[] = [];
  if (uv >= 8) t.push("UV ekstrem — wajib sunscreen SPF 50+ water-resistant, reapply tiap 2 jam saat di luar.");
  else if (uv >= 6) t.push("UV tinggi — sunscreen SPF 30–50 setiap pagi, reapply bila beraktivitas di luar.");
  else if (uv >= 3) t.push("UV sedang — sunscreen SPF 30 tetap wajib, walau terasa tidak terik.");
  else t.push("UV rendah hari ini, tapi sunscreen tetap dianjurkan (UVA tetap ada sepanjang hari).");

  if (humidity >= 70) t.push("Udara lembap — pilih moisturizer gel/water-based & fokus kontrol minyak.");
  else if (humidity < 45) t.push("Udara kering — pakai hydrating toner + moisturizer lebih rich agar kulit tidak dehidrasi.");
  else t.push("Kelembapan sedang — moisturizer ringan biasanya sudah cukup.");
  return t;
}

export function ClimateWidget({ defaultCity = "" }: { defaultCity?: string }) {
  const [city, setCity] = useState(defaultCity);
  const [data, setData] = useState<Climate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClimate = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=id&format=json`
      );
      const geo = await geoRes.json();
      if (!geo.results || geo.results.length === 0) {
        setError("Kota tidak ditemukan. Coba nama kota lain (mis. Jakarta, Bandung).");
        setLoading(false);
        return;
      }
      const loc = geo.results[0];
      const fRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m&daily=uv_index_max&timezone=auto&forecast_days=1`
      );
      const f = await fRes.json();
      setData({
        city: loc.name,
        region: [loc.admin1, loc.country].filter(Boolean).join(", "),
        uv: Math.round((f.daily?.uv_index_max?.[0] ?? 0) * 10) / 10,
        humidity: Math.round(f.current?.relative_humidity_2m ?? 0),
        temp: Math.round(f.current?.temperature_2m ?? 0),
      });
    } catch {
      setError("Gagal mengambil data cuaca. Coba lagi sebentar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (defaultCity) fetchClimate(defaultCity);
  }, [defaultCity, fetchClimate]);

  const level = data ? uvLevel(data.uv) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Iklim real-time kotamu</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); fetchClimate(city); }}
        className="flex gap-2 mb-4"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ketik kotamu, mis. Surabaya"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cek"}
        </button>
      </form>

      {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

      {data && level && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{data.city}</p>
            {data.region && <p className="text-xs text-muted-foreground">{data.region}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-xl border p-3 text-center ${level.bg}`}>
              <Sun className={`w-4 h-4 mx-auto mb-1 ${level.color}`} />
              <p className={`text-lg font-bold ${level.color}`}>{data.uv}</p>
              <p className="text-[10px] text-muted-foreground">UV · {level.label}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-3 text-center">
              <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-700" />
              <p className="text-lg font-bold text-foreground">{data.humidity}%</p>
              <p className="text-[10px] text-muted-foreground">Kelembapan</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-3 text-center">
              <Thermometer className="w-4 h-4 mx-auto mb-1 text-orange-700" />
              <p className="text-lg font-bold text-foreground">{data.temp}°</p>
              <p className="text-[10px] text-muted-foreground">Suhu</p>
            </div>
          </div>

          <ul className="space-y-1.5">
            {tips(data.uv, data.humidity).map((t, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {!data && !error && !loading && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
          <span>Data UV & kelembapan diambil real-time dari Open-Meteo (gratis). Rekomendasi sunscreen & pelembap menyesuaikan.</span>
        </div>
      )}
    </div>
  );
}
