import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getOppoPhonesSync, getCompetitorPhonesSync, saveOppoPhones, saveCompetitorPhones, deleteOppoPhone, deleteCompetitorPhone } from '../../../../lib/data-server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const [oppo, competitors] = await Promise.all([
    getOppoPhonesSync(),
    getCompetitorPhonesSync(),
  ]);
  return Response.json({ oppo, competitors });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

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

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

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

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, category } = await request.json();

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