import { OnlineCoursesListModel } from "@/models/onlineCourses";
import $apiClient from "..";
import { QueryParams } from "../types";

export class OnlineCourseService {
  static getAllOnlineCourses({
    limit,
    offset,
    search,
    sorting,
  }: QueryParams): Promise<OnlineCoursesListModel> {
    return $apiClient.get("/online-courses/list", {
      params: { limit, offset, sorting, search },
    });
  }
}
