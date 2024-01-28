import { User } from "next-auth";
import type { CourseType } from "@/utils/models/common";
import { CreateCommentsValidation, EditCommentsValidation } from "@/utils/validation/comments";
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

  static create(body: CreateCommentsValidation, user: NonNullable<User>) {
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

  static edit(body: EditCommentsValidation, id: number) {
    return prisma.courseComment.update({
      where: { id },
      data: {
        headline: body.headline,
        text: body.text,
        userPicture: body.userPicture,
      },
    });
  }

  static delete(id: number) {
    return prisma.courseComment.delete({ where: { id } });
  }
}
