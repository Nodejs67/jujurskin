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

-- =============================================
-- MIGRATION: Tambah kolom baru (quiz 7 langkah)
-- Jalankan ini SETELAH schema awal sudah berjalan
-- =============================================
ALTER TABLE skin_analyses
  ADD COLUMN IF NOT EXISTS penggunaan_sunscreen TEXT CHECK (penggunaan_sunscreen IN ('tidak_pernah', 'jarang', 'kadang', 'selalu')),
  ADD COLUMN IF NOT EXISTS paparan_matahari TEXT CHECK (paparan_matahari IN ('dalam_ruangan', 'sesekali', 'sering', 'sepanjang_hari')),
  ADD COLUMN IF NOT EXISTS lingkungan TEXT CHECK (lingkungan IN ('kering_ac', 'lembab', 'campuran')),
  ADD COLUMN IF NOT EXISTS kualitas_tidur TEXT CHECK (kualitas_tidur IN ('buruk', 'cukup', 'baik')),
  ADD COLUMN IF NOT EXISTS tingkat_stress TEXT CHECK (tingkat_stress IN ('rendah', 'sedang', 'tinggi')),
  ADD COLUMN IF NOT EXISTS riwayat_hormonal BOOLEAN,
  ADD COLUMN IF NOT EXISTS status_kehamilan TEXT CHECK (status_kehamilan IN ('tidak', 'hamil', 'menyusui')),
  ADD COLUMN IF NOT EXISTS riwayat_sensitif BOOLEAN,
  ADD COLUMN IF NOT EXISTS reaksi_produk TEXT,
  ADD COLUMN IF NOT EXISTS pengalaman_retinoid TEXT CHECK (pengalaman_retinoid IN ('belum', 'pernah_gagal', 'toleran'));

-- =============================================
-- Tabel: skin_progress (tracking mingguan)
-- =============================================
CREATE TABLE IF NOT EXISTS skin_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  week INTEGER NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  kondisi_jerawat INTEGER CHECK (kondisi_jerawat BETWEEN 1 AND 10),
  kelembapan INTEGER CHECK (kelembapan BETWEEN 1 AND 10),
  kecerahan INTEGER CHECK (kecerahan BETWEEN 1 AND 10),
  iritasi INTEGER CHECK (iritasi BETWEEN 1 AND 10),
  catatan TEXT,
  produk_dipakai TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skin_progress ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_skin_progress_session ON skin_progress(session_id);
CREATE POLICY "public insert progress" ON skin_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "public read progress" ON skin_progress FOR SELECT USING (true);
