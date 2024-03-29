import { ApplicantType } from "@prisma/client";

export const ERROR_MESSAGES = {
  somethingWentWrong: "Something went wrong",
  invalidCredentials: "Email or password is incorrect. Please enter valid credentials.",
  userAlreadyExists: "A user with this email address already exists.",
};

export const ITEMS_PER_PAGE = 5;

export const ApplicantEnum = ApplicantType;
