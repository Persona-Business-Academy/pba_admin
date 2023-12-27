import { InstructorsListModel, InstructorType } from "@/utils/models/instructors";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";
import $apiClient from "..";
import { QueryParams } from "../types";

export class InstructorService {
  static getAllInstructors(params: QueryParams): Promise<InstructorsListModel> {
    return $apiClient.get("/instructors/list", { params });
  }
  static getById(id: number): Promise<InstructorType> {
    return $apiClient.get(`/instructors/${id}`);
  }
  static createInstructor(data: CreateEditInstructorValidation): Promise<number> {
    return $apiClient.post("/instructors/create", data);
  }
  static editInstructor(id: number, data: CreateEditInstructorValidation): Promise<number> {
    return $apiClient.put(`/instructors/edit/${id}`, data);
  }
  static deleteInstructor(id: number): Promise<number> {
    return $apiClient.delete(`/instructors/delete/${id}`);
  }
}
