import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getOppoPhonesSync, getCompetitorPhonesSync, saveOppoPhones, saveCompetitorPhones, deleteOppoPhone, deleteCompetitorPhone } from '../../../../lib/data-server';
import { OPPO_PHONES } from '../../../../data/oppo';
import { COMPETITOR_PHONES } from '../../../../data/competitors';

// Check if Supabase is configured
function hasSupabase() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
}

// Fallback to static data when Supabase not available
function getStaticOppo() {
  return OPPO_PHONES;
}

function getStaticCompetitors() {
  return COMPETITOR_PHONES;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  if (hasSupabase()) {
    const [oppo, competitors] = await Promise.all([
      getOppoPhonesSync(),
      getCompetitorPhonesSync(),
    ]);
    return Response.json({ oppo, competitors });
  }

  // Fallback to static data
  return Response.json({ oppo: getStaticOppo(), competitors: getStaticCompetitors() });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

  if (hasSupabase()) {
    if (category === 'oppo') {
      const phones = await getOppoPhonesSync();
      if (phones.find(p => p.id === phone.id)) {
        return Response.json({ error: 'ID sudah ada' }, { status: 400 });
      }
      phones.push(phone);
      await saveOppoPhones(phones);
      return Response.json(phones);
    } else {
      const phones = await getCompetitorPhonesSync();
      if (phones.find(p => p.id === phone.id)) {
        return Response.json({ error: 'ID sudah ada' }, { status: 400 });
      }
      phones.push(phone);
      await saveCompetitorPhones(phones);
      return Response.json(phones);
    }
  }

  // Supabase not configured - return error for write operations
  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

  if (hasSupabase()) {
    if (category === 'oppo') {
      const phones = await getOppoPhonesSync();
      const updated = phones.map(p => p.id === phone.id ? phone : p);
      await saveOppoPhones(updated);
      return Response.json(updated);
    } else {
      const phones = await getCompetitorPhonesSync();
      const updated = phones.map(p => p.id === phone.id ? phone : p);
      await saveCompetitorPhones(updated);
      return Response.json(updated);
    }
  }

  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, category } = await request.json();

  if (hasSupabase()) {
    if (category === 'oppo') {
      await deleteOppoPhone(id);
      const phones = await getOppoPhonesSync();
      return Response.json(phones);
    } else {
      await deleteCompetitorPhone(id);
      const phones = await getCompetitorPhonesSync();
      return Response.json(phones);
    }
  }

  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}