import { getSupabaseAdmin } from '@/lib/supabase';
import { SCRIPTS } from '@/data/scripts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseAdmin();

  // Fallback to static data if Supabase not configured
  if (!supabase) {
    return new Response(JSON.stringify(SCRIPTS || []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: 'Gagal memuat naskah' }, { status: 500 });
  }

  return new Response(JSON.stringify(data || []), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}