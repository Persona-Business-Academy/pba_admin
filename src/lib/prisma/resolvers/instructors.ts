import { ConflictException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";
import prisma from "..";
import { orderBy } from "../utils/common";

export class Instructors {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, instructors] = await Promise.all([
      prisma.instructor.count({
        where: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
      prisma.instructor.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    return { count, instructors };
  }

  static async getById(instructorId: number) {
    return prisma.instructor.findUnique({
      where: {
        id: instructorId,
      },
    });
  }

  static async create(data: CreateEditInstructorValidation) {
    return prisma.instructor.create({
      data,
    });
  }

  static async edit(data: CreateEditInstructorValidation, id: number) {
    //aws
    return prisma.instructor.update({
      where: { id: +id },
      data,
    });
  }

  static async delete(id: number) {
    const referance = await prisma.onlineCourse.findFirst({ where: { instructorId: id } });

    if (referance) {
      throw new ConflictException("You has a online course");
    }

    const deletedInstructor = await prisma.instructor.delete({ where: { id } });
    return deletedInstructor.id;
  }
}
