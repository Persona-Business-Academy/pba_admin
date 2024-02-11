import { ApplicantType } from "@prisma/client";
import { BadRequestException, Catch, createHandler, Get, Param, Query } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { Applicants } from "@/lib/prisma/resolvers";
import { ERROR_MESSAGES } from "@/utils/constants/common";

@Catch(exceptionHandler)
@AuthMiddleware()
class ApplicantHandler {
  @Get("/list")
  list(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[],
    @Query("filter") filter?: ApplicantType,
    @Query("jobId") jobId?: string,
    @Query("offlineCourseId") offlineCourseId?: string,
  ) {
    return Applicants.list(+skip, +take, search, sorting, filter, jobId, offlineCourseId);
  }

  @Get("/:id")
  getById(@Param("id") id: string) {
    const applicantId = +id;

    if (isNaN(applicantId) || applicantId === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return Applicants.getById(applicantId);
  }
}

export default createHandler(ApplicantHandler);
