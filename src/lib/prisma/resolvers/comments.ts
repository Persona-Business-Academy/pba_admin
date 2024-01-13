import { User } from "next-auth";
import type { CommentFormData } from "@/utils/models/comments";
import type { CourseType } from "@/utils/models/common";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";
import prisma from "..";

export class Comment {
  static list(id: number, type: CourseType) {
    const where = { online: { onlineCourseId: id }, offline: { offlineCourseId: id } };

    return prisma.courseComment.findMany({
      where: where[type],
      include: { author: true, authorAdmin: true },
      orderBy: { createdAt: "asc" },
    });
  }

  static create(body: CreateEditCommentsValidation, user: NonNullable<User>) {
    const courseId = {
      online: { onlineCourseId: body.courseId },
      offline: { offlineCourseId: body.courseId },
    };

    return prisma.courseComment.create({
      data: {
        headline: body.headline,
        text: body.text,
        authorAdminId: user.id,
        ...courseId[body.courseType],
      },
    });
  }

  static edit(body: CommentFormData, id: number) {
    return prisma.courseComment.update({
      where: { id },
      data: {
        headline: body.headline,
        text: body.text,
      },
    });
  }

  static delete(id: number) {
    return prisma.courseComment.delete({ where: { id } });
  }
}
