import { BadRequestException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { ERROR_MESSAGES } from "@/constants/common";
import { CreateEditOfflineCourseValidation } from "@/validation/offline-courses";
import prisma from "..";

export class OfflineCourses {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    let orderBy: Record<string, "asc" | "desc"> = {}; // Initialize an empty object for orderBy
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0].id; // Get the sorting field from the first item in the array
      const sortingDirection = sorting[0].desc ? "desc" : "asc"; // Check if it's descending or ascending
      orderBy[sortingField] = sortingDirection; // Set the orderBy object
    }

    const count = await prisma.offlineCourse.count({
      where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
    });

    const offlineCourses = await prisma.offlineCourse.findMany({
      skip,
      take,
      orderBy,
      where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
    });

    return { count, offlineCourses };
  }

  static async getOne(courseId: number) {
    const offlineCourse = await prisma.offlineCourse.findUnique({
      where: {
        id: courseId,
      },
    });

    return offlineCourse;
  }

  static async create(data: CreateEditOfflineCourseValidation) {
    const newCourse = await prisma.offlineCourse.create({
      data: {
        ...data,
        whatYouWillLearn: [],
        benefits: [],
      },
    });
    return newCourse.id;
  }

  static async edit(data: CreateEditOfflineCourseValidation, id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const updatedCourse = await prisma.offlineCourse.update({
      where: { id: +id },
      data: {
        ...data,
        whatYouWillLearn: [],
      },
    });

    return updatedCourse.id;
  }

  static async delete(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const deletedCourse = await prisma.offlineCourse.delete({
      where: { id: +id },
    });

    return deletedCourse.id;
  }
}
