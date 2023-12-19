import { OfflineCourse, OfflineCoursesListModel } from "@/models/offlineCourses";
import { CreateEditOfflineCourseValidation } from "@/validation/offline-courses";
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
}
