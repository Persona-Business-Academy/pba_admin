import bcrypt from "bcrypt";
import { BadRequestException } from "next-api-decorators";
import { ERROR_MESSAGES } from "@/constants/common";
import { User } from "../resolvers";

export const validateUserPassword = async (email: string, password: string) => {
  try {
    return User.findUserByEmail(email).then((user) => {
      if (!user) {
        throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
      }

      bcrypt.compare(password, user.password || "").then((isValid) => {
        if (!isValid) {
          throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
        }
      });

      return user;
    });
  } catch (e) {
    throw new Error(e as string);
  }
};
