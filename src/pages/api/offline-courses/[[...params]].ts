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
  AddOfflineInstructorsValidation,
  CreateEditOfflineCourseValidation,
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
  ) {
    return OfflineCourses.list(+skip, +take, search, sorting);
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
  create(@Body(ValidationPipe) body: CreateEditOfflineCourseValidation) {
    return OfflineCourses.create(body);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: CreateEditOfflineCourseValidation, @Param("id") id: string) {
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
}

export default createHandler(OfflineCourseHandler);
