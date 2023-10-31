import { Prisma } from "@prisma/client";
import { User } from "@/lib/prisma/resolvers";

export type UserModel = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
};

export type UsersListModel = Prisma.PromiseReturnType<typeof User.list>;
