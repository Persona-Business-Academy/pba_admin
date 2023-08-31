import NextAuth, { Session, SessionStrategy, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUser } from '@/lib/prisma/resolvers';
import { validateUserPassword } from '@/lib/prisma/utils/auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials): Promise<{ id: string; email: string } | null> {
        const user = await validateUserPassword(
          credentials?.email || '',
          credentials?.password || '',
        );

        return user || null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session }: { session: Session }) {
      const user = await findUser(session.user?.email || '');

      return user
        ? {
            ...session,
            user: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
            },
          }
        : session;
    },

    async jwt({ token, user }: { token: JWT; user: User | AdapterUser }) {
      if (user) {
        return { ...token, id: user.id };
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: { strategy: 'jwt' as SessionStrategy },
});
