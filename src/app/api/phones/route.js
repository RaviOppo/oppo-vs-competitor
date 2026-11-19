import { getSupabaseAdmin } from '../../../lib/supabase';
import { OPPO_PHONES } from '../../../data/oppo';
import { COMPETITOR_PHONES } from '../../../data/competitors';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const supabaseAdmin = getSupabaseAdmin();

  // Fallback to static data if Supabase not configured
  if (!supabaseAdmin) {
    if (category === 'oppo') {
      return Response.json(OPPO_PHONES);
    }
    if (category === 'competitors') {
      return Response.json(COMPETITOR_PHONES);
    }
    return Response.json({ error: 'Invalid category' }, { status: 400 });
  }

  if (category === 'oppo') {
    const { data, error } = await supabaseAdmin
      .from(TABLE_OPPO)
      .select('*')
      .order('model', { ascending: true });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data.map(mapOppoFromDb));
  }

  if (category === 'competitors') {
    const { data, error } = await supabaseAdmin
      .from(TABLE_COMPETITORS)
      .select('*')
      .order('brand', { ascending: true })
      .order('model', { ascending: true });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data.map(mapCompetitorFromDb));
  }

  return Response.json({ error: 'Invalid category' }, { status: 400 });
}