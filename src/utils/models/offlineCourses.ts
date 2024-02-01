import { OfflineCourseVideo, Prisma } from "@prisma/client";
import { OfflineCourses } from "@/lib/prisma/resolvers/offline-courses";

export type OfflineCourse = Prisma.PromiseReturnType<typeof OfflineCourses.getOne>;
export type OfflineCoursesListModel = Prisma.PromiseReturnType<typeof OfflineCourses.list>;
export type OfflineCourseVideoModel = OfflineCourseVideo;

export type Timeline = Prisma.PromiseReturnType<typeof OfflineCourses.addTimeline>;
