import { Prisma } from "@prisma/client";
import { Jobs } from "@/lib/prisma/resolvers";

export type JobsListModel = Prisma.PromiseReturnType<typeof Jobs.list>;
export type JobModel = Prisma.PromiseReturnType<typeof Jobs.getById>;
