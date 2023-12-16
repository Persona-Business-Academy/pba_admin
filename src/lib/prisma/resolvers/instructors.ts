import { SortingType } from "@/api/types";
import { CreateEditInstructorValidation } from "@/validation/instructors";
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
    const instructor = await prisma.instructor.findUnique({
      where: {
        id: instructorId,
      },
    });

    return instructor;
  }

  static async create(data: CreateEditInstructorValidation) {
    const { firstName, lastName, about, avatar, avatarId } = data;
    const instructor = await prisma.instructor.create({
      data: {
        firstName,
        lastName,
        about,
        avatar,
        avatarId,
      },
    });
    return instructor.id;
  }

  static async edit(data: CreateEditInstructorValidation, id: number) {
    const { firstName, lastName, about, avatar, avatarId } = data;
    const updatedInstructor = await prisma.instructor.update({
      where: { id: +id },
      data: {
        firstName,
        lastName,
        about,
        avatar,
        avatarId,
      },
    });

    return updatedInstructor.id;
  }

  static async delete(id: number) {
    const deletedInstructor = await prisma.instructor.delete({ where: { id } });
    return deletedInstructor.id;
  }
}
