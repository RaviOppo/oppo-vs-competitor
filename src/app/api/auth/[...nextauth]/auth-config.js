import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('authorize called with:', credentials);
        const users = getUsers();
        console.log('users:', users);
        const user = users.find(u => u.username === credentials.username);
        console.log('found user:', user);
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        console.log('password valid:', valid);
        if (!valid) return null;
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