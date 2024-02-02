import { SortingType } from "@/api/types";
import prisma from "..";
import { orderBy } from "../utils/common";

export class Applicants {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, applicants] = await Promise.all([
      prisma.applicant.count({
        where: { OR: [{ email: { contains: search, mode: "insensitive" } }] },
      }),
      prisma.applicant.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: { OR: [{ email: { contains: search, mode: "insensitive" } }] },
      }),
    ]);

    return { count, applicants };
  }

  static getById(applicantId: number) {
    return prisma.applicant.findUnique({
      where: {
        id: applicantId,
      },
    });
  }
}
