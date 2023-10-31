import { Prisma } from "@prisma/client";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";

export type OnlineCourse = Prisma.PromiseReturnType<typeof OnlineCourses.getOnlineCourse>;
export type OnlineCoursesListModel = Prisma.PromiseReturnType<typeof OnlineCourses.list>;
export type OnlineCourseType = "levels" | "days" | "videos";
