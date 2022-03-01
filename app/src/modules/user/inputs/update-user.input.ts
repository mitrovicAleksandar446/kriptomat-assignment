import { IsEmail, IsOptional, MinLength } from 'class-validator';

export default class UpdateUserInput {
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}
