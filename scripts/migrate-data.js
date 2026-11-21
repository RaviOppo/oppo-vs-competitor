import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Set NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Load static data using fs (avoid ES module JSON import issues)
const OPPO_PHONES = JSON.parse(fs.readFileSync('./src/data/oppo.json', 'utf-8'));
const COMPETITOR_PHONES = JSON.parse(fs.readFileSync('./src/data/competitors.json', 'utf-8'));
const SCRIPTS_DATA = JSON.parse(fs.readFileSync('./src/data/scripts.json', 'utf-8'));
const usersData = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf-8'));

function mapOppoToDb(phone) {
  return {
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    type: phone.type,
    harga: phone.harga,
    rear_camera: phone.rearCamera,
    selfie_camera: phone.selfieCamera,
    layar: phone.layar,
    speaker: phone.speaker,
    baterai: phone.baterai,
    ram_rom: phone.ramRom,
    sertifikasi: phone.sertifikasi,
    chipset: phone.chipset,
    os: phone.os,
    ai_fitur: phone.aiFitur,
    fitur_kamera: phone.fiturKamera || null,
  };
}

function mapCompetitorToDb(phone) {
  return {
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    type: phone.type,
    harga: phone.harga,
    rear_camera: phone.rearCamera,
    selfie_camera: phone.selfieCamera,
    layar: phone.layar,
    speaker: phone.speaker,
    baterai: phone.baterai,
    ram_rom: phone.ramRom,
    sertifikasi: phone.sertifikasi,
    chipset: phone.chipset,
    os: phone.os,
    ai_fitur: phone.aiFitur,
    fitur_kamera: phone.fiturKamera || null,
  };
}

async function migrate() {
  console.log('📦 Migrasi data ke Supabase...');

  // Migrate OPPO
  const oppoDb = OPPO_PHONES.map(mapOppoToDb);
  const { error: oppoError } = await supabase
    .from('oppo_phones')
    .upsert(oppoDb, { onConflict: 'id' });

  if (oppoError) {
    console.error('❌ OPPO error:', oppoError);
  } else {
    console.log(`✅ OPPO: ${oppoDb.length} models`);
  }

  // Migrate Competitors
  const compDb = COMPETITOR_PHONES.map(mapCompetitorToDb);
  const { error: compError } = await supabase
    .from('competitor_phones')
    .upsert(compDb, { onConflict: 'id' });

  if (compError) {
    console.error('❌ Competitor error:', compError);
  } else {
    console.log(`✅ Competitors: ${compDb.length} models`);
  }

  // Migrate Users
  const usersDb = usersData.map(u => ({
    id: u.id,
    username: u.username,
    password_hash: u.passwordHash,
    role: u.role,
  }));

  const { error: usersError } = await supabase
    .from('users')
    .upsert(usersDb, { onConflict: 'username' });

  if (usersError) {
    console.error('❌ Users error:', usersError);
  } else {
    console.log(`✅ Users: ${usersDb.length} accounts`);
  }

  // Migrate Scripts
  const scriptsDb = SCRIPTS_DATA.map(s => ({
    id: s.id,
    title: s.title,
    content: s.content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { error: scriptsError } = await supabase
    .from('scripts')
    .upsert(scriptsDb, { onConflict: 'id' });

  if (scriptsError) {
    console.error('❌ Scripts error:', scriptsError);
  } else {
    console.log(`✅ Scripts: ${scriptsDb.length} naskah`);
  }

  console.log('🎉 Migrasi selesai!');
}

migrate().catch(console.error);