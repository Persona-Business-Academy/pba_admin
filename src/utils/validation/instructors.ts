import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEditInstructorValidation {
  @IsString()
  @IsNotEmpty({ message: "First Name is required" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Last Name is required" })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: "About is required" })
  about: string;

  @IsNumber()
  @IsNotEmpty({ message: "Graduated students count is required" })
  graduatedStudentsCount: number;

  @IsNumber()
  @IsNotEmpty({ message: "Enrolled students count is required" })
  enrolledStudentsCount: number;

  @IsString()
  @IsNotEmpty({ message: "Profession is required" })
  profession: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsNotEmpty({ message: "Missing query params" })
  mediaId: string;
}
