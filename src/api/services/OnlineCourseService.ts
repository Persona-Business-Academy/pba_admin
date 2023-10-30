import { OnlineCourse, OnlineCoursesListModel } from "@/models/onlineCourses";
import {
  CreateEditOnlineCourseValidation,
  CreateOnlineCourseDayValidation,
  CreateOnlineCourseLevelValidation,
  EditOnlineCourseDayValidation,
  EditOnlineCourseLevelValidation,
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
  static createOnlineCourse(data: CreateEditOnlineCourseValidation): Promise<number> {
    return $apiClient.post("/online-courses/create", data);
  }
  static editOnlineCourse(id: number, data: CreateEditOnlineCourseValidation): Promise<number> {
    return $apiClient.put(`/online-courses/edit/${id}`, data);
  }
  static deleteOnlineCourse(id: number): Promise<number> {
    return $apiClient.delete(`/online-courses/delete/${id}`);
  }
  // levels
  static createOnlineCourseLevel(data: CreateOnlineCourseLevelValidation): Promise<number> {
    return $apiClient.post("/online-courses/create-level", data);
  }
  static editOnlineCourseLevel(data: EditOnlineCourseLevelValidation): Promise<number> {
    return $apiClient.put(`/online-courses/edit-level/${data.id}`, data);
  }
  // days
  static createOnlineCourseDay(data: CreateOnlineCourseDayValidation): Promise<number> {
    return $apiClient.post("/online-courses/create-day", data);
  }
  static editOnlineCourseDay(data: EditOnlineCourseDayValidation): Promise<number> {
    return $apiClient.put(`/online-courses/edit-day/${data.id}`, data);
  }
  // videos
  static createOnlineCourseVideo(data: CreateOnlineCourseLevelValidation): Promise<number> {
    return $apiClient.post("/online-courses/create-video", data);
  }
}
