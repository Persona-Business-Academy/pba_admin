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
  static getAllOfflineCourses(params: QueryParams): Promise<OfflineCoursesListModel> {
    return $apiClient.get("/offline-courses/list", { params });
  }
  static getOfflineCourse(id: number): Promise<OfflineCourse> {
    return $apiClient.get(`/offline-courses/${id}`);
  }
  static createOfflineCourse(data: CreateEditOfflineCourseValidation): Promise<number> {
    return $apiClient.post("/offline-courses/create", data);
  }
  static editOfflineCourse(id: number, data: CreateEditOfflineCourseValidation): Promise<number> {
    return $apiClient.put(`/offline-courses/edit/${id}`, data);
  }
  static deleteOfflineCourse(id: number): Promise<number> {
    return $apiClient.delete(`/offline-courses/delete/${id}`);
  }
  // instructors
  static addInstructor(data: AddOfflineInstructorsValidation): Promise<number> {
    return $apiClient.post("/offline-courses/add-instructor", data);
  }
  static removeInstructor(data: { id: number }): Promise<number> {
    return $apiClient.delete(`/offline-courses/remove-instructor/${data.id}`);
  }
  // videos
  static addVideo(data: AddOfflineCourseVideosValidation): Promise<OfflineCourseVideoModel> {
    return $apiClient.post("/offline-courses/add-video", data);
  }
  static removeVideo(data: { id: number }): Promise<OfflineCourseVideoModel> {
    return $apiClient.delete(`/offline-courses/remove-video/${data.id}`);
  }
}
