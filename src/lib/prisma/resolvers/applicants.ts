import { ApplicantType } from "@prisma/client";
import { SortingType } from "@/api/types";
import { ApplicantEnum } from "@/utils/constants/common";
import prisma from "..";
import { orderBy } from "../utils/common";

export class Applicants {
  static async list(
    skip: number,
    take: number,
    search: string,
    sorting: SortingType[],
    filter: ApplicantType,
  ) {
    if (!Object.values(ApplicantEnum).includes(filter)) {
      return { count: 0, applicants: [] };
    }

    const [count, applicants] = await Promise.all([
      prisma.applicant.count({
        where: { for: filter, OR: [{ email: { contains: search, mode: "insensitive" } }] },
      }),
      prisma.applicant.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: { for: filter, OR: [{ email: { contains: search, mode: "insensitive" } }] },
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
