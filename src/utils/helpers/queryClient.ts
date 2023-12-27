import { QueryClient } from "@tanstack/react-query";

export const QUERY_KEY = {
  onlineCourse: (id: number) => ["online-course", id.toString()],
};

export const refetchOnlineCourseById = async (queryClient: QueryClient, id: number) =>
  await queryClient.refetchQueries({
    queryKey: QUERY_KEY.onlineCourse(id),
    type: "active",
    exact: true,
  });
