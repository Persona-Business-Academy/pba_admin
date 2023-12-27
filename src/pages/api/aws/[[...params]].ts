import { Catch, createHandler, Get, Query } from "next-api-decorators";
import { AwsService } from "@/lib/aws";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import type { GetSignatureReq } from "@/utils/models/common";

@Catch(exceptionHandler)
@AuthMiddleware()
class AwsHandler {
  @Get("/signature")
  getSignature(@Query() { datetime, to_sign }: GetSignatureReq) {
    return AwsService.getSignature({ dateTime: datetime, toSign: to_sign });
  }
}

export default createHandler(AwsHandler);
