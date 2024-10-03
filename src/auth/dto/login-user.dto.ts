import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @Length(8, 8)
  @IsString()
  dni: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe ser mínimo 6 carácteres' })
  @MaxLength(50, { message: 'No mayor a 50 carácteres' })
  password: string;

}
