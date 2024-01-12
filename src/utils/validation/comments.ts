import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
  courseType: "online" | "offline";
}
