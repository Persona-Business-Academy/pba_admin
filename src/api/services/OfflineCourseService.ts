import {
  OfflineCourse,
  OfflineCoursesListModel,
  OfflineCourseVideoModel,
} from "@/utils/models/offlineCourses";
import {
  AddOfflineCourseVideosValidation,
  AddOfflineInstructorsValidation,
  CreateEditOfflineCourseValidation,
} from "@/utils/validation/offline-courses";
import $apiClient from "..";
import { QueryParams } from "../types";

export class OfflineCourseService {
  static getAllOfflineCourses(params: QueryParams & { forKids: boolean }) {
    return $apiClient.get<OfflineCoursesListModel>("/offline-courses/list", {
      params: { ...params, forKids: params.forKids || "" },
    });
  }
  static getOfflineCourse(id: number) {
    return $apiClient.get<OfflineCourse>(`/offline-courses/${id}`);
  }
  static createOfflineCourse(data: CreateEditOfflineCourseValidation) {
    return $apiClient.post<number>("/offline-courses/create", data);
  }
  static editOfflineCourse(id: number, data: CreateEditOfflineCourseValidation) {
    return $apiClient.put<number>(`/offline-courses/edit/${id}`, data);
  }
  static deleteOfflineCourse(id: number) {
    return $apiClient.delete<number>(`/offline-courses/delete/${id}`);
  }
  // instructors
  static addInstructor(data: AddOfflineInstructorsValidation) {
    return $apiClient.post<number>("/offline-courses/add-instructor", data);
  }
  static removeInstructor(data: { id: number }) {
    return $apiClient.delete<number>(`/offline-courses/remove-instructor/${data.id}`);
  }
  // videos
  static addVideo(data: AddOfflineCourseVideosValidation) {
    return $apiClient.post<OfflineCourseVideoModel>("/offline-courses/add-video", data);
  }
  static removeVideo(data: { id: number }) {
    return $apiClient.delete<OfflineCourseVideoModel>(`/offline-courses/remove-video/${data.id}`);
  }
}
