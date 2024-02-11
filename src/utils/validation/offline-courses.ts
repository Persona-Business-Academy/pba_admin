import { Topic } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import type {
  CurrencyType,
  LanguageType,
  SkillLevelType,
  TimelineType,
  WhatYouWillLearnType,
} from "@/utils/models/common";

export class CreateOfflineCourseValidation {
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
  @IsNotEmpty({ message: "Topic is required" })
  topic: Topic;

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
  courseLevel: SkillLevelType;

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
  mediaId: string;

  @IsArray()
  whatYouWillLearn: WhatYouWillLearnType[];

  @IsBoolean()
  forKids: boolean;
}

export class EditOfflineCourseValidation {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subTitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  topic?: Topic;

  @IsString()
  @IsOptional()
  language?: LanguageType;

  @IsString()
  @Matches(/[0-9]+-[0-9]+/i, { message: "Invalid age limit" })
  @IsOptional()
  ageLimit?: string;

  @IsNumber()
  @IsOptional()
  totalDuration?: number;

  @IsString()
  @IsOptional()
  courseLevel?: SkillLevelType;

  @IsNumber()
  @IsOptional()
  graduatedStudentsCount?: number;

  @IsNumber()
  @IsOptional()
  enrolledStudentsCount?: number;

  @IsNumber()
  @IsOptional()
  lessonsCount?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: CurrencyType;

  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @IsString()
  @IsOptional()
  mediaId?: string;

  @IsArray()
  @IsOptional()
  whatYouWillLearn?: WhatYouWillLearnType[];

  @IsBoolean()
  @IsOptional()
  forKids?: boolean;

  @IsString()
  @IsOptional()
  graduationPhoto?: string;

  @IsString()
  @IsOptional()
  pdf?: string;

  @IsString()
  @IsOptional()
  whatYouWillLearnPhoto?: string;
}

export class AddOfflineInstructorsValidation {
  @IsNumber()
  @IsNotEmpty({ message: "Id is required" })
  instructorId: number;

  @IsNumber()
  @IsNotEmpty({ message: "Id is required" })
  offlineCourseId: number;
}

export class AddOfflineCourseVideosValidation {
  @IsString()
  @IsNotEmpty({ message: "Key is required" })
  key: string;

  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Offline Course is required" })
  @IsNumber()
  offlineCourseId: number;
}

export class AddEditOfflineCourseTimelineValidation {
  @IsNotEmpty({ message: "Offline Course is required" })
  @IsNumber()
  offlineCourseId: number;

  @IsArray()
  startDates: TimelineType[];
}
