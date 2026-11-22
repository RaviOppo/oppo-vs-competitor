#!/usr/bin/env node
/**
 * Seed Supabase with data from JSON files
 * Run: node scripts/seed-supabase.js
 * Requires .env.local with Supabase credentials
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Load env
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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
    fitur_kamera: phone.fiturKamera,
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
    fitur_kamera: phone.fiturKamera,
  };
}

async function seed() {
  console.log('🌱 Starting Supabase seed...\n');

  // Read JSON files
  const oppoData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/oppo.json'), 'utf-8'));
  const compData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/competitors.json'), 'utf-8'));
  const usersData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/users.json'), 'utf-8'));
  const scriptsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/scripts.json'), 'utf-8'));

  console.log(`📱 OPPO phones: ${oppoData.length}`);
  console.log(`📱 Competitor phones: ${compData.length}`);
  console.log(`👤 Users: ${usersData.length}`);
  console.log(`📝 Scripts: ${scriptsData.length}\n`);

  // Seed OPPO phones
  console.log('📤 Seeding OPPO phones...');
  const oppoDb = oppoData.map(mapOppoToDb);
  const { error: oppoError } = await supabase.from('oppo_phones').upsert(oppoDb, { onConflict: 'id' });
  if (oppoError) {
    console.error('❌ OPPO error:', oppoError.message);
  } else {
    console.log(`✅ OPPO phones seeded: ${oppoDb.length}`);
  }

  // Seed Competitor phones
  console.log('📤 Seeding Competitor phones...');
  const compDb = compData.map(mapCompetitorToDb);
  const { error: compError } = await supabase.from('competitor_phones').upsert(compDb, { onConflict: 'id' });
  if (compError) {
    console.error('❌ Competitor error:', compError.message);
  } else {
    console.log(`✅ Competitor phones seeded: ${compDb.length}`);
  }

  // Seed Users
  console.log('📤 Seeding Users...');
  for (const user of usersData) {
    const { error: userError } = await supabase.from('users').upsert({
      id: user.id,
      username: user.username,
      password_hash: user.passwordHash,
      role: user.role,
    }, { onConflict: 'id' });

    if (userError) {
      console.error(`❌ User ${user.username} error:`, userError.message);
    } else {
      console.log(`✅ User seeded: ${user.username}`);
    }
  }

  // Seed Scripts
  console.log('📤 Seeding Scripts...');
  for (const script of scriptsData) {
    const { error: scriptError } = await supabase.from('scripts').upsert({
      id: script.id,
      title: script.title,
      content: script.content,
    }, { onConflict: 'id' });

    if (scriptError) {
      console.error(`❌ Script ${script.title} error:`, scriptError.message);
    } else {
      console.log(`✅ Script seeded: ${script.title}`);
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run supabase-schema.sql in Supabase SQL Editor (if not done)');
  console.log('2. Deploy to Vercel with env vars');
  console.log('3. Test login at /login');
}

seed().catch(console.error);