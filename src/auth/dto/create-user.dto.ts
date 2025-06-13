import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
  IsDate,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
  IsIn,
  ArrayNotEmpty,
  IsArray,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @Length(8, 12, { message: 'El documento debe tener entre 8 y 12 dígitos' })
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  documentNumber: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  apellido_paterno: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  apellido_materno: string;

  // @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  // @Type(() => Date)
  // birthDate: Date;

  // @IsString({ message: 'La provincia debe ser una cadena de texto' })
  // province: string;

  @IsOptional()
  @IsString({ message: 'El distrito debe ser una cadena de texto' })
  district?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  address?: string;

  @IsOptional()
  @IsPhoneNumber('PE', {
    message: 'El número de celular debe ser un número válido de Perú',
  })
  @Length(9, 9, {
    message: 'El número de celular debe tener exactamente 9 dígitos',
  })
  mobileNumber?: string;

  @IsOptional()
  @IsString({ message: 'El correo debe ser una cadena de texto' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
  email?: string;

  @IsOptional()
  @IsArray({ message: 'Los roles deben ser un array' })
  @IsString({ each: true, message: 'Cada rol debe ser una cadena de texto' })
  @IsIn(['user', 'administrator', 'platform-operator'], {
    each: true,
    message: 'Los roles válidos son: user, administrator, platform-operator',
  })
  roles?: string[] = ['user'];

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(5, {
    message: 'La contraseña debe tener exactamente 5 caracteres',
  })
  @MaxLength(50, {
    message: 'La contraseña debe tener exactamente 5 caracteres',
  })
  password: string;
}
