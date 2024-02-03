import { ApplicantModel, ApplicantsListModel } from "@/utils/models/common";
import $apiClient from "..";
import { QueryParams } from "../types";

export class ApplicantService {
  static getAll(params: QueryParams & { filter?: string }) {
    return $apiClient.get<ApplicantsListModel>("/applicants/list", { params });
  }
  static getById(id: number) {
    return $apiClient.get<ApplicantModel>(`/applicants/${id}`);
  }
}
