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
import { Jobs } from "@/lib/prisma/resolvers";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import { CreateEditJobValidation } from "@/utils/validation/jobs";

@Catch(exceptionHandler)
@AuthMiddleware()
class JobHandler {
  @Get("/list")
  list(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
  ) {
    return Jobs.list(+skip, +take, search, sorting);
  }

  @Get("/:id")
  getById(@Param("id") id: string) {
    const jobId = +id;

    if (isNaN(jobId) || jobId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return Jobs.getById(jobId);
  }

  @Post("/create")
  create(@Body(ValidationPipe) body: CreateEditJobValidation) {
    return Jobs.create(body);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: CreateEditJobValidation, @Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return Jobs.edit(body, +id);
  }

  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return Jobs.delete(+id);
  }
}

export default createHandler(JobHandler);
