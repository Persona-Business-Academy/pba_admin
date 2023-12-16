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
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";
import {
  CreateEditOnlineCourseValidation,
  CreateOnlineCourseDayValidation,
  CreateOnlineCourseLevelValidation,
  CreateOnlineCourseVideoValidation,
  EditOnlineCourseDayValidation,
  EditOnlineCourseLevelValidation,
} from "@/validation/online-courses";

@Catch(exceptionHandler)
@AuthMiddleware()
export class OnlineCourseHandler {
  @Get("/list")
  getAll(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
  ) {
    return OnlineCourses.list(+skip, +take, search, sorting);
  }

  @Get("/:id")
  getOne(@Param("id") id: string) {
    const courseId = +id;
    if (isNaN(courseId) || courseId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return OnlineCourses.getOne(courseId);
  }

  @Post("/create")
  create(@Body(ValidationPipe) body: CreateEditOnlineCourseValidation) {
    return OnlineCourses.create(body);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: CreateEditOnlineCourseValidation, @Param("id") id: string) {
    return OnlineCourses.edit(body, id);
  }

  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    return OnlineCourses.delete(id);
  }

  @Post("/create-level")
  createLevel(@Body(ValidationPipe) body: CreateOnlineCourseLevelValidation) {
    return OnlineCourses.createLevel(body);
  }

  @Put("/edit-level/:id")
  editLevel(@Body(ValidationPipe) body: EditOnlineCourseLevelValidation, @Param("id") id: string) {
    return OnlineCourses.editLevel(body, id);
  }

  @Delete("/delete-level/:id")
  deleteLevel(@Param("id") id: string) {
    return OnlineCourses.deleteLevel(id);
  }

  @Post("/create-day")
  createDay(@Body(ValidationPipe) body: CreateOnlineCourseDayValidation) {
    return OnlineCourses.createDay(body);
  }

  @Put("/edit-day/:id")
  editDay(@Body(ValidationPipe) body: EditOnlineCourseDayValidation, @Param("id") id: string) {
    return OnlineCourses.editDay(body, id);
  }

  @Delete("/delete-day/:id")
  deleteDay(@Param("id") id: string) {
    return OnlineCourses.deleteDay(id);
  }

  @Post("/create-video")
  createVideo(@Body(ValidationPipe) body: CreateOnlineCourseVideoValidation) {
    return OnlineCourses.createVideo(body);
  }
}

export default createHandler(OnlineCourseHandler);
