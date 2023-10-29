import {
  BadRequestException,
  Body,
  Catch,
  createHandler,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "next-api-decorators";
import { SortingType } from "@/api/types";
import { ERROR_MESSAGES } from "@/constants/common";
import prisma from "@/lib/prisma";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";
import {
  CreateEditOnlineCourseValidation,
  CreateOnlineCourseLevelValidation,
  EditOnlineCourseLevelValidation,
} from "@/validation/online-courses";

@Catch(exceptionHandler)
@AuthMiddleware()
export class OnlineCourseHandler {
  @Get("/list")
  _getAllOnlineCourses(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
  ) {
    return OnlineCourses.list(+skip, +take, search, sorting);
  }

  @Get("/:id")
  async getOnlineCourse(@Param("id") id: string) {
    const courseId = +id;

    if (isNaN(courseId) || courseId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return OnlineCourses.getOnlineCourse(courseId);
  }

  @Post("/create")
  async createOnlineCourse(@Body(ValidationPipe) body: CreateEditOnlineCourseValidation) {
    const { name } = body;
    const newCourse = await prisma.onlineCourse.create({ data: { name } });
    return newCourse.id;
  }

  @Put("/edit/:id")
  async editOnlineCourse(
    @Body(ValidationPipe) body: CreateEditOnlineCourseValidation,
    @Param("id") id: string,
  ) {
    const { name } = body;

    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const updatedCourse = await prisma.onlineCourse.update({
      where: { id: +id },
      data: { name },
    });

    return updatedCourse.id;
  }

  @Delete("/delete/:id")
  async deleteOnlineCourse(@Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const deletedCourse = await prisma.onlineCourse.delete({
      where: { id: +id },
    });

    return deletedCourse.id;
  }

  @Post("/create-level")
  async createOnlineCourseLevel(@Body(ValidationPipe) body: CreateOnlineCourseLevelValidation) {
    const { onlineCourseId, level } = body;

    if (isNaN(Number(onlineCourseId)) || onlineCourseId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const newCourseLevel = await prisma.onlineCourseLevel.create({
      data: { level, onlineCourseId },
    });

    return newCourseLevel.id;
  }
  @Put("/edit-level/:id")
  async editOnlineCourseLevel(
    @Body(ValidationPipe) body: EditOnlineCourseLevelValidation,
    @Param("id") id: string,
  ) {
    const { level } = body;
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
}

export default createHandler(OnlineCourseHandler);
