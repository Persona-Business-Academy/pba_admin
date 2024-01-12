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
import { User } from "next-auth";
import { CurrentUser } from "@/lib/prisma/decorators/currentUser";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import { Comment } from "@/lib/prisma/resolvers";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import type { CommentFormData } from "@/utils/models/comments";
import { CreateEditCommentsValidation } from "@/utils/validation/comments";

@Catch(exceptionHandler)
@AuthMiddleware()
export class CommentHandler {
  @Get("/list")
  list(@Query("courseId") courseId: string, @Query("type") type: "online" | "offline") {
    const id = +courseId;
    if (isNaN(id) || id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    if (type !== "offline" && type !== "online") {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return Comment.list(id, type);
  }

  @Post("/create")
  create(
    @Body(ValidationPipe) body: CreateEditCommentsValidation,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return Comment.create(body, user);
  }

  @Put("/edit/:id")
  edit(@Body(ValidationPipe) body: CommentFormData, @Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }
    return Comment.edit(body, +id);
  }

  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    if (isNaN(Number(id)) || +id === 0) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    return Comment.delete(+id);
  }
}

export default createHandler(CommentHandler);
