import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateEditJobValidation {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsString()
  @IsNotEmpty()
  workingHours: string;

  @IsString()
  @IsNotEmpty()
  contractType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  responsibilities: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;

  @IsBoolean()
  disabled: boolean;
}
