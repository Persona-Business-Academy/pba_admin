import { CommentFormData, CommentModel, CommentsListModel } from "@/utils/models/comments";
import { CourseType } from "@/utils/models/common";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";
import $apiClient from "..";

export class CommentService {
  static getCourseComments(params: {
    courseId: number;
    type: CourseType;
  }): Promise<CommentsListModel> {
    return $apiClient.get("/comments/list", { params });
  }
  static create(data: CreateEditCommentsValidation): Promise<CommentModel> {
    return $apiClient.post("/comments/create", data);
  }
  static edit(id: number, data: CommentFormData): Promise<CommentModel> {
    return $apiClient.put(`/comments/edit/${id}`, data);
  }
  static delete(id: number): Promise<CommentModel> {
    return $apiClient.delete(`/comments/delete/${id}`);
  }
}
