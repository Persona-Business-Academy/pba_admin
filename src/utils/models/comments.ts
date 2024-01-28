import { Prisma } from "@prisma/client";
import { Comment } from "@/lib/prisma/resolvers";
import { CreateCommentsValidation } from "../validation/comments";

export type CommentsListModel = Prisma.PromiseReturnType<typeof Comment.list>;
export type CommentModel = Prisma.PromiseReturnType<typeof Comment.create>;

export type CommentFormData = Pick<CreateCommentsValidation, "headline" | "text">;
