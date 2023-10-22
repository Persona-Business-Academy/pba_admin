import { OnlineCoursesListModel } from "@/models/onlineCourses";
import { CreateEditOnlineCourseValidation } from "@/validation/online-courses";
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
  static createOnlineCourse(data: CreateEditOnlineCourseValidation) {
    return $apiClient.post("/online-courses/create", data);
  }
  static editOnlineCourse(id: number, data: CreateEditOnlineCourseValidation) {
    return $apiClient.put(`/online-courses/edit/${id}`, data);
  }
  static deleteOnlineCourse(id: number) {
    return $apiClient.delete(`/online-courses/delete/${id}`);
  }
}
