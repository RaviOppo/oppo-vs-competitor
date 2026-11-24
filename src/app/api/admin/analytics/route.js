import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d'; // 7d, 30d, 90d, all
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Calculate date threshold
    let dateThreshold = null;
    if (range !== 'all') {
      const days = parseInt(range.replace('d', ''));
      const date = new Date();
      date.setDate(date.getDate() - days);
      dateThreshold = date.toISOString();
    }

    // Build base query
    let query = supabase
      .from('visits')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (dateThreshold) {
      query = query.gte('created_at', dateThreshold);
    }

    const { data: visits, error, count } = await query;

    if (error) throw error;

    // Aggregate stats
    const totalVisits = visits?.length || 0;
    const logins = visits?.filter(v => v.event_type === 'login').length || 0;
    const pageViews = visits?.filter(v => v.event_type === 'page_view').length || 0;

    // Unique users
    const uniqueUsers = new Set(visits?.map(v => v.user_id).filter(Boolean)).size;

    // Top users by visit count
    const userStats = {};
    visits?.forEach(v => {
      if (!userStats[v.username]) {
        userStats[v.username] = {
          username: v.username,
          user_id: v.user_id,
          total_visits: 0,
          logins: 0,
          page_views: 0,
          last_visit: v.created_at,
          paths: new Set(),
        };
      }
      const stat = userStats[v.username];
      stat.total_visits++;
      if (v.event_type === 'login') stat.logins++;
      if (v.event_type === 'page_view') stat.page_views++;
      if (v.path) stat.paths.add(v.path);
      if (new Date(v.created_at) > new Date(stat.last_visit)) {
        stat.last_visit = v.created_at;
      }
    });

    const topUsers = Object.values(userStats)
      .map(u => ({
        ...u,
        paths_visited: u.paths.size,
        paths: Array.from(u.paths).slice(0, 10),
      }))
      .sort((a, b) => b.total_visits - a.total_visits);

    // Visits by day
    const dailyStats = {};
    visits?.forEach(v => {
      const day = v.created_at.split('T')[0];
      if (!dailyStats[day]) {
        dailyStats[day] = { date: day, total: 0, logins: 0, page_views: 0, unique_users: new Set() };
      }
      dailyStats[day].total++;
      dailyStats[day].unique_users.add(v.user_id);
      if (v.event_type === 'login') dailyStats[day].logins++;
      if (v.event_type === 'page_view') dailyStats[day].page_views++;
    });

    const dailyData = Object.values(dailyStats)
      .map(d => ({ ...d, unique_users: d.unique_users.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top paths
    const pathStats = {};
    visits?.filter(v => v.event_type === 'page_view' && v.path).forEach(v => {
      pathStats[v.path] = (pathStats[v.path] || 0) + 1;
    });
    const topPaths = Object.entries(pathStats)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({
      summary: {
        total_visits: totalVisits,
        logins,
        page_views: pageViews,
        unique_users: uniqueUsers,
        period: range,
      },
      top_users: topUsers,
      daily: dailyData,
      top_paths: topPaths,
      recent_visits: visits?.slice(0, 50) || [],
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}