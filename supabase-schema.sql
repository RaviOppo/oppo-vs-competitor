-- Supabase Schema for OPPO vs Competitor App
-- Run this in Supabase SQL Editor

-- ===========================================
-- OPPO Phones Table
-- ===========================================
CREATE TABLE IF NOT EXISTS oppo_phones (
  id TEXT PRIMARY KEY,
  brand TEXT,
  model TEXT,
  type TEXT,
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

-- ===========================================
-- Competitor Phones Table
-- ===========================================
CREATE TABLE IF NOT EXISTS competitor_phones (
  id TEXT PRIMARY KEY,
  brand TEXT,
  model TEXT,
  type TEXT,
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

-- ===========================================
-- Users Table (for NextAuth credentials)
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Scripts Table (for admin naskah)
-- ===========================================
CREATE TABLE IF NOT EXISTS scripts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Enable Row Level Security (RLS)
-- ===========================================
ALTER TABLE oppo_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- Public Read Policies (anyone can read)
-- ===========================================
CREATE POLICY "Public read oppo_phones" ON oppo_phones
  FOR SELECT USING (true);

CREATE POLICY "Public read competitor_phones" ON competitor_phones
  FOR SELECT USING (true);

CREATE POLICY "Public read scripts" ON scripts
  FOR SELECT USING (true);

-- Users table: no public read (admin only via service role)

-- ===========================================
-- Admin Write Policies (via service_role key - bypasses RLS)
-- Service role key has full access, no policies needed
-- But if using anon key with auth, add policies:
-- ===========================================
-- CREATE POLICY "Admin insert oppo_phones" ON oppo_phones
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- ===========================================
-- Indexes for performance
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_oppo_phones_model ON oppo_phones(model);
CREATE INDEX IF NOT EXISTS idx_oppo_phones_type ON oppo_phones(type);
CREATE INDEX IF NOT EXISTS idx_competitor_phones_brand ON competitor_phones(brand);
CREATE INDEX IF NOT EXISTS idx_competitor_phones_model ON competitor_phones(model);
CREATE INDEX IF NOT EXISTS idx_competitor_phones_type ON competitor_phones(type);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- ===========================================
-- Updated_at trigger function
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ===========================================
-- Apply updated_at triggers
-- ===========================================
DROP TRIGGER IF EXISTS update_oppo_phones_updated_at ON oppo_phones;
CREATE TRIGGER update_oppo_phones_updated_at
  BEFORE UPDATE ON oppo_phones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_competitor_phones_updated_at ON competitor_phones;
CREATE TRIGGER update_competitor_phones_updated_at
  BEFORE UPDATE ON competitor_phones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scripts_updated_at ON scripts;
CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();