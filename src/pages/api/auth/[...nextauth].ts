import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { User } from "@/lib/prisma/resolvers";
import { validateUserPassword } from "@/lib/prisma/utils/auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: { email: { type: "text" }, password: { type: "password" } },
      authorize: async (credentials) =>
        (await validateUserPassword(
          credentials?.email || "",
          credentials?.password || ""
        )) || null,
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      const admin = await User.findAdminByEmail(session.user?.email || "");
      return admin
        ? {
            ...session,
            user: {
              name: `${admin.firstName} ${admin.lastName}`,
              email: admin.email,
            },
          }
        : session;
    },
    jwt: async ({ user, token }) =>
      !!user ? { ...token, id: user.id } : token,
  },
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
};

export default NextAuth(authOptions);
