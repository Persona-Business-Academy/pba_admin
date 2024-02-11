import { NotFoundException } from "next-api-decorators";
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

  static async edit(data: CreateEditJobValidation, id: number) {
    const job = await prisma.job.findUnique({ where: { id: +id } });
    if (!job) {
      throw new NotFoundException("Job not found");
    }

    const updatedJob = await prisma.job.update({
      where: { id: +id },
      data,
    });

    return updatedJob;
  }

  static async delete(id: number) {
    const job = await prisma.job.findUnique({ where: { id: +id } });
    if (!job) {
      throw new NotFoundException("Job not found");
    }
    const deletedJob = await prisma.job.delete({ where: { id } });

    return deletedJob;
  }
}
