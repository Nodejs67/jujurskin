-- JujurSkin Database Schema
-- Jalankan ini di Supabase SQL Editor: https://supabase.com/dashboard/project/mmmbupwjoztixoijvjmj/sql

-- =============================================
-- Tabel: skin_analyses
-- Menyimpan hasil analisis kulit setiap user
-- =============================================
CREATE TABLE IF NOT EXISTS skin_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT,
  usia INTEGER NOT NULL,
  kota TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('pria', 'wanita')),
  tipe_kulit TEXT NOT NULL CHECK (tipe_kulit IN ('normal', 'berminyak', 'kering', 'kombinasi', 'sensitif')),
  masalah TEXT[] NOT NULL DEFAULT '{}',
  budget INTEGER NOT NULL,
  produk_existing TEXT,
  hasil JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query berdasarkan waktu
CREATE INDEX IF NOT EXISTS idx_skin_analyses_created_at ON skin_analyses(created_at DESC);

-- =============================================
-- Tabel: feedback
-- Menyimpan feedback dari teman yang mencoba
-- =============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT,
  usia INTEGER,
  kota TEXT,
  pengguna_aktif BOOLEAN NOT NULL DEFAULT false,
  hal_disukai TEXT,
  hal_membingungkan TEXT,
  fitur_diinginkan TEXT,
  fitur_tidak_penting TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query berdasarkan waktu
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- =============================================
-- Row Level Security (nonaktifkan dulu untuk public access)
-- =============================================
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: siapapun bisa INSERT (tidak perlu login)
CREATE POLICY "public insert analyses" ON skin_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert feedback" ON feedback FOR INSERT WITH CHECK (true);

-- Policy: bisa baca analysis berdasarkan ID (untuk halaman hasil)
CREATE POLICY "public read analyses by id" ON skin_analyses FOR SELECT USING (true);
CREATE POLICY "public read feedback" ON feedback FOR SELECT USING (true);
