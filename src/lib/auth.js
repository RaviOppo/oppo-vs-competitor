import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase';

// Inline credentials provider to avoid import issues
const CredentialsProvider = (options) => ({
  id: 'credentials',
  name: options.name || 'Credentials',
  type: 'credentials',
  credentials: options.credentials || {},
  authorize: options.authorize,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!supabaseAdmin) {
          console.error('Supabase admin client not configured');
          return null;
        }

        const { data: users, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('username', credentials.username)
          .single();

        if (error || !users) return null;

        const valid = await bcrypt.compare(credentials.password, users.password_hash);
        if (!valid) return null;

        return { id: users.id, name: users.username, role: users.role };
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