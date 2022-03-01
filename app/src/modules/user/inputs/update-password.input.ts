import { IsNotEmpty, MinLength } from 'class-validator';

export default class UpdatePasswordInput {
  @MinLength(3)
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(3)
  @IsNotEmpty()
  newPassword: string;
}
