import { QueryClient } from "@tanstack/react-query";
import { CourseType } from "../models/common";

export const QUERY_KEY = {
  onlineCourse: (id: number) => ["online-course", id.toString()],
  offlineCourse: (id: number) => ["offline-course", id.toString()],
  comments: (courseId: number, courseType: CourseType) => ["course-comments", courseId, courseType],
  allInstructors: (search: string, page: number) => [
    search ? `all-instructors/${search}` : "all-instructors",
    page,
  ],
  allOfflineCourses: (search: string, page: number) => [
    search ? `all-offline-courses/${search}` : "all-offline-courses",
    page,
  ],
  allOnlineCourses: (search: string, page: number) => [
    search ? `all-online-courses/${search}` : "all-online-courses",
    page,
  ],
  allUsers: (search: string, page: number) => [search ? `all-users/${search}` : "all-users", page],
};

export const refetchOnlineCourseById = async (queryClient: QueryClient, id: number) =>
  await queryClient.refetchQueries({
    queryKey: QUERY_KEY.onlineCourse(id),
    type: "active",
    exact: true,
  });
