import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignUpValidation {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}
