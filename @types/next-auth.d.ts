import { Prisma } from "@prisma/client";
// eslint-disable-next-line unused-imports/no-unused-imports
import NextAuth, { ISODateString } from "next-auth";
import { User } from "@/lib/prisma/resolvers";

declare module "next-auth" {
  export type User = Prisma.PromiseReturnType<typeof User.findAdminByEmail>;
  interface Session {
    expires: ISODateString;
    token: { email: string; iat: number; jti: string; exp: number };
    user: User;
  }
}
// todo
