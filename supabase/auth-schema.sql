-- ============================================================
-- JujurSkin — Persistensi per-user (akun)
-- JALANKAN MANUAL di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mmmbupwjoztixoijvjmj/sql
-- Aman dijalankan berulang (IF NOT EXISTS). Tidak mengubah tabel lama.
-- ============================================================

-- 1) PROFIL: 1 baris per user (memakai auth.users bawaan)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  kota TEXT,
  tipe_kulit TEXT,
  usia INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2) SAVED ANALYSES: hasil analisis yang disimpan user ke akun
CREATE TABLE IF NOT EXISTS saved_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  tipe_kulit TEXT,
  usia INTEGER,
  kota TEXT,
  budget INTEGER,
  masalah TEXT[] DEFAULT '{}',
  hasil JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_user ON saved_analyses(user_id, created_at DESC);
ALTER TABLE saved_analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_analyses_select_own" ON saved_analyses;
DROP POLICY IF EXISTS "saved_analyses_insert_own" ON saved_analyses;
DROP POLICY IF EXISTS "saved_analyses_delete_own" ON saved_analyses;
CREATE POLICY "saved_analyses_select_own" ON saved_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_analyses_insert_own" ON saved_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_analyses_delete_own" ON saved_analyses FOR DELETE USING (auth.uid() = user_id);

-- 3) SAVED PROGRESS: jurnal mingguan per user (TANPA foto — foto tetap di perangkat,
--    sesuai Data & Privacy Doctrine: kami tidak menyimpan foto wajah di server)
CREATE TABLE IF NOT EXISTS saved_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  kondisi_jerawat INTEGER,
  kelembapan INTEGER,
  kecerahan INTEGER,
  iritasi INTEGER,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, week)
);
CREATE INDEX IF NOT EXISTS idx_saved_progress_user ON saved_progress(user_id, week);
ALTER TABLE saved_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_progress_select_own" ON saved_progress;
DROP POLICY IF EXISTS "saved_progress_insert_own" ON saved_progress;
DROP POLICY IF EXISTS "saved_progress_update_own" ON saved_progress;
DROP POLICY IF EXISTS "saved_progress_delete_own" ON saved_progress;
CREATE POLICY "saved_progress_select_own" ON saved_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_progress_insert_own" ON saved_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_progress_update_own" ON saved_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "saved_progress_delete_own" ON saved_progress FOR DELETE USING (auth.uid() = user_id);
