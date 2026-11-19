-- Supabase Schema for OPPO vs Competitor
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- OPPO Phones Table
CREATE TABLE IF NOT EXISTS oppo_phones (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL DEFAULT 'OPPO',
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  harga TEXT,
  rear_camera TEXT,
  selfie_camera TEXT,
  layar TEXT,
  speaker TEXT,
  baterai TEXT,
  ram_rom TEXT,
  sertifikasi TEXT,
  chipset TEXT,
  os TEXT,
  ai_fitur TEXT,
  fitur_kamera TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor Phones Table
CREATE TABLE IF NOT EXISTS competitor_phones (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  harga TEXT,
  rear_camera TEXT,
  selfie_camera TEXT,
  layar TEXT,
  speaker TEXT,
  baterai TEXT,
  ram_rom TEXT,
  sertifikasi TEXT,
  chipset TEXT,
  os TEXT,
  ai_fitur TEXT,
  fitur_kamera TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (for NextAuth credentials)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_oppo_phones_model ON oppo_phones(model);
CREATE INDEX IF NOT EXISTS idx_competitor_phones_brand_model ON competitor_phones(brand, model);

-- Row Level Security (RLS) - Optional but recommended
ALTER TABLE oppo_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for service role (admin API)
CREATE POLICY "Allow all for service role" ON oppo_phones FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service role" ON competitor_phones FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service role" ON users FOR ALL USING (auth.role() = 'service_role');

-- Policies: Allow public read access (for comparison page)
CREATE POLICY "Public read access" ON oppo_phones FOR SELECT USING (true);
CREATE POLICY "Public read access" ON competitor_phones FOR SELECT USING (true);