import { CommentFormData, CommentModel, CommentsListModel } from "@/utils/models/comments";
import { CourseType } from "@/utils/models/common";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";
import $apiClient from "..";

export class CommentService {
  static getCourseComments(params: { courseId: number; type: CourseType }) {
    return $apiClient.get<CommentsListModel>(`/comments/list`, { params });
  }
  static create(data: CreateEditCommentsValidation) {
    return $apiClient.post<CommentModel>("/comments/create", data);
  }
  static edit(id: number, data: CommentFormData) {
    return $apiClient.put<CommentModel>(`/comments/edit/${id}`, data);
  }
  static delete(id: number) {
    return $apiClient.delete<CommentModel>(`/comments/delete/${id}`);
  }
}
