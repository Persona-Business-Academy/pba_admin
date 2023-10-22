import { Prisma } from "@prisma/client";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";

export type OnlineCourse = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OnlineCoursesListModel = Prisma.PromiseReturnType<
  typeof OnlineCourses.list
>;
