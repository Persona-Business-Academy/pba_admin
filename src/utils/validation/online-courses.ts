import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import type { LanguageType, SkillLevelType, TopicType } from "@/utils/models/common";

export class CreateEditOnlineCourseValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  title: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @IsString()
  @IsNotEmpty({ message: "Course level is required" })
  courseLevel: SkillLevelType;

  @IsString()
  @IsNotEmpty({ message: "Topic is required" })
  topic: TopicType;

  @IsString()
  @IsNotEmpty({ message: "Language is required" })
  language: LanguageType;

  @IsNotEmpty({ message: "Instructor is required" })
  @IsNumber()
  instructorId: number;

  @IsString()
  coverPhoto: string;

  @IsString()
  @IsNotEmpty({ message: "Missing query params" })
  coverPhotoId: string;
}

export class CreateOnlineCourseLevelValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  level: string;

  @IsNotEmpty({ message: "Online Course is required" })
  @IsNumber()
  onlineCourseId: number;
}

export class EditOnlineCourseLevelValidation {
  @IsString()
  @IsNotEmpty({ message: "Level is required" })
  level: string;

  @IsNotEmpty({ message: "Level is required" })
  @IsNumber()
  id: number;
}

export class CreateOnlineCourseDayValidation {
  @IsString()
  @IsNotEmpty({ message: "Label is required" })
  label: string;

  @IsNotEmpty({ message: "Online Course is required" })
  @IsNumber()
  onlineCourseId: number;

  @IsNotEmpty({ message: "Online Course Level is required" })
  @IsNumber()
  onlineCourseLevelId: number;
}

export class EditOnlineCourseDayValidation {
  @IsString()
  @IsNotEmpty({ message: "Label is required" })
  label: string;

  @IsNotEmpty({ message: "Online Course Day is required" })
  @IsNumber()
  id: number;
}

export class CreateOnlineCourseVideoValidation {
  @IsString()
  @IsNotEmpty({ message: "Key is required" })
  key: string;

  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Online Course is required" })
  @IsNumber()
  onlineCourseId: number;

  @IsNotEmpty({ message: "Online Course Level is required" })
  @IsNumber()
  onlineCourseLevelId: number;

  @IsNotEmpty({ message: "Online Course Day is required" })
  @IsNumber()
  onlineCourseDayId: number;
}
