import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: 'Gagal memuat naskah' }, { status: 500 });
  }

  return Response.json(data || []);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { title, content } = await request.json();
  const validation = validateScript(title, content);
  if (validation) return Response.json(validation, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const newScript = {
    id: generateId(title),
    title: title.trim(),
    content: content.trim(),
  };

  const { data, error } = await supabase
    .from('scripts')
    .insert(newScript)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: 'Gagal menyimpan naskah' }, { status: 500 });
  }

  return Response.json(data);
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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('scripts')
    .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: 'Gagal memperbarui naskah' }, { status: 500 });
  }

  if (!data) {
    return Response.json({ error: 'Naskah tidak ditemukan' }, { status: 404 });
  }

  return Response.json(data);
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: 'ID wajib diisi' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: 'Gagal menghapus naskah' }, { status: 500 });
  }

  return Response.json({ success: true });
}