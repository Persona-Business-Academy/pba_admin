import { JobModel, JobsListModel } from "@/utils/models/job";
import { CreateEditJobValidation } from "@/utils/validation/jobs";
import $apiClient from "..";
import { QueryParams } from "../types";

export class JobService {
  static getAll(params: QueryParams) {
    return $apiClient.get<JobsListModel>("/jobs/list", { params });
  }
  static getById(id: number) {
    return $apiClient.get<JobModel>(`/jobs/${id}`);
  }
  static create(data: CreateEditJobValidation) {
    return $apiClient.post<JobModel>("/jobs/create", data);
  }
  static edit(id: number, data: CreateEditJobValidation) {
    return $apiClient.put<JobModel>(`/jobs/edit/${id}`, data);
  }
  static delete(id: number) {
    return $apiClient.delete<JobModel>(`/jobs/delete/${id}`);
  }
}
