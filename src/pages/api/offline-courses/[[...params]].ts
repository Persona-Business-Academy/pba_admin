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
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { OfflineCourses } from "@/lib/prisma/resolvers";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import {
  AddEditOfflineCourseTimelineValidation,
  AddOfflineCourseVideosValidation,
  AddOfflineInstructorsValidation,
  CreateOfflineCourseValidation,
  EditOfflineCourseValidation,
} from "@/utils/validation/offline-courses";

@Catch(exceptionHandler)
@AuthMiddleware()
export class OfflineCourseHandler {
  @Get("/list")
  getAll(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
    @Query("forKids") forKids?: string,
  ) {
    return OfflineCourses.list(+skip, +take, search, sorting, forKids);
  }

  @Get("/:id")
  getOne(@Param("id") id: string) {
    const courseId = +id;
    if (isNaN(courseId) || courseId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return OfflineCourses.getOne(courseId);
  }

  @Post("/create")
  create(@Body(ValidationPipe) body: CreateOfflineCourseValidation) {
    return OfflineCourses.create(body);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: EditOfflineCourseValidation, @Param("id") id: string) {
    return OfflineCourses.edit(body, id);
  }

  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    return OfflineCourses.delete(id);
  }

  @Post("/add-instructor")
  addInstructor(@Body(ValidationPipe) body: AddOfflineInstructorsValidation) {
    return OfflineCourses.addInstructors(body);
  }

  @Delete("/remove-instructor/:id")
  removeInstructor(@Param("id") id: string) {
    return OfflineCourses.removeInstructors(id);
  }

  @Post("/add-video")
  addVideo(@Body(ValidationPipe) body: AddOfflineCourseVideosValidation) {
    return OfflineCourses.addVideo(body);
  }

  @Delete("/remove-video/:id")
  removeVideo(@Param("id") id: string) {
    return OfflineCourses.removeVideo(id);
  }

  @Post("/add-timeline")
  addTimeline(@Body(ValidationPipe) body: AddEditOfflineCourseTimelineValidation) {
    return OfflineCourses.addTimeline(body);
  }

  @Put("/edit-timeline/:id")
  editTimeline(
    @Body(ValidationPipe) body: AddEditOfflineCourseTimelineValidation,
    @Param("id") id: string,
  ) {
    return OfflineCourses.editTimeline(body, id);
  }
}

export default createHandler(OfflineCourseHandler);
