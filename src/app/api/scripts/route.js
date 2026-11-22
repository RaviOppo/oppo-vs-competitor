import { getScriptsSync } from '@/lib/data-server';
import { SCRIPTS } from '@/data/scripts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const scripts = await getScriptsSync();

  // Fallback to static data if Supabase not configured
  if (!scripts || scripts.length === 0) {
    return new Response(JSON.stringify(SCRIPTS || []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  return new Response(JSON.stringify(scripts), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}