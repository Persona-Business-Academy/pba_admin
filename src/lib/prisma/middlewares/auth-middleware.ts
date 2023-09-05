import { NextApiRequest, NextApiResponse } from "next";
import { createMiddlewareDecorator, NextFunction } from "next-api-decorators";
// import { validateJwt } from "./auth";

export const AuthMiddleware = createMiddlewareDecorator(
 (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
  //   if (!validateJwt(req)) {
  //    throw new UnauthorizedException();
  //   }
  next();
 }
);
