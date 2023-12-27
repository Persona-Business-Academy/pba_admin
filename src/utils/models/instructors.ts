import { Prisma } from "@prisma/client";
import { Instructors } from "@/lib/prisma/resolvers";

export type InstructorsListModel = Prisma.PromiseReturnType<typeof Instructors.list>;
export type InstructorType = Prisma.PromiseReturnType<typeof Instructors.getById>;
