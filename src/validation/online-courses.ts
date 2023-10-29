import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEditOnlineCourseValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;
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
