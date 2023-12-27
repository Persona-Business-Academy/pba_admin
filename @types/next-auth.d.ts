import { Prisma } from "@prisma/client";
import { ISODateString } from "next-auth";
import { User } from "@/lib/prisma/resolvers";

declare module "next-auth" {
  export type User = Prisma.PromiseReturnType<typeof User.findAdminByEmail>;
  interface Session {
    expires: ISODateString;
    token?: {
      email: string;
      sub: string;
      iat: number;
      exp: number;
      jti: string;
    } | null;
    user: User;
  }
}
