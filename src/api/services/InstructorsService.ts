import { InstructorsListModel, InstructorType } from "@/utils/models/instructors";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";
import $apiClient from "..";
import { QueryParams } from "../types";

export class InstructorService {
  static getAllInstructors(params: QueryParams) {
    return $apiClient.get<InstructorsListModel>("/instructors/list", { params });
  }
  static getById(id: number) {
    return $apiClient.get<InstructorType>(`/instructors/${id}`);
  }
  static createInstructor(data: CreateEditInstructorValidation) {
    return $apiClient.post<InstructorType>("/instructors/create", data);
  }
  static editInstructor(id: number, data: CreateEditInstructorValidation) {
    return $apiClient.put<InstructorType>(`/instructors/edit/${id}`, data);
  }
  static deleteInstructor(id: number) {
    return $apiClient.delete<number>(`/instructors/delete/${id}`);
  }
}
