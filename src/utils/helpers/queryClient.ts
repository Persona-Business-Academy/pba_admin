import { QueryClient } from "@tanstack/react-query";
import { CourseType } from "../models/common";

export const QUERY_KEY = {
  onlineCourse: (id: number) => ["online-course", id.toString()],
  offlineCourse: (id: number) => ["offline-course", id.toString()],
  comments: (courseId: number, courseType: CourseType) => ["course-comments", courseId, courseType],
};

export const refetchOnlineCourseById = async (queryClient: QueryClient, id: number) =>
  await queryClient.refetchQueries({
    queryKey: QUERY_KEY.onlineCourse(id),
    type: "active",
    exact: true,
  });
