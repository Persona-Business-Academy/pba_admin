import { Topic } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import type {
  CurrencyType,
  LanguageType,
  SkillLevelType,
  TopicType,
  WhatYouWillLearnType,
} from "@/utils/models/common";

export class CreateEditOfflineCourseValidation {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @IsString()
  @IsNotEmpty({ message: "Subtitle is required" })
  subTitle: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @IsString()
  @IsEnum(Topic, { message: "Invalid topic type" })
  @IsNotEmpty({ message: "Topic is required" })
  topic: TopicType;

  @IsString()
  @IsNotEmpty({ message: "Language is required" })
  language: LanguageType;

  @IsString()
  @IsNotEmpty({ message: "Age limit is required" })
  @Matches(/[0-9]+-[0-9]+/i, { message: "Invalid age limit" })
  ageLimit: string;

  @IsNumber()
  @IsNotEmpty({ message: "Total duration is required" })
  totalDuration: number;

  @IsString()
  @IsNotEmpty({ message: "Level is required" })
  level: SkillLevelType;

  @IsNumber()
  @IsNotEmpty({ message: "Graduated students count is required" })
  graduatedStudentsCount: number;

  @IsNumber()
  @IsNotEmpty({ message: "Graduated students count is required" })
  enrolledStudentsCount: number;

  @IsNumber()
  @IsNotEmpty({ message: "Lessons count is required" })
  lessonsCount: number;

  @IsNumber()
  @IsNotEmpty({ message: "Price is required" })
  price: number;

  @IsString()
  @IsNotEmpty({ message: "Currency is required" })
  currency: CurrencyType;

  @IsString()
  coverPhoto: string;

  @IsString()
  @IsNotEmpty({ message: "Missing query params" })
  coverPhotoId: string;

  @IsArray()
  whatYouWillLearn: WhatYouWillLearnType[];
}

export class AddOfflineInstructorsValidation {
  @IsNumber()
  @IsNotEmpty({ message: "Id is required" })
  instructorId: number;

  @IsNumber()
  @IsNotEmpty({ message: "Id is required" })
  offlineCourseId: number;
}
