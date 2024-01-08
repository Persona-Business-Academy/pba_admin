import { Prisma } from "@prisma/client";
import { OfflineCourses } from "@/lib/prisma/resolvers/offline-courses";

export type OfflineCourse = Prisma.PromiseReturnType<typeof OfflineCourses.getOne>;
export type OfflineCoursesListModel = Prisma.PromiseReturnType<typeof OfflineCourses.list>;

export type LocalVideo = {
  name: string;
  key: string;
  file: File;
};
