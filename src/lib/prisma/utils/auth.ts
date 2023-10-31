import bcrypt from "bcrypt";
import { BadRequestException } from "next-api-decorators";
import { ERROR_MESSAGES } from "@/constants/common";
import { User } from "../resolvers";

export const validateUserPassword = async (email: string, password: string) => {
  return User.findAdminByEmail(email)
    .then((admin) => {
      if (!admin) {
        throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
      }

      bcrypt.compare(password, admin.password || "").then((isValid) => {
        if (!isValid) {
          throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
        }
      });

      return admin;
    })
    .catch((e) => {
      throw e;
    });
};
