import { Catch, createHandler, Get, Query } from "next-api-decorators";
import { getSignature } from "@/lib/aws";
import { exceptionHandler } from "@/lib/prisma/error";
import { AuthMiddleware } from "@/lib/prisma/middlewares/auth-middleware";
import * as common from "@/models/common";

@Catch(exceptionHandler)
@AuthMiddleware()
class AwsHandler {
  @Get("/signature")
  _getSignature(@Query() { datetime, to_sign }: common.GetSignatureReq) {
    return getSignature({ dateTime: datetime, toSign: to_sign });
  }
}

export default createHandler(AwsHandler);
