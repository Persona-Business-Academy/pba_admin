import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEditOnlineCourseValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;
}

export class CreateEditOnlineCourseLevelValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  level: string;

  @IsNotEmpty({ message: "Online Course is required" })
  @IsNumber()
  onlineCourseId: number;
}
