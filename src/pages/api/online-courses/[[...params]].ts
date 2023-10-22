import { Catch, createHandler, Get, Query } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { OnlineCourses } from "@/lib/prisma/resolvers/online-courses";

@Catch(exceptionHandler)
@AuthMiddleware()
class OnlineCourseHandler {
  @Get("/list")
  _getAllOnlineCourses(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[]
  ) {
    return OnlineCourses.list(+skip, +take, search, sorting);
  }
}

export default createHandler(OnlineCourseHandler);
