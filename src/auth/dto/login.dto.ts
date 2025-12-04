import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  mail: string;

  @IsString()
  @MinLength(4)
  password: string;
}