import { SortingType } from "@/api/types";
import prisma from "..";
import { orderBy } from "../utils/common";

export class User {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, users] = await Promise.all([
      prisma.user.count({
        where: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
        orderBy: orderBy(sorting),
        skip,
        take,
      }),
    ]);

    return {
      count,
      users,
    };
  }

  static async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }
}
