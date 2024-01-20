import { OnlineCourse, OnlineCoursesListModel } from "@/utils/models/onlineCourses";
import {
  CreateEditOnlineCourseValidation,
  CreateOnlineCourseDayValidation,
  CreateOnlineCourseLevelValidation,
  CreateOnlineCourseVideoValidation,
  EditOnlineCourseDayValidation,
  EditOnlineCourseLevelValidation,
} from "@/utils/validation/online-courses";
import $apiClient from "..";
import { QueryParams } from "../types";

export class OnlineCourseService {
  static getAllOnlineCourses(params: QueryParams) {
    return $apiClient.get<OnlineCoursesListModel>("/online-courses/list", { params });
  }
  static getOnlineCourse(id: number) {
    return $apiClient.get<OnlineCourse>(`/online-courses/${id}`);
  }
  static createOnlineCourse(data: CreateEditOnlineCourseValidation) {
    return $apiClient.post<number>("/online-courses/create", data);
  }
  static editOnlineCourse(id: number, data: CreateEditOnlineCourseValidation) {
    return $apiClient.put<number>(`/online-courses/edit/${id}`, data);
  }
  static deleteOnlineCourse(id: number) {
    return $apiClient.delete<number>(`/online-courses/delete/${id}`);
  }
  // levels
  static createOnlineCourseLevel(data: CreateOnlineCourseLevelValidation) {
    return $apiClient.post<number>("/online-courses/create-level", data);
  }
  static editOnlineCourseLevel(data: EditOnlineCourseLevelValidation) {
    return $apiClient.put<number>(`/online-courses/edit-level/${data.id}`, data);
  }
  static deleteOnlineCourseLevel(id: number) {
    return $apiClient.delete<number>(`/online-courses/delete-level/${id}`);
  }
  // days
  static createOnlineCourseDay(data: CreateOnlineCourseDayValidation) {
    return $apiClient.post<number>("/online-courses/create-day", data);
  }
  static editOnlineCourseDay(data: EditOnlineCourseDayValidation) {
    return $apiClient.put<number>(`/online-courses/edit-day/${data.id}`, data);
  }
  static deleteOnlineCourseDay(id: number) {
    return $apiClient.delete<number>(`/online-courses/delete-day/${id}`);
  }
  // videos
  static createOnlineCourseVideo(data: CreateOnlineCourseVideoValidation) {
    return $apiClient.post<number>("/online-courses/create-video", data);
  }
  static editOnlineCourseVideo(data: any) {
    return $apiClient.put<number>("/online-courses/edit-video", data);
  }
  static deleteOnlineCourseVideo(id: number) {
    return $apiClient.delete<number>(`/online-courses/delete-video/${id}`);
  }
}
