import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @Length(8, 12, { message: 'El documento debe tener entre 8 y 12 dígitos' })
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  documentNumber: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
  @IsString({ message: 'El correo debe ser una cadena de texto' })
  email: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(0, { message: 'El apellido paterno' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  apellido_paterno: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(0, { message: 'El apellido materno' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  apellido_materno: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean = true;
}
