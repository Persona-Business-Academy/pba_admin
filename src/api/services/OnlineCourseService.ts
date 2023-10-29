import { OnlineCourse, OnlineCoursesListModel } from "@/models/onlineCourses";
import {
  CreateEditOnlineCourseLevelValidation,
  CreateEditOnlineCourseValidation,
} from "@/validation/online-courses";
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
  static getOnlineCourse(id: number): Promise<OnlineCourse> {
    return $apiClient.get(`/online-courses/${id}`);
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
  // levels
  static createOnlineCourseLevel(data: CreateEditOnlineCourseLevelValidation) {
    return $apiClient.post("/online-courses/create-level", data);
  }
  static createOnlineCourseDay(data: CreateEditOnlineCourseLevelValidation) {
    return $apiClient.post("/online-courses/create-day", data);
  }
  static createOnlineCourseVideo(data: CreateEditOnlineCourseLevelValidation) {
    return $apiClient.post("/online-courses/create-video", data);
  }
}
