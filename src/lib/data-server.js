import { getSupabaseAdmin } from './supabase';

const TABLE_OPPO = 'oppo_phones';
const TABLE_COMPETITORS = 'competitor_phones';

function mapOppoFromDb(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    type: row.type,
    harga: row.harga,
    rearCamera: row.rear_camera,
    selfieCamera: row.selfie_camera,
    layar: row.layar,
    speaker: row.speaker,
    baterai: row.baterai,
    ramRom: row.ram_rom,
    sertifikasi: row.sertifikasi,
    chipset: row.chipset,
    os: row.os,
    aiFitur: row.ai_fitur,
    fiturKamera: row.fitur_kamera,
  };
}

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

function mapCompetitorFromDb(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    type: row.type,
    harga: row.harga,
    rearCamera: row.rear_camera,
    selfieCamera: row.selfie_camera,
    layar: row.layar,
    speaker: row.speaker,
    baterai: row.baterai,
    ramRom: row.ram_rom,
    sertifikasi: row.sertifikasi,
    chipset: row.chipset,
    os: row.os,
    aiFitur: row.ai_fitur,
    fiturKamera: row.fitur_kamera,
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

function getAdmin() {
  return getSupabaseAdmin();
}

export async function getOppoPhonesSync() {
  const admin = getAdmin();
  if (!admin) return [];
  const { data, error } = await admin
    .from(TABLE_OPPO)
    .select('*')
    .order('model', { ascending: true });
  if (error) {
    console.error('Error fetching OPPO phones:', error);
    return [];
  }
  return data.map(mapOppoFromDb);
}

export async function getCompetitorPhonesSync() {
  const admin = getAdmin();
  if (!admin) return [];
  const { data, error } = await admin
    .from(TABLE_COMPETITORS)
    .select('*')
    .order('brand', { ascending: true })
    .order('model', { ascending: true });
  if (error) {
    console.error('Error fetching competitor phones:', error);
    return [];
  }
  return data.map(mapCompetitorFromDb);
}

export async function saveOppoPhones(phones) {
  const admin = getAdmin();
  if (!admin) return false;
  const dbPhones = phones.map(mapOppoToDb);
  const { error } = await admin.from(TABLE_OPPO).upsert(dbPhones, { onConflict: 'id' });
  if (error) {
    console.error('Error saving OPPO phones:', error);
    return false;
  }
  return true;
}

export async function saveCompetitorPhones(phones) {
  const admin = getAdmin();
  if (!admin) return false;
  const dbPhones = phones.map(mapCompetitorToDb);
  const { error } = await admin.from(TABLE_COMPETITORS).upsert(dbPhones, { onConflict: 'id' });
  if (error) {
    console.error('Error saving competitor phones:', error);
    return false;
  }
  return true;
}

export async function deleteOppoPhone(id) {
  const admin = getAdmin();
  if (!admin) return false;
  const { error } = await admin.from(TABLE_OPPO).delete().eq('id', id);
  if (error) {
    console.error('Error deleting OPPO phone:', error);
    return false;
  }
  return true;
}

export async function deleteCompetitorPhone(id) {
  const admin = getAdmin();
  if (!admin) return false;
  const { error } = await admin.from(TABLE_COMPETITORS).delete().eq('id', id);
  if (error) {
    console.error('Error deleting competitor phone:', error);
    return false;
  }
  return true;
}