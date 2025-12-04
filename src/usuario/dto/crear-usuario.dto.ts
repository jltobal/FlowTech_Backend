import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  mail: string;
}