import { NextApiRequest, NextApiResponse } from "next";
import {
  createMiddlewareDecorator,
  NextFunction,
  UnauthorizedException,
} from "next-api-decorators";
import { getToken } from "next-auth/jwt";

export const AuthMiddleware = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException();
    }
    next();
  }
);
