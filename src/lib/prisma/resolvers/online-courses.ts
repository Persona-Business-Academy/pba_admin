import { SortingType } from "@/api/types";
import prisma from "..";

export class OnlineCourses {
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

    const count = await prisma.onlineCourse.count({
      where: { OR: [{ name: { contains: search, mode: "insensitive" } }] },
    });

    const onlineCourses = await prisma.onlineCourse.findMany({
      skip,
      take,
      orderBy,
      where: { OR: [{ name: { contains: search, mode: "insensitive" } }] },
    });

    return { count, onlineCourses };
  }
}
