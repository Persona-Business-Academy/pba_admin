import { ConflictException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";
import prisma from "..";

export class Instructors {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    let orderBy: Record<string, "asc" | "desc"> = {}; // Initialize an empty object for orderBy
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0].id; // Get the sorting field from the first item in the array
      const sortingDirection = sorting[0].desc ? "desc" : "asc"; // Check if it's descending or ascending
      orderBy[sortingField] = sortingDirection; // Set the orderBy object
    }

    const count = await prisma.instructor.count({
      where: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    const instructors = await prisma.instructor.findMany({
      skip,
      take,
      orderBy,
      where: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      },
    });

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
