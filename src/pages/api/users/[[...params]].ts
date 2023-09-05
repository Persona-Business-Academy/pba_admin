import { createHandler, Get, Query } from "next-api-decorators";
import { User } from "@/lib/prisma/resolvers";

class UserHandler {
 @Get("/list")
 _getAllUsers(@Query("offset") skip: string, @Query("limit") take: string) {
  return User.list(+skip, +take);
 }
}

export default createHandler(UserHandler);
