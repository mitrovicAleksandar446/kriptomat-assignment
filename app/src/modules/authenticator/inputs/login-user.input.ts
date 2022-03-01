import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class LoginUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(3)
  @IsNotEmpty()
  password: string;
}
