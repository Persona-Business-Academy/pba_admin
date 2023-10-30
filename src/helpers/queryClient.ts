import { QueryClient } from "@tanstack/react-query";

export const refetchOnlineCourseById = async (queryClient: QueryClient, id: number) =>
  await queryClient.refetchQueries({
    queryKey: ["online-course", id.toString()],
    type: "active",
    exact: true,
  });
