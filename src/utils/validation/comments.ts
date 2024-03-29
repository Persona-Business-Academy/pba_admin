import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import type { CourseType } from "../models/common";

export class CreateCommentsValidation {
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

export class EditCommentsValidation {
  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  courseId?: number;

  @IsString()
  @IsOptional()
  courseType?: CourseType;

  @IsString()
  @IsOptional()
  userPicture?: string;
}
