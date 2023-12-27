import bcrypt from "bcrypt";
import { UnauthorizedException } from "next-api-decorators";
import { ERROR_MESSAGES } from "@/constants/common";
import { User } from "../resolvers";

export const validateUserPassword = async (email: string, password: string) => {
  try {
    const user = await User.findAdminByEmail(email);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    }

    return user;
  } catch (e) {
    throw new Error(e as string);
  }
};
