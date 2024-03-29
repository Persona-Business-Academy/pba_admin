import { BadRequestException, NotFoundException } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import {
  CreateEditOnlineCourseValidation,
  CreateOnlineCourseDayValidation,
  CreateOnlineCourseLevelValidation,
  CreateOnlineCourseVideoValidation,
  EditOnlineCourseDayValidation,
  EditOnlineCourseLevelValidation,
} from "@/utils/validation/online-courses";
import prisma from "..";
import { orderBy } from "../utils/common";

export class OnlineCourses {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, onlineCourses] = await Promise.all([
      prisma.onlineCourse.count({
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
      }),
      prisma.onlineCourse.findMany({
        where: { OR: [{ title: { contains: search, mode: "insensitive" } }] },
        orderBy: orderBy(sorting),
        skip,
        take,
      }),
    ]);

    return { count, onlineCourses };
  }

  static async getOne(courseId: number) {
    const onlineCourse = await prisma.onlineCourse.findUnique({
      where: {
        id: courseId,
      },
      include: {
        levels: {
          orderBy: { createdAt: "desc" },
          include: {
            days: {
              orderBy: { createdAt: "desc" },
              include: {
                videos: {
                  orderBy: { createdAt: "desc" },
                },
              },
            },
          },
        },
      },
    });

    return onlineCourse;
  }

  static async create(data: CreateEditOnlineCourseValidation) {
    const { whatYouWillLearn, ..._data } = data;

    const newCourse = await prisma.onlineCourse.create({
      data: {
        ..._data, // todo
        subTitle: "",
        whatYouWillLearn: whatYouWillLearn.map(item => item.value),
      },
    });
    return newCourse.id;
  }

  static async edit(data: CreateEditOnlineCourseValidation, id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const course = await prisma.onlineCourse.findUnique({ where: { id: +id } });
    if (!course) {
      throw new NotFoundException("Course not found");
    }

    // await AwsService.deleteFromStorage(course.coverPhoto, data.coverPhoto);

    const updatedCourse = await prisma.onlineCourse.update({
      where: { id: +id },
      data: { ...data, whatYouWillLearn: data.whatYouWillLearn.map(item => item.value) },
    });

    return updatedCourse.id;
  }

  static async delete(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const deletedCourse = await prisma.onlineCourse.delete({
      where: { id: +id },
    });

    return deletedCourse.id;
  }

  static async createLevel(data: CreateOnlineCourseLevelValidation) {
    const { onlineCourseId, level } = data;

    if (isNaN(Number(onlineCourseId)) || onlineCourseId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const newCourseLevel = await prisma.onlineCourseLevel.create({
      data: { level, onlineCourseId },
    });

    return newCourseLevel.id;
  }

  static async editLevel(data: EditOnlineCourseLevelValidation, id: string) {
    const { level } = data;
    const levelId = Number(id);

    if (isNaN(levelId) || levelId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const updatedCourseLevel = await prisma.onlineCourseLevel.update({
      where: { id: levelId },
      data: { level },
    });

    return updatedCourseLevel.id;
  }

  static async deleteLevel(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const deletedCourseLevel = await prisma.onlineCourseLevel.delete({
      where: { id: +id },
    });

    return deletedCourseLevel.id;
  }

  static async createDay(data: CreateOnlineCourseDayValidation) {
    const { onlineCourseId, onlineCourseLevelId, label } = data;

    if (
      isNaN(Number(onlineCourseId)) ||
      onlineCourseId === 0 ||
      isNaN(Number(onlineCourseLevelId)) ||
      onlineCourseLevelId === 0
    ) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const newCourseDay = await prisma.onlineCourseDay.create({
      data: { label, onlineCourseId, onlineCourseLevelId },
    });

    return newCourseDay.id;
  }

  static async editDay(data: EditOnlineCourseDayValidation, id: string) {
    const { label } = data;
    const dayId = Number(id);

    if (isNaN(dayId) || dayId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const updatedCourseLevel = await prisma.onlineCourseDay.update({
      where: { id: dayId },
      data: { label },
    });

    return updatedCourseLevel.id;
  }

  static async deleteDay(id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const deletedCourseDay = await prisma.onlineCourseDay.delete({
      where: { id: +id },
    });

    return deletedCourseDay.id;
  }

  static async createVideo(data: CreateOnlineCourseVideoValidation) {
    const { onlineCourseId, onlineCourseLevelId, onlineCourseDayId, key, name } = data;

    if (
      isNaN(Number(onlineCourseId)) ||
      onlineCourseId === 0 ||
      isNaN(Number(onlineCourseLevelId)) ||
      onlineCourseLevelId === 0 ||
      isNaN(Number(onlineCourseDayId)) ||
      onlineCourseDayId === 0
    ) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const newCourseVideo = await prisma.onlineCourseVideo.create({
      data: { name, key, onlineCourseId, onlineCourseDayId, onlineCourseLevelId },
    });

    return newCourseVideo.id;
  }
}
