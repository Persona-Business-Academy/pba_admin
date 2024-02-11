import { NotFoundException } from "next-api-decorators";
import { User } from "next-auth";
import { AwsService } from "@/lib/aws";
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

  static async edit(body: EditCommentsValidation, id: number) {
    const comment = await prisma.courseComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    const updatedComment = await prisma.courseComment.update({
      where: { id },
      data: {
        headline: body.headline,
        text: body.text,
        userPicture: body.userPicture,
      },
    });

    await AwsService.deleteFromStorage("update", {
      existingKey: comment.userPicture || "",
      key: updatedComment.userPicture || "",
    });

    return updatedComment;
  }

  static async delete(id: number) {
    const comment = await prisma.courseComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    const deletedComment = await prisma.courseComment.delete({ where: { id } });

    await AwsService.deleteFromStorage("delete", { existingKey: comment.userPicture || "" });

    return deletedComment;
  }
}
