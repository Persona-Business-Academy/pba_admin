import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import type { CourseType } from "../models/common";

export class CreateEditCommentsValidation {
  @IsString()
  @IsNotEmpty({ message: "Headline is required" })
  headline: string;

  @IsString()
  @IsNotEmpty({ message: "Text is required" })
  text: string;

  @IsNumber()
  @IsNotEmpty({ message: "Course is required" })
  courseId: number;

  @IsString()
  @IsNotEmpty({ message: "Course is required" })
  courseType: CourseType;
}
