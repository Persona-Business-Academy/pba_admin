import { CommentModel, CommentsListModel } from "@/utils/models/comments";
import { CourseType } from "@/utils/models/common";
import { CreateCommentsValidation, EditCommentsValidation } from "@/utils/validation/comments";
import $apiClient from "..";

export class CommentService {
  static getCourseComments(params: { courseId: number; type: CourseType }) {
    return $apiClient.get<CommentsListModel>(`/comments/list`, { params });
  }
  static create(data: CreateCommentsValidation) {
    return $apiClient.post<CommentModel>("/comments/create", data);
  }
  static edit({ id, data }: { id: number; data: EditCommentsValidation }) {
    return $apiClient.put<CommentModel>(`/comments/edit/${id}`, data);
  }
  static delete(id: number) {
    return $apiClient.delete<CommentModel>(`/comments/delete/${id}`);
  }
}
