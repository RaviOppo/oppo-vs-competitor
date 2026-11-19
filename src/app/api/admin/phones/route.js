import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getOppoPhonesSync, getCompetitorPhonesSync, saveOppoPhones, saveCompetitorPhones } from '../../../../lib/data-server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const oppo = getOppoPhonesSync();
  const competitors = getCompetitorPhonesSync();
  return Response.json({ oppo, competitors });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

  if (category === 'oppo') {
    const phones = getOppoPhonesSync();
    if (phones.find(p => p.id === phone.id)) {
      return Response.json({ error: 'ID sudah ada' }, { status: 400 });
    }
    phones.push(phone);
    saveOppoPhones(phones);
    return Response.json(phones);
  } else {
    const phones = getCompetitorPhonesSync();
    if (phones.find(p => p.id === phone.id)) {
      return Response.json({ error: 'ID sudah ada' }, { status: 400 });
    }
    phones.push(phone);
    saveCompetitorPhones(phones);
    return Response.json(phones);
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { category, ...phone } = await request.json();

  if (category === 'oppo') {
    let phones = getOppoPhonesSync();
    phones = phones.map(p => p.id === phone.id ? phone : p);
    saveOppoPhones(phones);
    return Response.json(phones);
  } else {
    let phones = getCompetitorPhonesSync();
    phones = phones.map(p => p.id === phone.id ? phone : p);
    saveCompetitorPhones(phones);
    return Response.json(phones);
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, category } = await request.json();

  if (category === 'oppo') {
    let phones = getOppoPhonesSync();
    phones = phones.filter(p => p.id !== id);
    saveOppoPhones(phones);
    return Response.json(phones);
  } else {
    let phones = getCompetitorPhonesSync();
    phones = phones.filter(p => p.id !== id);
    saveCompetitorPhones(phones);
    return Response.json(phones);
  }
}