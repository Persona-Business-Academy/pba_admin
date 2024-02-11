import { BadRequestException, NotFoundException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { AwsService } from "@/lib/aws";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import {
  AddEditOfflineCourseTimelineValidation,
  AddOfflineCourseVideosValidation,
  AddOfflineInstructorsValidation,
  CreateOfflineCourseValidation,
  EditOfflineCourseValidation,
} from "@/utils/validation/offline-courses";
import prisma from "..";
import { orderBy } from "../utils/common";

export class OfflineCourses {
  static async list(
    skip: number,
    take: number,
    search: string,
    sorting: SortingType[],
    forKids?: string,
  ) {
    const [count, offlineCourses] = await Promise.all([
      prisma.offlineCourse.count({
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }], forKids: !!forKids },
      }),
      prisma.offlineCourse.findMany({
        skip,
        take,
        orderBy: orderBy(sorting),
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }], forKids: !!forKids },
        include: {
          instructors: { select: { id: true, instructor: true } },
          offlineCourseVideos: true,
        },
      }),
    ]);

    return { count, offlineCourses };
  }

  static getOne(courseId: number) {
    return prisma.offlineCourse.findUnique({
      where: {
        id: courseId,
      },
      include: {
        instructors: { select: { id: true, instructor: true } },
        offlineCourseVideos: true,
        timeLine: true,
      },
    });
  }

  static create(data: CreateOfflineCourseValidation) {
    const { whatYouWillLearn, ..._data } = data;

    return prisma.offlineCourse.create({
      data: {
        ..._data,
        whatYouWillLearn: whatYouWillLearn.map(item => item.value),
        benefits: [],
      },
    });
  }

  static async edit(data: EditOfflineCourseValidation, id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    const { whatYouWillLearn, ..._data } = data;

    const offlineCourse = await prisma.offlineCourse.findUnique({ where: { id: +id } });

    if (!offlineCourse) {
      throw new NotFoundException("Offline course not found");
    }

    const updatedOfflineCourse = await prisma.offlineCourse.update({
      where: { id: +id },
      data: {
        ..._data,
        ...(whatYouWillLearn ? { whatYouWillLearn: whatYouWillLearn.map(item => item.value) } : {}),
      },
    });

    await Promise.all([
      AwsService.deleteFromStorage("update", {
        existingKey: offlineCourse.coverPhoto,
        key: updatedOfflineCourse.coverPhoto,
      }),
      AwsService.deleteFromStorage("update", {
        existingKey: offlineCourse.graduationPhoto,
        key: updatedOfflineCourse.graduationPhoto,
      }),
      AwsService.deleteFromStorage("update", {
        existingKey: offlineCourse.pdf,
        key: updatedOfflineCourse.pdf,
      }),
      AwsService.deleteFromStorage("update", {
        existingKey: offlineCourse.whatYouWillLearnPhoto,
        key: updatedOfflineCourse.whatYouWillLearnPhoto,
      }),
    ]);

    return updatedOfflineCourse;
  }

  static async delete(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const offlineCourse = await prisma.offlineCourse.findUnique({ where: { id: +id } });

    if (!offlineCourse) {
      throw new NotFoundException("Offline course not found");
    }

    const deletedOfflineCourse = await prisma.offlineCourse.delete({
      where: { id: +id },
    });

    await Promise.all([
      AwsService.deleteFromStorage("delete", { existingKey: offlineCourse.coverPhoto }),
      AwsService.deleteFromStorage("delete", { existingKey: offlineCourse.graduationPhoto }),
      AwsService.deleteFromStorage("delete", { existingKey: offlineCourse.pdf }),
      AwsService.deleteFromStorage("delete", { existingKey: offlineCourse.whatYouWillLearnPhoto }),
    ]);

    return deletedOfflineCourse;
  }

  static addInstructors({ instructorId, offlineCourseId }: AddOfflineInstructorsValidation) {
    return prisma.offlineCourseInstructors.create({
      data: { instructorId, offlineCourseId },
    });
  }

  static async removeInstructors(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const offlineCourseInstructor = await prisma.offlineCourseInstructors.findUnique({
      where: { id: +id },
    });

    if (!offlineCourseInstructor) {
      throw new NotFoundException("Instructor not found");
    }

    const deletedOfflineCourseInstructor = await prisma.offlineCourseInstructors.delete({
      where: { id: +id },
    });

    return deletedOfflineCourseInstructor;
  }

  static addVideo({ name, key, offlineCourseId }: AddOfflineCourseVideosValidation) {
    return prisma.offlineCourseVideo.create({
      data: { name, key, offlineCourseId },
    });
  }

  static async removeVideo(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const offlineCourseVideo = await prisma.offlineCourseVideo.findUnique({ where: { id: +id } });

    if (!offlineCourseVideo) {
      throw new NotFoundException("Video not found");
    }

    const deletedOfflineCourseVideo = await prisma.offlineCourseVideo.delete({
      where: { id: +id },
    });

    await AwsService.deleteFromStorage("delete", { existingKey: offlineCourseVideo.key });

    return deletedOfflineCourseVideo;
  }

  static addTimeline(body: AddEditOfflineCourseTimelineValidation) {
    const data = {
      offlineCourseId: body.offlineCourseId,
      startDates: body.startDates.map(({ value }) => value),
    };

    return prisma.offlineCourseTimeline.create({
      data,
    });
  }

  static editTimeline(body: AddEditOfflineCourseTimelineValidation, id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return prisma.offlineCourseTimeline.update({
      where: { id: +id, offlineCourseId: body.offlineCourseId },
      data: { startDates: body.startDates.map(({ value }) => value) },
    });
  }
}
