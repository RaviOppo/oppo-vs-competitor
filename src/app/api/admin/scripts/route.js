import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getScriptsSync, saveScripts, deleteScript } from '../../../../lib/data-server';
import { SCRIPTS } from '../../../../data/scripts';

export const dynamic = 'force-dynamic';

// Check if Supabase is configured
function hasSupabase() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function generateId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)
    + '-' + Math.random().toString(36).slice(2, 8);
}

function validateScript(title, content) {
  if (!title?.trim() || !content?.trim()) {
    return { error: 'Judul dan isi wajib diisi' };
  }
  if (title.trim().length > 200) {
    return { error: 'Judul maksimal 200 karakter' };
  }
  if (content.trim().length > 10000) {
    return { error: 'Isi naskah maksimal 10.000 karakter' };
  }
  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  if (hasSupabase()) {
    const scripts = await getScriptsSync();
    return Response.json(scripts);
  }

  // Fallback to static data
  return Response.json(SCRIPTS || []);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { title, content } = await request.json();
  const validation = validateScript(title, content);
  if (validation) return Response.json(validation, { status: 400 });

  if (hasSupabase()) {
    const scripts = await getScriptsSync();
    const newScript = {
      id: generateId(title),
      title: title.trim(),
      content: content.trim(),
    };
    scripts.push(newScript);
    await saveScripts(scripts);
    return Response.json(scripts);
  }

  // Supabase not configured
  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, title, content } = await request.json();
  if (!id) {
    return Response.json({ error: 'ID wajib diisi' }, { status: 400 });
  }
  const validation = validateScript(title, content);
  if (validation) return Response.json(validation, { status: 400 });

  if (hasSupabase()) {
    const scripts = await getScriptsSync();
    const updated = scripts.map(s => s.id === id ? { ...s, title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() } : s);
    await saveScripts(updated);
    return Response.json(updated);
  }

  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: 'ID wajib diisi' }, { status: 400 });
  }

  if (hasSupabase()) {
    await deleteScript(id);
    const scripts = await getScriptsSync();
    return Response.json(scripts);
  }

  return Response.json({ error: 'Database tidak dikonfigurasi. Tambah Supabase env vars untuk menyimpan data.' }, { status: 503 });
}