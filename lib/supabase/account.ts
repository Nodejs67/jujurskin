"use client";

import { createClient } from "@/lib/supabase/client";
import type { AnalysisResult } from "@/lib/recommendations";

// Catatan: semua fungsi RESILIENT — jika tabel belum dibuat / RLS menolak / offline,
// kembalikan nilai aman (null/[]/false) tanpa melempar, agar fitur lama (localStorage)
// tetap berjalan. Tabel dibuat manual via supabase/auth-schema.sql.

export type SavedAnalysis = {
  id: string;
  label: string | null;
  tipe_kulit: string | null;
  usia: number | null;
  kota: string | null;
  budget: number | null;
  masalah: string[] | null;
  hasil: AnalysisResult;
  created_at: string;
};

export type ProgressRow = {
  week: number;
  tanggal?: string | null;
  kondisi_jerawat: number;
  kelembapan: number;
  kecerahan: number;
  iritasi: number;
  catatan?: string | null;
};

type SaveAnalysisInput = {
  hasil: AnalysisResult;
  label?: string;
  tipe_kulit?: string;
  usia?: number;
  kota?: string;
  budget?: number;
  masalah?: string[];
};

export async function saveAnalysis(userId: string, input: SaveAnalysisInput): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("saved_analyses").insert({
      user_id: userId,
      label: input.label ?? null,
      tipe_kulit: input.tipe_kulit ?? null,
      usia: input.usia ?? null,
      kota: input.kota ?? null,
      budget: input.budget ?? null,
      masalah: input.masalah ?? [],
      hasil: input.hasil,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function listSavedAnalyses(userId: string): Promise<SavedAnalysis[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as SavedAnalysis[];
  } catch {
    return [];
  }
}

export async function deleteSavedAnalysis(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("saved_analyses").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function saveProgress(userId: string, rows: ProgressRow[]): Promise<boolean> {
  try {
    const supabase = createClient();
    const payload = rows.map((r) => ({
      user_id: userId,
      week: r.week,
      tanggal: r.tanggal ?? null,
      kondisi_jerawat: r.kondisi_jerawat,
      kelembapan: r.kelembapan,
      kecerahan: r.kecerahan,
      iritasi: r.iritasi,
      catatan: r.catatan ?? null,
    }));
    const { error } = await supabase.from("saved_progress").upsert(payload, { onConflict: "user_id,week" });
    return !error;
  } catch {
    return false;
  }
}

export async function loadProgress(userId: string): Promise<ProgressRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_progress")
      .select("week,tanggal,kondisi_jerawat,kelembapan,kecerahan,iritasi,catatan")
      .eq("user_id", userId)
      .order("week", { ascending: true });
    if (error || !data) return [];
    return data as ProgressRow[];
  } catch {
    return [];
  }
}
