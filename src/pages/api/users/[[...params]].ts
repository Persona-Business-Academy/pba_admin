import { createHandler, Get, Query } from "next-api-decorators";
import { SortingType } from "@/api/types";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { User } from "@/lib/prisma/resolvers";

@AuthMiddleware()
class UserHandler {
  @Get("/list")
  _getAllUsers(
    @Query("offset") skip: string,
    @Query("limit") take: string,
    @Query("search") search: string,
    @Query("sorting") sorting: SortingType[]
  ) {
    return User.list(+skip, +take, search, sorting);
  }
}

export default createHandler(UserHandler);
