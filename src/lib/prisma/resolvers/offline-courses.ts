import { BadRequestException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import {
  AddOfflineInstructorsValidation,
  CreateEditOfflineCourseValidation,
} from "@/utils/validation/offline-courses";
import prisma from "..";
import { orderBy } from "../utils/common";

export class OfflineCourses {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, offlineCourses] = await Promise.all([
      prisma.offlineCourse.count({
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
      }),
      prisma.offlineCourse.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
        include: { OfflineCourseInstructors: { select: { id: true, instructor: true } } },
      }),
    ]);

    return { count, offlineCourses };
  }

  static async getOne(courseId: number) {
    return prisma.offlineCourse.findUnique({
      where: {
        id: courseId,
      },
      include: { OfflineCourseInstructors: { select: { id: true, instructor: true } } },
    });
  }

  static async create(data: CreateEditOfflineCourseValidation) {
    const { whatYouWillLearn, ..._data } = data;

    return prisma.offlineCourse.create({
      data: {
        ..._data,
        whatYouWillLearn: whatYouWillLearn.map(item => item.value),
        benefits: [],
      },
    });
  }

  static async edit(data: CreateEditOfflineCourseValidation, id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    const { whatYouWillLearn, ..._data } = data;
    //aws
    return prisma.offlineCourse.update({
      where: { id: +id },
      data: {
        ..._data,
        whatYouWillLearn: whatYouWillLearn.map(item => item.value),
      },
    });
  }

  static async delete(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return prisma.offlineCourse.delete({
      where: { id: +id },
    });
  }

  static async addInstructors({ instructorId, offlineCourseId }: AddOfflineInstructorsValidation) {
    return prisma.offlineCourseInstructors.create({
      data: { instructorId, offlineCourseId },
    });
  }

  static async removeInstructors(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return prisma.offlineCourseInstructors.delete({
      where: { id: +id },
    });
  }
}
