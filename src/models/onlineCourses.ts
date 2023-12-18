import { Prisma, SkillLevel } from "@prisma/client";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";

export type OnlineCourse = Prisma.PromiseReturnType<typeof OnlineCourses.getOne>;
export type OnlineCoursesListModel = Prisma.PromiseReturnType<typeof OnlineCourses.list>;
export type OnlineCourseType = "levels" | "days" | "videos";
export type OnlineCourseSkillLevelType = SkillLevel;
