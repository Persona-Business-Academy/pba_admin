import { SortingType } from "@/api/types";
import { CreateEditJobValidation } from "@/utils/validation/jobs";
import prisma from "..";
import { orderBy } from "../utils/common";

export class Jobs {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, jobs] = await Promise.all([
      prisma.job.count({
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
      }),
      prisma.job.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
      }),
    ]);

    return { count, jobs };
  }

  static getById(jobId: number) {
    return prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
  }

  static async create(data: CreateEditJobValidation) {
    return prisma.job.create({
      data,
    });
  }

  static edit(data: CreateEditJobValidation, id: number) {
    return prisma.job.update({
      where: { id: +id },
      data,
    });
  }

  static delete(id: number) {
    return prisma.job.delete({ where: { id } });
  }
}
