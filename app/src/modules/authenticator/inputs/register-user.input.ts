import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export default class RegisterUserInput {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(3)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}
