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
import { Instructors } from "@/lib/prisma/resolvers";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import { CreateEditInstructorValidation } from "@/utils/validation/instructors";

@Catch(exceptionHandler)
@AuthMiddleware()
class InstructorHandler {
  @Get("/list")
  list(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
  ) {
    return Instructors.list(+skip, +take, search, sorting);
  }

  @Get("/:id")
  getById(@Param("id") id: string) {
    const instructorId = +id;

    if (isNaN(instructorId) || instructorId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return Instructors.getById(instructorId);
  }

  @Post("/create")
  create(@Body(ValidationPipe) body: CreateEditInstructorValidation) {
    return Instructors.create(body);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: CreateEditInstructorValidation, @Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return Instructors.edit(body, +id);
  }

  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return Instructors.delete(+id);
  }
}

export default createHandler(InstructorHandler);
