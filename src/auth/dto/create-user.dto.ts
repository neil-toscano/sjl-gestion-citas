import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
  IsDate,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  dni: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  lastName: string;

  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  @Type(() => Date)
  birthDate: Date;

  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  department: string;

  @IsString({ message: 'La provincia debe ser una cadena de texto' })
  province: string;

  @IsString({ message: 'El distrito debe ser una cadena de texto' })
  district: string;

  @IsPhoneNumber('PE', { message: 'El número de celular debe ser un número válido de Perú' }) // Para Perú
  @Length(9, 9, { message: 'El número de celular debe tener exactamente 9 dígitos' })
  mobileNumber: string;

  @IsString({ message: 'El correo debe ser una cadena de texto' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder los 50 caracteres' })
  password: string;
}
