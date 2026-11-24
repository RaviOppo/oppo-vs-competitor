import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from '@/lib/supabase';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function trackLogin(username, userId, req) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const ipHash = Buffer.from(ip).toString('base64').slice(0, 16);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await supabase.from('visits').insert({
      user_id: userId,
      username,
      event_type: 'login',
      path: '/login',
      user_agent: userAgent,
      ip_hash: ipHash,
    });
  } catch (err) {
    console.error('Track login error:', err.message);
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log('authorize called with:', credentials);
        const users = getUsers();
        console.log('users:', users);
        const user = users.find(u => u.username === credentials.username);
        console.log('found user:', user);
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        console.log('password valid:', valid);
        if (!valid) return null;

        // Track login event
        await trackLogin(user.username, user.id, req);

        return { id: user.id, name: user.username, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'oppo-admin-secret-change-in-production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };