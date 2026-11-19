import fs from 'fs';
import path from 'path';

const OPPO_FILE = path.join(process.cwd(), 'src/data/oppo.json');
const COMPETITORS_FILE = path.join(process.cwd(), 'src/data/competitors.json');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category === 'oppo') {
    if (!fs.existsSync(OPPO_FILE)) return Response.json([]);
    const data = JSON.parse(fs.readFileSync(OPPO_FILE, 'utf-8'));
    return Response.json(data);
  }

  if (category === 'competitors') {
    if (!fs.existsSync(COMPETITORS_FILE)) return Response.json([]);
    const data = JSON.parse(fs.readFileSync(COMPETITORS_FILE, 'utf-8'));
    return Response.json(data);
  }

  return Response.json({ error: 'Invalid category' }, { status: 400 });
}