"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, Plus, Calendar, CheckCircle,
  Sparkles, ChevronDown, ChevronUp, Droplets, Sun,
  Zap, Heart, Edit3, Trash2, BarChart2, Info, Camera, X, ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteFooter } from "@/components/site-footer";

interface ProgressEntry {
  id: string;
  week: number;
  date: string;
  kondisi_jerawat: number;
  kelembapan: number;
  kecerahan: number;
  iritasi: number;
  catatan: string;
  produk_dipakai: string[];
  photo?: string; // base64
}

const METRICS = [
  { key: "kondisi_jerawat" as const, label: "Kondisi Jerawat", icon: Zap, color: "text-blue-400", desc: "10 = bebas jerawat" },
  { key: "kelembapan" as const, label: "Kelembapan", icon: Droplets, color: "text-cyan-400", desc: "10 = sangat lembap" },
  { key: "kecerahan" as const, label: "Kecerahan", icon: Sun, color: "text-amber-400", desc: "10 = sangat cerah & glowing" },
  { key: "iritasi" as const, label: "Bebas Iritasi", icon: Heart, color: "text-green-400", desc: "10 = tidak ada iritasi" },
];

function ScoreSlider({ value, onChange, color, disabled }: { value: number; onChange: (v: number) => void; color: string; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className={`flex-1 h-2 rounded-full accent-primary cursor-pointer disabled:opacity-40`}
      />
      <div className={`w-8 text-center text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className={`text-xs font-bold w-5 ${color}`}>{value}</span>
    </div>
  );
}

function TrendArrow({ entries, metricKey }: { entries: ProgressEntry[]; metricKey: keyof ProgressEntry }) {
  if (entries.length < 2) return null;
  const last = entries[entries.length - 1][metricKey] as number;
  const prev = entries[entries.length - 2][metricKey] as number;
  const diff = last - prev;
  if (diff === 0) return <span className="text-xs text-muted-foreground">→</span>;
  return diff > 0
    ? <span className="text-xs text-green-400">↑ +{diff}</span>
    : <span className="text-xs text-red-400">↓ {diff}</span>;
}

const LINE_COLORS: Record<string, string> = {
  kondisi_jerawat: "#60a5fa",
  kelembapan: "#22d3ee",
  kecerahan: "#fbbf24",
  iritasi: "#4ade80",
};

function ProgressLineChart({ entries }: { entries: ProgressEntry[] }) {
  const PL = 28, PR = 16, PT = 12, PB = 28;
  const W = 400, H = 160;
  const cW = W - PL - PR;
  const cH = H - PT - PB;
  const n = entries.length;

  const xOf = (i: number) =>
    PL + (n === 1 ? cW / 2 : (i / (n - 1)) * cW);
  const yOf = (val: number) =>
    PT + cH - ((val - 1) / 9) * cH;

  const keys = ["kondisi_jerawat", "kelembapan", "kecerahan", "iritasi"] as const;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "140px" }}>
      {[2, 4, 6, 8, 10].map((v) => (
        <g key={v}>
          <line
            x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          />
          <text x={PL - 4} y={yOf(v) + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.22)">
            {v}
          </text>
        </g>
      ))}

      {entries.map((entry, i) => (
        <text
          key={entry.id}
          x={xOf(i)}
          y={H - 5}
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.28)"
        >
          W{entry.week}
        </text>
      ))}

      {keys.map((key) => {
        const color = LINE_COLORS[key];
        const pts = entries
          .map((e, i) => `${xOf(i).toFixed(1)},${yOf(e[key]).toFixed(1)}`)
          .join(" ");
        return (
          <g key={key}>
            {n >= 2 && (
              <polyline
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}
            {entries.map((e, i) => (
              <circle
                key={e.id}
                cx={xOf(i)}
                cy={yOf(e[key])}
                r={n <= 5 ? 3 : 2}
                fill={color}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

const STORAGE_KEY = "jujurskin_progress";
const SESSION_KEY = "jujurskin_session";

function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export default function ProgressPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Form state
  const [form, setForm] = useState({
    kondisi_jerawat: 5,
    kelembapan: 5,
    kecerahan: 5,
    iritasi: 5,
    catatan: "",
    produk_dipakai_raw: "",
    photo: "" as string,
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch { /* skip */ }
    }
  }, []);

  const saveEntries = useCallback((updated: ProgressEntry[]) => {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const handleSubmit = () => {
    const existing = editingId ? entries.find(e => e.id === editingId) : null;
    const entry: ProgressEntry = {
      id: editingId || Date.now().toString(36),
      week: existing?.week ?? (entries.length > 0 ? Math.max(...entries.map(e => e.week)) + 1 : 1),
      date: existing?.date ?? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      kondisi_jerawat: form.kondisi_jerawat,
      kelembapan: form.kelembapan,
      kecerahan: form.kecerahan,
      iritasi: form.iritasi,
      catatan: form.catatan,
      produk_dipakai: form.produk_dipakai_raw.split(",").map(s => s.trim()).filter(Boolean),
      photo: form.photo || undefined,
    };

    const updated = editingId
      ? entries.map(e => e.id === editingId ? entry : e)
      : [...entries, entry];

    saveEntries(updated);
    setShowForm(false);
    setEditingId(null);
    setPhotoPreview("");
    setForm({ kondisi_jerawat: 5, kelembapan: 5, kecerahan: 5, iritasi: 5, catatan: "", produk_dipakai_raw: "", photo: "" });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setForm(f => ({ ...f, photo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (entry: ProgressEntry) => {
    setForm({
      kondisi_jerawat: entry.kondisi_jerawat,
      kelembapan: entry.kelembapan,
      kecerahan: entry.kecerahan,
      iritasi: entry.iritasi,
      catatan: entry.catatan,
      produk_dipakai_raw: entry.produk_dipakai.join(", "),
      photo: entry.photo || "",
    });
    setPhotoPreview(entry.photo || "");
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  const avgScore = (entries: ProgressEntry[], key: keyof ProgressEntry) => {
    if (!entries.length) return 0;
    return Math.round(entries.reduce((acc, e) => acc + (e[key] as number), 0) / entries.length * 10) / 10;
  };

  const latestEntry = entries[entries.length - 1];
  const overallScore = latestEntry
    ? Math.round((latestEntry.kondisi_jerawat + latestEntry.kelembapan + latestEntry.kecerahan + latestEntry.iritasi) / 4 * 10)
    : 0;

  const firstEntry = entries[0];
  const overallFirst = firstEntry
    ? Math.round((firstEntry.kondisi_jerawat + firstEntry.kelembapan + firstEntry.kecerahan + firstEntry.iritasi) / 4 * 10)
    : 0;

  const improvement = overallScore - overallFirst;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Progress Kulit</span>
          </div>
          <Button
            size="sm"
            onClick={() => { setEditingId(null); setForm({ kondisi_jerawat: 5, kelembapan: 5, kecerahan: 5, iritasi: 5, catatan: "", produk_dipakai_raw: "", photo: "" }); setShowForm(true); }}
            className="bg-primary text-primary-foreground text-xs gap-1"
          >
            <Plus className="w-3 h-3" /> Catat
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 w-full space-y-6">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-base">Skin Progress Tracker</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Catat kondisi kulitmu setiap minggu — lihat apakah rutinitas yang kamu jalankan benar-benar bekerja.
          </p>
        </motion.div>

        {/* Summary Stats (hanya jika ada data) */}
        {entries.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
              <p className="text-3xl font-bold text-primary mb-0.5">{overallScore}</p>
              <p className="text-xs text-muted-foreground">Skor Minggu Ini <span className="text-xs">(dari 100)</span></p>
              {entries.length > 1 && (
                <p className={`text-xs font-medium mt-1 ${improvement >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {improvement >= 0 ? `↑ Naik ${improvement} poin` : `↓ Turun ${Math.abs(improvement)} poin`} dari awal
                </p>
              )}
            </div>
            <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-center">
              <p className="text-3xl font-bold text-primary mb-0.5">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Minggu Tercatat</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {entries.length < 4 ? "Konsistenlah selama 4 minggu" : entries.length < 8 ? "Bagus! Terus lanjutkan" : "Luar biasa konsisten!"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Chart toggle (jika ada 2+ entry) */}
        {entries.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => setShowChart(!showChart)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <span>Grafik perkembangan {entries.length} minggu</span>
              </div>
              {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-t-0 border-border/60 rounded-b-xl bg-card/50 p-4">
                    <ProgressLineChart entries={entries} />
                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 mt-1">
                      {METRICS.map(m => (
                        <div key={m.key} className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-0.5 rounded-full inline-block"
                            style={{ backgroundColor: LINE_COLORS[m.key] }}
                          />
                          <span className="text-[10px] text-muted-foreground">{m.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Metric summary */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border/30 pt-3">
                      {METRICS.map(m => (
                        <div key={m.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <m.icon className={`w-3 h-3 ${m.color}`} />
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <strong className={m.color}>{avgScore(entries, m.key)}</strong>
                            <TrendArrow entries={entries} metricKey={m.key} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-primary/30 bg-card p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {editingId ? "Edit Catatan" : `Catatan Minggu ${entries.length + 1}`}
                </h3>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 flex gap-2">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nilai <strong className="text-foreground">10 = kondisi terbaik</strong>. Misal jerawat 10 = bebas jerawat. Iritasi 10 = kulit tenang sempurna.
                </p>
              </div>

              {METRICS.map(m => (
                <div key={m.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                    <p className="text-sm font-medium">{m.label}</p>
                    <span className="text-xs text-muted-foreground/60">({m.desc})</span>
                  </div>
                  <ScoreSlider
                    value={form[m.key]}
                    onChange={v => setForm(f => ({ ...f, [m.key]: v }))}
                    color={m.color}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Produk yang dipakai (pisah dengan koma)</label>
                <input
                  value={form.produk_dipakai_raw}
                  onChange={e => setForm(f => ({ ...f, produk_dipakai_raw: e.target.value }))}
                  placeholder="Misal: Azarine SPF45, COSRX Snail, Somethinc Niacinamide..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Catatan tambahan (opsional)</label>
                <textarea
                  value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                  placeholder="Kondisi jerawat, reaksi produk baru, perubahan cuaca, hormon, stress, dll..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Foto Kulit Minggu Ini (opsional)
                </label>
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-border" />
                    <button
                      onClick={() => { setPhotoPreview(""); setForm(f => ({ ...f, photo: "" })); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border bg-card/50 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground/60">Klik untuk pilih foto · Max 2MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button onClick={handleSubmit} className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                {editingId ? "Simpan Perubahan" : "Simpan Catatan Minggu Ini"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {entries.length === 0 && !showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="font-semibold text-base mb-2">Mulai Tracking Kulitmu</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto mb-6">
              Catat kondisi kulitmu setiap minggu — dalam 4–8 minggu, kamu akan tahu apakah rutinitas benar-benar bekerja.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Mulai Catat Sekarang
            </Button>
          </motion.div>
        )}

        {/* Entry List */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Riwayat Progress</h2>
              <Badge variant="outline" className="text-xs">{entries.length} minggu</Badge>
            </div>

            {[...entries].reverse().map((entry, idx) => {
              const isExpanded = expandedId === entry.id;
              const total = Math.round((entry.kondisi_jerawat + entry.kelembapan + entry.kecerahan + entry.iritasi) / 4 * 10);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-xl border border-border/60 bg-card/80 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">W{entry.week}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{entry.date}</p>
                          <p className="text-xs text-muted-foreground">Skor: <strong className="text-primary">{total}/100</strong></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:grid grid-cols-4 gap-1">
                          {METRICS.map(m => (
                            <div key={m.key} className="text-center">
                              <m.icon className={`w-3 h-3 mx-auto ${m.color}`} />
                              <p className={`text-[10px] font-bold ${m.color}`}>{entry[m.key]}</p>
                            </div>
                          ))}
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 border-t border-border/40 space-y-3">
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            {METRICS.map(m => (
                              <div key={m.key}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <m.icon className={`w-3 h-3 ${m.color}`} />
                                  <p className="text-xs text-muted-foreground">{m.label}</p>
                                </div>
                                <ScoreBar value={entry[m.key]} color={m.color} />
                              </div>
                            ))}
                          </div>

                          {entry.produk_dipakai.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1.5">Produk dipakai:</p>
                              <div className="flex flex-wrap gap-1">
                                {entry.produk_dipakai.map((p, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs px-2">{p}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {entry.catatan && (
                            <div className="bg-muted/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground leading-relaxed">{entry.catatan}</p>
                            </div>
                          )}

                          {entry.photo && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Camera className="w-3 h-3" /> Foto minggu ini:</p>
                              <img src={entry.photo} alt={`Foto minggu ${entry.week}`} className="w-full max-h-48 object-cover rounded-xl border border-border" />
                            </div>
                          )}

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="flex items-center gap-1.5 text-xs text-red-400 hover:underline"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Before / After Photo Comparison */}
        {entries.filter(e => e.photo).length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold">Perbandingan Foto</p>
              </div>
              <button onClick={() => setCompareMode(!compareMode)} className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors">
                {compareMode ? "Sembunyikan" : "Lihat Before/After"}
              </button>
            </div>
            {compareMode && (
              <div className="grid grid-cols-2 gap-3">
                {[entries.filter(e => e.photo)[0], entries.filter(e => e.photo)[entries.filter(e => e.photo).length - 1]].map((e, i) => (
                  <div key={e.id}>
                    <p className="text-xs text-muted-foreground mb-1.5 text-center">{i === 0 ? "📸 Awal" : "📸 Sekarang"} · Minggu {e.week}</p>
                    <img src={e.photo} alt="" className="w-full h-36 object-cover rounded-xl border border-border" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border/40 bg-card/40 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Tips Tracking yang Efektif</p>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>Catat di hari yang sama setiap minggu — misalnya setiap Minggu pagi setelah bangun tidur.</li>
            <li className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>Jangan ganti banyak produk sekaligus — kalau ada perubahan besar (baik atau buruk), kamu tidak akan tahu produk mana penyebabnya.</li>
            <li className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>Catat juga faktor eksternal: stress kerja, siklus hormonal, kurang tidur, atau cuaca ekstrem.</li>
            <li className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>Hasil nyata biasanya baru terlihat di <strong className="text-foreground">minggu ke-4 hingga ke-8</strong>. Jangan judge produk sebelum 4 minggu.</li>
          </ul>
        </motion.div>

        {/* CTA ke analisis */}
        {entries.length === 0 && (
          <div className="flex gap-3 pb-6">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/analisis")}>
              Mulai Analisis Dulu
            </Button>
            <Button className="flex-1" onClick={() => router.push("/rutinitas")}>
              Lihat Rutinitas
            </Button>
          </div>
        )}

        {entries.length > 0 && (
          <div className="flex gap-3 pb-6">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/rutinitas")}>
              Rutinitas AM/PM
            </Button>
            <Button className="flex-1" onClick={() => { setEditingId(null); setForm({ kondisi_jerawat: 5, kelembapan: 5, kecerahan: 5, iritasi: 5, catatan: "", produk_dipakai_raw: "", photo: "" }); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Catat Minggu Baru
            </Button>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
