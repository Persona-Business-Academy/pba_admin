import { SortingType } from "@/api/types";
import prisma from "..";

export class User {
  static async list(
    skip: number,
    take: number,
    search: string,
    sorting: SortingType[]
  ) {
    let orderBy: Record<string, "asc" | "desc"> = {}; // Initialize an empty object for orderBy
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0].id; // Get the sorting field from the first item in the array
      const sortingDirection = sorting[0].desc ? "desc" : "asc"; // Check if it's descending or ascending
      orderBy[sortingField] = sortingDirection; // Set the orderBy object
    }

    const count = await prisma.user.count({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const users = await prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      where: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy,
    });

    return {
      count,
      users,
    };
  }

  static async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }
}
