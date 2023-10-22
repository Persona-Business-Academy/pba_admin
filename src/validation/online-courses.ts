import { IsNotEmpty, IsString } from "class-validator";

export class CreateEditOnlineCourseValidation {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;
}
