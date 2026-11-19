const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';

export async function getOppoPhones() {
  const res = await fetch(`${BASE_URL}/api/phones?category=oppo`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getCompetitorPhones() {
  const res = await fetch(`${BASE_URL}/api/phones?category=competitors`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getOppoTypes() {
  const phones = await getOppoPhones();
  return [...new Set(phones.map(p => p.type))].sort();
}

export async function getCompetitorBrands() {
  const phones = await getCompetitorPhones();
  return [...new Set(phones.map(p => p.brand))].sort();
}

export async function getTypesByBrand(brand) {
  const phones = await getCompetitorPhones();
  return [...new Set(phones.filter(p => p.brand === brand).map(p => p.type))].sort();
}

export async function getModelsByBrandAndType(brand, type) {
  const phones = await getCompetitorPhones();
  return phones.filter(p => p.brand === brand && p.type === type);
}

export async function getModelsByBrand(brand) {
  const phones = await getCompetitorPhones();
  return phones.filter(p => p.brand === brand);
}